import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { X, CheckCircle, XCircle, Clipboard, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import stiTestingService from "../../../../services/stiTestingService";

const slotLabels = {
  0: "Sáng (8:00 - 12:00)",
  1: "Chiều (13:00 - 17:00)",
  2: "Tối (17:00 - 21:00)",
};

const testPackageLabels = {
  0: "Gói Cơ Bản",
  1: "Gói Nâng Cao",
  2: "Gói Tùy Chọn",
};

const statusLabels = {
  0: { label: "Đã lên lịch", color: "bg-blue-100 text-blue-800" },
  1: { label: "Đã lấy mẫu", color: "bg-yellow-100 text-yellow-800" },
  2: { label: "Đang xử lý", color: "bg-purple-100 text-purple-800" },
  3: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
  4: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
};

function TestDetailModal({
  test: initialTest,
  onClose,
  onStatusChange,
  onShowResults,
}) {
  const [currentTest, setCurrentTest] = useState(initialTest);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setCurrentTest(initialTest);
  }, [initialTest]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return "N/A";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "HH:mm - dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return "N/A";
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculatePrice = (test) => {
    if (test.totalPrice) return test.totalPrice;

    // Default prices if not specified
    const packagePrices = {
      0: 450000, // Basic
      1: 950000, // Advanced
      2: 0, // Custom - calculated based on parameters
    };

    if (test.testPackage !== 2) {
      return packagePrices[test.testPackage] || 0;
    } else {
      // For custom package, calculate based on selected parameters
      const parameterPrice = 150000; // Price per parameter
      const parameterCount = test.testResult?.length || 0;
      return parameterCount * parameterPrice;
    }
  };

  // Hàm để tải lại dữ liệu xét nghiệm từ server
  const refreshTestData = async () => {
    if (!currentTest?.id) return;

    setIsRefreshing(true);
    try {
      const response = await stiTestingService.getSTITestingById(
        currentTest.id
      );
      if (response?.is_success) {
        setCurrentTest(response.data);
        toast.success("Đã cập nhật thông tin xét nghiệm");
      } else {
        toast.warning("Không thể tải lại thông tin xét nghiệm");
      }
    } catch (error) {
      console.error("Error refreshing test data:", error);
      toast.error("Lỗi khi tải lại thông tin xét nghiệm");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Hàm xử lý khi thay đổi trạng thái
  const handleStatusChange = async (testId, newStatus) => {
    try {
      const response = await stiTestingService.updateSTITestingStatus(
        testId,
        newStatus
      );

      if (response.is_success) {
        // Cập nhật dữ liệu local nếu cần
        // ...

        toast.success("Cập nhật trạng thái thành công");
        return { success: true, data: response.data };
      } else {
        toast.error(
          `Lỗi: ${response.message || "Không thể cập nhật trạng thái"}`
        );
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Lỗi khi cập nhật trạng thái");
      return { success: false, error: error.message };
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Chi tiết xét nghiệm STI
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation buttons with refresh button */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="text-lg font-medium">Thông tin chi tiết</h3>
            <button
              onClick={refreshTestData}
              disabled={isRefreshing}
              className="ml-2 text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50"
              title="Tải lại thông tin"
            >
              <RefreshCw
                size={18}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
          <button
            onClick={() => onShowResults(currentTest)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            <Clipboard size={18} className="mr-2" />
            Xem kết quả xét nghiệm
          </button>
        </div>

        {/* Thông tin chi tiết - Sử dụng currentTest thay vì test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Thông tin khách hàng
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Họ tên</span>
                <span className="block font-medium">
                  {currentTest.customer?.name || "N/A"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Email</span>
                <span className="block font-medium">
                  {currentTest.customer?.email || "N/A"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">
                  Số điện thoại
                </span>
                <span className="block font-medium">
                  {currentTest.customer?.phoneNumber || "N/A"}
                </span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Địa chỉ</span>
                <span className="block font-medium">
                  {currentTest.customer?.address || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Appointment information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Thông tin lịch hẹn
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Ngày hẹn</span>
                <span className="block font-medium">
                  {formatDate(currentTest.scheduleDate)}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Khung giờ</span>
                <span className="block font-medium">
                  {slotLabels[currentTest.slot] || "N/A"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Ghi chú</span>
                <span className="block font-medium">
                  {currentTest.notes || "Không có ghi chú"}
                </span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Trạng thái</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusLabels[currentTest.status]?.color ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusLabels[currentTest.status]?.label || "Không xác định"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Test information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Thông tin xét nghiệm
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-3">
                <span className="block text-sm text-gray-500">
                  ID xét nghiệm
                </span>
                <span className="block font-medium break-all">
                  {currentTest.id || "N/A"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">
                  Gói xét nghiệm
                </span>
                <span className="block font-medium">
                  {testPackageLabels[currentTest.testPackage] ||
                    "Không xác định"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">
                  Thời gian lấy mẫu
                </span>
                <span className="block font-medium">
                  {formatDateTime(currentTest.sampleTakenAt) || "Chưa lấy mẫu"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">
                  Thời gian hoàn thành
                </span>
                <span className="block font-medium">
                  {formatDateTime(currentTest.completedAt) || "Chưa hoàn thành"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Giá tiền</span>
                <span className="block font-medium">
                  {formatCurrency(calculatePrice(currentTest))}
                </span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Thanh toán</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    currentTest.isPaid
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentTest.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
            </div>
          </div>

          {/* Status management - Sử dụng handleStatusChange mới */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Quản lý trạng thái
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <p className="text-sm text-gray-700">
                Cập nhật trạng thái xét nghiệm
              </p>

              <div className="grid grid-cols-1 gap-2">
                {Object.entries(statusLabels).map(
                  ([value, { label, color }]) => {
                    const statusValue = parseInt(value);
                    // Disable status if it's not a valid transition
                    const isDisabled =
                      // Can't go back to previous states
                      currentTest.status > statusValue ||
                      // Can't skip steps (except cancellation)
                      (statusValue !== 4 &&
                        statusValue > currentTest.status + 1) ||
                      // Can't move to completed without sample
                      (statusValue === 3 && !currentTest.sampleTakenAt);

                    return (
                      <button
                        key={value}
                        onClick={() =>
                          !isDisabled &&
                          handleStatusChange(currentTest.id, statusValue)
                        }
                        disabled={isDisabled}
                        className={`flex items-center justify-between py-2 px-4 rounded-md ${
                          currentTest.status === statusValue
                            ? "bg-indigo-600 text-white"
                            : isDisabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{label}</span>
                        {currentTest.status === statusValue && (
                          <CheckCircle size={18} className="text-white" />
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Thông báo theo trạng thái - thay test bằng currentTest */}
              <div className="text-sm text-gray-500 pt-2">
                {currentTest.status === 0 && (
                  <p className="flex items-center">
                    <span className="mr-1 text-blue-500">ℹ️</span>
                    Sau khi lấy mẫu, cập nhật trạng thái để bắt đầu xử lý
                  </p>
                )}
                {currentTest.status === 1 && (
                  <p className="flex items-center">
                    <span className="mr-1 text-yellow-500">⚠️</span>
                    Tiếp tục quy trình xử lý mẫu
                  </p>
                )}
                {currentTest.status === 2 && (
                  <p className="flex items-center">
                    <span className="mr-1 text-purple-500">🔍</span>
                    Nhập kết quả xét nghiệm để hoàn thành
                  </p>
                )}
                {currentTest.status === 3 && (
                  <p className="flex items-center">
                    <span className="mr-1 text-green-500">✓</span>
                    Xét nghiệm đã hoàn thành
                  </p>
                )}
                {currentTest.status === 4 && (
                  <p className="flex items-center">
                    <span className="mr-1 text-red-500">✗</span>
                    Xét nghiệm đã bị hủy
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestDetailModal;
