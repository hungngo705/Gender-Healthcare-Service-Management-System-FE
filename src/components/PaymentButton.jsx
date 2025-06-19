import React from 'react';
import { usePayment } from '../hooks/usePayment';
import LoadingSpinner from './LoadingSpinner';

const PaymentButton = ({ 
  stiTestingId, 
  amount, 
  disabled = false, 
  className = "",
  children 
}) => {
  const { initiatePayment, isLoading } = usePayment();

  const handlePayment = async () => {
    if (!stiTestingId) {
      console.error('STI Testing ID is required for payment');
      return;
    }

    try {
      await initiatePayment(stiTestingId);
    } catch (error) {
      // Error is handled in the hook
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={`payment-button ${className} ${isLoading ? 'loading' : ''}`}
      style={{
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.6 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        minWidth: '120px',
        transition: 'all 0.2s ease',
        ...(!disabled && !isLoading && {
          ':hover': {
            backgroundColor: '#1d4ed8'
          }
        })
      }}
    >
      {isLoading ? (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Processing...
        </>
      ) : (
        children || `Pay ${amount ? `$${amount}` : 'Now'}`
      )}
    </button>
  );
};

export default PaymentButton;