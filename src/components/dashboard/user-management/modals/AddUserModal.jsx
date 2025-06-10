import React from "react";
import { UserPlus, X, Loader } from "lucide-react";

const AddUserModal = ({
  isOpen,
  onClose,
  onSubmit,
  userForm,
  formErrors,
  submitting,
  onFormChange,
}) => {
  if (!isOpen) return null;

  const handleFormChange = (field, value) => {
    onFormChange(field, value);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserPlus className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Thêm người dùng mới</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="add-user-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Họ và tên *
            </label>
            <input
              id="add-user-name"
              type="text"
              required
              value={userForm.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập họ và tên"
              disabled={submitting}
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="add-user-email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email *
            </label>
            <input
              id="add-user-email"
              type="email"
              required
              value={userForm.email}
              onChange={(e) => handleFormChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập địa chỉ email"
              disabled={submitting}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="add-user-phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Số điện thoại
            </label>
            <input
              id="add-user-phone"
              type="tel"
              value={userForm.phoneNumber}
              onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập số điện thoại"
              disabled={submitting}
            />
            {formErrors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.phoneNumber}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="add-user-address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Địa chỉ
            </label>
            <textarea
              id="add-user-address"
              value={userForm.address}
              onChange={(e) => handleFormChange("address", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Nhập địa chỉ"
              rows={3}
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="add-user-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mật khẩu *
            </label>
            <input
              id="add-user-password"
              type="password"
              required
              value={userForm.password}
              onChange={(e) => handleFormChange("password", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mật khẩu"
              disabled={submitting}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="add-user-role"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Vai trò *
            </label>
            <select
              id="add-user-role"
              required
              value={userForm.role}
              onChange={(e) => handleFormChange("role", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                formErrors.role ? "border-red-500" : "border-gray-300"
              }`}
              disabled={submitting}
            >
              <option value="">Chọn vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="manager">Quản lý</option>
              <option value="consultant">Tư vấn viên</option>
              <option value="staff">Nhân viên</option>
              <option value="customer">Khách hàng</option>
            </select>
            {formErrors.role && (
              <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="add-user-specialty"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Chuyên môn (dành cho tư vấn viên)
            </label>
            <input
              id="add-user-specialty"
              type="text"
              value={userForm.specialty}
              onChange={(e) => handleFormChange("specialty", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Nhập chuyên môn"
              disabled={submitting}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {submitting && <Loader className="h-4 w-4 animate-spin" />}
              <span>{submitting ? "Đang tạo..." : "Thêm người dùng"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
