import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import stiTestingService from "../../../services/stiTestingService";
import { useAuth } from "../../../contexts/AuthContext";
import {
  STI_PACKAGES,
  STI_TEST_TYPES,
} from "../../sti/booking-components/constants";
import axios from "axios";

function STITestingHistory({ userId }) {
  const { currentUser } = useAuth();
  const [userTests, setUserTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', '0' (pending), '1' (completed)
  const [searchText, setSearchText] = useState("");
  // Hàm tiện ích để định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };
  // Fetch user's STI tests
  useEffect(() => {
    const fetchUserTests = async () => {
      if (!currentUser && !userId) return;

      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/users/${userId || currentUser.id}/sti-tests`
        );

        // Handle success response structure
        if (response.data && response.data.is_success && response.data.data) {
          setUserTests(response.data.data);
        } else {
          console.error(
            "Failed to fetch tests:",
            response.data.message || "Unknown error"
          );
          setUserTests([]);
        }
      } catch (error) {
        console.error("Error fetching STI tests:", error);
        setUserTests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTests();
  }, [currentUser, userId]);

  // Filter tests based on status and search text
  useEffect(() => {
    let filtered = [...userTests];

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (test) => test.status.toString() === filterStatus
      );
    }

    // Filter by search text
    if (searchText.trim()) {
      filtered = filtered.filter((test) => {
        // Get test parameters based on package type
        let testParams = [];
        if (test.testPackage === 2 && test.customParameters) {
          testParams = test.customParameters;
        } else if (test.testPackage === 0) {
          testParams = [0, 1, 2]; // Basic package parameters
        } else if (test.testPackage === 1) {
          testParams = [0, 1, 2, 3, 4, 5]; // Advanced package parameters
        }

        // Check if any test parameter matches search text
        const testParamLabels = {
          0: "Chlamydia",
          1: "Gonorrhea",
          2: "Syphilis",
          3: "HIV",
          4: "Hepatitis B",
          5: "Hepatitis C",
          6: "Herpes",
          7: "HPV",
          8: "Mycoplasma",
          9: "Trichomonas",
        };

        return (
          // Search by date
          new Date(test.scheduleDate || test.createdAt)
            .toLocaleDateString("vi-VN")
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          // Search by parameters
          testParams.some((paramId) =>
            testParamLabels[paramId]
              ?.toLowerCase()
              .includes(searchText.toLowerCase())
          )
        );
      });
    }

    setFilteredTests(filtered);
  }, [userTests, filterStatus, searchText]);

  const getPackagePrice = (packageId) => {
    const pkg = STI_PACKAGES.find((pkg) => pkg.id === packageId);
    return pkg ? pkg.price : 0;
  };

  // Package info helper
  const getPackageInfo = (packageId) => {
    const packageInfo = {
      0: {
        name: "Gói Cơ Bản",
        description:
          "Xét nghiệm các bệnh lây truyền qua đường tình dục phổ biến.",
        parameters: ["Chlamydia", "Gonorrhea (Lậu)", "Syphilis (Giang mai)"],
      },
      1: {
        name: "Gói Nâng Cao",
        description:
          "Xét nghiệm toàn diện các bệnh lây truyền qua đường tình dục.",
        parameters: [
          "Chlamydia",
          "Gonorrhea (Lậu)",
          "Syphilis (Giang mai)",
          "HIV",
          "Hepatitis B (Viêm gan B)",
          "Hepatitis C (Viêm gan C)",
        ],
      },
      2: {
        name: "Gói Tùy Chọn",
        description:
          "Xét nghiệm các bệnh lây truyền qua đường tình dục theo nhu cầu của bạn.",
        parameters: [],
      },
    };
    return packageInfo[packageId] || null;
  };

  const getTestInfo = (testId) => {
    return STI_TEST_TYPES.find((test) => test.id === testId) || {};
  };

  // Hiển thị mô tả cho gói xét nghiệm
  const renderPackageDescription = (packageId) => {
    const packageInfo = getPackageInfo(packageId);
    if (!packageInfo || !packageInfo.description) return null;

    return (
      <div className="text-sm text-gray-600 mt-1 italic">
        {packageInfo.description}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Vui lòng đăng nhập để xem lịch sử xét nghiệm STI
          </p>
        </div>
      </div>
    );
  }

  if (userTests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Lịch Sử Xét Nghiệm STI
        </h4>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Chưa có xét nghiệm STI nào
          </p>
          <p className="text-sm text-gray-500">
            Lịch sử xét nghiệm STI của bạn sẽ được hiển thị tại đây
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4">
        Lịch Sử Xét Nghiệm STI
      </h4>
      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Tìm kiếm xét nghiệm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label
            htmlFor="filterStatus"
            className="text-sm font-medium text-gray-700"
          >
            Trạng thái:
          </label>{" "}
          <select
            id="filterStatus"
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="0">Đã lên lịch</option>
            <option value="1">Đã lấy mẫu</option>
            <option value="2">Đang xử lý</option>
            <option value="3">Hoàn thành</option>
            <option value="4">Đã hủy</option>
          </select>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider"
              >
                Ngày xét nghiệm
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider"
              >
                Loại xét nghiệm
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider"
              >
                Trạng thái
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider"
              >
                Chi phí
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-indigo-600 uppercase tracking-wider"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => {
                // Định nghĩa các package xét nghiệm theo enum TestPackage
                const testPackageLabels = {
                  0: "Gói Cơ Bản",
                  1: "Gói Nâng Cao",
                  2: "Gói Tùy Chọn",
                };

                // Định nghĩa các tham số xét nghiệm theo enum TestParameter
                const testParamLabels = {
                  0: "Chlamydia",
                  1: "Gonorrhea (Lậu)",
                  2: "Syphilis (Giang mai)",
                  3: "HIV",
                  4: "Hepatitis B (Viêm gan B)",
                  5: "Hepatitis C (Viêm gan C)",
                  6: "Herpes",
                  7: "HPV",
                  8: "Mycoplasma",
                  9: "Trichomonas",
                };

                // Định nghĩa trạng thái xét nghiệm theo enum TestingStatus
                const statusLabels = {
                  0: "Đã lên lịch",
                  1: "Đã lấy mẫu",
                  2: "Đang xử lý",
                  3: "Hoàn thành",
                  4: "Đã hủy",
                };

                return (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span>
                          {formatDate(test.scheduleDate || test.createdAt)}
                        </span>
                        {test.slot !== undefined && (
                          <span className="text-xs text-gray-500 mt-1">
                            {test.slot === 0
                              ? "Sáng"
                              : test.slot === 1
                              ? "Chiều"
                              : "Tối"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex flex-col">
                        <span className="font-medium text-indigo-600 mb-1">
                          {testPackageLabels[test.testPackage] ||
                            "Không xác định"}
                        </span>
                        <div className="text-xs text-gray-500">
                          {test.testPackage === 2 && test.customParameters ? (
                            // Handle both array and string format
                            (Array.isArray(test.customParameters)
                              ? test.customParameters
                              : test.customParameters
                                  .split(",")
                                  .map((p) => parseInt(p.trim()))
                            ).map((paramId) => (
                              <div key={paramId} className="mb-1">
                                •{" "}
                                {testParamLabels[paramId] ||
                                  `Tham số #${paramId}`}
                              </div>
                            ))
                          ) : (
                            <div>
                              {test.testPackage === 0 ? (
                                <>
                                  • Chlamydia
                                  <br />
                                  • Gonorrhea (Lậu)
                                  <br />• Syphilis (Giang mai)
                                </>
                              ) : test.testPackage === 1 ? (
                                <>
                                  • Chlamydia
                                  <br />
                                  • Gonorrhea (Lậu)
                                  <br />
                                  • Syphilis (Giang mai)
                                  <br />
                                  • HIV
                                  <br />
                                  • Hepatitis B<br />• Hepatitis C
                                </>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          test.status === 3
                            ? "bg-green-100 text-green-800"
                            : test.status === 4
                            ? "bg-red-100 text-red-800"
                            : test.status === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {statusLabels[test.status] || "Không xác định"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {(() => {
                        // Use totalPrice from API if available
                        const price = test.totalPrice || 0;

                        if (price > 0) {
                          return new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(price);
                        } else {
                          return (
                            <span className="text-xs text-gray-500">
                              Không có thông tin
                            </span>
                          );
                        }
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 focus:outline-none px-3 py-1 rounded-md border border-indigo-300 hover:bg-indigo-50 text-xs"
                          onClick={() => {
                            setSelectedTest(test);
                            setShowModal(true);
                          }}
                        >
                          Chi tiết
                        </button>
                        {!test.isPaid && (
                          <button
                            className="text-white bg-green-600 hover:bg-green-700 focus:outline-none px-3 py-1 rounded-md text-xs"
                            onClick={() => {
                              // Handle payment logic
                              alert("Chuyển hướng đến trang thanh toán");
                            }}
                          >
                            Thanh toán
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
                  {searchText || filterStatus !== "all"
                    ? "Không tìm thấy kết quả phù hợp"
                    : "Không có xét nghiệm nào"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal hiển thị chi tiết xét nghiệm */}
      {showModal && selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
          <div className="relative w-full max-w-3xl mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Chi tiết xét nghiệm STI
                </h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-900 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  <span className="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                {/* Thông tin cơ bản */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Thông tin xét nghiệm
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {" "}
                    <div>
                      <p className="text-sm text-gray-500">Gói xét nghiệm</p>
                      <div className="mt-1">
                        <span className="inline-block font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-md border border-purple-200">
                          {(() => {
                            const packageLabels = {
                              0: "Cơ bản",
                              1: "Nâng cao",
                              2: "Tùy chỉnh",
                            };
                            return (
                              packageLabels[selectedTest.testPackage] ||
                              "Không xác định"
                            );
                          })()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày lấy mẫu</p>
                      <p className="text-base font-medium">
                        {new Date(
                          selectedTest.scheduleDate || selectedTest.createdAt
                        ).toLocaleDateString("vi-VN")}
                        {selectedTest.slot !== undefined && (
                          <span className="text-sm text-gray-500 ml-2">
                            {selectedTest.slot === 0
                              ? "(Sáng)"
                              : selectedTest.slot === 1
                              ? "(Chiều)"
                              : "(Tối)"}
                          </span>
                        )}
                      </p>
                    </div>{" "}
                    <div>
                      <p className="text-sm text-gray-500">Trạng thái</p>
                      <p
                        className={`text-base font-medium ${(() => {
                          const colorClasses = {
                            0: "text-yellow-600", // Pending
                            1: "text-blue-600", // In progress
                            2: "text-blue-700", // Processing
                            3: "text-green-600", // Completed
                            4: "text-red-600", // Cancelled
                          };
                          return (
                            colorClasses[selectedTest.status] || "text-gray-600"
                          );
                        })()}`}
                      >
                        {(() => {
                          const modalStatusLabels = {
                            0: "Đã lên lịch",
                            1: "Đã lấy mẫu",
                            2: "Đang xử lý",
                            3: "Hoàn thành",
                            4: "Đã hủy",
                          };
                          return (
                            modalStatusLabels[selectedTest.status] ||
                            "Không xác định"
                          );
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Chi phí</p>
                      <p className="text-base font-medium">
                        {(() => {
                          const price = selectedTest.totalPrice || 0;

                          if (price > 0) {
                            return new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(price);
                          } else {
                            return "Không có thông tin";
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Thông tin bác sĩ và lịch hẹn */}
                {selectedTest.appointment && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Thông tin lịch hẹn
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedTest.appointment.consultant && (
                        <div className="flex items-center mb-4">
                          <img
                            className="h-12 w-12 rounded-full object-cover mr-4"
                            src={
                              selectedTest.appointment.consultant.avatarUrl ||
                              "https://via.placeholder.com/48"
                            }
                            alt={selectedTest.appointment.consultant.name}
                          />
                          <div>
                            <p className="text-base font-medium">
                              {selectedTest.appointment.consultant.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {selectedTest.appointment.consultant.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              {selectedTest.appointment.consultant.phoneNumber}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Ngày hẹn</p>
                          <p className="text-base font-medium">
                            {new Date(
                              selectedTest.appointment.appointmentDate
                            ).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Trạng thái lịch hẹn
                          </p>
                          <p className="text-base font-medium">
                            {[
                              "Chờ xác nhận",
                              "Đã xác nhận",
                              "Đã hoàn thành",
                              "Đã hủy",
                            ][selectedTest.appointment.status] || "N/A"}
                          </p>
                        </div>
                        {selectedTest.appointment.notes && (
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Ghi chú</p>
                            <p className="text-base">
                              {selectedTest.appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}{" "}
                {/* Thông tin các loại xét nghiệm cụ thể */}
                {selectedTest.customParameters &&
                  selectedTest.customParameters.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">
                        <span className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                          </svg>
                          Loại xét nghiệm
                        </span>
                      </h4>
                      <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
                        <h5 className="font-semibold text-purple-700 mb-3">
                          {selectedTest.testPackage === 2
                            ? "Gói Tùy Chọn"
                            : selectedTest.testPackage === 1
                            ? "Gói Nâng Cao"
                            : "Gói Cơ Bản"}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedTest.customParameters.map((paramId) => {
                            const testParamLabels = {
                              0: "Chlamydia",
                              1: "Gonorrhoeae (Lậu)",
                              2: "Syphilis (Giang mai)",
                              3: "HIV",
                              4: "Herpes",
                              5: "Viêm gan B",
                              6: "Viêm gan C",
                              7: "Trichomonas",
                              8: "Mycoplasma Genitalium",
                            };
                            return (
                              <div
                                key={paramId}
                                className="flex items-center text-blue-600"
                              >
                                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                                <span className="text-sm">
                                  {testParamLabels[paramId] ||
                                    `Loại xét nghiệm ${paramId}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}{" "}
                {/* Kết quả xét nghiệm - Hiển thị kết quả từ API nếu có */}
                {selectedTest.status >= 3 &&
                  selectedTest.testResult &&
                  selectedTest.testResult.length > 0 && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h5 className="text-lg font-medium mb-3">
                        Kết quả xét nghiệm
                      </h5>
                      <div className="space-y-3">
                        {selectedTest.testResult.map((result) => {
                          // Define test parameter labels
                          const paramLabels = {
                            0: "Chlamydia",
                            1: "Gonorrhea (Lậu)",
                            2: "Syphilis (Giang mai)",
                            3: "HIV",
                            4: "Hepatitis B (Viêm gan B)",
                            5: "Hepatitis C (Viêm gan C)",
                            6: "Herpes",
                            7: "HPV",
                            8: "Mycoplasma",
                            9: "Trichomonas",
                          };

                          // Define outcome labels
                          const outcomeLabels = {
                            0: "Âm tính",
                            1: "Dương tính",
                            2: "Không xác định",
                          };

                          // Define outcome color classes
                          const getOutcomeColorClass = (outcome) =>
                            outcome === 0
                              ? "text-green-600"
                              : outcome === 1
                              ? "text-red-600"
                              : "text-yellow-600";

                          return (
                            <div
                              key={result.id}
                              className="p-3 border border-gray-200 rounded-md flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium">
                                  {paramLabels[result.parameter] ||
                                    `Xét nghiệm #${result.parameter}`}
                                </p>
                                {result.comments && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    {result.comments}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p
                                  className={`font-semibold ${getOutcomeColorClass(
                                    result.outcome
                                  )}`}
                                >
                                  {outcomeLabels[result.outcome] ||
                                    "Không xác định"}
                                </p>
                                {result.processedAt && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(
                                      result.processedAt
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>{" "}
              <div className="flex items-center justify-end p-6 border-t border-gray-200 rounded-b">
                <button
                  className="px-6 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-md mr-2 hover:bg-indigo-100 transition duration-150"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
                {/* Hiển thị nút thanh toán nếu chưa thanh toán */}{" "}
                {!selectedTest.isPaid && (
                  <button
                    className="px-6 py-2 bg-green-600 text-white font-medium rounded-md mr-2 hover:bg-green-700"
                    type="button"
                    onClick={() => {
                      // Tạo object dữ liệu thanh toán đầy đủ
                      const testParamLabels = {
                        0: "Chlamydia",
                        1: "Gonorrhea (Lậu)",
                        2: "Syphilis (Giang mai)",
                        3: "HIV",
                        4: "Hepatitis B (Viêm gan B)",
                        5: "Hepatitis C (Viêm gan C)",
                        6: "Herpes",
                        7: "HPV",
                        8: "Mycoplasma",
                        9: "Trichomonas",
                      };

                      const testPackageLabels = {
                        0: "Gói Cơ Bản",
                        1: "Gói Nâng Cao",
                        2: "Gói Tùy Chọn",
                      };

                      // Lấy danh sách tên các loại xét nghiệm
                      let testParams = [];
                      if (
                        selectedTest.testResult &&
                        selectedTest.testResult.length > 0
                      ) {
                        testParams = selectedTest.testResult
                          .filter((r) => r !== null)
                          .map(
                            (result) =>
                              testParamLabels[result.parameter] ||
                              `Loại ${result.parameter}`
                          );
                      } else if (
                        selectedTest.customParameters &&
                        selectedTest.customParameters.length > 0
                      ) {
                        testParams = selectedTest.customParameters.map(
                          (param) => testParamLabels[param] || `Loại ${param}`
                        );
                      }
                      const paymentData = {
                        testId: selectedTest.id,
                        amount:
                          selectedTest.totalPrice ||
                          getPackagePrice(selectedTest.testPackage) ||
                          0,
                        returnUrl: window.location.pathname,
                        testType:
                          testPackageLabels[selectedTest.testPackage] ||
                          "Xét nghiệm STI",
                        testDate: formatDate(
                          selectedTest.scheduleDate || selectedTest.createdAt
                        ),
                        testParams: testParams,
                      };

                      // Lưu vào localStorage để trang Payment có thể truy xuất
                      localStorage.setItem(
                        "paymentData",
                        JSON.stringify(paymentData)
                      );

                      // Chuyển hướng đến trang thanh toán
                      window.location.href = `/payment?testId=${selectedTest.id}`;

                      // Đóng modal
                      setShowModal(false);
                    }}
                  >
                    Thanh toán
                  </button>
                )}
                <button
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
                  type="button"
                  onClick={() => {
                    // Logic to schedule follow-up or contact support
                    alert("Chức năng liên hệ hỗ trợ sẽ được cập nhật sớm!");
                    setShowModal(false);
                  }}
                >
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default STITestingHistory;
