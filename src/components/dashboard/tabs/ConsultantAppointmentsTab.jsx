import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { appoinments } from "../../../data/consultants";
import authService from "../../../services/authService";

function ConsultantAppointmentsTab({ role }) {
  const [filter, setFilter] = useState("all");
  const [consultantAppointments, setConsultantAppointments] = useState([]);
  const [userId, setUserId] = useState(null);

  // Get user ID from JWT token
  useEffect(() => {
    // Get decoded token
    const decodedToken = authService.getDecodedToken();
    console.log("Decoded token:", decodedToken);

    // Extract user ID from token claims
    // JWT tokens can have different claim names for the user ID
    let extractedUserId = null;

    if (decodedToken) {
      // Check common claim names for user ID
      extractedUserId =
        decodedToken.sub ||
        decodedToken.userId ||
        decodedToken.id ||
        decodedToken.nameid ||
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        null;
    }

    console.log("Extracted userId from JWT:", extractedUserId);
    setUserId(extractedUserId);
  }, []);

  // Map status numbers to strings
  const statusMap = {
    0: "scheduled",
    1: "completed",
    2: "cancelled",
  };

  // Process and filter appointments when component mounts or userId changes
  useEffect(() => {
    if (!userId) return;

    // Filter appointments for this consultant
    const filteredAppointments = appoinments.filter(
      (appointment) => appointment.consultantId === userId
    );

    console.log("UserID:", userId);
    console.log("Filtered appointments:", filteredAppointments);

    // Transform to expected format
    const formattedAppointments = filteredAppointments.map((appointment) => ({
      id: appointment.id,
      customerName: appointment.customer?.name || "Unknown",
      date: appointment.appointmentDate,
      time: getTimeBySlot(appointment.slot),
      type: getServiceType(appointment.serviceId),
      status: statusMap[appointment.status] || "unknown",
      phone: appointment.customer?.phoneNumber || "No phone",
      symptoms: appointment.notes || "No symptoms recorded",
      testResults:
        appointment.serviceId?.includes("sti") && appointment.status !== 1
          ? "Đang chờ kết quả"
          : null,
    }));

    setConsultantAppointments(formattedAppointments);
  }, [userId]);

  // Helper function to get time based on slot number
  const getTimeBySlot = (slot) => {
    const slotTimes = {
      0: "08:00",
      1: "10:00",
      2: "13:00",
      3: "15:00",
      4: "17:00",
    };
    return slotTimes[slot] || "Unknown";
  };

  // Helper function to get service type based on serviceId
  const getServiceType = (serviceId) => {
    // Placeholder - in a real app you'd have a mapping of service IDs to names
    if (serviceId?.includes("sti")) return "Xét nghiệm STI";
    if (serviceId?.includes("ultrasound")) return "Siêu âm";
    if (serviceId?.includes("checkup")) return "Khám định kỳ";
    return "Tư vấn";
  };

  const filteredAppointments =
    filter === "all"
      ? consultantAppointments
      : consultantAppointments.filter((app) => app.status === filter);

  const getStatusClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return "Đã hẹn";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Lịch hẹn của bạn
        </h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              filter === "all"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              filter === "scheduled"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setFilter("scheduled")}
          >
            Đã hẹn
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              filter === "completed"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setFilter("completed")}
          >
            Hoàn thành
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              filter === "cancelled"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setFilter("cancelled")}
          >
            Đã hủy
          </button>
        </div>
      </div>

      {/* Show message if no appointments */}
      {filteredAppointments.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">
            {filter === "all"
              ? "Bạn chưa có lịch hẹn nào."
              : `Không có lịch hẹn nào ở trạng thái "${getStatusText(filter)}".`}
          </p>
        </div>
      )}

      {filteredAppointments.length > 0 && (
        <div className="overflow-hidden bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Khách hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày & Giờ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Loại hẹn
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
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
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 text-lg font-medium">
                          {appointment.customerName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.date}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.type}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {appointment.symptoms}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {getStatusText(appointment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Chi tiết
                    </button>
                    {appointment.status === "scheduled" && (
                      <>
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          Bắt đầu khám
                        </button>
                      </>
                    )}
                    {appointment.type.includes("Xét nghiệm") && (
                      <button className="text-purple-600 hover:text-purple-900">
                        {appointment.testResults
                          ? "Xem kết quả"
                          : "Cập nhật kết quả"}
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
  );
}

// Update PropTypes - userId is no longer required as a prop
ConsultantAppointmentsTab.propTypes = {
  role: PropTypes.string.isRequired,
};

export default ConsultantAppointmentsTab;
