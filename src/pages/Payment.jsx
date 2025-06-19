import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import stiTestingService from "../services/stiTestingService";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    // Lấy dữ liệu từ location state khi chuyển trang
    if (location.state && location.state.bookingData) {
      setBookingData(location.state.bookingData);
      setTotalAmount(location.state.totalAmount || 0);
    } else {
      // Nếu không có dữ liệu, quay lại trang trước
      toast.error("Không tìm thấy thông tin đặt lịch. Vui lòng thử lại.");
      navigate(-1);
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const processPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Submit the booking data to the backend
      const response = await stiTestingService.create(bookingData);

      if (response?.data?.is_success) {
        toast.success("Thanh toán thành công!");
        // Chuyển đến trang thành công với dữ liệu kết quả
        navigate("/payment-success", {
          state: {
            bookingData: {
              ...bookingData,
              ...response.data.data,
              paymentMethod,
              paymentTime: new Date().toISOString(),
              totalAmount,
            },
          },
        });
      } else {
        throw new Error(
          response?.data?.message || "Có lỗi xảy ra trong quá trình thanh toán"
        );
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

  // Nếu không có dữ liệu, hiển thị trạng thái loading
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div
                    className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      paymentMethod === "momo"
                        ? "border-purple-500 bg-purple-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePaymentMethodChange("momo")}
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-2">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                        alt="MoMo"
                        className="max-h-full"
                      />
                    </div>
                    <span className="text-sm font-medium">MoMo</span>
                  </div>

                  <div
                    className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      paymentMethod === "vnpay"
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePaymentMethodChange("vnpay")}
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-2">
                      <img
                        src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                        alt="VNPay"
                        className="max-h-full"
                      />
                    </div>
                    <span className="text-sm font-medium">VNPay</span>
                  </div>

                  <div
                    className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      paymentMethod === "zalopay"
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePaymentMethodChange("zalopay")}
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-2">
                      <img
                        src="https://play-lh.googleusercontent.com/MNO-bLIQjt_qGhVrP1Y03_GdYdaVRcX3v0MiIJ9j1J-NvBHwn02ZkrJ1SBK0VXdNSPw"
                        alt="ZaloPay"
                        className="max-h-full"
                      />
                    </div>
                    <span className="text-sm font-medium">ZaloPay</span>
                  </div>

                  <div
                    className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-green-500 bg-green-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePaymentMethodChange("card")}
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Thẻ tín dụng</span>
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <form>
                      <div className="mb-4">
                        <label
                          htmlFor="cardNumber"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Số thẻ
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={cardInfo.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                          maxLength="19"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="cardHolder"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Tên chủ thẻ
                        </label>
                        <input
                          type="text"
                          id="cardHolder"
                          name="cardHolder"
                          value={cardInfo.cardHolder}
                          onChange={handleChange}
                          placeholder="NGUYEN VAN A"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                          <label
                            htmlFor="expiryDate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Ngày hết hạn
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={cardInfo.expiryDate}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                            maxLength="5"
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="cvv"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={cardInfo.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                            maxLength="3"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {paymentMethod === "momo" && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-purple-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">
                        Số điện thoại MoMo
                      </span>
                      <span className="text-sm font-medium text-purple-700">
                        097XXXXXXX
                      </span>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-purple-100 text-center">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MomoPaymentDemo"
                        alt="MoMo QR Code"
                        className="mx-auto h-32 w-32 mb-2"
                      />
                      <p className="text-sm text-gray-600">
                        Quét mã QR bằng ứng dụng MoMo để thanh toán
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === "vnpay" && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">
                        Tài khoản ngân hàng
                      </span>
                      <span className="text-sm font-medium text-blue-700">
                        Liên kết với VNPay
                      </span>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-blue-100 text-center">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VNPaymentDemo"
                        alt="VNPay QR Code"
                        className="mx-auto h-32 w-32 mb-2"
                      />
                      <p className="text-sm text-gray-600">
                        Quét mã QR bằng ứng dụng ngân hàng hoặc VNPay để thanh
                        toán
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === "zalopay" && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">
                        Tài khoản ZaloPay
                      </span>
                      <span className="text-sm font-medium text-blue-700">
                        097XXXXXXX
                      </span>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-blue-100 text-center">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ZaloPaymentDemo"
                        alt="ZaloPay QR Code"
                        className="mx-auto h-32 w-32 mb-2"
                      />
                      <p className="text-sm text-gray-600">
                        Quét mã QR bằng ứng dụng ZaloPay để thanh toán
                      </p>
                    </div>
                  </div>
                )}
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
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={processPayment}
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
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
                    `Thanh toán ${formatCurrency(totalAmount)}`
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
