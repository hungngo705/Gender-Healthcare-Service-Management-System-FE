/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import stiTestingService from "../../../services/stiTestingService";
import paymentService from "../../../services/paymentService";
import { useAuth } from "../../../contexts/AuthContext";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
// Import các enum chung
import {
  PARAMETER_ENUM,
  TIME_SLOT_ENUM,
  TEST_PACKAGE_ENUM,
  STATUS_ENUM,
  OUTCOME_ENUM,
} from "../../../constants/enums";

// Sử dụng các enum từ file chung thay vì định nghĩa lại
const testPackageLabels = Object.values(TEST_PACKAGE_ENUM).reduce(
  (acc, pkg) => {
    acc[pkg.id] = pkg.name;
    return acc;
  },
  {}
);

const slotLabels = Object.values(TIME_SLOT_ENUM).reduce((acc, slot) => {
  acc[slot.id] = slot.display;
  return acc;
}, {});

const statusLabels = Object.values(STATUS_ENUM).reduce((acc, status) => {
  acc[status.id] = status.label;
  return acc;
}, {});

const parameterLabels = Object.values(PARAMETER_ENUM).reduce((acc, param) => {
  acc[param.id] = param.name;
  return acc;
}, {});

const outcomeLabels = Object.values(OUTCOME_ENUM).reduce((acc, outcome) => {
  acc[outcome.id] = outcome.label;
  return acc;
}, {});

