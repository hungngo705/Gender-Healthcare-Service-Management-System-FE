import { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  Search,
  ArrowDown,
  ArrowUp,
  Download,
  CreditCard as CardIcon,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import paymentService from "../../../services/paymentService";
import tokenHelper from "../../../utils/tokenHelper";
import LoadingSpinner from "../../ui/LoadingSpinner";
import Pagination from "../../ui/Pagination";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function PaymentsTab() {
  const navigate = useNavigate();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStats, setPaymentStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    totalSuccessfulAmount: 0,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setIsLoading(true);
        const userId = tokenHelper.getUserIdFromToken();

        if (!userId) {
          throw new Error("Không thể lấy thông tin người dùng");
        }

        // Gọi API lấy lịch sử thanh toán
        const response = await paymentService.getCustomerPaymentHistory(userId);

        if (response.success) {
          // Cập nhật dữ liệu lịch sử thanh toán
          setPaymentHistory(response.data.paymentHistory || []);

          // Cập nhật thống kê thanh toán
          setPaymentStats({
            totalTransactions: response.data.totalTransactions || 0,
            totalAmount: response.data.totalAmount || 0,
            totalSuccessfulAmount: response.data.totalSuccessfulAmount || 0,
          });
        } else {
          throw new Error(response.error || "Không thể tải lịch sử thanh toán");
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
        setError(error.message || "Đã xảy ra lỗi khi tải lịch sử thanh toán");
        toast.error("Không thể tải lịch sử thanh toán");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  // Reset lại trang hiện tại khi tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Hàm sort lịch sử thanh toán
  const handleSort = (field) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  // Hàm lọc lịch sử thanh toán theo từ khóa
  const filteredPayments = paymentHistory.filter(
    (payment) =>
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderInfo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.testPackage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.testingStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paymentService
        .getPaymentMethodDisplayName(payment.paymentMethod)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Sắp xếp danh sách thanh toán
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortField === "date") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (sortField === "amount") {
      return sortDirection === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }

    if (sortField === "status") {
      return sortDirection === "asc"
        ? a.status - b.status
        : b.status - a.status;
    }

    if (sortField === "testPackage") {
      return sortDirection === "asc"
        ? (a.testPackage || "").localeCompare(b.testPackage || "")
        : (b.testPackage || "").localeCompare(a.testPackage || "");
    }

    // Mặc định sort theo ngày
    return sortDirection === "asc"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Tính toán phân trang
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = sortedPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hàm xử lý xem chi tiết thanh toán
  const handleViewDetails = (transactionId) => {
    navigate(`/payment/receipt/${transactionId}`);
  };

  // Hàm xử lý tải xuống lịch sử thanh toán
  const handleDownloadHistory = () => {
    toast.info("Đang chuẩn bị tải xuống lịch sử thanh toán...");
    // Triển khai chức năng tải xuống sau
  };

  // Hàm định dạng ngày tháng
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

  // Hàm định dạng ngày lịch hẹn (không hiển thị giờ)
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

  // Lấy class CSS tương ứng với trạng thái thanh toán
  const getStatusClass = (statusCode) => {
    const statusClasses = {
      0: "bg-yellow-100 text-yellow-800", // Đang xử lý
      1: "bg-green-100 text-green-800", // Thành công
      2: "bg-red-100 text-red-800", // Thất bại
    };
    return statusClasses[statusCode] || "bg-gray-100 text-gray-800";
  };

  // Lấy tên hiển thị cho trạng thái thanh toán
  const getStatusDisplayName = (statusCode) => {
    const statusNames = {
      0: "Đang xử lý",
      1: "Thành công",
      2: "Thất bại",
    };
    return statusNames[statusCode] || "Không xác định";
  };

  // Lấy tên hiển thị cho trạng thái xét nghiệm
  const getTestingStatusClass = (status) => {
    const statusClasses = {
      Scheduled: "bg-blue-100 text-blue-800",
      InProgress: "bg-indigo-100 text-indigo-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-800";
  };

  // Lấy tên hiển thị cho trạng thái xét nghiệm bằng tiếng Việt
  const getTestingStatusName = (status) => {
    const statusNames = {
      Scheduled: "Đã đặt lịch",
      InProgress: "Đang xử lý",
      Completed: "Hoàn thành",
      Cancelled: "Đã hủy",
    };
    return statusNames[status] || status || "Không xác định";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Thống kê thanh toán */}
      <div className="mb-6 border-b pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tổng quan thanh toán
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-md">
                <CardIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-indigo-700">Tổng giao dịch</p>
                <p className="text-xl font-semibold text-indigo-900">
                  {paymentStats.totalTransactions} giao dịch
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-green-700">Thanh toán thành công</p>
                <p className="text-xl font-semibold text-green-900">
                  {paymentService.formatCurrency(
                    paymentStats.totalSuccessfulAmount
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-purple-700">Tổng số tiền</p>
                <p className="text-xl font-semibold text-purple-900">
                  {paymentService.formatCurrency(paymentStats.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-medium text-gray-800">
            Lịch sử thanh toán
          </h4>

          {/* Tìm kiếm */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Tìm kiếm giao dịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Hiển thị lịch sử thanh toán */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-6 bg-red-50 rounded-lg text-red-700">
            <p>{error}</p>
          </div>
        ) : sortedPayments.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <Calendar size={36} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      onClick={() => handleSort("date")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        Ngày giao dịch
                        {sortField === "date" &&
                          (sortDirection === "asc" ? (
                            <ArrowUp className="ml-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="ml-1 h-3 w-3" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã giao dịch
                    </th>
                    <th
                      onClick={() => handleSort("testPackage")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        Gói xét nghiệm
                        {sortField === "testPackage" &&
                          (sortDirection === "asc" ? (
                            <ArrowUp className="ml-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="ml-1 h-3 w-3" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày hẹn
                    </th>
                    <th
                      onClick={() => handleSort("amount")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        Số tiền
                        {sortField === "amount" &&
                          (sortDirection === "asc" ? (
                            <ArrowUp className="ml-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="ml-1 h-3 w-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("status")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        Trạng thái
                        {sortField === "status" &&
                          (sortDirection === "asc" ? (
                            <ArrowUp className="ml-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="ml-1 h-3 w-3" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái xét nghiệm
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chi tiết
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPayments.map((payment) => (
                    <tr
                      key={payment.transactionId}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {payment.transactionReference || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.testPackage || "Không xác định"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatScheduleDate(payment.scheduleDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {paymentService.formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                            payment.status
                          )}`}
                        >
                          {getStatusDisplayName(payment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTestingStatusClass(
                            payment.testingStatus
                          )}`}
                        >
                          {getTestingStatusName(payment.testingStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            handleViewDetails(payment.transactionId)
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer cho bảng với phân trang */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm text-gray-500 gap-4">
              <p>
                Hiển thị {currentPayments.length} / {sortedPayments.length} giao
                dịch
              </p>

              {/* Phân trang */}
              <Pagination
                postsPerPage={paymentsPerPage}
                totalPosts={sortedPayments.length}
                paginate={paginate}
                currentPage={currentPage}
              />

              <button
                onClick={handleDownloadHistory}
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <Download className="h-4 w-4 mr-1" />
                Tải lịch sử giao dịch
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default PaymentsTab;
