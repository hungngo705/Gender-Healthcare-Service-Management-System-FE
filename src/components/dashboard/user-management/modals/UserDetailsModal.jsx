import React, { useEffect, useState } from "react";
import {
  Eye,
  X,
  Edit,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Users,
  Shield,
  UserCheck,
} from "lucide-react";

const UserDetailsModal = ({
  isOpen,
  onClose,
  user,
  onEdit,
  onToggleStatus,
  getRoleBadgeClass,
  getRoleText,
}) => {
  // Add state to force modal to open
  const [localIsOpen, setLocalIsOpen] = useState(false);
  useEffect(() => {
    // If isOpen prop changes to true, also set our local state to true
    if (isOpen && !localIsOpen) {
      setLocalIsOpen(true);
    } else if (!isOpen && localIsOpen) {
      setLocalIsOpen(false);
    }
  }, [isOpen, user, localIsOpen]); // Only return null if both external and local state indicate closed
  // We're using our local state as a backup in case the isOpen prop is inconsistent
  if (!isOpen && !localIsOpen) {
    return null;
  }

  // Force the modal to open if our local state says it should be open
  // This helps with race conditions or prop update issues
  const shouldShow = isOpen || localIsOpen;
  // If the modal should be open but there's no user data yet, show a loading state
  if (shouldShow && !user) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin người dùng...</p>
          </div>
        </div>
      </div>
    );
  }
  // If we should not show the modal at all, return null
  if (!shouldShow) {
    return null;
  }

  const isActive =
    user.isActive !== undefined ? user.isActive : user.status === "active";
  // Create a custom handleClose that manages both local and parent state
  const handleClose = () => {
    setLocalIsOpen(false); // Update local state
    if (onClose) onClose(); // Call parent callback if provided
  };
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 transform transition-all animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserCheck className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Chi tiết người dùng</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 rounded-full p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* User Info Card */}
          <div className="bg-gradient-to-b from-indigo-50 to-white rounded-xl shadow-sm border border-indigo-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
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
                    className="h-24 w-24 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg"
                    style={{ display: "none" }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {getRoleText(user.role)}
                    </span>
                  </div>
                </div>
              </div>
              {/* Basic Info */}
              <div className="flex-grow text-center md:text-left">
                <h4 className="text-xl font-bold text-gray-900">{user.name}</h4>{" "}
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-center md:justify-start text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>
                      {user.phoneNumber || user.phone || "Chưa cập nhật"}
                    </span>
                  </div>
                  {user.address && (
                    <div className="flex items-center justify-center md:justify-start text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{user.address}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Status Badge */}
              <div className="flex-shrink-0 flex flex-col items-center md:items-end">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span className="flex items-center">
                    {isActive ? (
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1.5" />
                    )}
                    {isActive ? "Hoạt động" : "Ngừng hoạt động"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Specialty Section */}
          {user.specialty && (
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-6 mb-6 border border-indigo-100">
              <h5 className="flex items-center text-sm font-semibold text-indigo-800 mb-2">
                <Shield className="h-4 w-4 mr-2" />
                Chuyên môn
              </h5>
              <p className="text-sm text-gray-800">{user.specialty}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={() => {
                onClose();
                onEdit(user);
              }}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit className="h-4 w-4" />
              <span>Chỉnh sửa thông tin</span>
            </button>

            <button
              onClick={() => onToggleStatus(user)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? "text-red-700 bg-red-50 border border-red-200 hover:bg-red-100"
                  : "text-green-700 bg-green-50 border border-green-200 hover:bg-green-100"
              }`}
            >
              {isActive ? (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Vô hiệu hóa tài khoản</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Kích hoạt tài khoản</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
