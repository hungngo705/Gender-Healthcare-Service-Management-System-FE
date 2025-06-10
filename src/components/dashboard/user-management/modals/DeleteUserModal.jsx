import React from "react";
import { AlertTriangle, X, Loader } from "lucide-react";

const DeleteUserModal = ({ isOpen, onClose, onConfirm, user, submitting }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-t-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Xác nhận xóa người dùng</h3>
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
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-shrink-0 h-16 w-16">
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={user.avatar}
                alt={user.name}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                className="h-16 w-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ display: "none" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">Vai trò: {user.role}</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Tất
              cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh viễn.
            </p>
          </div>

          <p className="text-gray-700 mb-6">
            Bạn có chắc chắn muốn xóa người dùng <strong>{user.name}</strong>{" "}
            không?
          </p>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {submitting && <Loader className="h-4 w-4 animate-spin" />}
              <span>{submitting ? "Đang xóa..." : "Xóa người dùng"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
