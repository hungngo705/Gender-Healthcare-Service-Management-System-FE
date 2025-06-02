import React, { useState } from "react";
import PropTypes from "prop-types";
import { Edit2 } from "lucide-react";

function ProfileTab({ profileData, onSave }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(profileData);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý lưu thông tin
  const handleSave = (e) => {
    e.preventDefault();
    onSave(formData);
    setIsEditMode(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {isEditMode ? (
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Người liên hệ khi khẩn cấp
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setIsEditMode(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Thông tin cá nhân
            </h3>
            <button
              type="button"
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() => setIsEditMode(true)}
            >
              <Edit2 size={16} className="mr-1" />
              Chỉnh sửa
            </button>
          </div>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profileData.name || "Chưa cập nhật"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profileData.email || "Chưa cập nhật"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Số điện thoại
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profileData.phone || "Chưa cập nhật"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Ngày sinh</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profileData.birthday
                  ? new Date(profileData.birthday).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Giới tính</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profileData.gender === "male" && "Nam"}
                {profileData.gender === "female" && "Nữ"}
                {profileData.gender === "other" && "Khác"}
                {!profileData.gender && "Chưa cập nhật"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Người liên hệ khi khẩn cấp
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profileData.emergencyContact || "Chưa cập nhật"}
              </dd>
            </div>

            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Địa chỉ</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profileData.address || "Chưa cập nhật"}
              </dd>
            </div>
          </dl>
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
    birthday: PropTypes.string,
    gender: PropTypes.string,
    emergencyContact: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ProfileTab;
