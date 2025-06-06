import React, { useState } from "react";
import PropTypes from "prop-types";

function TestProcessingTab({ role }) {
  // Use role for role-specific functionality if needed
  console.log(`TestProcessingTab rendered with role: ${role}`);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample STI test data - in a real app, you would fetch this from an API
  const stiTests = [
    {
      id: 1,
      patientName: "Nguyễn Văn A",
      testDate: "2023-08-15",
      testType: "STI - Gói cơ bản",
      status: "pending",
      sampleId: "STI-20230815-001",
      priority: "normal",
      results: null,
    },
    {
      id: 2,
      patientName: "Trần Thị B",
      testDate: "2023-08-14",
      testType: "STI - Gói nâng cao",
      status: "processing",
      sampleId: "STI-20230814-003",
      priority: "urgent",
      results: null,
    },
    {
      id: 3,
      patientName: "Lê Văn C",
      testDate: "2023-08-13",
      testType: "HIV, HPV, Giang mai",
      status: "completed",
      sampleId: "STI-20230813-007",
      priority: "normal",
      results: {
        hiv: "Âm tính",
        hpv: "Âm tính",
        syphilis: "Âm tính",
      },
    },
    {
      id: 4,
      patientName: "Phạm Thị D",
      testDate: "2023-08-12",
      testType: "STI - Gói toàn diện",
      status: "completed",
      sampleId: "STI-20230812-009",
      priority: "normal",
      results: {
        hiv: "Âm tính",
        hpv: "Dương tính (Type 16)",
        syphilis: "Âm tính",
        chlamydia: "Âm tính",
        gonorrhea: "Dương tính",
      },
    },
  ];

  const filteredTests =
    filter === "all"
      ? stiTests
      : stiTests.filter((test) => test.status === filter);

  const searchFilteredTests = filteredTests.filter(
    (test) =>
      test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.sampleId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
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
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "urgent":
        return "Khẩn cấp";
      case "high":
        return "Ưu tiên cao";
      case "normal":
        return "Bình thường";
      default:
        return priority;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quản lý xét nghiệm STI
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã mẫu..."
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
                filter === "pending"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("pending")}
            >
              Chờ xử lý
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                filter === "processing"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("processing")}
            >
              Đang xử lý
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
          </div>
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
                Thông tin bệnh nhân
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mã mẫu
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
            {searchFilteredTests.map((test) => (
              <tr key={test.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 text-lg font-medium">
                        {test.patientName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {test.patientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(test.testDate).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{test.sampleId}</div>
                  <div className="text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(
                        test.priority
                      )}`}
                    >
                      {getPriorityText(test.priority)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {test.testType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                      test.status
                    )}`}
                  >
                    {getStatusText(test.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    Chi tiết
                  </button>

                  {test.status === "pending" && (
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Bắt đầu xử lý
                    </button>
                  )}

                  {test.status === "processing" && (
                    <button className="text-green-600 hover:text-green-900 mr-3">
                      Nhập kết quả
                    </button>
                  )}

                  {test.status === "completed" && (
                    <button className="text-purple-600 hover:text-purple-900">
                      Xem kết quả
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

TestProcessingTab.propTypes = {
  role: PropTypes.string.isRequired,
};

export default TestProcessingTab;
