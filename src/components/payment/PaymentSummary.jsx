import React from 'react';
import { format } from 'date-fns';
import paymentService from '../../services/paymentService';

const PaymentSummary = ({ 
  bookingData, 
  totalAmount, 
  showPaymentMethod = false,
  className = "",
  variant = "default" // default, compact, detailed
}) => {
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Không xác định";
      
      if (dateString.includes("-")) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return format(date, "dd/MM/yyyy");
      }
      
      return dateString.replace(/-/g, "/");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString || "Không xác định";
    }
  };

  const formatTestTypes = () => {
    if (!bookingData?.testTypes || bookingData.testTypes.length === 0) {
      return "Xét nghiệm STI";
    }
    return bookingData.testTypes.map((type) => type.name).join(", ");
  };

  const baseClasses = "bg-gray-50 p-4 rounded-lg border border-gray-200";
  const variantClasses = {
    default: baseClasses,
    compact: "bg-white p-3 rounded border border-gray-200 text-sm",
    detailed: `${baseClasses} space-y-4`
  };

  if (variant === "compact") {
    return (
      <div className={`${variantClasses.compact} ${className}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-800">Tổng thanh toán</span>
          <span className="text-lg font-bold text-indigo-600">
            {paymentService.formatCurrency(totalAmount || 0)}
          </span>
        </div>
        <div className="text-xs text-gray-600">
          {formatTestTypes()} • {formatDate(bookingData?.preferredDate)}
        </div>
      </div>
    );
  }

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Tóm tắt đơn hàng
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Dịch vụ</span>
          <span className="text-sm font-medium text-right max-w-48">
            {formatTestTypes()}
          </span>
        </div>

        {bookingData?.preferredDate && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Ngày xét nghiệm</span>
            <span className="text-sm font-medium">
              {formatDate(bookingData.preferredDate)}
            </span>
          </div>
        )}

        {bookingData?.slot !== undefined && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Khung giờ</span>
            <span className="text-sm font-medium">
              {bookingData.slot === 0 ? "Sáng (8:00-12:00)" : 
               bookingData.slot === 1 ? "Chiều (13:00-17:00)" : 
               "Tối (17:00-20:00)"}
            </span>
          </div>
        )}

        {bookingData?.location && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Địa điểm</span>
            <span className="text-sm font-medium text-right max-w-48">
              {bookingData.location}
            </span>
          </div>
        )}

        {typeof bookingData?.isAnonymous !== 'undefined' && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Xét nghiệm ẩn danh</span>
            <span className="text-sm font-medium">
              {bookingData.isAnonymous ? "Có" : "Không"}
            </span>
          </div>
        )}

        {showPaymentMethod && bookingData?.paymentMethod && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Phương thức thanh toán</span>
            <span className="text-sm font-medium">
              {paymentService.getPaymentMethodDisplayName(bookingData.paymentMethod)}
            </span>
          </div>
        )}

        {bookingData?.notes && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Ghi chú</span>
            <span className="text-sm font-medium text-right max-w-48">
              {bookingData.notes}
            </span>
          </div>
        )}
      </div>

      {variant === "detailed" && bookingData?.isAnonymous && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <div className="flex">
            <svg
              className="h-4 w-4 text-yellow-400 mr-2 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-xs text-yellow-700 font-medium">
                Xét nghiệm ẩn danh
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Thông tin cá nhân sẽ không được lưu trữ. Bạn sẽ nhận được mã xét nghiệm để theo dõi kết quả.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Price breakdown */}
      <div className="border-t border-gray-200 pt-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí xét nghiệm</span>
            <span className="text-gray-900">
              {paymentService.formatCurrency(totalAmount || 0)}
            </span>
          </div>
          
          {variant === "detailed" && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí dịch vụ</span>
                <span className="text-gray-900">Miễn phí</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT</span>
                <span className="text-gray-900">Đã bao gồm</span>
              </div>
            </>
          )}
          
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Tổng thanh toán</span>
              <span className="text-lg font-bold text-indigo-600">
                {paymentService.formatCurrency(totalAmount || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {variant === "detailed" && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex">
            <svg
              className="h-4 w-4 text-blue-400 mr-2 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-xs text-blue-700 font-medium">
                Cam kết bảo mật
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Thông tin thanh toán được mã hóa SSL 256-bit. Kết quả xét nghiệm chỉ có bạn mới xem được.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSummary; 