import React, { useState } from "react";
import PropTypes from "prop-types";
import { X, Eye, EyeOff } from "lucide-react";
import userUtils from "../../../utils/userUtils";
import { useAuth } from "../../../contexts/AuthContext";

const PasswordChangeModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { changePassword } = useAuth();
  const { displayName } = userUtils.useUserInfo();

  const validateForm = () => {
    // Reset error state
    setError("");

    // Validate current password
    if (!currentPassword) {
      setError("Vui lòng nhập mật khẩu hiện tại");
      return false;
    }

    // Validate new password
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 kí tự");
      return false;
    }

    // Confirm passwords match
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Call the Auth Context method to change password
      await changePassword(currentPassword, newPassword);
      setSuccess(true);

      // Reset form after success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Auto close after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      setError(error.message || "Không thể đổi mật khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 pt-5 pb-6">
            <h3 className="text-lg font-medium text-center text-gray-900">
              Đổi mật khẩu
            </h3>
            <p className="mt-1 text-sm text-center text-gray-500">
              Cập nhật mật khẩu cho tài khoản{" "}
              <span className="font-medium">{displayName}</span>
            </p>

            {success && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                Đổi mật khẩu thành công!
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu hiện tại
                </label>
                <div className="relative mt-1">
                  <input
                    id="current-password"
                    name="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    {showCurrent ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu mới
                </label>
                <div className="relative mt-1">
                  <input
                    id="new-password"
                    name="newPassword"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || success}
                  className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none ${
                    (loading || success) && "opacity-70 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

PasswordChangeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PasswordChangeModal;
