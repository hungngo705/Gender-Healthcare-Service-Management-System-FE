import React from "react";
import { Link, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const PaymentFailed = () => {
  const location = useLocation();
  const error = location.state?.error;
  const vnpayParams = location.state?.vnpayParams;

  // Get error details from VNPay parameters if available
  const getErrorMessage = () => {
    if (vnpayParams?.vnp_ResponseCode) {
      const responseCode = vnpayParams.vnp_ResponseCode;

      const errorMessages = {
        "02": "Tài khoản của quý khách không đủ số dư để thực hiện giao dịch",
        "03": "Thông tin tài khoản không chính xác",
        "04": "Số tiền không hợp lệ",
        "05": "URL không hợp lệ",
        "06": "Tài khoản không tồn tại",
        "07": "Ngày hết hạn không chính xác",
        "09": "Thông tin thẻ không chính xác",
        10: "Thẻ đã hết hạn",
        11: "Thẻ chưa đăng ký dịch vụ",
        12: "Ngày có hiệu lực của thẻ chưa tới",
        13: "Thẻ bị khóa",
        21: "Số tiền không đủ để thanh toán",
        22: "Thẻ chưa được đăng ký dịch vụ internetbanking tại ngân hàng",
        23: "Bạn đã nhập sai thông tin thẻ quá 3 lần",
        24: "Khách hàng hủy giao dịch",
        25: "OTP không chính xác",
        99: "Lỗi không xác định",
      };

      return errorMessages[responseCode] || "Giao dịch không thành công";
    }

    return error || "Thanh toán thất bại";
  };

  const getRetryRecommendation = () => {
    if (vnpayParams?.vnp_ResponseCode) {
      const responseCode = vnpayParams.vnp_ResponseCode;

      if (["02", "21"].includes(responseCode)) {
        return "Vui lòng kiểm tra số dư tài khoản và thử lại";
      } else if (["03", "06", "09", "10", "13"].includes(responseCode)) {
        return "Vui lòng kiểm tra thông tin thẻ/tài khoản và thử lại";
      } else if (responseCode === "24") {
        return "Bạn có thể thử thanh toán lại hoặc chọn phương thức thanh toán khác";
      }
    }

    return "Bạn có thể thử lại hoặc chọn phương thức thanh toán khác";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen overflow-hidden flex flex-col bg-gradient-to-b from-red-50 to-white"
    >
      {/* Header section */}
      <div className="bg-gradient-to-r from-red-500 to-rose-500 py-6 px-4 shadow-lg">
        <div className="container mx-auto max-w-4xl flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-full p-3 mr-4 shadow-md"
          >
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Thanh Toán Thất Bại
            </h1>
            <p className="text-red-100">
              Rất tiếc, giao dịch của bạn không thành công
            </p>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto max-w-4xl h-full flex flex-col md:flex-row">
          {/* Left column - Error details */}
          <div className="md:w-3/5 p-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Chi tiết lỗi
              </h2>

              <div className="bg-red-50 rounded-lg p-4 border border-red-100 mb-5">
                <div className="flex items-start">
                  <div className="mr-3">
                    <svg
                      className="w-5 h-5 text-red-500"
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
                  </div>
                  <div>
                    <p className="font-medium text-red-800">Lý do thất bại:</p>
                    <p className="mt-1 text-red-700">{getErrorMessage()}</p>
                    <p className="mt-2 text-sm text-red-600">
                      {getRetryRecommendation()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction details if available */}
              {vnpayParams && (
                <div className="mb-5">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Thông tin giao dịch
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    {vnpayParams.vnp_TxnRef && (
                      <>
                        <div className="text-gray-600">Mã giao dịch:</div>
                        <div className="font-mono text-gray-800">
                          {vnpayParams.vnp_TxnRef}
                        </div>
                      </>
                    )}
                    {vnpayParams.vnp_Amount && (
                      <>
                        <div className="text-gray-600">Số tiền:</div>
                        <div className="text-gray-800">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(parseInt(vnpayParams.vnp_Amount) / 100)}
                        </div>
                      </>
                    )}
                    {vnpayParams.vnp_ResponseCode && (
                      <>
                        <div className="text-gray-600">Mã lỗi:</div>
                        <div className="font-mono text-red-600">
                          {vnpayParams.vnp_ResponseCode}
                        </div>
                      </>
                    )}
                    <div className="text-gray-600">Thời gian:</div>
                    <div className="text-gray-800">
                      {new Date().toLocaleString("vi-VN")}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Các bước bạn có thể thực hiện:
                </h3>
                <ul className="text-sm text-amber-700 space-y-1 pl-7 list-disc">
                  <li>Kiểm tra lại thông tin thẻ/tài khoản ngân hàng</li>
                  <li>Đảm bảo có đủ số dư trong tài khoản</li>
                  <li>Thử lại với phương thức thanh toán khác</li>
                  <li>Liên hệ ngân hàng nếu vấn đề liên quan đến thẻ</li>
                </ul>
              </div>

              <div className="mt-auto flex justify-center pt-4">
                <img
                  src="/img/everwell-logo.png"
                  alt="Everwell Logo"
                  className="h-8 opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Right column - Actions */}
          <div className="md:w-2/5 p-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Bạn muốn làm gì tiếp theo?
              </h2>

              <div className="space-y-4 flex-1">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-indigo-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-indigo-800">
                        Thử lại thanh toán
                      </h3>
                      <p className="text-sm text-indigo-600 mt-1">
                        Quay lại trang thanh toán để thử lại hoặc chọn phương
                        thức thanh toán khác
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-blue-800">Cần hỗ trợ?</h3>
                      <p className="text-sm text-blue-600 mt-1">
                        Liên hệ đội ngũ hỗ trợ của chúng tôi để được giúp đỡ về
                        vấn đề thanh toán
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <Link
                  to="/sti-testing"
                  className="block w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-center transition duration-200"
                >
                  Thử lại thanh toán
                </Link>
                <Link
                  to="/contact"
                  className="block w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-indigo-600 font-medium rounded-lg text-center border border-indigo-600 transition duration-200"
                >
                  Liên hệ hỗ trợ
                </Link>
                <Link
                  to="/"
                  className="block w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-center transition duration-200"
                >
                  Về trang chủ
                </Link>

                <div className="pt-3 text-center text-xs text-gray-500">
                  <p>Cần hỗ trợ ngay? Liên hệ:</p>
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

export default PaymentFailed;
