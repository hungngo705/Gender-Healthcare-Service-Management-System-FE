import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Edit2,
  User,
  Save,
  X,
  Check,
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  BadgeCheck,
} from "lucide-react";
import userUtils from "../../../utils/userUtils";
import AvatarUploader from "../../user/AvatarUploader";

function ProfileTab({ profileData, onSave }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(profileData);
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', or null
  const { formattedRole } = userUtils.useUserInfo();

  // Update local form data when profileData changes
  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (
      formData.phone &&
      !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý lưu thông tin
  const handleSave = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      onSave(formData);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {isEditMode ? (
        // Form chỉnh sửa thông tin
        <form onSubmit={handleSave} className="p-6">
          {saveStatus === "success" && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-md p-3 flex items-center">
              <Check size={18} className="mr-2 text-green-500" />
              <span>Thông tin đã được cập nhật thành công</span>
            </div>
          )}
          <div className="mb-8 border-b pb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ảnh đại diện
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <AvatarUploader />
              <div className="ml-0 sm:ml-4 mt-4 sm:mt-0">
                <p className="text-sm text-gray-600 mb-2">
                  Chọn hình ảnh đại diện của bạn. Kích thước tối ưu: 200x200px.
                </p>
                <div className="text-xs text-gray-400 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                    <Check size={10} className="mr-1" /> JPG
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                    <Check size={10} className="mr-1" /> PNG
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                    <Check size={10} className="mr-1" /> GIF
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <User size={20} className="text-indigo-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Thông tin cá nhân
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Cập nhật thông tin cá nhân của bạn để chúng tôi có thể liên hệ và
              cung cấp dịch vụ phù hợp nhất
            </p>
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User size={16} className="mr-2 text-gray-500" />
                Họ và tên <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                placeholder="Nhập họ và tên đầy đủ"
                required
              />
              {errors.name && (
                <p className="mt-2 text-xs text-red-500 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail size={16} className="mr-2 text-gray-500" />
                Email <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                placeholder="example@email.com"
                required
              />
              {errors.email && (
                <p className="mt-2 text-xs text-red-500 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>{" "}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Phone size={16} className="mr-2 text-gray-500" />
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="Ví dụ: 0912345678"
                className={`w-full px-4 py-3 border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              />
              {errors.phone && (
                <p className="mt-2 text-xs text-red-500 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>{" "}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin size={16} className="mr-2 text-gray-500" />
                Địa chỉ
              </label>
              <textarea
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Nhập địa chỉ đầy đủ của bạn"
              ></textarea>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 flex flex-col-reverse sm:flex-row justify-between sm:justify-end items-center space-y-4 space-y-reverse sm:space-y-0 sm:space-x-3">
            {saveStatus === "error" && (
              <div className="w-full sm:w-auto sm:mr-auto flex items-center text-red-600 text-sm bg-red-50 px-4 py-2 rounded-md">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span>Đã xảy ra lỗi khi lưu. Vui lòng thử lại.</span>
              </div>
            )}
            <button
              type="button"
              className="w-full sm:w-auto flex justify-center items-center px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              onClick={() => {
                setIsEditMode(false);
                setFormData(profileData); // Reset to original data
                setErrors({});
              }}
            >
              <X size={16} className="mr-2" />
              Hủy
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex justify-center items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              <Save size={16} className="mr-2" />
              Lưu thay đổi
            </button>
          </div>
        </form>
      ) : (
        // Hiển thị thông tin
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-xl font-medium text-gray-900 flex items-center">
                <BadgeCheck size={20} className="mr-2 text-indigo-600" />
                Thông tin cá nhân
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Chi tiết thông tin cá nhân của bạn
              </p>
            </div>
            <button
              type="button"
              className="flex items-center px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 rounded-lg transition-colors"
              onClick={() => setIsEditMode(true)}
            >
              <Edit2 size={16} className="mr-2" />
              Chỉnh sửa thông tin
            </button>
          </div>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-8">
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <User size={20} className="text-gray-400" />
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
                <dd className="mt-1 text-base text-gray-900 font-medium">
                  {profileData.name || "Chưa cập nhật"}
                </dd>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <Mail size={20} className="text-gray-400" />
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-base text-gray-900">
                  {profileData.email || "Chưa cập nhật"}
                </dd>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <BadgeCheck size={20} className="text-gray-400" />
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Vai trò</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {formattedRole}
                  </span>
                </dd>
              </div>
            </div>{" "}
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <Phone size={20} className="text-gray-400" />
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Số điện thoại
                </dt>
                <dd className="mt-1 text-base text-gray-900">
                  {profileData.phone || "Chưa cập nhật"}
                </dd>
              </div>
            </div>
            <div className="md:col-span-2 flex">
              <div className="flex-shrink-0 mr-3">
                <MapPin size={20} className="text-gray-400" />
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Địa chỉ</dt>
                <dd className="mt-1 text-base text-gray-900">
                  {profileData.address || "Chưa cập nhật"}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Thông tin của bạn được bảo mật và chỉ được sử dụng để cung cấp
              dịch vụ y tế tốt nhất.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

ProfileTab.propTypes = {
  profileData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ProfileTab;
