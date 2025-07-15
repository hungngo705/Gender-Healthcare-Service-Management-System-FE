import React from "react";
import { MoreVertical, Edit, Trash2, Eye, Mail, Phone, XCircle, CheckCircle } from "lucide-react";

const UserTable = ({
  paginatedUsers,
  showActionMenu,
  setShowActionMenu,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onToggleUserStatus,
  getRoleBadgeClass,
  getRoleText,
  getStatusClass,
  getStatusText,
  getUserDisplayInfo,
  formatDate,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Người dùng
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Vai trò
            </th>
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
              Hoạt động
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
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={user.avatarUrl}
                      alt={user.name}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ display: "none" }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {getUserDisplayInfo(user).phone}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                    user.role
                  )}`}
                >
                  {getRoleText(user.role)}
                </span>
                {user.specialty && (
                  <div className="text-xs text-gray-500 mt-1">
                    Chuyên môn: {user.specialty}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                    user
                  )}`}
                >
                  {getStatusText(user)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>Hoạt động gần nhất: {formatDate(user.lastActive)}</div>
                <div>Ngày tạo: {formatDate(user.createdAt)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative" data-action-menu="true">
                  <button
                    type="button"
                    onClick={() => {
                      setShowActionMenu(
                        showActionMenu === user.id ? null : user.id
                      );
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {showActionMenu === user.id && (
                    <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu">
                        <button
                          type="button"
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            onViewUser(user);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-3" />
                          Xem chi tiết
                        </button>
                        <button
                          type="button"
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            onEditUser(user);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-3" />
                          Chỉnh sửa
                        </button>
                        {/* Toggle status button */}
                        {(() => {
                          const isActive =
                            user.isActive !== undefined
                              ? user.isActive
                              : user.status === "active";
                          return isActive ? (
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                              onClick={() => onToggleUserStatus(user)}
                            >
                              <XCircle className="h-4 w-4 mr-3" />
                              Vô hiệu hóa
                            </button>
                          ) : (
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                              onClick={() => onToggleUserStatus(user)}
                            >
                              <CheckCircle className="h-4 w-4 mr-3" />
                              Kích hoạt
                            </button>
                          );
                        })()}
                        <hr className="my-1" />
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                          onClick={() => onDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          Xóa người dùng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
