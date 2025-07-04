import React from "react";
import { Users, Shield } from "lucide-react";

const UserStatsCards = ({ filteredUsers, currentPage, totalPages }) => {
  // Đơn giản hóa hàm getUserStats, chỉ giữ lại tổng số
  const getTotalUsers = (users) => {
    return {
      total: users.length,
    };
  };

  const { total } = getTotalUsers(filteredUsers);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">
              Tổng số người dùng
            </p>
            <p className="text-lg font-semibold text-gray-900">{total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Shield className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Trang hiện tại</p>
            <p className="text-lg font-semibold text-gray-900">
              {currentPage}/{totalPages}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsCards;
