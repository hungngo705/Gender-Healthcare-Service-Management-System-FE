import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PaymentFailed = () => {
  const location = useLocation();
  const error = location.state?.error;
  const vnpayParams = location.state?.vnpayParams;

  // Get error details from VNPay parameters if available
  const getErrorMessage = () => {
    if (vnpayParams?.vnp_ResponseCode) {
      const responseCode = vnpayParams.vnp_ResponseCode;
      
      const errorMessages = {
        '02': 'Tài khoản của quý khách không đủ số dư để thực hiện giao dịch',
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
        '22': 'Thẻ chưa được đăng ký dịch vụ internetbanking tại ngân hàng',
        '23': 'Bạn đã nhập sai thông tin thẻ quá 3 lần',
        '24': 'Khách hàng hủy giao dịch',
        '25': 'OTP không chính xác',
        '99': 'Lỗi không xác định'
      };

      return errorMessages[responseCode] || 'Giao dịch không thành công';
    }

    return error || 'Thanh toán thất bại';
  };

  const getRetryRecommendation = () => {
    if (vnpayParams?.vnp_ResponseCode) {
      const responseCode = vnpayParams.vnp_ResponseCode;
      
      if (['02', '21'].includes(responseCode)) {
        return 'Vui lòng kiểm tra số dư tài khoản và thử lại';
      } else if (['03', '06', '09', '10', '13'].includes(responseCode)) {
        return 'Vui lòng kiểm tra thông tin thẻ/tài khoản và thử lại';
      } else if (responseCode === '24') {
        return 'Bạn có thể thử thanh toán lại hoặc chọn phương thức thanh toán khác';
      }
    }
    
    return 'Bạn có thể thử lại hoặc chọn phương thức thanh toán khác';
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-red-500 p-4 flex items-center justify-center">
          <svg
            className="h-12 w-12 text-white mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Thanh Toán Thất Bại
          </h3>

          <p className="text-gray-600 text-center mb-6">
            Rất tiếc, giao dịch của bạn không thể hoàn tất.
          </p>

          {/* Error Details */}
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400 mr-2 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm text-red-700 font-medium">
                  Lý do thất bại:
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {getErrorMessage()}
                </p>
                <p className="text-xs text-red-600 mt-2">
                  {getRetryRecommendation()}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Details (if available) */}
          {vnpayParams && (
            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <h4 className="font-medium text-gray-800 mb-3">Thông tin giao dịch</h4>
              <div className="space-y-2 text-sm">
                {vnpayParams.vnp_TxnRef && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="text-gray-900 font-mono">{vnpayParams.vnp_TxnRef}</span>
                  </div>
                )}
                {vnpayParams.vnp_Amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="text-gray-900">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(parseInt(vnpayParams.vnp_Amount) / 100)}
                    </span>
                  </div>
                )}
                {vnpayParams.vnp_ResponseCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã lỗi:</span>
                    <span className="text-red-600 font-mono">{vnpayParams.vnp_ResponseCode}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="text-gray-900">
                    {new Date().toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Help Information */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <div className="flex">
              <svg
                className="h-5 w-5 text-blue-400 mr-2 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Các bước bạn có thể thực hiện:
                </p>
                <ul className="text-xs text-blue-600 mt-1 list-disc list-inside space-y-1">
                  <li>Kiểm tra lại thông tin thẻ/tài khoản ngân hàng</li>
                  <li>Đảm bảo có đủ số dư trong tài khoản</li>
                  <li>Thử lại với phương thức thanh toán khác</li>
                  <li>Liên hệ ngân hàng nếu vấn đề liên quan đến thẻ</li>
                  <li>Liên hệ hotline của chúng tôi để được hỗ trợ</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/sti-testing"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                Thử lại thanh toán
              </Link>

              <Link
                to="/contact"
                className="bg-white hover:bg-gray-100 text-indigo-600 font-medium py-2 px-4 border border-indigo-600 rounded transition-colors duration-200"
              >
                Liên hệ hỗ trợ
              </Link>

              <Link
                to="/"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                Về trang chủ
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Cần hỗ trợ? Liên hệ hotline:{" "}
                <a href="tel:1900123456" className="text-indigo-600 hover:text-indigo-800">
                  1900 123 456
                </a>
                {" "}hoặc email:{" "}
                <a href="mailto:support@everwell.com" className="text-indigo-600 hover:text-indigo-800">
                  support@everwell.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed; 