import React from "react";
import { Search, Users, Shield, CheckCircle, XCircle } from "lucide-react";

const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
}) => {
  const filterButtons = [
    { key: "all", label: "Tất cả", icon: Users },
    { key: "admin", label: "Quản trị viên", icon: Shield },
    { key: "manager", label: "Quản lý", icon: Users },
    { key: "consultant", label: "Tư vấn viên", icon: Users },
    { key: "staff", label: "Nhân viên", icon: Users },
    { key: "customer", label: "Khách hàng", icon: Users },
    { key: "active", label: "Hoạt động", icon: CheckCircle },
    { key: "inactive", label: "Ngừng hoạt động", icon: XCircle },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        {filterButtons.map(({ key, label, icon }) => {
          const IconComponent = icon;
          return (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === key
                  ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-200"
                  : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchAndFilters;
