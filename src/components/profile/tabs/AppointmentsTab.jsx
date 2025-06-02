import React from "react";
import PropTypes from "prop-types";
import { Calendar } from "lucide-react";

function AppointmentsTab({ navigate }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Lịch hẹn của bạn
      </h3>

      {/* Trường hợp không có lịch hẹn */}
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Calendar size={48} className="mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Bạn chưa có lịch hẹn nào</p>
        <button
          type="button"
          className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={() => navigate("/services")}
        >
          Đặt lịch hẹn ngay
        </button>
      </div>

      {/* Vị trí hiển thị danh sách lịch hẹn khi có dữ liệu */}
    </div>
  );
}

AppointmentsTab.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default AppointmentsTab;
