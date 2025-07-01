import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import paymentService from "../services/paymentService";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import logo from "../assets/logo2.svg";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePaymentResult = async () => {
      try {
        // Check if this is a VNPay callback
        const vnpayParams = Object.fromEntries(searchParams.entries());
        const hasVnpayParams = Object.keys(vnpayParams).some((key) =>
          key.startsWith("vnp_")
        );

        if (hasVnpayParams) {
          // Handle VNPay callback
          await handleVnpayCallback(vnpayParams);
        } else if (location.state && location.state.bookingData) {
          // Handle direct navigation from payment page
          setBookingData(location.state.bookingData);
          setPaymentStatus("success");
        } else {
          // No payment data available
          setPaymentStatus("failed");
          toast.error("Không tìm thấy thông tin thanh toán.");
          setTimeout(() => navigate("/", { replace: true }), 3000);
        }
      } catch (error) {
        console.error("Error initializing payment result:", error);
        setPaymentStatus("failed");
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
        setPaymentStatus("success");
        // Create booking data from VNPay parameters
        const vnpayBookingData = {
          bookingId:
            vnpayParams.vnp_TxnRef ||
            `STI${Math.floor(Math.random() * 100000)}`,
          transactionId: vnpayParams.vnp_TransactionNo,
          totalAmount: vnpayParams.vnp_Amount
            ? parseInt(vnpayParams.vnp_Amount) / 100
            : 0,
          paymentMethod: "vnpay",
          paymentTime: new Date().toISOString(),
          orderInfo: vnpayParams.vnp_OrderInfo,
          responseCode: vnpayParams.vnp_ResponseCode,
          preferredDate: new Date().toISOString().split("T")[0],
          isAnonymous: false,
        };
        setBookingData(vnpayBookingData);
        toast.success("Thanh toán VNPay thành công!");
      } else {
        setPaymentStatus("failed");
        toast.error(result.error || "Thanh toán VNPay thất bại.");
      }
    } catch (error) {
      console.error("VNPay callback error:", error);
      setPaymentStatus("failed");
      toast.error("Có lỗi xảy ra khi xử lý kết quả thanh toán VNPay.");
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Không xác định";
      if (dateString.includes("-")) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return format(date, "dd/MM/yyyy");
      }
      return dateString.replace(/-/g, "/");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return dateString || "Không xác định";
    }
  };

  const getPaymentMethodDisplayName = (method) => {
    return paymentService.getPaymentMethodDisplayName(method);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-opacity-75"></div>
          <p className="mt-4 text-lg text-indigo-800">
            Đang xử lý thanh toán...
          </p>
        </div>
      </div>
    );
  }

  // Failed payment state - redirect to payment failed page
  if (paymentStatus === "failed") {
    navigate("/payment-failed", {
      state: {
        error: "Thanh toán không thành công",
        vnpayParams: Object.fromEntries(searchParams.entries()),
      },
    });
    return null;
  }

  // Success payment state
  if (!bookingData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-opacity-75"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen overflow-hidden flex flex-col bg-gradient-to-b from-green-50 to-white"
    >
      {/* Header section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-6 px-4 shadow-lg">
        <div className="container mx-auto max-w-4xl flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-full p-3 mr-4 shadow-md"
          >
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Thanh Toán Thành Công
            </h1>
            <p className="text-green-100">Đơn hàng của bạn đã được xác nhận</p>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto max-w-4xl h-full flex flex-col md:flex-row">
          {/* Left column - Order details */}
          <div className="md:w-3/5 p-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Chi tiết đơn hàng
              </h2>

              <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
                <div className="text-gray-600">Mã đơn hàng:</div>
                <div className="font-semibold text-gray-800">
                  {bookingData.bookingId ||
                    "STI" + Math.floor(Math.random() * 10000)}
                </div>

                {bookingData.transactionId && (
                  <>
                    <div className="text-gray-600">Mã giao dịch:</div>
                    <div className="font-mono text-gray-800">
                      {bookingData.transactionId}
                    </div>
                  </>
                )}

                <div className="text-gray-600">Ngày xét nghiệm:</div>
                <div className="text-gray-800">
                  {formatDate(bookingData.preferredDate)}
                </div>

                <div className="text-gray-600">Phương thức:</div>
                <div className="text-gray-800">
                  {getPaymentMethodDisplayName(bookingData.paymentMethod)}
                </div>

                <div className="text-gray-600">Dịch vụ:</div>
                <div className="text-gray-800">
                  {bookingData.orderInfo || "Xét nghiệm STI"}
                </div>

                <div className="text-gray-600">Trạng thái:</div>
                <div className="text-green-600 font-medium">Đã thanh toán</div>
              </div>

              <div className="mt-2 bg-green-50 p-3 rounded-lg border border-green-100 flex items-center">
                <div className="text-green-700 font-medium mr-2">
                  Tổng thanh toán:
                </div>
                <div className="text-green-700 text-xl font-bold">
                  {paymentService.formatCurrency(bookingData.totalAmount || 0)}
                </div>
              </div>

              {/* Anonymous section if applicable */}
              {bookingData.isAnonymous && (
                <div className="mt-4 bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-amber-500 mt-1 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <p className="font-medium text-amber-800">
                        Xét nghiệm ẩn danh
                      </p>
                      <p className="mt-1 text-amber-700">
                        Mã xét nghiệm:{" "}
                        <span className="font-mono font-bold">
                          {bookingData.anonymousCode ||
                            "ANO-" + Math.floor(Math.random() * 100000)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto flex justify-center pb-4">
                <img src={logo} alt="logo" className="h-30 opacity-30" />
              </div>
            </div>
          </div>

          {/* Right column - Next steps & actions */}
          <div className="md:w-2/5 p-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Hướng dẫn tiếp theo
              </h2>

              <div className="mb-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span>Vui lòng đến cơ sở y tế đúng ngày và giờ đã đặt</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span>Mang theo giấy tờ tùy thân và mã đơn hàng</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span>
                      Kết quả xét nghiệm sẽ có trong 3-5 ngày làm việc
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto space-y-3">
                <Link
                  to="/profile"
                  className="block w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-center transition duration-200"
                >
                  Xem lịch sử đặt lịch
                </Link>
                <Link
                  to="/sti-testing"
                  className="block w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-indigo-600 font-medium rounded-lg text-center border border-indigo-600 transition duration-200"
                >
                  Đặt lịch mới
                </Link>
                <Link
                  to="/"
                  className="block w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-center transition duration-200"
                >
                  Về trang chủ
                </Link>

                <div className="pt-3 text-center text-xs text-gray-500">
                  <p>Cần hỗ trợ? Liên hệ:</p>
                  <div className="flex justify-center space-x-3 mt-1">
                    <a
                      href="tel:1900123456"
                      className="text-indigo-600 hover:underline"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                        </svg>
                        1900 123 456
                      </span>
                    </a>
                    <a
                      href="mailto:support@everwell.com"
                      className="text-indigo-600 hover:underline"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                        Email
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;
