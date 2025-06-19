import { useState } from 'react';
import paymentService from '../services/paymentService';
import toastService from '../utils/toastService';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = async (stiTestingId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await paymentService.createPayment(stiTestingId);
      
      if (response.paymentUrl) {
        // Redirect to VNPay
        window.location.href = response.paymentUrl;
        return response;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create payment';
      setError(errorMessage);
      toastService.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiatePayment,
    isLoading,
    error
  };
};