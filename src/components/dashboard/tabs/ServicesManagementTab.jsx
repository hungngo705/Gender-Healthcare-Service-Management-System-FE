import React, { useState } from "react";
import PropTypes from "prop-types";

function ServicesManagementTab({ role }) {
  // Use role for role-specific functionality if needed
  console.log(`ServicesManagementTab rendered with role: ${role}`);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Sample services data
  const services = [
    {
      id: 1,
      name: "Tư vấn sức khỏe sinh sản",
      category: "Tư vấn",
      price: "300000",
      status: "active",
      duration: 60,
      description: "Tư vấn với chuyên gia về các vấn đề sức khỏe sinh sản",
      availability: "online",
    },
    {
      id: 2,
      name: "Xét nghiệm STI cơ bản",
      category: "Xét nghiệm",
      price: "500000",
      status: "active",
      duration: 30,
      description:
        "Bộ xét nghiệm cơ bản cho các bệnh lây truyền qua đường tình dục phổ biến",
      availability: "offline",
    },
    {
      id: 3,
      name: "Xét nghiệm STI toàn diện",
      category: "Xét nghiệm",
      price: "1200000",
      status: "active",
      duration: 45,
      description:
        "Bộ xét nghiệm đầy đủ cho tất cả các bệnh lây truyền qua đường tình dục",
      availability: "offline",
    },
    {
      id: 4,
      name: "Tư vấn tâm lý về giới tính",
      category: "Tư vấn",
      price: "400000",
      status: "inactive",
      duration: 90,
      description:
        "Tư vấn về các vấn đề liên quan đến bản dạng giới và xu hướng tính dục",
      availability: "both",
    },
    {
      id: 5,
      name: "Tư vấn kế hoạch hóa gia đình",
      category: "Tư vấn",
      price: "250000",
      status: "active",
      duration: 45,
      description:
        "Tư vấn về các phương pháp tránh thai và kế hoạch hóa gia đình",
      availability: "both",
    },
  ];

  // Filter by category or status
  const filteredServices = services.filter((service) => {
    if (filter === "all") return true;
    if (filter === "Xét nghiệm" || filter === "Tư vấn") {
      return service.category === filter;
    }
    return service.status === filter;
  });

  // Filter by search term
  const searchFilteredServices = filteredServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getStatusText = (status) => {
    return status === "active" ? "Hoạt động" : "Ngừng hoạt động";
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case "online":
        return "Trực tuyến";
      case "offline":
        return "Tại cơ sở";
      case "both":
        return "Trực tuyến & Tại cơ sở";
      default:
        return availability;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quản lý dịch vụ
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
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

          <div className="flex space-x-2 mb-4 md:mb-0 md:ml-4">
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
                filter === "Tư vấn"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("Tư vấn")}
            >
              Tư vấn
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                filter === "Xét nghiệm"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("Xét nghiệm")}
            >
              Xét nghiệm
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                filter === "active"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("active")}
            >
              Đang hoạt động
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                filter === "inactive"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("inactive")}
            >
              Ngừng hoạt động
            </button>
          </div>

          <button className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Thêm dịch vụ mới
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
                Tên dịch vụ
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Danh mục
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thông tin
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
            {searchFilteredServices.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {service.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {service.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(service.price)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {service.duration} phút |{" "}
                    {getAvailabilityText(service.availability)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                      service.status
                    )}`}
                  >
                    {getStatusText(service.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    Xem
                  </button>
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Sửa
                  </button>
                  {service.status === "active" ? (
                    <button className="text-red-600 hover:text-red-900">
                      Tạm ngưng
                    </button>
                  ) : (
                    <button className="text-green-600 hover:text-green-900">
                      Kích hoạt
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

ServicesManagementTab.propTypes = {
  role: PropTypes.string.isRequired,
};

export default ServicesManagementTab;
