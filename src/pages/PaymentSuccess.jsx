import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import paymentService from "../services/paymentService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('processing'); // processing, success, failed
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePaymentResult = async () => {
      try {
        // Check if this is a VNPay callback
        const vnpayParams = Object.fromEntries(searchParams.entries());
        const hasVnpayParams = Object.keys(vnpayParams).some(key => key.startsWith('vnp_'));
        
        if (hasVnpayParams) {
          // Handle VNPay callback
          await handleVnpayCallback(vnpayParams);
        } else if (location.state && location.state.bookingData) {
          // Handle direct navigation from payment page
          setBookingData(location.state.bookingData);
          setPaymentStatus('success');
        } else {
          // No payment data available
          setPaymentStatus('failed');
          toast.error("Không tìm thấy thông tin thanh toán.");
          setTimeout(() => navigate("/", { replace: true }), 3000);
        }
      } catch (error) {
        console.error("Error initializing payment result:", error);
        setPaymentStatus('failed');
        toast.error("Có lỗi xảy ra khi xử lý kết quả thanh toán.");
      } finally {
        setIsLoading(false);
      }
    };

    initializePaymentResult();
  }, [location, navigate, searchParams]);

  const handleVnpayCallback = async (vnpayParams) => {
    try {
      const result = await paymentService.processVnpayCallback(vnpayParams);
      
      if (result.success) {
        setPaymentStatus('success');
        // Create booking data from VNPay parameters
        const vnpayBookingData = {
          bookingId: vnpayParams.vnp_TxnRef || `STI${Math.floor(Math.random() * 100000)}`,
          transactionId: vnpayParams.vnp_TransactionNo,
          totalAmount: vnpayParams.vnp_Amount ? parseInt(vnpayParams.vnp_Amount) / 100 : 0,
          paymentMethod: 'vnpay',
          paymentTime: new Date().toISOString(),
          orderInfo: vnpayParams.vnp_OrderInfo,
          responseCode: vnpayParams.vnp_ResponseCode,
          // Add default values for display
          preferredDate: new Date().toISOString().split('T')[0],
          isAnonymous: false,
        };
        setBookingData(vnpayBookingData);
        toast.success("Thanh toán VNPay thành công!");
      } else {
        setPaymentStatus('failed');
        toast.error(result.error || "Thanh toán VNPay thất bại.");
      }
    } catch (error) {
      console.error("VNPay callback error:", error);
      setPaymentStatus('failed');
      toast.error("Có lỗi xảy ra khi xử lý kết quả thanh toán VNPay.");
    }
  };

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

  const getPaymentMethodDisplayName = (method) => {
    return paymentService.getPaymentMethodDisplayName(method);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  // Failed payment state
  if (paymentStatus === 'failed') {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-red-500 p-4 flex items-center justify-center">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div className="p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thanh Toán Thất Bại
            </h3>

            <p className="text-gray-600 mb-6">
              Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/sti-testing"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                Thử lại
              </Link>

              <Link
                to="/contact"
                className="bg-white hover:bg-gray-100 text-indigo-600 font-medium py-2 px-4 border border-indigo-600 rounded transition-colors duration-200"
              >
                Liên hệ hỗ trợ
              </Link>

              <Link
                to="/"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success payment state
  if (!bookingData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

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
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
                <span className="text-gray-900 font-bold">
                  {bookingData.bookingId || "STI" + Math.floor(Math.random() * 10000)}
                </span>
              </div>

              {bookingData.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Mã giao dịch:</span>
                  <span className="text-gray-900 font-mono text-sm">
                    {bookingData.transactionId}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">
                  Ngày xét nghiệm:
                </span>
                <span className="text-gray-900">
                  {formatDate(bookingData.preferredDate)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">
                  Phương thức thanh toán:
                </span>
                <span className="text-gray-900">
                  {getPaymentMethodDisplayName(bookingData.paymentMethod)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Dịch vụ:</span>
                <span className="text-gray-900">
                  {bookingData.orderInfo || "Xét nghiệm STI"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">
                  Tổng thanh toán:
                </span>
                <span className="text-green-600 font-bold">
                  {paymentService.formatCurrency(bookingData.totalAmount || 0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Trạng thái:</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  Đã thanh toán
                </span>
              </div>

              {bookingData.paymentTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Thời gian:</span>
                  <span className="text-gray-900 text-sm">
                    {format(new Date(bookingData.paymentTime), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {bookingData.isAnonymous && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-yellow-400 mr-2 mt-0.5"
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
                    <span className="font-bold font-mono">
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
          )}

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <div className="flex">
              <svg
                className="h-5 w-5 text-blue-400 mr-2 mt-0.5"
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
                <p className="text-sm text-blue-700 font-medium">
                  Hướng dẫn tiếp theo
                </p>
                <ul className="text-xs text-blue-600 mt-1 list-disc list-inside space-y-1">
                  <li>Email xác nhận đã được gửi đến địa chỉ email của bạn</li>
                  <li>Vui lòng đến cơ sở y tế đúng ngày và giờ đã đặt</li>
                  <li>Mang theo giấy tờ tùy thân và mã đơn hàng</li>
                  <li>Kết quả xét nghiệm sẽ có trong 3-5 ngày làm việc</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/profile"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                Xem lịch sử đặt lịch
              </Link>

              <Link
                to="/sti-testing"
                className="bg-white hover:bg-gray-100 text-indigo-600 font-medium py-2 px-4 border border-indigo-600 rounded transition-colors duration-200"
              >
                Đặt lịch mới
              </Link>

              <Link
                to="/"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                Về trang chủ
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Cần hỗ trợ? Liên hệ hotline:{" "}
                <a href="tel:1900123456" className="text-indigo-600 hover:text-indigo-800">
                  1900 123 456
                </a>
                {" "}hoặc email:{" "}
                <a href="mailto:support@everwell.com" className="text-indigo-600 hover:text-indigo-800">
                  support@everwell.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
