import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const BookingForm = ({
  selectedConsultant,
  selectedDate,
  selectedTimeSlot,
  formData,
  onInputChange,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <div className="px-6 py-4">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin đã chọn</h3>
        <div className="bg-indigo-50 p-4 rounded-md">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0 h-10 w-10">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={selectedConsultant.image}
                alt={selectedConsultant.name}
              />
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900">
                {selectedConsultant.name}
              </div>
              <div className="text-sm text-gray-500">
                {selectedConsultant.specialty}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-2 rounded border border-gray-200">
              <div className="text-gray-500">Ngày</div>
              <div className="font-medium">
                {format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
              </div>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200">
              <div className="text-gray-500">Giờ</div>
              <div className="font-medium">{selectedTimeSlot.time}</div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Họ và tên *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số điện thoại *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lý do tư vấn
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={3}
              value={formData.reason}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Mô tả ngắn gọn vấn đề bạn muốn tư vấn"
            ></textarea>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Xác Nhận Đặt Lịch"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;