import React from "react";
import { FileText } from "lucide-react";

function MedicalRecordsTab() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Hồ sơ y tế</h3>

      {/* Trường hợp không có hồ sơ */}
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <FileText size={48} className="mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Chưa có hồ sơ y tế nào</p>
        <p className="text-sm text-gray-500">
          Hồ sơ y tế của bạn sẽ được hiển thị sau khi bạn sử dụng dịch vụ
        </p>
      </div>

      {/* Vị trí hiển thị danh sách hồ sơ y tế khi có dữ liệu */}
    </div>
  );
}

export default MedicalRecordsTab;
