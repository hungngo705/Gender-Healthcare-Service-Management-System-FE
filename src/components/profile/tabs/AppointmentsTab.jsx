import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import userService from "../../../services/userService";
import appointmentService from "../../../services/appointmentService";
import feedbackService from "../../../services/feedbackService";

function AppointmentsTab({ navigate }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "completed"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add feedback states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Add these new state variables after your existing state declarations
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // New state variables for viewing feedback
  const [appointmentsWithFeedback, setAppointmentsWithFeedback] = useState({});
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [showViewFeedbackModal, setShowViewFeedbackModal] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Helper function to convert slot number to time string
  const getTimeBySlot = (slot) => {
    const slotMap = {
      0: "08:00",
      1: "10:00",
      2: "13:00",
      3: "15:00",
    };
    return slotMap[slot] || "Unknown";
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

  // Extract fetchData function outside of useEffect to make it reusable
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

      // Debug: Log all appointments to see the data structure
      console.log("All appointments in database:", allAppointments);
      console.log("Current user ID:", currentUserId);

      const userAppointments = allAppointments.filter(
        (appointment) => appointment.customerId === currentUserId
      );

      console.log("User appointments after filtering:", userAppointments);

      // Instead of fetching meeting info for all appointments, just set the basic appointment data
      setAppointments(
        userAppointments.map((appointment) => ({
          ...appointment,
          meetingInfo: null,
          hasMeetingRoom: false,
          isExpired: false,
          meetingMessage: null,
        }))
      );

      setError(null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Use the extracted fetchData in useEffect for initial load
  useEffect(() => {
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

  // Add feedback handlers after the existing helper functions
  const handleOpenFeedbackModal = (appointment) => {
    console.log("Opening feedback modal for appointment:", appointment); // Debug log
    setSelectedAppointment(appointment);
    setRating(5);
    setComment("");
    setFeedbackError(null);
    setFeedbackSuccess(false);
    setShowFeedbackModal(true);
    console.log("showFeedbackModal state set to:", true); // Debug log
  };

  // Update the handleSubmitFeedback function to use the extracted fetchData
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    if (!selectedAppointment) return;

    try {
      setFeedbackSubmitting(true);
      setFeedbackError(null);

      const feedbackData = {
        consultantId: selectedAppointment.consultantId,
        appointmentId: selectedAppointment.id,
        rating: rating,
        comment: comment,
      };

      console.log("Submitting feedback:", feedbackData);
      await feedbackService.create(feedbackData);
      console.log("Feedback submitted successfully");
      setFeedbackSuccess(true);

      // Reload appointment data to reflect the new feedback
      await fetchData(); // Wait for data to reload
      console.log("Appointments reloaded after feedback submission");

      // Close modal after short delay
      setTimeout(() => {
        setShowFeedbackModal(false);
        setSelectedAppointment(null);
        setRating(5);
        setComment("");
        setFeedbackSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFeedbackError("Không thể gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Add this new function before the return statement
  const handleCancelAppointment = async (e) => {
    e.preventDefault();

    if (!appointmentToCancel) return;

    try {
      setIsCancelling(true);
      setCancelError(null);

      // Call the cancel API with the appointment ID
      await appointmentService.cancel(appointmentToCancel.id);

      // Show success message
      setCancelSuccess(true);

      // Reload all appointment data
      await fetchData();

      // Close modal after short delay
      setTimeout(() => {
        setShowCancelModal(false);
        setAppointmentToCancel(null);
        setCancelReason("");
        setCancelSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setCancelError("Không thể hủy lịch hẹn. Vui lòng thử lại sau.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Add this function to open the cancel modal
  const handleOpenCancelModal = (appointment) => {
    setAppointmentToCancel(appointment);
    setCancelReason("");
    setCancelError(null);
    setCancelSuccess(false);
    setShowCancelModal(true);
  };

  // New function to view feedback
  const handleViewFeedback = async (appointmentId) => {
    try {
      setLoadingFeedback(true);
      const existingFeedback = appointmentsWithFeedback[appointmentId];
      setViewingFeedback(existingFeedback);
      setShowViewFeedbackModal(true);
    } catch (error) {
      console.error("Error loading feedback details:", error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  // Close the feedback view modal
  const handleCloseFeedbackModal = () => {
    setShowViewFeedbackModal(false);
    setViewingFeedback(null);
  };

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
                    Giờ vào
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Giờ ra
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAppointments.map((appointment) => {
                  const statusInfo = getStatusInfo(appointment.status);
                  const isCompleted =
                    appointment.status === 1 || appointment.status === "1";

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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.checkInTimeUtc || appointment.checkInTime
                          ? new Date(
                              appointment.checkInTimeUtc ||
                                appointment.checkInTime
                            ).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              timeZone: "Asia/Ho_Chi_Minh",
                            })
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.checkOutTimeUtc || appointment.checkOutTime
                          ? new Date(
                              appointment.checkOutTimeUtc ||
                                appointment.checkOutTime
                            ).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              timeZone: "Asia/Ho_Chi_Minh",
                            })
                          : "-"}
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {(() => {
                          const isCompleted =
                            appointment.status === 1 ||
                            appointment.status === "1";
                          const isScheduled =
                            appointment.status === 0 ||
                            appointment.status === "0";
                          const hasFeedback =
                            appointmentsWithFeedback[appointment.id];

                          return (
                            <>
                              {isCompleted &&
                                (hasFeedback ? (
                                  <button
                                    onClick={() =>
                                      handleViewFeedback(appointment.id)
                                    }
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                  >
                                    <Star className="w-3 h-3 mr-1 fill-indigo-500" />
                                    Xem đánh giá
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleOpenFeedbackModal(appointment)
                                    }
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                                  >
                                    <Star className="w-3 h-3 mr-1" />
                                    Đánh giá
                                  </button>
                                ))}

                              {isScheduled &&
                                (appointment.isExpired ? (
                                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-3 h-3 mr-1"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    {appointment.meetingMessage ||
                                      "Cuộc hẹn đã kết thúc"}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/meeting/${appointment.id}?start=true`
                                      )
                                    }
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 mr-2"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-3 h-3 mr-1"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                      <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                                    </svg>
                                    Bắt đầu
                                  </button>
                                ))}

                              {isScheduled && (
                                <button
                                  onClick={() =>
                                    handleOpenCancelModal(appointment)
                                  }
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3 h-3 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Hủy lịch
                                </button>
                              )}
                            </>
                          );
                        })()}
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

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div
          className="fixed inset-0 overflow-y-auto z-50"
          style={{ zIndex: 9999 }}
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay - only blurs content behind the modal, not the modal itself */}
            <div
              className="fixed inset-0 bg-white/1 bg-opacity-50 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              onClick={() => setShowFeedbackModal(false)}
            ></div>

            {/* Modal positioning */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal content - positioned above the blurred background */}
            <div className="relative inline-block align-bottom bg-white rounded-lg border-2 border-gray-300 text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal header */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-3 mb-4">
                      Đánh giá tư vấn viên
                    </h3>

                    {feedbackSuccess ? (
                      <div className="rounded-md bg-green-50 p-4 mb-4 flex items-center justify-center">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <CheckCircle
                              className="h-6 w-6 text-green-400"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-base font-medium text-green-800">
                              Cảm ơn bạn đã đánh giá!
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleSubmitFeedback}
                        className="space-y-5"
                      >
                        {/* Rating selection */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Đánh giá của bạn
                          </label>
                          <div className="flex items-center justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-all duration-150 hover:scale-110"
                              >
                                <Star
                                  className={`h-8 w-8 ${
                                    star <= rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          <p className="mt-1 text-center text-sm text-gray-500">
                            {rating === 1 && "Không hài lòng"}
                            {rating === 2 && "Tạm được"}
                            {rating === 3 && "Bình thường"}
                            {rating === 4 && "Hài lòng"}
                            {rating === 5 && "Rất hài lòng"}
                          </p>
                        </div>

                        {/* Comment */}
                        <div className="mb-4">
                          <label
                            htmlFor="comment"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Nhận xét của bạn
                          </label>
                          <textarea
                            id="comment"
                            name="comment"
                            rows={4}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2 resize-none"
                            placeholder="Chia sẻ trải nghiệm của bạn với tư vấn viên"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Nhận xét của bạn sẽ giúp chúng tôi cải thiện dịch vụ
                          </p>
                        </div>

                        {/* Error message */}
                        {feedbackError && (
                          <div className="rounded-md bg-red-50 p-3 mb-2 border border-red-200">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg
                                  className="h-5 w-5 text-red-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">
                                  {feedbackError}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Form buttons */}
                        <div className="mt-6 sm:mt-5 sm:flex sm:flex-row-reverse gap-3 pt-3 border-t border-gray-200">
                          <button
                            type="submit"
                            disabled={feedbackSubmitting}
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 sm:ml-3 sm:w-auto sm:text-sm ${
                              feedbackSubmitting
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {feedbackSubmitting ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Đang gửi...
                              </>
                            ) : (
                              "Gửi đánh giá"
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowFeedbackModal(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Hủy bỏ
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && (
        <div
          className="fixed inset-0 overflow-y-auto z-50"
          style={{ zIndex: 9999 }}
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay - only blurs content behind the modal, not the modal itself */}
            <div
              className="fixed inset-0 bg-white/1 bg-opacity-50 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              onClick={() => setShowCancelModal(false)}
            ></div>

            {/* Modal positioning */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal content - positioned above the blurred background */}
            <div className="relative inline-block align-bottom bg-white rounded-lg border-2 border-gray-300 text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal header */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-3 mb-4">
                      Hủy lịch hẹn
                    </h3>

                    <p className="text-sm text-gray-500 mb-4">
                      Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động
                      này không thể hoàn tác.
                    </p>

                    {/* Error message */}
                    {cancelError && (
                      <div className="rounded-md bg-red-50 p-3 mb-2 border border-red-200">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-red-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">
                              {cancelError}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Success message (temporary) */}
                    {cancelSuccess && (
                      <div className="rounded-md bg-green-50 p-4 mb-4 flex items-center justify-center">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <CheckCircle
                              className="h-6 w-6 text-green-400"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-base font-medium text-green-800">
                              Đã hủy lịch hẹn thành công!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Modal footer with action buttons */}
                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                      <button
                        type="button"
                        onClick={handleCancelAppointment}
                        disabled={isCancelling}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 sm:ml-3 sm:w-auto sm:text-sm ${
                          isCancelling ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isCancelling ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Đang hủy...
                          </>
                        ) : (
                          "Xác nhận hủy"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCancelModal(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Hủy bỏ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Feedback Modal */}
      {showViewFeedbackModal && viewingFeedback && (
        <div
          className="fixed inset-0 overflow-y-auto z-50"
          style={{ zIndex: 9999 }}
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-white/1 bg-opacity-50 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              onClick={() => setShowViewFeedbackModal(false)}
            ></div>

            {/* Modal positioning */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal content */}
            <div className="relative inline-block align-bottom bg-white rounded-lg border-2 border-gray-300 text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal header */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-3 mb-4">
                      Đánh giá của bạn
                    </h3>

                    <div className="space-y-4">
                      {/* Rating display */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Điểm đánh giá
                        </label>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= viewingFeedback.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {viewingFeedback.rating}/5
                          </span>
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nhận xét của bạn
                        </label>
                        <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-800">
                          {viewingFeedback.comment || "Không có nhận xét"}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày đánh giá
                        </label>
                        <div className="text-sm text-gray-600">
                          {new Date(
                            viewingFeedback.createdAt
                          ).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      {/* Close button */}
                      <div className="mt-6 sm:mt-5 pt-3 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => setShowViewFeedbackModal(false)}
                          className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 sm:w-auto sm:text-sm"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

AppointmentsTab.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default AppointmentsTab;
