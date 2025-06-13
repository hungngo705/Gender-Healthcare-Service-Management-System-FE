import React from "react";
import { Users, CheckCircle, XCircle, Shield } from "lucide-react";

const UserStatsCards = ({ filteredUsers, currentPage, totalPages }) => {
  const activeUsers = filteredUsers.filter((user) =>
    user.isActive !== undefined ? user.isActive : user.status === "active"
  );

  const inactiveUsers = filteredUsers.filter((user) =>
    user.isActive !== undefined ? !user.isActive : user.status !== "active"
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Tổng số</p>
            <p className="text-lg font-semibold text-gray-900">
              {filteredUsers.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Hoạt động</p>
            <p className="text-lg font-semibold text-gray-900">
              {activeUsers.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <XCircle className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Tạm dừng</p>
            <p className="text-lg font-semibold text-gray-900">
              {inactiveUsers.length}
            </p>
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
