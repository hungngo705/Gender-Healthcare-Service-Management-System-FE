import React, { useState } from "react";
import PropTypes from "prop-types";

function ConsultantAppointmentsTab({ role }) {
  const [filter, setFilter] = useState("all");

  // Use role for role-specific functionality if needed
  console.log(`ConsultantAppointmentsTab rendered with role: ${role}`);

  // Sample appointments data - in a real app, you would fetch this from an API
  const appointments = [
    {
      id: 1,
      customerName: "Nguyễn Thị Hương",
      date: "2023-08-15",
      time: "09:00",
      type: "Tư vấn",
      status: "scheduled",
      phone: "0901234567",
      symptoms: "Đau bụng dưới, chu kỳ không đều",
      testResults: null,
    },
    {
      id: 2,
      customerName: "Trần Văn Bình",
      date: "2023-08-15",
      time: "10:30",
      type: "Siêu âm",
      status: "completed",
      phone: "0912345678",
      symptoms: "Theo dõi thai kỳ",
      testResults: "Siêu âm thai 12 tuần, phát triển bình thường",
    },
    {
      id: 3,
      customerName: "Lê Thị Minh",
      date: "2023-08-15",
      time: "14:00",
      type: "Khám định kỳ",
      status: "cancelled",
      phone: "0923456789",
      symptoms: "Kiểm tra sức khỏe",
      testResults: null,
    },
    {
      id: 4,
      customerName: "Phạm Văn An",
      date: "2023-08-16",
      time: "08:30",
      type: "Xét nghiệm STI",
      status: "scheduled",
      phone: "0934567890",
      symptoms: "Kiểm tra STI định kỳ",
      testResults: "Đang chờ kết quả",
    },
  ];

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((app) => app.status === filter);

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
                    {new Date(appointment.date).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointment.time}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {appointment.type}
                  </div>
                  <div className="text-sm text-gray-500">
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
    </div>
  );
}

ConsultantAppointmentsTab.propTypes = {
  role: PropTypes.string.isRequired,
};

export default ConsultantAppointmentsTab;
