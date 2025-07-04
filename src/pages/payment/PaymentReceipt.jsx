import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  Clock,
  User,
  FileText,
  Check,
  Download,
  Share2,
  AlertTriangle,
  Package,
  CheckCircle,
  X,
  PenSquare,
  MapPin,
  Hash,
} from "lucide-react";
import paymentService from "../../services/paymentService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function PaymentReceipt() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        // Sử dụng API getPaymentTransaction thay vì getTransactionDetails
        const response = await paymentService.getPaymentTransaction(
          transactionId
        );

        if (response.success) {
          console.log("Transaction details:", response.data);
          setTransaction(response.data);
        } else {
          setError(response.error || "Không thể tải thông tin giao dịch");
          toast.error("Không thể tải thông tin giao dịch");
        }
      } catch (err) {
        console.error("Error fetching transaction details:", err);
        setError("Đã xảy ra lỗi khi tải thông tin giao dịch");
        toast.error("Đã xảy ra lỗi khi tải thông tin giao dịch");
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) {
      fetchTransactionDetails();
    }
  }, [transactionId]);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Không xác định";
      const date = parseISO(dateString);
      return format(date, "HH:mm, dd MMMM yyyy", { locale: vi });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return dateString || "Không xác định";
    }
  };

  // Format cho ngày lịch hẹn (không hiển thị giờ)
  const formatScheduleDate = (dateString) => {
    try {
      if (!dateString) return "Không xác định";
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy", { locale: vi });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return dateString || "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      0: "text-yellow-600", // Đang xử lý
      1: "text-green-600", // Thành công
      2: "text-red-600", // Thất bại
    };
    return statusColors[status] || "text-gray-600";
  };

  const getStatusName = (status) => {
    const statusNames = {
      0: "Đang xử lý",
      1: "Thành công",
      2: "Thất bại",
    };
    return statusNames[status] || "Không xác định";
  };

  const getTestingStatusName = (status) => {
    const statusNames = {
      0: "Đã đặt lịch",
      1: "Đang xử lý",
      2: "Hoàn thành",
      3: "Đã hủy",
    };
    return statusNames[status] || "Không xác định";
  };

  const getTestPackageName = (packageId) => {
    const packages = {
      0: "Gói cơ bản",
      1: "Gói nâng cao",
      2: "Gói toàn diện",
      3: "Gói tùy chỉnh",
    };
    return packages[packageId] || "Gói xét nghiệm";
  };

  const getSlotTime = (slot) => {
    const slots = {
      0: "8:00 - 9:00",
      1: "9:00 - 10:00",
      2: "10:00 - 11:00",
      3: "13:00 - 14:00",
      4: "14:00 - 15:00",
      5: "15:00 - 16:00",
    };
    return slots[slot] || "Không xác định";
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.info("Chức năng tải xuống PDF đang được phát triển");
  };

  const handleShare = () => {
    toast.info("Chức năng chia sẻ đang được phát triển");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg mt-10 mb-20">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-red-700">
            Không thể tải thông tin giao dịch
          </h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg mt-10 mb-20">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold text-yellow-700">
            Không tìm thấy thông tin giao dịch
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Lấy thông tin xét nghiệm từ dữ liệu API
  const stiTesting = transaction.stiTesting || {};

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gray-50 print:bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Container chính với nội dung */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 bg-white shadow-md print:shadow-none my-0 rounded-lg">
        {/* Header với nút quay lại và các chức năng */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FileText className="mr-2 h-4 w-4" />
              In
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Tải PDF
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Chia sẻ
            </button>
          </div>
        </div>

        {/* Tiêu đề hóa đơn */}
        <div className="text-center border-b pb-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Biên lai thanh toán
          </h1>
          <p className="text-gray-500 mt-1">
            Mã giao dịch: {transaction.transactionId || transaction.id}
          </p>
          <div className={`mt-2 ${getStatusColor(transaction.status)}`}>
            <span className="inline-flex items-center">
              {transaction.status === 1 && <Check className="mr-1 h-4 w-4" />}
              {transaction.status === 2 && (
                <AlertTriangle className="mr-1 h-4 w-4" />
              )}
              {getStatusName(transaction.status)}
            </span>
          </div>
          {transaction.responseCode && (
            <p className="text-xs text-gray-500 mt-2">
              Mã phản hồi: {transaction.responseCode}
            </p>
          )}
        </div>

        {/* Thông tin chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Thông tin thanh toán
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Phương thức thanh toán
                  </p>
                  <p className="text-base text-gray-900">
                    {paymentService.getPaymentMethodDisplayName(
                      transaction.paymentMethod
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Ngày giao dịch
                  </p>
                  <p className="text-base text-gray-900">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Cập nhật lần cuối
                  </p>
                  <p className="text-base text-gray-900">
                    {transaction.updatedAt
                      ? formatDate(transaction.updatedAt)
                      : "Chưa có cập nhật"}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Hash className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Mã giao dịch hệ thống
                  </p>
                  <p className="text-base text-gray-900 font-mono">
                    {transaction.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Thông tin xét nghiệm
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <Package className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Gói xét nghiệm
                  </p>
                  <p className="text-base text-gray-900">
                    {getTestPackageName(stiTesting.testPackage)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Ngày hẹn xét nghiệm
                  </p>
                  <p className="text-base text-gray-900">
                    {formatScheduleDate(stiTesting.scheduleDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Khung giờ</p>
                  <p className="text-base text-gray-900">
                    {getSlotTime(stiTesting.slot)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Trạng thái xét nghiệm
                  </p>
                  <p className="text-base text-gray-900">
                    {getTestingStatusName(stiTesting.status)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="border rounded-md p-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Chi tiết thanh toán
          </h2>
          <div className="divide-y divide-gray-200">
            <div className="py-3 flex justify-between">
              <span className="text-gray-600">
                {getTestPackageName(stiTesting.testPackage)}
              </span>
              <span className="font-medium text-gray-900">
                {paymentService.formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-gray-600">Giảm giá</span>
              <span className="font-medium text-gray-900">0 ₫</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-gray-900 font-medium">Tổng cộng</span>
              <span className="font-bold text-xl text-indigo-600">
                {paymentService.formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Thông tin trạng thái thanh toán */}
        <div className="bg-gray-50 rounded-md p-4 mb-8">
          <h3 className="font-medium text-gray-900 mb-2">Trạng thái</h3>

          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`p-2 rounded-full ${
                transaction.status === 1
                  ? "bg-green-100"
                  : transaction.status === 2
                  ? "bg-red-100"
                  : "bg-yellow-100"
              }`}
            >
              {transaction.status === 1 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : transaction.status === 2 ? (
                <X className="h-5 w-5 text-red-600" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-600" />
              )}
            </div>

            <div>
              <p
                className={`font-medium ${
                  transaction.status === 1
                    ? "text-green-700"
                    : transaction.status === 2
                    ? "text-red-700"
                    : "text-yellow-700"
                }`}
              >
                {getStatusName(transaction.status)}
              </p>
              <p className="text-sm text-gray-600">
                {transaction.status === 1
                  ? "Thanh toán đã được xử lý thành công"
                  : transaction.status === 2
                  ? "Thanh toán thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ"
                  : "Thanh toán đang chờ xử lý"}
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-sm">
            {transaction.orderInfo ||
              "Không có ghi chú bổ sung cho giao dịch này."}
          </p>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-start mb-3">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
              <p className="text-sm text-gray-700">
                {stiTesting.isPaid
                  ? "Đã thanh toán đầy đủ cho dịch vụ xét nghiệm"
                  : "Thanh toán đang được xử lý"}
              </p>
            </div>

            <p className="text-xs text-gray-500">
              Vui lòng giữ biên lai này làm bằng chứng thanh toán. Nếu bạn có
              bất kỳ câu hỏi nào, hãy liên hệ với bộ phận hỗ trợ khách hàng của
              chúng tôi.
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Mã xét nghiệm: {stiTesting.id}
            </p>
          </div>
        </div>

        {/* Ghi chú của khách hàng */}
        {stiTesting.notes && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-900">
              Ghi chú của bạn
            </h3>
            <p className="mt-1 text-sm text-gray-600">{stiTesting.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-gray-500 print:hidden">
        &copy; {new Date().getFullYear()} Gender Healthcare - Tất cả các quyền
        được bảo lưu
      </div>
    </motion.div>
  );
}

export default PaymentReceipt;
