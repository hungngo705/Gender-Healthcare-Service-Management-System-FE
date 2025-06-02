import React from "react";

const BookingSuccess = ({ onReset }) => {
  return (
    <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <svg
        className="h-12 w-12 text-green-500 mx-auto mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Đặt Lịch Thành Công!
      </h3>
      <p className="text-gray-600 mb-6">
        Lịch hẹn của bạn đã được xác nhận. Chúng tôi sẽ gửi email xác nhận cho bạn trong thời gian sớm nhất.
      </p>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Đặt Lịch Hẹn Khác
      </button>
    </div>
  );
};

export default BookingSuccess;