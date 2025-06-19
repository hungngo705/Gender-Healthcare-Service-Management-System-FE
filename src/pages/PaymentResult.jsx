import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [paymentDetails, setPaymentDetails] = useState({});

  useEffect(() => {
    // Extract VNPay response parameters
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus');
    const vnp_TxnRef = searchParams.get('vnp_TxnRef');
    const vnp_Amount = searchParams.get('vnp_Amount');
    const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
    const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');

    // Determine payment status based on VNPay response codes
    let status = 'failed';
    if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
      status = 'success';
    } else if (vnp_ResponseCode === '24') {
      status = 'cancelled';
    }

    setPaymentStatus(status);
    setPaymentDetails({
      transactionRef: vnp_TxnRef,
      amount: vnp_Amount ? (parseInt(vnp_Amount) / 100).toLocaleString() : '',
      orderInfo: vnp_OrderInfo,
      transactionNo: vnp_TransactionNo,
      responseCode: vnp_ResponseCode
    });
  }, [searchParams]);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-16 h-16 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <LoadingSpinner />;
    }
  };

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Payment Successful!';
      case 'cancelled':
        return 'Payment Cancelled';
      case 'failed':
        return 'Payment Failed';
      default:
        return 'Processing Payment...';
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Your payment has been processed successfully. You will receive a confirmation email shortly.';
      case 'cancelled':
        return 'Your payment was cancelled. You can try again or contact support if you need assistance.';
      case 'failed':
        return 'Your payment could not be processed. Please try again or contact support.';
      default:
        return 'Please wait while we process your payment...';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'cancelled':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className={`bg-white rounded-lg shadow-md border-2 ${getStatusColor()} p-8 text-center`}>
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {getStatusTitle()}
          </h1>
          
          <p className="text-gray-600 mb-8">
            {getStatusMessage()}
          </p>

          {paymentDetails.transactionRef && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction Reference:</span>
                  <span className="font-mono">{paymentDetails.transactionRef}</span>
                </div>
                {paymentDetails.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">{paymentDetails.amount} VND</span>
                  </div>
                )}
                {paymentDetails.transactionNo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">VNPay Transaction:</span>
                    <span className="font-mono">{paymentDetails.transactionNo}</span>
                  </div>
                )}
                {paymentDetails.orderInfo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Info:</span>
                    <span>{paymentDetails.orderInfo}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate('/services/sti-testing')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to STI Testing
            </button>
            
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              View My Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;