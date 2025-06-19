import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Lấy dữ liệu từ location state khi chuyển trang
    if (location.state && location.state.bookingData) {
      setBookingData(location.state.bookingData);
    } else {
      // Nếu không có dữ liệu, quay lại trang chủ
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Nếu không có dữ liệu, hiển thị trạng thái loading
  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Không xác định";

      // Check if date is in ISO format (yyyy-MM-dd)
      if (dateString.includes("-")) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return format(date, "dd/MM/yyyy");
      }

      // If already in dd-MM-yyyy format
      return dateString.replace(/-/g, "/");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString || "Không xác định";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-green-500 p-4 flex items-center justify-center">
          <svg
            className="h-12 w-12 text-white mx-auto"
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
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Đặt Lịch & Thanh Toán Thành Công!
          </h3>

          <p className="text-gray-600 text-center mb-6">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Thông tin xét nghiệm
            của bạn đã được ghi nhận.
          </p>

          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
              <span className="text-gray-900 font-bold">
                {bookingData.bookingId ||
                  "STI" + Math.floor(Math.random() * 10000)}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600 font-medium">
                Ngày xét nghiệm:
              </span>
              <span className="text-gray-900">
                {formatDate(bookingData.preferredDate)}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600 font-medium">
                Phương thức thanh toán:
              </span>
              <span className="text-gray-900">
                {(() => {
                  switch (bookingData.paymentMethod) {
                    case "momo":
                      return "MoMo";
                    case "vnpay":
                      return "VNPay";
                    case "zalopay":
                      return "ZaloPay";
                    case "card":
                      return "Thẻ tín dụng";
                    default:
                      return "Online";
                  }
                })()}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600 font-medium">Dịch vụ:</span>
              <span className="text-gray-900">Xét nghiệm STI</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600 font-medium">
                Tổng thanh toán:
              </span>
              <span className="text-green-600 font-bold">
                {formatCurrency(bookingData.totalAmount || 0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Trạng thái:</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                Đã thanh toán
              </span>
            </div>
          </div>

          {bookingData.isAnonymous ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-yellow-400 mr-2"
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
                  <p className="text-sm text-yellow-700 font-medium">
                    Bạn đã chọn xét nghiệm ẩn danh
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Mã xét nghiệm của bạn:{" "}
                    <span className="font-bold">
                      {bookingData.anonymousCode ||
                        "ANO-" + Math.floor(Math.random() * 100000)}
                    </span>
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Vui lòng lưu lại mã này để nhận kết quả xét nghiệm. Chúng
                    tôi sẽ không lưu thông tin cá nhân của bạn.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Email xác nhận đã được gửi đến địa chỉ email của bạn. Vui lòng
              kiểm tra hộp thư đến.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/tracking"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                Theo dõi đơn hàng
              </Link>

              <Link
                to="/sti-testing"
                className="bg-white hover:bg-gray-100 text-indigo-600 font-medium py-2 px-4 border border-indigo-600 rounded transition-colors duration-200"
              >
                Trở về trang xét nghiệm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
