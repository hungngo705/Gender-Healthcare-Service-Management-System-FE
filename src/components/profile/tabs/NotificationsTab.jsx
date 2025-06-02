import React from "react";
import { Bell } from "lucide-react";

function NotificationsTab() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Thông báo</h3>

      {/* Trường hợp không có thông báo */}
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Bell size={48} className="mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Chưa có thông báo nào</p>
      </div>

      {/* Vị trí hiển thị danh sách thông báo khi có dữ liệu */}
    </div>
  );
}

export default NotificationsTab;
