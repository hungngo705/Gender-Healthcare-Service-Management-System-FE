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
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState({});

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

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19)
        formattedValue = formattedValue.substring(0, 19);
    }

    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2");
      if (formattedValue.length > 5)
        formattedValue = formattedValue.substring(0, 5);
    }

    // Format CVV (numbers only)
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 4)
        formattedValue = formattedValue.substring(0, 4);
    }

    setCardInfo((prev) => ({ ...prev, [name]: formattedValue }));

    // Clear validation error when user starts typing
    if (cardErrors[name]) {
      setCardErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setCardErrors({}); // Clear card errors when switching payment methods
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

  const processPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validate card info if using card payment method
      if (paymentMethod === "card") {
        const validation = paymentService.validateCardInfo(cardInfo);
        if (!validation.isValid) {
          setCardErrors(validation.errors);
          toast.error("Vui lòng kiểm tra lại thông tin thẻ");
          setIsProcessing(false);
          return;
        }
      }

      // Prepare complete booking data with payment method
      const completeBookingData = {
        ...bookingData,
        paymentMethod,
        totalAmount,
        cardInfo: paymentMethod === "card" ? cardInfo : null,
      };

      console.log("Processing payment with data:", completeBookingData);

      // Create booking and payment based on method
      if (paymentMethod === "vnpay") {
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
      } else {
        // Use mock payment for other methods (demo purposes)
        const result = await paymentService.createBookingAndPayment(
          completeBookingData
        );

        if (result.success) {
          // For demo payments, simulate processing
          const mockPaymentResult = await paymentService.processMockPayment({
            paymentMethod,
            amount: totalAmount,
            bookingData: completeBookingData,
            cardInfo: paymentMethod === "card" ? cardInfo : null,
          });

          if (mockPaymentResult.success) {
            toast.success("Thanh toán thành công!");

            // After successful payment, update the stiTesting record to isPaid = true
            try {
              const stiTestingId = result.data.stiTestingId;
              if (stiTestingId) {
                await stiTestingService.setAsPaid(stiTestingId);
                console.log(
                  `Updated STI testing record ${stiTestingId} to isPaid=true.`
                );
              } else {
                console.warn(
                  "No stiTestingId found, cannot update payment status."
                );
              }
            } catch (error) {
              console.error(
                "Failed to update payment status for STI testing record:",
                error
              );
              // Do not block navigation, but warn the user.
              // The payment itself was successful. This is a secondary step.
              toast.warn(
                "Không thể cập nhật trạng thái đơn hàng. Vui lòng liên hệ hỗ trợ."
              );
            }

            // Navigate to success page with result data
            navigate("/payment-success", {
              state: {
                bookingData: {
                  ...completeBookingData,
                  stiTestingId: result.data.stiTestingId,
                  paymentId: result.data.paymentId,
                  paymentTime: new Date().toISOString(),
                  transactionId: mockPaymentResult.transactionId,
                  bookingId:
                    result.data.stiTestingId ||
                    `STI${Math.floor(Math.random() * 100000)}`,
                  anonymousCode: completeBookingData.isAnonymous
                    ? `ANO${Math.floor(Math.random() * 100000)}`
                    : undefined,
                },
              },
            });
          } else {
            throw new Error(mockPaymentResult.error);
          }
        } else {
          throw new Error(result.error);
        }
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

  // Get payment method config
  const getPaymentMethodConfig = (method) => {
    return paymentService.getPaymentMethodConfig(method);
  };

  // If no data, show loading state
  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const paymentMethods = ["vnpay", "momo", "zalopay", "card"];

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
                  {paymentMethods.map((method) => {
                    const config = getPaymentMethodConfig(method);
                    const isSelected = paymentMethod === method;

                    return (
                      <div
                        key={method}
                        className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                          isSelected
                            ? `border-${config.color}-500 bg-${config.color}-50 shadow-sm`
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handlePaymentMethodChange(method)}
                      >
                        <div className="w-12 h-12 flex items-center justify-center mb-2">
                          {config.icon ? (
                            <img
                              src={config.icon}
                              alt={config.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-8 w-8 text-${config.color}-600`}
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
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {config.name}
                        </span>
                        {config.recommended && (
                          <span className="text-xs text-blue-600 mt-1">
                            Khuyến nghị
                          </span>
                        )}
                        {!config.realPayment && (
                          <span className="text-xs text-gray-500 mt-1">
                            Demo
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Payment Method Details */}
                {paymentMethod === "card" && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <form>
                      <div className="mb-4">
                        <label
                          htmlFor="cardNumber"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Số thẻ *
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={cardInfo.cardNumber}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          className={`w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                            cardErrors.cardNumber
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          maxLength="19"
                        />
                        {cardErrors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1">
                            {cardErrors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="cardHolder"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Tên chủ thẻ *
                        </label>
                        <input
                          type="text"
                          id="cardHolder"
                          name="cardHolder"
                          value={cardInfo.cardHolder}
                          onChange={handleCardChange}
                          placeholder="NGUYEN VAN A"
                          className={`w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                            cardErrors.cardHolder
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {cardErrors.cardHolder && (
                          <p className="text-red-500 text-xs mt-1">
                            {cardErrors.cardHolder}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                          <label
                            htmlFor="expiryDate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Ngày hết hạn *
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={cardInfo.expiryDate}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            className={`w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                              cardErrors.expiryDate
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            maxLength="5"
                          />
                          {cardErrors.expiryDate && (
                            <p className="text-red-500 text-xs mt-1">
                              {cardErrors.expiryDate}
                            </p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="cvv"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            CVV *
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={cardInfo.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                            className={`w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                              cardErrors.cvv
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            maxLength="4"
                          />
                          {cardErrors.cvv && (
                            <p className="text-red-500 text-xs mt-1">
                              {cardErrors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {paymentMethod === "vnpay" && (
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
                        Bạn sẽ được chuyển hướng đến cổng thanh toán VNPay để
                        hoàn tất giao dịch một cách an toàn.
                      </p>
                    </div>
                  </div>
                )}

                {(paymentMethod === "momo" || paymentMethod === "zalopay") && (
                  <div
                    className={`border border-gray-200 rounded-lg p-4 ${
                      paymentMethod === "momo" ? "bg-purple-50" : "bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">
                        {getPaymentMethodConfig(paymentMethod).name}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          paymentMethod === "momo"
                            ? "text-purple-700"
                            : "text-blue-700"
                        }`}
                      >
                        Demo Mode
                      </span>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-100 text-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${paymentMethod}PaymentDemo`}
                        alt={`${
                          getPaymentMethodConfig(paymentMethod).name
                        } QR Code`}
                        className="mx-auto h-32 w-32 mb-2"
                      />
                      <p className="text-sm text-gray-600">
                        Quét mã QR bằng ứng dụng{" "}
                        {getPaymentMethodConfig(paymentMethod).name} để thanh
                        toán
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          paymentMethod === "momo"
                            ? "text-purple-600"
                            : "text-blue-600"
                        }`}
                      >
                        ⚠️ Đây là chế độ demo - thanh toán thật không được xử lý
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
