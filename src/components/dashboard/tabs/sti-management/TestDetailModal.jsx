import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { X, CheckCircle, XCircle, AlertCircle } from "lucide-react";


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

// Parameters for STI tests
const parameterLabels = {
  0: "HIV",
  1: "Giang mai",
  2: "Lậu",
  3: "Chlamydia",
  4: "Viêm gan B",
  5: "Viêm gan C",
};

// Outcome for test results
const outcomeLabels = {
  0: { label: "Âm tính", color: "text-green-600" },
  1: { label: "Dương tính", color: "text-red-600" },
  2: { label: "Không xác định", color: "text-yellow-600" },
};

function TestDetailModal({ test, onClose, onStatusChange }) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Thông tin khách hàng
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Họ tên</span>
                <span className="block font-medium">
                  {test.customer?.name || "N/A"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Email</span>
                <span className="block font-medium">
                  {test.customer?.email || "N/A"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">
                  Số điện thoại
                </span>
                <span className="block font-medium">
                  {test.customer?.phoneNumber || "N/A"}
                </span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Địa chỉ</span>
                <span className="block font-medium">
                  {test.customer?.address || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Thông tin lịch hẹn
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Ngày hẹn</span>
                <span className="block font-medium">
                  {formatDate(test.scheduleDate)}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Khung giờ</span>
                <span className="block font-medium">
                  {slotLabels[test.slot] || "N/A"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Ghi chú</span>
                <span className="block font-medium">
                  {test.notes || "Không có ghi chú"}
                </span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Trạng thái</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusLabels[test.status]?.color ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusLabels[test.status]?.label || "Không xác định"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  {test.id || "N/A"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">
                  Gói xét nghiệm
                </span>
                <span className="block font-medium">
                  {testPackageLabels[test.testPackage] || "Không xác định"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">
                  Thời gian lấy mẫu
                </span>
                <span className="block font-medium">
                  {formatDateTime(test.sampleTakenAt) || "Chưa lấy mẫu"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">
                  Thời gian hoàn thành
                </span>
                <span className="block font-medium">
                  {formatDateTime(test.completedAt) || "Chưa hoàn thành"}
                </span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Giá tiền</span>
                <span className="block font-medium">
                  {formatCurrency(calculatePrice(test))}
                </span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Thanh toán</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    test.isPaid
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {test.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
            </div>
          </div>

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
                      test.status > statusValue ||
                      // Can't skip steps (except cancellation)
                      (statusValue !== 4 && statusValue > test.status + 1) ||
                      // Can't move to completed without sample
                      (statusValue === 3 && !test.sampleTakenAt);

                    return (
                      <button
                        key={value}
                        onClick={() =>
                          !isDisabled && onStatusChange(test.id, statusValue)
                        }
                        disabled={isDisabled}
                        className={`flex items-center justify-between py-2 px-4 rounded-md ${
                          test.status === statusValue
                            ? "bg-indigo-600 text-white"
                            : isDisabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{label}</span>
                        {test.status === statusValue && (
                          <CheckCircle size={18} className="text-white" />
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="text-sm text-gray-500 pt-2">
                {test.status === 0 && (
                  <p className="flex items-center">
                    <AlertCircle size={16} className="mr-1 text-blue-500" />
                    Sau khi lấy mẫu, cập nhật trạng thái để bắt đầu xử lý
                  </p>
                )}
                {test.status === 1 && (
                  <p className="flex items-center">
                    <AlertCircle size={16} className="mr-1 text-yellow-500" />
                    Tiếp tục quy trình xử lý mẫu
                  </p>
                )}
                {test.status === 2 && (
                  <p className="flex items-center">
                    <AlertCircle size={16} className="mr-1 text-purple-500" />
                    Nhập kết quả xét nghiệm để hoàn thành
                  </p>
                )}
                {test.status === 3 && (
                  <p className="flex items-center">
                    <CheckCircle size={16} className="mr-1 text-green-500" />
                    Xét nghiệm đã hoàn thành
                  </p>
                )}
                {test.status === 4 && (
                  <p className="flex items-center">
                    <XCircle size={16} className="mr-1 text-red-500" />
                    Xét nghiệm đã bị hủy
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Test Results Section */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Kết quả xét nghiệm
          </h3>

          {test.testResult && test.testResult.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông số
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kết quả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ghi chú
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên xử lý
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {test.testResult.map((result) => (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {parameterLabels[result.parameter] || "Không xác định"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block font-medium ${
                            outcomeLabels[result.outcome]?.color ||
                            "text-gray-700"
                          }`}
                        >
                          {outcomeLabels[result.outcome]?.label ||
                            "Không xác định"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {result.comments || "Không có ghi chú"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.staff?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(result.processedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500">Chưa có kết quả xét nghiệm</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
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
