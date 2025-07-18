import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Calendar,
  CheckCircle,
  Trash2,
  Clock,
  X,
  CalendarClock,
  AlertCircle,
} from "lucide-react";
import appointmentService from "../../../services/appointmentService";
import userService from "../../../services/userService";

function ConsultantScheduleTab({ role }) {
  // State for consultant ID
  const [consultantId, setConsultantId] = useState("");

  // State for schedule management
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(0);

  // State for UI
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // State for active tab
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "past"

  // Get current user profile
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userService.getCurrentUserProfile();
        setConsultantId(response.id || response.data?.id);
      } catch (err) {
        console.error("Error fetching current user profile:", err);
        setError("Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.");
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch consultant schedules when component loads or after a new schedule is created
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!consultantId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Change the API call to use getConsultantScheduleById
        const response = await appointmentService.getConsultantScheduleById(
          consultantId
        );

        const scheduleData = response?.data?.data || [];

        setSchedules(scheduleData);
      } catch (err) {
        console.error("Error fetching consultant schedules:", err);
        setError("Không thể tải lịch nghỉ. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [consultantId, success]);

  // Slot options mapping
  const slotOptions = {
    0: "08:00 - 10:00",
    1: "10:00 - 12:00",
    2: "13:00 - 15:00",
    3: "15:00 - 17:00",
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Handle form submission - modified to always set isAvailable to false
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setError("Vui lòng chọn ngày.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create schedule data - always set isAvailable to false
      const scheduleData = {
        consultantId: consultantId,
        workDate: selectedDate,
        slot: parseInt(selectedSlot),
        isAvailable: false, // Always set to false - consultant is registering time off
      };

      console.log("Submitting schedule data:", scheduleData);

      // Call API to create consultant schedule
      await appointmentService.createConsultantSchedule(scheduleData);

      // Show success message and reset form
      setSuccess(
        `Đã đăng ký nghỉ cho ngày ${formatDate(selectedDate)}, ${
          slotOptions[selectedSlot]
        } thành công!`
      );
      setShowSuccessNotification(true);
      setSelectedDate("");
      setSelectedSlot(0);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
    } catch (err) {
      console.error("Error creating consultant schedule:", err);
      setError("Không thể đăng ký nghỉ. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to filter schedules based on active tab
  const getFilteredSchedules = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === "upcoming") {
      return schedules.filter((schedule) => {
        const scheduleDate = new Date(schedule.workDate);
        return scheduleDate >= today;
      });
    } else {
      return schedules.filter((schedule) => {
        const scheduleDate = new Date(schedule.workDate);
        return scheduleDate < today;
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Success notification */}
      {showSuccessNotification && success && (
        <div className="fixed top-4 right-4 z-50 max-w-md w-full bg-white shadow-lg rounded-lg border-l-4 border-green-500 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">
                  Cập nhật thành công
                </p>
                <p className="mt-1 text-sm text-gray-500">{success}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => setShowSuccessNotification(false)}
                  className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quản lý lịch nghỉ
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <CalendarClock className="h-5 w-5 mr-2 text-indigo-500" />
            Đăng ký ngày nghỉ
          </h3>

          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md border border-red-200 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="selectedDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Chọn ngày nghỉ
              </label>
              <input
                type="date"
                id="selectedDate"
                name="selectedDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div>
              <label
                htmlFor="selectedSlot"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Khung giờ nghỉ
              </label>
              <select
                id="selectedSlot"
                name="selectedSlot"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2"
              >
                {Object.entries(slotOptions).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                {isSubmitting ? (
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
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng ký nghỉ"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Schedules List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
              Lịch nghỉ đã đăng ký
            </h3>

            <div className="mt-3 sm:mt-0 flex space-x-2">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  activeTab === "upcoming"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Sắp tới
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  activeTab === "past"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Đã qua
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mx-auto mb-3"></div>
              <p className="text-gray-500">Đang tải lịch nghỉ...</p>
            </div>
          )}

          {!isLoading && schedules.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Bạn chưa đăng ký ngày nghỉ nào.</p>
            </div>
          )}

          {!isLoading &&
            schedules.length > 0 &&
            getFilteredSchedules().length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  {activeTab === "upcoming"
                    ? "Bạn không có ngày nghỉ nào sắp tới."
                    : "Bạn không có ngày nghỉ nào trong quá khứ."}
                </p>
              </div>
            )}

          {!isLoading && getFilteredSchedules().length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ngày
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Khung giờ
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
                  {getFilteredSchedules().map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(schedule.workDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {slotOptions[schedule.slot]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Only show delete button for upcoming days off */}
                        {activeTab === "upcoming" && (
                          <button
                            className="text-red-600 hover:text-red-900 focus:outline-none"
                            onClick={() => {
                              // Could implement delete functionality here
                              alert("Chức năng xóa đang được phát triển");
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ConsultantScheduleTab.propTypes = {
  role: PropTypes.string.isRequired,
};

export default ConsultantScheduleTab;
