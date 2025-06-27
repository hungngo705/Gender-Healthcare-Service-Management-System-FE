// src\pages\Payment.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import paymentService from "../services/paymentService";
import stiTestingService from "../services/stiTestingService";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod] = useState("vnpay");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get data from location state when navigating
    if (location.state && location.state.bookingData) {
      setBookingData(location.state.bookingData);
      setTotalAmount(location.state.totalAmount || 0);
    } else {
      // If no data, go back to previous page
      toast.error("Không tìm thấy thông tin đặt lịch. Vui lòng thử lại.");
      navigate(-1);
    }
  }, [location, navigate]);

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

  const formatTestTypes = () => {
    if (
      !bookingData ||
      !bookingData.testTypes ||
      bookingData.testTypes.length === 0
    ) {
      return "Không có xét nghiệm nào được chọn";
    }

    return bookingData.testTypes.map((type) => type.name).join(", ");
  };

  const processPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Prepare complete booking data with payment method
      const completeBookingData = {
        ...bookingData,
        paymentMethod,
        totalAmount,
      };

      console.log("Processing payment with data:", completeBookingData);

      // Use real VNPay integration
      const result = await paymentService.createBookingAndPayment(
        completeBookingData
      );

      if (result.success) {
        // Redirect to VNPay payment URL
        toast.success("Chuyển hướng đến cổng thanh toán VNPay...");
        window.location.href = result.data.paymentUrl;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.message || "Thanh toán thất bại. Vui lòng thử lại sau."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // If no data, show loading state
  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Quay lại biểu mẫu đặt lịch
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">
            Thanh toán dịch vụ xét nghiệm
          </h1>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Phương thức thanh toán
                </h2>
                <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      Thanh toán qua VNPay
                    </span>
                    <span className="text-sm font-medium text-blue-700">
                      An toàn & Bảo mật
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-blue-100">
                    <div className="flex items-center justify-center mb-2">
                      <svg
                        className="h-8 w-8 text-blue-600 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Kết nối an toàn với ngân hàng
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Bạn sẽ được chuyển hướng đến cổng thanh toán VNPay để hoàn
                      tất giao dịch một cách an toàn.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Tóm tắt đơn hàng
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Loại xét nghiệm
                    </span>
                    <span className="text-sm font-medium">
                      {formatTestTypes()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Ngày xét nghiệm
                    </span>
                    <span className="text-sm font-medium">
                      {formatDate(bookingData.preferredDate) || "Chưa chọn"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Xét nghiệm ẩn danh
                    </span>
                    <span className="text-sm font-medium">
                      {bookingData.isAnonymous ? "Có" : "Không"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tổng thanh toán</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {paymentService.formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={processPayment}
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    isProcessing ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isProcessing ? (
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
                    `Thanh toán ${paymentService.formatCurrency(totalAmount)}`
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Bằng việc thanh toán, bạn đồng ý với điều khoản dịch vụ và
                  chính sách bảo mật của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
