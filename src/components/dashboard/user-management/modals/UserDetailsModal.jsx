import React from "react";
import {
  Eye,
  X,
  Edit,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Users,
} from "lucide-react";

const UserDetailsModal = ({
  isOpen,
  onClose,
  user,
  onEdit,
  onToggleStatus,
  getRoleBadgeClass,
  getRoleText,
  formatDate,
}) => {
  if (!isOpen || !user) return null;

  const isActive =
    user.isActive !== undefined ? user.isActive : user.status === "active";

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-t-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Chi tiết người dùng</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                      src={user.avatar}
                      alt={user.name}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="h-24 w-24 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg"
                      style={{ display: "none" }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {user.name}
                </h4>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${getRoleBadgeClass(
                    user.role
                  )}`}
                >
                  {getRoleText(user.role)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Số điện thoại
                    </p>
                    <p className="text-sm text-gray-600">
                      {user.phoneNumber || user.phone || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                {user.address && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Địa chỉ
                      </p>
                      <p className="text-sm text-gray-600">{user.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">
                    Thông tin hệ thống
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isActive ? "Hoạt động" : "Ngừng hoạt động"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ngày tạo:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Hoạt động gần nhất:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(user.lastActive)}
                      </span>
                    </div>
                  </div>
                </div>

                {user.specialty && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">
                      Chuyên môn
                    </h5>
                    <p className="text-sm text-gray-600">{user.specialty}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onClose();
                  onEdit(user);
                }}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all"
              >
                <Edit className="h-4 w-4" />
                <span>Chỉnh sửa</span>
              </button>

              <button
                onClick={() => onToggleStatus(user)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? "text-red-700 bg-red-100 hover:bg-red-200"
                    : "text-green-700 bg-green-100 hover:bg-green-200"
                }`}
              >
                {isActive ? (
                  <>
                    <XCircle className="h-4 w-4" />
                    <span>Vô hiệu hóa</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Kích hoạt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
