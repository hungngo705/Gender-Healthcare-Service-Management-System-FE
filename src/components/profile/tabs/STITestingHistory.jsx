import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import stiTestingService from "../../../services/stiTestingService";
import { useAuth } from "../../../contexts/AuthContext";

function STITestingHistory() {
  const { currentUser } = useAuth();
  const [userTests, setUserTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', '0' (pending), '1' (completed)
  const [searchText, setSearchText] = useState("");

  // Fetch user's STI tests
  useEffect(() => {
    const fetchUserTests = async () => {
      if (!currentUser) return;

      setIsLoading(true);
      try {
        const response = await stiTestingService.getAll();
        if (response?.data?.is_success) {
          // Convert dates to proper format and sort by collectedDate (newest first)
          const processedTests = response.data.data
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
  }, [currentUser]);

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
            <option value="all">Tất cả</option>
            <option value="0">Đang xử lý</option>
            <option value="1">Hoàn thành</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ngày xét nghiệm
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bác sĩ tư vấn
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Loại xét nghiệm
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phương pháp
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng thái
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Chi tiết
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => {
                // Define test type labels
                const testTypeLabels = [
                  "Comprehensive",
                  "Gonorrhea",
                  "Chlamydia",
                  "Syphilis",
                  "HIV",
                ];
                const methodLabels = [
                  "Máu",
                  "Nước tiểu",
                  "Dịch âm đạo",
                  "Ngoáy họng",
                ];
                const statusLabels = ["Đang xử lý", "Hoàn thành"];

                // Format date
                const formattedDate = new Date(
                  test.collectedDate
                ).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                });

                return (
                  <tr
                    key={`${test.appointmentId}-${test.testType}-${test.method}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formattedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {test.appointment?.consultant ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <img
                              className="h-8 w-8 rounded-full object-cover"
                              src={
                                test.appointment.consultant.avatarUrl ||
                                "https://via.placeholder.com/40"
                              }
                              alt={test.appointment.consultant.name}
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {test.appointment.consultant.name}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">
                        {testTypeLabels[test.testType] || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {methodLabels[test.method] || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          test.status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {statusLabels[test.status] || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() => {
                          setSelectedTest(test);
                          setShowModal(true);
                        }}
                      >
                        Xem chi tiết
                      </button>
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
                    <div>
                      <p className="text-sm text-gray-500">Loại xét nghiệm</p>
                      <p className="text-base font-medium">
                        {(() => {
                          const testTypeLabels = [
                            "Comprehensive",
                            "Gonorrhea",
                            "Chlamydia",
                            "Syphilis",
                            "HIV",
                          ];
                          return testTypeLabels[selectedTest.testType] || "N/A";
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phương pháp</p>
                      <p className="text-base font-medium">
                        {(() => {
                          const methodLabels = [
                            "Máu",
                            "Nước tiểu",
                            "Dịch âm đạo",
                            "Ngoáy họng",
                          ];
                          return methodLabels[selectedTest.method] || "N/A";
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày lấy mẫu</p>
                      <p className="text-base font-medium">
                        {new Date(
                          selectedTest.collectedDate
                        ).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Trạng thái</p>
                      <p
                        className={`text-base font-medium ${
                          selectedTest.status === 1
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {selectedTest.status === 1
                          ? "Hoàn thành"
                          : "Đang xử lý"}
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
                )}

                {/* Kết quả xét nghiệm - Sẽ hiển thị nếu xét nghiệm đã hoàn thành */}
                {selectedTest.status === 1 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Kết quả xét nghiệm
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-600 font-medium mb-2">
                        Kết quả đã có! Vui lòng liên hệ bác sĩ tư vấn để được
                        giải thích chi tiết.
                      </p>
                      <button
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                        onClick={() => {
                          // Logic to view or download test results would go here
                          alert("Đang tải kết quả xét nghiệm...");
                        }}
                      >
                        Xem kết quả
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end p-6 border-t border-gray-200 rounded-b">
                <button
                  className="px-6 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-md mr-2 hover:bg-indigo-100"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
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
