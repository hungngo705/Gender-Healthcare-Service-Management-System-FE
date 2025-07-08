import apiClient from "../utils/axiosConfig";
import stiTestingService from "./stiTestingService";
import config from "../utils/config";

class PaymentService {
  /**
   * Complete booking flow: Create STI testing and then create payment
   * @param {Object} bookingData - Complete booking information
   * @returns {Promise<Object>} Payment response with payment URL
   */
  async createBookingAndPayment(bookingData) {
    try {
      console.log("Creating STI testing booking...", bookingData);

      // Step 1: Create STI testing booking - Dữ liệu khớp với yêu cầu backend
      const stiTestingData = {
        testPackage: bookingData.testPackage || 0,
        customParameters: bookingData.customParameters || [],
        scheduleDate: bookingData.scheduleDate || bookingData.preferredDate,
        slot: bookingData.slot || 0,
        totalPrice: bookingData.totalAmount || 0,
        notes: bookingData.notes || bookingData.note || "",
      };

      const stiResponse = await stiTestingService.create(stiTestingData);

      if (!stiResponse?.data?.is_success) {
        throw new Error(
          stiResponse?.data?.message || "Failed to create STI testing booking"
        );
      }

      const stiTestingId = stiResponse.data.data.id;
      console.log("STI testing created with ID:", stiTestingId);

      // Step 2: Create payment for the STI testing
      const paymentResponse = await this.createPayment(
        stiTestingId,
        bookingData.paymentMethod
      );

      if (paymentResponse.success) {
        return {
          success: true,
          data: {
            ...paymentResponse.data,
            stiTestingId: stiTestingId,
            bookingData: {
              ...bookingData,
              stiTestingId: stiTestingId,
              id: stiTestingId,
            },
          },
        };
      } else {
        throw new Error(paymentResponse.error);
      }
    } catch (error) {
      console.error("Booking and payment creation error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create booking and payment",
      };
    }
  }