function STITestingHistory({ userId }) {
  const { currentUser } = useAuth();
  const [userTests, setUserTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [filterSlot, setFilterSlot] = useState("all");

  const [activeTab, setActiveTab] = useState("details");

  // Hàm tiện ích để lấy class màu sắc cho trạng thái
  const getStatusColorClass = (status) => {
    return STATUS_ENUM[status]?.color || "bg-gray-100 text-gray-800";
  };

  // Hàm tiện ích để định dạng ngày tháng - đồng bộ với các components khác
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Hàm tiện ích định dạng ngày giờ - đồng bộ với các components khác
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "HH:mm - dd/MM/yyyy", { locale: vi });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return "N/A";
    }
  };

  // Thêm hàm này sau hàm formatDateTime trong file STITestingHistory.jsx
  const formatTimeOnly = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "HH:mm", { locale: vi });
    } catch (error) {
      return "N/A";
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

    // Filter by slot
    if (filterSlot !== "all") {
      const slotNum = parseInt(filterSlot, 10);
      result = result.filter((test) => test.slot === slotNum);
    }

    // Filter by date range
    if (isDateFilterActive && startDate && endDate) {
      const startDateTime = new Date(startDate).setHours(0, 0, 0, 0);
      const endDateTime = new Date(endDate).setHours(23, 59, 59, 999);

      result = result.filter((test) => {
        const testDate = new Date(
          test.scheduleDate || test.createdAt
        ).getTime();
        return testDate >= startDateTime && testDate <= endDateTime;
      });
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
  }, [
    userTests,
    filterStatus,
    filterSlot, // Thêm filterSlot vào dependencies
    searchText,
    startDate,
    endDate,
    isDateFilterActive,
  ]);

  // Sửa hàm getPackagePrice để sử dụng TEST_PACKAGE_ENUM
  const getPackagePrice = (packageId) => {
    return TEST_PACKAGE_ENUM[packageId]?.price || 0;
  };

  // Update the handlePaymentRedirect function
  const handlePaymentRedirect = async (test) => {
    setIsRedirecting(true);

    try {
      // Use the existing createPayment function
      const paymentResult = await paymentService.createPayment(
        test.id, // The ID of the existing test
        "vnpay" // Default payment method
      );

      if (paymentResult.success && paymentResult.data?.paymentUrl) {
        // Redirect to the payment URL
        window.location.href = paymentResult.data.paymentUrl;
      } else {
        toast.error(
          "Không thể tạo liên kết thanh toán: " +
            (paymentResult.error || "Lỗi không xác định")
        );
        setIsRedirecting(false);
      }
    } catch (error) {
      console.error("Payment redirect error:", error);
      toast.error(
        "Lỗi khi tạo liên kết thanh toán: " +
          (error.message || "Lỗi không xác định")
      );
      setIsRedirecting(false);
    }
  };

  // Add a function to handle resetting the date filter
  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsDateFilterActive(false);
  };

  // Add a function to apply the date filter
  const applyDateFilter = () => {
    if (startDate && endDate) {
      setIsDateFilterActive(true);
    } else {
      toast.warning("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc");
    }
  };

  // Hàm reset tất cả các bộ lọc
  const resetAllFilters = () => {
    setFilterStatus("all");
    setFilterSlot("all");
    setStartDate("");
    setEndDate("");
    setIsDateFilterActive(false);
    setSearchText("");
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
      {/* Search and Filter Bar - Updated with date range */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
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

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Bộ lọc trạng thái */}
            <div className="flex items-center space-x-2">
              <label
                htmlFor="filterStatus"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
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
                <option value="0">Đã lên lịch</option>
                <option value="1">Đã lấy mẫu</option>
                <option value="2">Đang xử lý</option>
                <option value="3">Hoàn thành</option>
                <option value="4">Đã hủy</option>
              </select>
            </div>

            {/* Bộ lọc khung giờ */}
            <div className="flex items-center space-x-2">
              <label
                htmlFor="filterSlot"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Khung giờ:
              </label>
              <select
                id="filterSlot"
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterSlot}
                onChange={(e) => setFilterSlot(e.target.value)}
              >
                <option value="all">Tất cả</option>
                {Object.values(TIME_SLOT_ENUM).map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.display}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 012 2z"
              ></path>
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Khoảng thời gian:
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-grow">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label
                htmlFor="startDate"
                className="text-sm text-gray-500 whitespace-nowrap"
              >
                Từ ngày:
              </label>
              <input
                type="date"
                id="startDate"
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label
                htmlFor="endDate"
                className="text-sm text-gray-500 whitespace-nowrap"
              >
                Đến ngày:
              </label>
              <input
                type="date"
                id="endDate"
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none"
                onClick={applyDateFilter}
              >
                Áp dụng
              </button>
              <button
                type="button"
                className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-100 focus:outline-none"
                onClick={resetDateFilter}
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        {/* Show active filters */}
        <div className="flex flex-wrap gap-2">
          {isDateFilterActive && startDate && endDate && (
            <div className="flex items-center bg-blue-50 p-2 rounded-md">
              <span className="text-xs text-blue-700 mr-2">
                Khoảng thời gian:
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                <button
                  onClick={resetDateFilter}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </span>
            </div>
          )}

          {filterSlot !== "all" && (
            <div className="flex items-center bg-purple-50 p-2 rounded-md">
              <span className="text-xs text-purple-700 mr-2">Khung giờ:</span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center">
                {slotLabels[parseInt(filterSlot, 10)]}
                <button
                  onClick={() => setFilterSlot("all")}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </span>
            </div>
          )}
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
                return (
                  <tr key={test.id}>
                    {/* Ngày xét nghiệm */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">
                          {formatDate(test.scheduleDate || test.createdAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {slotLabels[test.slot] || "Không xác định"}
                        </div>
                      </div>
                    </td>
                    {/* Loại xét nghiệm */}
                    <td className="px-3 py-4 text-sm text-gray-900">
                      <div className="mb-2 w-25">
                        <span className="font-semibold text-purple-700 bg-purple-50 py-1 px-1 rounded-md border border-purple-200">
                          {testPackageLabels[test.testPackage] || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.0">
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
                                {parameterLabels[result.parameter] ||
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
                              {parameterLabels[param] || `Loại ${param}`}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            Không có thông tin xét nghiệm
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Trạng thái */}
                    <td className="px-3 py-4 whitespace-nowrap">
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 012 2z"
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
                            setActiveTab("details");
                            setShowModal(true);
                          }}
                        >
                          Xem chi tiết
                        </button>
                        {/* Hiển thị nút thanh toán nếu đã lên lịch và chưa thanh toán */}
                        {!test.isPaid && test.status === 0 && (
                          <button
                            className="text-white bg-green-600 hover:bg-green-700 focus:outline-none px-3 py-1 rounded-md text-xs"
                            onClick={() => handlePaymentRedirect(test)}
                            disabled={isRedirecting}
                          >
                            {isRedirecting ? (
                              <>
                                <span className="inline-block w-3 h-3 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Đang chuyển...
                              </>
                            ) : (
                              "Thanh toán"
                            )}
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

      {/* Nút reset tất cả các bộ lọc */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-100 focus:outline-none"
          onClick={resetAllFilters}
        >
          Xóa tất cả bộ lọc
        </button>
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
              <div className="px-6 pt-4 border-b border-gray-200">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
                  <li className="mr-2">
                    <button
                      onClick={() => setActiveTab("details")}
                      className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                        activeTab === "details"
                          ? "text-indigo-600 border-indigo-600"
                          : "border-transparent hover:text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      Thông tin chi tiết
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      onClick={() => setActiveTab("results")}
                      className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                        activeTab === "results"
                          ? "text-indigo-600 border-indigo-600"
                          : "border-transparent hover:text-gray-600 hover:border-gray-300"
                      }`}
                      disabled={
                        !selectedTest.testResult ||
                        selectedTest.testResult.length === 0
                      }
                    >
                      Kết quả xét nghiệm
                    </button>
                  </li>
                </ul>
              </div>
              <div
                className="relative p-6 flex-auto"
                style={{ maxHeight: "60vh", overflowY: "auto" }}
              >
                {activeTab === "details" && (
                  <div>
                    {/* Thông tin người đặt */}
                    {selectedTest.customer && (
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
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
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                          </svg>
                          Thông tin người đặt lịch
                        </h4>
                        <div className="flex items-start">
                          <img
                            className="h-16 w-16 rounded-full object-cover mr-5 flex-shrink-0"
                            src={
                              selectedTest.customer.avatarUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                selectedTest.customer.name
                              )}&color=7F9CF5&background=EBF4FF`
                            }
                            alt={selectedTest.customer.name}
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 flex-grow">
                            <div className="sm:col-span-2">
                              <p className="text-sm text-gray-500">Họ và tên</p>
                              <p className="text-base font-medium text-gray-900 truncate">
                                {selectedTest.customer.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="text-base font-medium text-gray-900 truncate">
                                {selectedTest.customer.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Thông tin cơ bản */}
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Thông tin xét nghiệm
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {" "}
                        <div>
                          <p className="text-sm text-gray-500">
                            Gói xét nghiệm
                          </p>
                          <div className="mt-1">
                            <span className="inline-block font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-md border border-purple-200">
                              {testPackageLabels[selectedTest.testPackage] ||
                                "Không xác định"}
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
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Khung giờ</p>
                          <p className="text-base font-medium">
                            {slotLabels[selectedTest.slot] || "Không xác định"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Trạng thái</p>
                          <p
                            className={`text-base font-medium ${getStatusColorClass(
                              selectedTest.status
                            ).replace("bg-", "text-")}`}
                          >
                            {statusLabels[selectedTest.status] ||
                              "Không xác định"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Chi phí</p>
                          <p className="text-base font-bold text-gray-800">
                            {selectedTest.totalPrice
                              ? new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(selectedTest.totalPrice)
                              : selectedTest.testPackage !== undefined
                              ? new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(
                                  getPackagePrice(selectedTest.testPackage)
                                )
                              : "N/A"}
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
                                  selectedTest.appointment.consultant
                                    .avatarUrl ||
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
                                  {
                                    selectedTest.appointment.consultant
                                      .phoneNumber
                                  }
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
                                  strokeWidth="2"
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
                                return (
                                  <div
                                    key={paramId}
                                    className="flex items-center text-blue-600"
                                  >
                                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                                    <span className="text-sm">
                                      {parameterLabels[paramId] ||
                                        `Loại xét nghiệm ${paramId}`}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                )}
                {activeTab === "results" && (
                  <div>
                    {/* Kết quả xét nghiệm - Hiển thị kết quả từ API nếu có */}
                    {selectedTest.testResult &&
                    selectedTest.testResult.length > 0 ? (
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
                                  // Sử dụng enum từ constants thay vì định nghĩa lại

                                  // Màu sắc theo kết quả
                                  const resultColorClass =
                                    OUTCOME_ENUM[result.outcome]?.color ||
                                    "text-yellow-600";

                                  return (
                                    <tr key={result.id}>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="font-medium">
                                          {parameterLabels[result.parameter] ||
                                            `Loại ${result.parameter}`}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <span
                                          className={`${resultColorClass} font-medium`}
                                        >
                                          {outcomeLabels[result.outcome] ||
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
                    ) : (
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
                          Chưa có kết quả xét nghiệm
                        </p>
                        <p className="text-sm text-gray-500">
                          Kết quả sẽ được hiển thị ở đây khi có.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                      handlePaymentRedirect(selectedTest);
                      setShowModal(false);
                    }}
                    disabled={isRedirecting}
                  >
                    {isRedirecting ? (
                      <>
                        <span className="inline-block w-3 h-3 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Đang chuyển...
                      </>
                    ) : (
                      "Thanh toán"
                    )}
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
