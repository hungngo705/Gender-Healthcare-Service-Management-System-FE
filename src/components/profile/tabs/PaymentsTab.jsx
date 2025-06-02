import React from "react";
import { CreditCard } from "lucide-react";

function PaymentsTab() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Thông tin thanh toán
      </h3>

      {/* Trường hợp không có phương thức thanh toán */}
      <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
        <CreditCard size={48} className="mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Chưa có phương thức thanh toán nào
        </p>
        <button
          type="button"
          className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Thêm phương thức thanh toán
        </button>
      </div>

      <h4 className="text-md font-medium text-gray-800 mt-8 mb-3">
        Lịch sử thanh toán
      </h4>

      {/* Trường hợp không có lịch sử thanh toán */}
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Chưa có giao dịch nào</p>
      </div>

      {/* Vị trí hiển thị lịch sử thanh toán khi có dữ liệu */}
    </div>
  );
}

export default PaymentsTab;
