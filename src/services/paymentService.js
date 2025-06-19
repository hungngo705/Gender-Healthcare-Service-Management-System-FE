import apiClient from "../utils/axiosConfig";

const paymentService = {
  // Create payment URL for VNPay
  createPayment: async (stiTestingId) => {
    try {
      const response = await apiClient.post('/api/payment/create-payment', {
        stiTestingId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Get payment status (optional - for checking payment status)
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await apiClient.get(`/api/payment/status/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  }
};

export default paymentService; 