import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import paymentService from '../services/paymentService';

const VnpayCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, failed

  useEffect(() => {
    const processVnpayReturn = async () => {
      try {
        console.log('VNPay callback parameters:', Object.fromEntries(searchParams.entries()));
        
        // Get all VNPay parameters from URL
        const vnpayParams = Object.fromEntries(searchParams.entries());
        
        // Check if we have VNPay parameters
        const hasVnpayParams = Object.keys(vnpayParams).some(key => key.startsWith('vnp_'));
        
        if (!hasVnpayParams) {
          console.error('No VNPay parameters found');
          setStatus('failed');
          toast.error('Không tìm thấy thông tin thanh toán VNPay');
          setTimeout(() => navigate('/payment-failed', { replace: true }), 2000);
          return;
        }

        // Check VNPay response code first
        const responseCode = vnpayParams.vnp_ResponseCode;
        const transactionStatus = vnpayParams.vnp_TransactionStatus;
        
        console.log('VNPay Response Code:', responseCode);
        console.log('VNPay Transaction Status:', transactionStatus);

        if (responseCode === '00' && transactionStatus === '00') {
          // Payment successful
          setStatus('success');
          toast.success('Thanh toán VNPay thành công!');
          
          // Wait a moment then redirect to success page
          setTimeout(() => {
            navigate('/payment-success?' + searchParams.toString(), { replace: true });
          }, 1500);
        } else {
          // Payment failed
          setStatus('failed');
          const errorMessage = getVnpayErrorMessage(responseCode);
          toast.error(`Thanh toán thất bại: ${errorMessage}`);
          
          setTimeout(() => {
            navigate('/payment-failed', { 
              replace: true,
              state: { 
                error: errorMessage,
                vnpayParams 
              }
            });
          }, 2000);
        }

        // Also process through backend (for IPN simulation if needed)
        try {
          await paymentService.processVnpayCallback(vnpayParams);
        } catch (error) {
          console.warn('Backend processing warning:', error);
          // Don't fail the whole process if backend processing has issues
        }

      } catch (error) {
        console.error('VNPay callback processing error:', error);
        setStatus('failed');
        toast.error('Có lỗi xảy ra khi xử lý kết quả thanh toán');
        setTimeout(() => {
          navigate('/payment-failed', { 
            replace: true,
            state: { 
              error: error.message 
            }
          });
        }, 2000);
      }
    };

    processVnpayReturn();
  }, [navigate, searchParams]);

  const getVnpayErrorMessage = (responseCode) => {
    const errorMessages = {
      '02': 'Tài khoản không đủ số dư',
      '03': 'Thông tin tài khoản không chính xác',
      '04': 'Số tiền không hợp lệ',
      '05': 'URL không hợp lệ',
      '06': 'Tài khoản không tồn tại',
      '07': 'Ngày hết hạn không chính xác',
      '09': 'Thông tin thẻ không chính xác',
      '10': 'Thẻ đã hết hạn',
      '11': 'Thẻ chưa đăng ký dịch vụ',
      '12': 'Ngày có hiệu lực của thẻ chưa tới',
      '13': 'Thẻ bị khóa',
      '21': 'Số tiền không đủ để thanh toán',
      '22': 'Thẻ chưa được đăng ký dịch vụ internetbanking',
      '23': 'Bạn đã nhập sai thông tin thẻ quá 3 lần',
      '24': 'Khách hàng hủy giao dịch',
      '25': 'OTP không chính xác',
      '99': 'Lỗi không xác định'
    };

    return errorMessages[responseCode] || `Lỗi không xác định (${responseCode})`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'failed':
        return (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        );
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return {
          title: 'Thanh toán thành công!',
          message: 'Đang chuyển hướng đến trang kết quả...'
        };
      case 'failed':
        return {
          title: 'Thanh toán thất bại',
          message: 'Đang chuyển hướng đến trang lỗi...'
        };
      default:
        return {
          title: 'Đang xử lý thanh toán',
          message: 'Chúng tôi đang xác thực kết quả thanh toán từ VNPay. Vui lòng chờ trong giây lát...'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
        {getStatusIcon()}
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {statusInfo.title}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {statusInfo.message}
        </p>
        
        {status === 'processing' && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-xs text-blue-600">
              ⚠️ Vui lòng không đóng trình duyệt hoặc quay lại trang trước
            </p>
          </div>
        )}

        {status === 'failed' && (
          <div className="mt-4">
            <button
              onClick={() => navigate('/sti-testing')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
            >
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VnpayCallback; 