import React, { useState } from "react";
import PropTypes from "prop-types";

function AppointmentsTab({ role }) {
  // Use role for role-specific functionality
  console.log(`AppointmentsTab rendered with role: ${role}`);
  const [filter, setFilter] = useState("all");

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
      consultant: "TS. Trần Minh Khoa",
    },
    {
      id: 2,
      customerName: "Trần Văn Bình",
      date: "2023-08-15",
      time: "10:30",
      type: "Siêu âm",
      status: "completed",
      phone: "0912345678",
      consultant: "BS. Lê Thu Hà",
    },
    {
      id: 3,
      customerName: "Lê Thị Minh",
      date: "2023-08-15",
      time: "14:00",
      type: "Khám định kỳ",
      status: "cancelled",
      phone: "0923456789",
      consultant: "BS. Nguyễn Quang Anh",
    },
    {
      id: 4,
      customerName: "Phạm Văn An",
      date: "2023-08-16",
      time: "08:30",
      type: "Xét nghiệm STI",
      status: "scheduled",
      phone: "0934567890",
      consultant: "TS. Ngô Thị Lan",
    },
  ];

  // Filter appointments based on status
  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((appointment) => appointment.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Quản lý lịch hẹn
        </h2>

        <div className="flex">
          <div className="mr-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm">
            Tạo lịch hẹn mới
          </button>
        </div>
      </div>

      <div className="bg-white overflow-hidden rounded-lg shadow">
        <div className="overflow-x-auto">
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
                  Thời gian
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Loại dịch vụ
                </th>
                {role === "admin" || role === "manager" ? (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Chuyên gia
                  </th>
                ) : null}
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
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
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
                  </td>
                  {role === "admin" || role === "manager" ? (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.consultant}
                      </div>
                    </td>
                  ) : null}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status === "scheduled"
                        ? "Đã lên lịch"
                        : appointment.status === "completed"
                        ? "Hoàn thành"
                        : "Đã hủy"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Chi tiết
                    </button>
                    {appointment.status === "scheduled" && (
                      <button className="text-red-600 hover:text-red-900">
                        Hủy
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

AppointmentsTab.propTypes = {
  role: PropTypes.string.isRequired,
};

export default AppointmentsTab;
