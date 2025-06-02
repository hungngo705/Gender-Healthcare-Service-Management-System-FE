import React from "react";

function SecurityTab() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Bảo mật tài khoản
      </h3>

      <div className="space-y-6">
        <div className="pb-4 border-b border-gray-200">
          <h4 className="text-md font-medium text-gray-800">
            Thay đổi mật khẩu
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Cập nhật mật khẩu của bạn để tăng cường bảo mật
          </p>
          <button
            type="button"
            className="mt-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Thay đổi mật khẩu
          </button>
        </div>

        <div className="pb-4 border-b border-gray-200">
          <h4 className="text-md font-medium text-gray-800">
            Xác thực hai yếu tố
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Thêm một lớp bảo mật cho tài khoản của bạn
          </p>
          <button
            type="button"
            className="mt-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Thiết lập
          </button>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-800">Phiên đăng nhập</h4>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý các thiết bị đang đăng nhập vào tài khoản của bạn
          </p>
          <button
            type="button"
            className="mt-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Xem phiên đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}

export default SecurityTab;
