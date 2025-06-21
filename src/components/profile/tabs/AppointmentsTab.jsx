import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Calendar, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import userService from "../../../services/userService";
import appointmentService from "../../../services/appointmentService";

function AppointmentsTab({ navigate }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "completed"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Helper function to convert slot number to time string
  const getTimeBySlot = (slotNumber) => {
    const slotMap = {
      0: "08:00 - 10:00",
      1: "10:00 - 12:00",
      2: "13:00 - 15:00",
      3: "15:00 - 17:00",
    };
    return slotMap[slotNumber] || "Không xác định";
  };

  // Helper function to get status text and class
  const getStatusInfo = (statusCode) => {
    // Convert to number if it's a string
    const status =
      typeof statusCode === "string" ? parseInt(statusCode, 10) : statusCode;

    switch (status) {
      case 0:
        return {
          text: "Đã đặt lịch",
          className: "bg-yellow-100 text-yellow-800",
        };
      case 1:
        return {
          text: "Hoàn thành",
          className: "bg-green-100 text-green-800",
        };
      case 2:
        return {
          text: "Đã hủy",
          className: "bg-red-100 text-red-800",
        };
      case 3:
        return {
          text: "Đang tiến hành",
          className: "bg-blue-100 text-blue-800",
        };
      default:
        return {
          text: "Không xác định",
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Step 1: Get current user profile
        const userResponse = await userService.getCurrentUserProfile();
        console.log("User profile:", userResponse);

        // Extract user ID from response
        const currentUserId = userResponse.id || userResponse.data?.id;
        setUserId(currentUserId);

        if (!currentUserId) {
          throw new Error("Không thể xác định người dùng hiện tại");
        }

        // Step 2: Get all appointments
        const appointmentsResponse = await appointmentService.getAll();
        console.log("All appointments:", appointmentsResponse);

        // Step 3: Filter appointments for this user
        const allAppointments = appointmentsResponse.data?.data || [];
        const userAppointments = allAppointments.filter(
          (appointment) => appointment.customerId === currentUserId
        );

        console.log("User appointments:", userAppointments);
        setAppointments(userAppointments);
        setError(null);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter((appointment) => {
    const status =
      typeof appointment.status === "string"
        ? parseInt(appointment.status, 10)
        : appointment.status;

    if (activeTab === "upcoming") {
      // Show scheduled (0) and in progress (3) appointments
      return status === 0 || status === 3;
    } else {
      // Show completed (1) and cancelled (2) appointments
      return status === 1 || status === 2;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Reset to first page when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Page change handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Lịch hẹn của bạn
        </h3>
        <div className="text-center py-8">
          <div className="animate-pulse flex justify-center">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">Đang tải lịch hẹn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Lịch hẹn của bạn
        </h3>
        <div className="text-center py-8 bg-red-50 rounded-lg">
          <Calendar size={48} className="mx-auto text-red-400" />
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Lịch hẹn của bạn
      </h3>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6 w-64 flex-shrink-0">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`${
              activeTab === "upcoming"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm w-24 text-center`}
          >
            Sắp tới
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`${
              activeTab === "completed"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm w-24 text-center`}
          >
            Hoàn thành
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {filteredAppointments.length === 0 ? (
        // No appointments for current tab
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          {activeTab === "upcoming" ? (
            <>
              <Calendar size={48} className="mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Bạn chưa có lịch hẹn nào sắp tới
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate("/services")}
              >
                Đặt lịch hẹn ngay
              </button>
            </>
          ) : (
            <>
              <CheckCircle size={48} className="mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Bạn chưa có lịch hẹn nào đã hoàn thành
              </p>
            </>
          )}
        </div>
      ) : (
        // Show appointments for current tab
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tư vấn viên
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ngày hẹn
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thời gian
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAppointments.map((appointment) => {
                  const statusInfo = getStatusInfo(appointment.status);
                  return (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {appointment.consultant?.avatarUrl && (
                            <div className="flex-shrink-0 h-8 w-8 mr-2">
                              <img
                                className="h-8 w-8 rounded-full"
                                src={appointment.consultant.avatarUrl}
                                alt=""
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/40";
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.consultant?.name || "Không xác định"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(appointment.appointmentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getTimeBySlot(appointment.slot)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.className}`}
                        >
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.notes || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {filteredAppointments.length > itemsPerPage && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Trước
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị từ{" "}
                    <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                    đến{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredAppointments.length)}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="font-medium">
                      {filteredAppointments.length}
                    </span>{" "}
                    lịch hẹn
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    {/* Improved pagination numbers */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Trang trước</span>
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {/* Logic to show limited page numbers with ellipsis */}
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        // Only show first page, last page, current page, and 1 page before/after current
                        const showPageButton =
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          Math.abs(pageNum - currentPage) <= 1;

                        // Show ellipsis when there are gaps
                        if (!showPageButton) {
                          // Show ellipsis only once between gaps
                          if (pageNum === 2 || pageNum === totalPages - 1) {
                            return (
                              <span
                                key={`ellipsis-${pageNum}`}
                                className="relative inline-flex h-8 w-8 items-center justify-center text-sm text-gray-700"
                              >
                                ···
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`relative inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-all duration-200
                              ${
                                currentPage === pageNum
                                  ? "z-10 bg-indigo-600 text-white shadow-sm"
                                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                              }`}
                            aria-current={
                              currentPage === pageNum ? "page" : undefined
                            }
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Trang sau</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          )}

          {activeTab === "upcoming" && (
            <div className="mt-4 text-right">
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate("/services")}
              >
                Đặt thêm lịch hẹn
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

AppointmentsTab.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default AppointmentsTab;