  /**
   * Create a payment for an existing STI testing
   * @param {string} stiTestingId - The STI testing ID
   * @param {string} paymentMethod - Payment method (vnpay, momo, zalopay)
   * @returns {Promise<Object>} Payment response with payment URL
   */
  async createPayment(stiTestingId, paymentMethod = "vnpay") {
    try {
      const response = await apiClient.post(config.api.payment.createPayment, {
        stiTestingId: stiTestingId,
        paymentMethod: paymentMethod,
      });

      if (response.data.is_success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || "Payment creation failed",
        };
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Payment creation failed",
      };
    }
  }

  /**
   * Process VNPay callback response
   * @param {Object} vnpayParams - VNPay response parameters
   * @returns {Promise<Object>} Processing result
   */
  async processVnpayCallback(vnpayParams) {
    try {
      // For frontend callback processing, we mainly need to validate the response
      // The actual payment status update should happen via IPN to backend

      console.log("Processing VNPay callback:", vnpayParams);

      // Basic validation
      const responseCode = vnpayParams.vnp_ResponseCode;
      const transactionStatus = vnpayParams.vnp_TransactionStatus;

      if (!responseCode || !transactionStatus) {
        throw new Error("Missing required VNPay response parameters");
      }

      // Optionally, send callback data to backend for additional processing
      // This is separate from IPN and used for frontend state management
      try {
        const response = await apiClient.post(
          config.api.payment.vnpayCallback,
          vnpayParams,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Backend callback processing result:", response.data);

        return {
          success: response.data.is_success || false,
          rspCode: response.data.rspCode || responseCode,
          message: response.data.message || "Callback processed",
        };
      } catch (backendError) {
        console.warn("Backend callback processing failed:", backendError);
        // Continue with frontend-only processing if backend fails

        // Determine success based on VNPay response codes
        const isSuccess = responseCode === "00" && transactionStatus === "00";

        return {
          success: isSuccess,
          rspCode: responseCode,
          message: isSuccess ? "Payment successful" : "Payment failed",
          frontendOnly: true,
        };
      }
    } catch (error) {
      console.error("VNPay callback processing error:", error);
      return {
        success: false,
        rspCode: "99",
        error: error.message || "Callback processing failed",
      };
    }
  }

  /**
   * Mock payment processing for demo methods
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Mock payment result
   */
  async processMockPayment(paymentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate payment processing delay
        const isSuccess = Math.random() > 0.1; // 90% success rate for demo

        if (isSuccess) {
          resolve({
            success: true,
            transactionId: `TXN${Date.now()}`,
            paymentMethod: paymentData.paymentMethod,
            amount: paymentData.amount,
            message: "Payment processed successfully",
          });
        } else {
          resolve({
            success: false,
            error: "Payment failed. Please try again.",
          });
        }
      }, 2000);
    });
  }

  /**
   * Get payment transaction details
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Transaction details
   */
  async getPaymentTransaction(transactionId) {
    try {
      const response = await apiClient.get(
        config.api.payment.getTransaction(transactionId)
      );

      if (response.data.is_success) {
        return {
          success: true,
          data: response.data.data,
        };
      } else {
        return {
          success: false,
          error: response.data.message || "Failed to get transaction details",
        };
      }
    } catch (error) {
      console.error("Get transaction error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to get transaction details",
      };
    }
  }

  /**
   * Get payment method display name
   * @param {string} method - Payment method code
   * @returns {string} Display name
   */
  getPaymentMethodDisplayName(method) {
    const methodNames = {
      vnpay: "VNPay",
      momo: "MoMo",
      zalopay: "ZaloPay",
      card: "Thẻ tín dụng",
      bank_transfer: "Chuyển khoản ngân hàng",
    };

    return methodNames[method?.toLowerCase()] || method || "Online";
  }

  /**
   * Format currency amount
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Validate card information
   * @param {Object} cardInfo - Card information object
   * @returns {Object} Validation result
   */
  validateCardInfo(cardInfo) {
    const errors = {};

    // Card number validation
    if (
      !cardInfo.cardNumber ||
      cardInfo.cardNumber.replace(/\s/g, "").length < 13
    ) {
      errors.cardNumber = "Số thẻ không hợp lệ";
    }

    // Card holder validation
    if (!cardInfo.cardHolder || cardInfo.cardHolder.trim().length < 2) {
      errors.cardHolder = "Tên chủ thẻ không hợp lệ";
    }

    // Expiry date validation
    if (!cardInfo.expiryDate || !/^\d{2}\/\d{2}$/.test(cardInfo.expiryDate)) {
      errors.expiryDate = "Ngày hết hạn không hợp lệ (MM/YY)";
    } else {
      const [month, year] = cardInfo.expiryDate.split("/");
      const currentDate = new Date();
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);

      if (expiryDate < currentDate) {
        errors.expiryDate = "Thẻ đã hết hạn";
      }
    }

    // CVV validation
    if (!cardInfo.cvv || !/^\d{3,4}$/.test(cardInfo.cvv)) {
      errors.cvv = "CVV không hợp lệ";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Get payment method configuration
   * @param {string} method - Payment method
   * @returns {Object} Payment method config
   */
  getPaymentMethodConfig(method) {
    const configs = {
      vnpay: {
        name: "VNPay",
        description: "Thanh toán qua VNPay - An toàn & Bảo mật",
        icon: "https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png",
        color: "blue",
        recommended: true,
        realPayment: true,
      },
      momo: {
        name: "MoMo",
        description: "Thanh toán qua ví MoMo",
        icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
        color: "purple",
        recommended: false,
        realPayment: false,
      },
      zalopay: {
        name: "ZaloPay",
        description: "Thanh toán qua ví ZaloPay",
        icon: "https://play-lh.googleusercontent.com/MNO-bLIQjt_qGhVrP1Y03_GdYdaVRcX3v0MiIJ9j1J-NvBHwn02ZkrJ1SBK0VXdNSPw",
        color: "blue",
        recommended: false,
        realPayment: false,
      },
      card: {
        name: "Thẻ tín dụng",
        description: "Thanh toán bằng thẻ tín dụng/ghi nợ",
        icon: null,
        color: "green",
        recommended: false,
        realPayment: false,
      },
    };

    return configs[method?.toLowerCase()] || configs.vnpay;
  }

  /**
   * Get payment history for a specific customer
   * @param {string} customerId - ID of the customer
   * @returns {Promise<Object>} Payment history data
   */
  async getCustomerPaymentHistory(customerId) {
    try {
      if (!customerId) {
        console.error("Missing customerId for payment history");
        return {
          success: false,
          error: "ID người dùng không hợp lệ",
        };
      }

      const response = await apiClient.get(
        config.api.payment.getCustomerHistory(customerId)
      );

      // Kiểm tra cấu trúc dữ liệu trả về từ API
      console.log("Payment history API response:", response.data);

      // Thêm hàm chuẩn hóa dữ liệu
      const normalizePaymentData = (rawData) => {
        if (!Array.isArray(rawData)) {
          console.warn("Payment data is not an array:", rawData);
          return [];
        }

        return rawData.map((payment) => ({
          transactionId:
            payment.transactionId ||
            payment.id ||
            `TXN-${Math.random().toString(36).substring(2, 10)}`,
          paymentDate:
            payment.paymentDate ||
            payment.createdAt ||
            payment.date ||
            new Date().toISOString(),
          amount: payment.amount || payment.totalAmount || 0,
          serviceInfo:
            payment.serviceInfo ||
            payment.orderInfo ||
            payment.description ||
            "Thanh toán dịch vụ",
          paymentMethod: payment.paymentMethod || payment.method || "online",
          status: payment.status || payment.paymentStatus || "completed",
          customerId: payment.customerId || payment.userId || "",
          // Các trường khác nếu cần
        }));
      };

      if (
        response.data &&
        (response.data.is_success || response.status === 200)
      ) {
        const rawData = response.data.data || response.data;
        // eslint-disable-next-line no-unused-vars
        const normalizedData = normalizePaymentData(rawData);

        return {
          success: true,
          data: response.data.data || {},
        };
      } else {
        console.error("Payment API error:", response.data);
        return {
          success: false,
          error: response.data?.message || "Không thể tải lịch sử giao dịch",
        };
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Lỗi khi tải lịch sử thanh toán",
      };
    }
  }

  /**
   * Get details for a specific transaction
   * @param {string} transactionId - ID of the transaction
   * @returns {Promise<Object>} Transaction details
   */
  async getTransactionDetails(transactionId) {
    try {
      if (!transactionId) {
        console.error("Missing transactionId");
        return {
          success: false,
          error: "ID giao dịch không hợp lệ",
        };
      }

      const response = await apiClient.get(
        config.api.payment.getTransaction(transactionId)
      );

      if (response.data && response.data.is_success) {
        return {
          success: true,
          data: response.data.data || {},
        };
      } else {
        return {
          success: false,
          error: response.data?.message || "Không thể tải thông tin giao dịch",
        };
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Lỗi khi tải thông tin giao dịch",
      };
    }
  }
}

const paymentService = new PaymentService();
export default paymentService;
