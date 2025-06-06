import React, { useState } from "react";
import PropTypes from "prop-types";

function PatientsTab({ role }) {
  // Use role for role-specific functionality
  console.log(`PatientsTab rendered with role: ${role}`);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample patients data - in a real app, you would fetch this from an API
  const patients = [
    {
      id: 1,
      name: "Nguyễn Thị Hương",
      age: 28,
      gender: "Nữ",
      phone: "0901234567",
      email: "huong.nguyen@example.com",
      lastVisit: "2023-08-10",
      condition: "Khám thai định kỳ",
    },
    {
      id: 2,
      name: "Trần Văn Bình",
      age: 35,
      gender: "Nam",
      phone: "0912345678",
      email: "binh.tran@example.com",
      lastVisit: "2023-08-05",
      condition: "Tư vấn sức khỏe sinh sản",
    },
    {
      id: 3,
      name: "Lê Thị Minh",
      age: 42,
      gender: "Nữ",
      phone: "0923456789",
      email: "minh.le@example.com",
      lastVisit: "2023-07-28",
      condition: "Tiền mãn kinh",
    },
    {
      id: 4,
      name: "Phạm Văn An",
      age: 30,
      gender: "Nam",
      phone: "0934567890",
      email: "an.pham@example.com",
      lastVisit: "2023-07-15",
      condition: "Kiểm tra hormone",
    },
    {
      id: 5,
      name: "Hoàng Thị Lan",
      age: 25,
      gender: "Nữ",
      phone: "0945678901",
      email: "lan.hoang@example.com",
      lastVisit: "2023-08-12",
      condition: "Tư vấn biện pháp tránh thai",
    },
  ];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Danh sách bệnh nhân
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <button className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Thêm bệnh nhân mới
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
                Bệnh nhân
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thông tin liên hệ
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Lần khám gần nhất
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tình trạng
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
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 text-lg font-medium">
                        {patient.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {patient.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.age} tuổi, {patient.gender}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.phone}</div>
                  <div className="text-sm text-gray-500">{patient.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(patient.lastVisit).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.condition}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    Hồ sơ
                  </button>
                  <button className="text-green-600 hover:text-green-900 mr-3">
                    Đặt lịch hẹn
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    Chỉnh sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

PatientsTab.propTypes = {
  role: PropTypes.string.isRequired,
};

export default PatientsTab;
