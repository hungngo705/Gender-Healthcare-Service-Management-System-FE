import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import stiTestingService from "../../../services/stiTestingService";
import { useAuth } from "../../../contexts/AuthContext";
import {
  STI_PACKAGES,
  STI_TEST_TYPES,
} from "../../sti/booking-components/constants";

function STITestingHistory({ userId }) {
  const { currentUser } = useAuth();
  const [userTests, setUserTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', '0' (pending), '1' (completed)  const [searchText, setSearchText] = useState("");
  const [searchText, setSearchText] = useState("");
  // Hàm tiện ích để lấy class màu sắc cho trạng thái
  const getStatusColorClass = (status) => {
    switch (status) {
      case 0:
        return "bg-yellow-100 text-yellow-800"; // Scheduled
      case 1:
        return "bg-purple-100 text-purple-800"; // SampleTaken
      case 2:
        return "bg-blue-100 text-blue-800"; // Processing
      case 3:
        return "bg-green-100 text-green-800"; // Completed
      case 4:
        return "bg-red-100 text-red-800"; // Cancelled
      default:
        return "bg-gray-100 text-gray-800"; // Unknown
    }
  };

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
      if (!currentUser && !userId) {
        toast.error("Vui lòng đăng nhập để xem lịch sử xét nghiệm");
        return;
      }

      setIsLoading(true);
      try {
        // Sử dụng API mới để lấy STI test của người dùng hiện tại
        const response = await stiTestingService.getForCustomer();
        if (response?.data?.is_success) {
          console.log("Customer STI tests:", response.data.data);

          // Chuẩn bị dữ liệu từ API và loại bỏ null
          const userTestsOnly = (response.data.data || []).filter(
            (test) => test !== null
          ); // Loại bỏ các phần tử null

          // Convert dates to proper format and sort by collectedDate (newest first)
          const processedTests = userTestsOnly
            .map((test) => ({
              ...test,
              // Make sure dates are properly formatted
              collectedDate:
                test.collectedDate || new Date().toISOString().split("T")[0],
              appointment: test.appointment
                ? {
                    ...test.appointment,
                    appointmentDate:
                      test.appointment.appointmentDate ||
                      new Date().toISOString().split("T")[0],
                  }
                : null,
            }))
            .sort(
              (a, b) => new Date(b.collectedDate) - new Date(a.collectedDate)
            );

          setUserTests(processedTests);
        }
      } catch (error) {
        console.error("Error fetching user STI tests:", error);
        toast.error("Không thể tải dữ liệu xét nghiệm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserTests();
  }, [currentUser, userId]);

  // Filter tests based on status and search text
  useEffect(() => {
    if (!userTests.length) {
      setFilteredTests([]);
      return;
    }

    let result = [...userTests];

    // Filter by status
    if (filterStatus !== "all") {
      const statusNum = parseInt(filterStatus, 10);
      result = result.filter((test) => test.status === statusNum);
    }

    // Filter by search text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      result = result.filter(
        (test) =>
          // Search in test type
          (test.testType !== undefined &&
            ["comprehensive", "gonorrhea", "chlamydia", "syphilis", "hiv"][
              test.testType
            ]
              ?.toLowerCase()
              .includes(searchLower)) ||
          // Search in consultant name
          test.appointment?.consultant?.name
            .toLowerCase()
            .includes(searchLower) ||
          // Search in date
          test.collectedDate.includes(searchLower)
      );
    }

    setFilteredTests(result);
  }, [userTests, filterStatus, searchText]);

  // Tiện ích để lấy giá từ constants
  const getTestPrice = (testId) => {
    const test = STI_TEST_TYPES.find((test) => test.id === testId);
    return test ? test.price : 0;
  };

  const getPackagePrice = (packageId) => {
    const pkg = STI_PACKAGES.find((pkg) => pkg.id === packageId);
    return pkg ? pkg.price : 0;
  };

  const getPackageInfo = (packageId) => {
    return STI_PACKAGES.find((pkg) => pkg.id === packageId) || {};
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
          </label>
          <select
            id="filterStatus"
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {" "}
            <option value="all">Tất cả</option>
            <option value="0">Đã lên lịch</option>
            <option value="1">Đã lấy mẫu</option>
            <option value="2">Đang xử lý</option>
            <option value="3">Hoàn thành</option>
            <option value="4">Đã hủy</option>
          </select>
        </div>
      </div>{" "}
      <div className="bg-white shadow-md rounded-lg overflow-auto">
        {" "}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <tr>
              {" "}
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
                  0: "Gói Cơ Bản", // Basic
                  1: "Gói Tự Chọn", // Custom 3
                  2: "Gói Toàn Diện", // Complete
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
                  0: "Đã lên lịch", // Scheduled
                  1: "Đã lấy mẫu", // SampleTaken
                  2: "Đang xử lý", // Processing
                  3: "Hoàn thành", // Completed
                  4: "Đã hủy", // Cancelled                }; // Không cần format date ở đây nữa vì chúng ta có hàm formatDate
                };
                return (
                  <tr key={test.id}>
                    {" "}
                    {/* Ngày xét nghiệm */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">
                          {formatDate(test.scheduleDate || test.createdAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(
                            test.scheduleDate || test.createdAt
                          ).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </td>{" "}
                    {/* Loại xét nghiệm */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="mb-2">
                        <span className="font-semibold text-purple-700 bg-purple-50 px-1 py-1 rounded-md border border-purple-200">
                          {testPackageLabels[test.testPackage] || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {test.testResult &&
                        test.testResult.filter((r) => r !== null).length > 0 ? (
                          test.testResult
                            .filter((r) => r !== null)
                            .map((result) => (
                              <span
                                key={result.id}
                                className="flex items-center text-blue-600 text-xs"
                              >
                                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                                {testParamLabels[result.parameter] ||
                                  `Loại ${result.parameter}`}
                              </span>
                            ))
                        ) : test.customParameters &&
                          test.customParameters.length > 0 ? (
                          test.customParameters.map((param) => (
                            <span
                              key={param}
                              className="flex items-center text-blue-600 text-xs"
                            >
                              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                              {testParamLabels[param] || `Loại ${param}`}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            Không có thông tin xét nghiệm
                          </span>
                        )}
                      </div>
                    </td>{" "}
                    {/* Trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
                          test.status
                        )}`}
                      >
                        {(() => {
                          // Icon phù hợp với trạng thái
                          let statusIcon = "";
                          switch (test.status) {
                            case 0:
                              statusIcon = (
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              );
                              break;
                            case 1:
                              statusIcon = (
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                  />
                                </svg>
                              );
                              break;
                            case 2:
                              statusIcon = (
                                <svg
                                  className="w-3 h-3 mr-1 animate-spin"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                              );
                              break;
                            case 3:
                              statusIcon = (
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              );
                              break;
                            case 4:
                              statusIcon = (
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              );
                              break;
                            default:
                              statusIcon = null;
                          }
                          return (
                            <>
                              {statusIcon}
                              {statusLabels[test.status] || "Không xác định"}
                            </>
                          );
                        })()}
                      </span>
                    </td>
                    {/* Chi phí */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-800">
                        {" "}
                        {test.totalPrice
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(test.totalPrice)
                          : test.testPackage !== undefined
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(getPackagePrice(test.testPackage))
                          : "N/A"}
                      </div>
                      {test.isPaid ? (
                        <div className="mt-1">
                          <span className="text-xs text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-full inline-flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Đã thanh toán
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1">
                          <span className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-100 px-2 py-1 rounded-full inline-flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Chưa thanh toán
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex flex-col gap-2 items-center">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 focus:outline-none border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md"
                          onClick={() => {
                            setSelectedTest(test);
                            setShowModal(true);
                          }}
                        >
                          Xem chi tiết
                        </button>
                        {/* Hiển thị nút thanh toán nếu đã lên lịch và chưa thanh toán */}
                        {!test.isPaid && test.status === 0 && (
                          <button
                            className="text-white bg-green-600 hover:bg-green-700 focus:outline-none px-3 py-1 rounded-md text-xs"
                            onClick={() => {
                              // Tạo object dữ liệu thanh toán đầy đủ
                              const paymentData = {
                                testId: test.id,
                                amount: test.totalPrice,
                                returnUrl: window.location.pathname,
                                testType:
                                  testPackageLabels[test.testPackage] ||
                                  "Xét nghiệm STI",
                                testDate: formatDate(
                                  test.scheduleDate || test.createdAt
                                ),
                                testParam: test.customParameters || [],
                              };

                              // Lưu vào localStorage để trang Payment có thể truy xuất
                              localStorage.setItem(
                                "paymentData",
                                JSON.stringify(paymentData)
                              );

                              // Chuyển hướng đến trang thanh toán
                              window.location.href = `/payment?testId=${test.id}`;
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
                          selectedTest.collectedDate
                        ).toLocaleDateString("vi-VN")}
                      </p>
                    </div>{" "}
                    <div>
                      <p className="text-sm text-gray-500">Trạng thái</p>
                      <p
                        className={`text-base font-medium ${(() => {
                          switch (selectedTest.status) {
                            case 3:
                              return "text-green-600"; // Completed
                            case 4:
                              return "text-red-600"; // Cancelled
                            case 2:
                              return "text-blue-600"; // Processing
                            case 1:
                              return "text-purple-600"; // SampleTaken
                            default:
                              return "text-yellow-600"; // Scheduled
                          }
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
                            ? "Tùy chỉnh"
                            : selectedTest.testPackage === 1
                            ? "Nâng cao"
                            : "Cơ bản"}
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
                {selectedTest.testResult &&
                  selectedTest.testResult.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Kết quả xét nghiệm
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Loại xét nghiệm
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Kết quả
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Ghi chú
                                </th>
                                {selectedTest.status >= 3 && (
                                  <th
                                    scope="col"
                                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Ngày xử lý
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedTest.testResult.map((result) => {
                                // Enum mapping cho TestParameter
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

                                // Enum mapping cho ResultOutcome
                                const resultOutcomeLabels = {
                                  0: "Âm tính",
                                  1: "Dương tính",
                                  2: "Đang xử lý",
                                };

                                // Màu sắc theo kết quả
                                const resultColorClass =
                                  result.outcome === 0
                                    ? "text-green-600"
                                    : result.outcome === 1
                                    ? "text-red-600"
                                    : "text-yellow-600";

                                return (
                                  <tr key={result.id}>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <span className="font-medium">
                                        {testParamLabels[result.parameter] ||
                                          `Loại ${result.parameter}`}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <span
                                        className={`${resultColorClass} font-medium`}
                                      >
                                        {resultOutcomeLabels[result.outcome] ||
                                          "Không xác định"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      {result.comments || "Không có"}
                                    </td>
                                    {selectedTest.status >= 3 && (
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        {result.processedAt
                                          ? new Date(
                                              result.processedAt
                                            ).toLocaleDateString("vi-VN")
                                          : "Chưa xử lý"}
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {selectedTest.status === 3 && (
                          <div className="mt-4">
                            <p className="text-green-600 font-medium">
                              Kết quả đã có! Vui lòng liên hệ bác sĩ tư vấn để
                              được giải thích chi tiết.
                            </p>
                            <button
                              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                              onClick={() => {
                                // Logic to view or download test results would go here
                                alert(
                                  "Đang tải kết quả xét nghiệm chi tiết..."
                                );
                              }}
                            >
                              Tải kết quả
                            </button>
                          </div>
                        )}
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
                {!selectedTest.isPaid && selectedTest.status === 0 && (
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
                        1: "Gói Tự Chọn",
                        2: "Gói Toàn Diện",
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
                {selectedTest.status === 0 && (
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default STITestingHistory;
