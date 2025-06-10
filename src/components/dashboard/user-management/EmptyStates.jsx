import React from "react";
import { Loader, Users, UserPlus, AlertTriangle } from "lucide-react";

const EmptyStates = ({
  loading,
  paginatedUsers,
  filteredUsers,
  searchTerm,
  filter,
  onAddUser,
  onReturnToFirstPage,
}) => {
  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Đang tải danh sách người dùng...
        </h3>
        <p className="text-gray-500">
          Vui lòng chờ trong giây lát để tải dữ liệu
        </p>
      </div>
    );
  }

  // No results for current page (but users exist)
  if (paginatedUsers.length === 0 && filteredUsers.length > 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Không có kết quả cho trang hiện tại
        </h3>
        <p className="text-gray-500 mb-6">
          Có {filteredUsers.length} người dùng phù hợp nhưng không có ai ở trang
          này.
        </p>
        <button
          onClick={onReturnToFirstPage}
          className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <span>Về trang đầu</span>
        </button>
      </div>
    );
  }

  // Complete empty state (no users at all)
  if (paginatedUsers.length === 0 && filteredUsers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
          <Users className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {searchTerm || filter !== "all"
            ? "Không tìm thấy người dùng"
            : "Chưa có người dùng"}
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          {searchTerm || filter !== "all" ? (
            <>
              Không có người dùng nào phù hợp với tiêu chí tìm kiếm "
              {searchTerm}"{filter !== "all" && ` và bộ lọc "${filter}"`}. Hãy
              thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
            </>
          ) : (
            "Hệ thống chưa có người dùng nào. Hãy thêm người dùng đầu tiên để bắt đầu quản lý."
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {searchTerm || filter !== "all" ? (
            <>
              <button
                onClick={() => {
                  // Clear search and filter
                  window.location.reload(); // Simple way to reset all filters
                }}
                className="inline-flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span>Xóa bộ lọc</span>
              </button>
              <button
                onClick={onAddUser}
                className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Thêm người dùng</span>
              </button>
            </>
          ) : (
            <button
              onClick={onAddUser}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <UserPlus className="h-5 w-5" />
              <span>Thêm người dùng đầu tiên</span>
            </button>
          )}
        </div>

        {/* Additional help text */}
        {!searchTerm && filter === "all" && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>Mẹo:</strong> Sau khi thêm người dùng, bạn có thể sử
              dụng các bộ lọc và tìm kiếm để quản lý danh sách một cách hiệu
              quả.
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default EmptyStates;
