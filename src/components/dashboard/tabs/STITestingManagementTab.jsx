import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Search,
  Filter,
  RefreshCcw,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Import services
import {
  getAll as getAllSTITestings,
  updateTestingStatus,
  deleteTesting as deleteSTITesting,
  getById as getSTITestingById,
} from "../../../services/stiTestingService";

// Import components for test results
import TestResultModal from "./sti-management/TestResultModal";
import TestDetailModal from "./sti-management/TestDetailModal";

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

function STITestingManagementTab() {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPackage, setFilterPackage] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(10);

  // Selected test state for operations
  const [selectedTest, setSelectedTest] = useState(null);

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Load all STI testing data
  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await getAllSTITestings();
      // API trả về cấu trúc { status_code, message, is_success, data }
      if (response?.data?.is_success && Array.isArray(response.data.data)) {
        setTests(response.data.data);
        setFilteredTests(response.data.data);
      } else {
        toast.error("Không thể tải dữ liệu xét nghiệm");
        console.log("API response:", response); // For debugging
      }
    } catch (error) {
      console.error("Error fetching STI tests:", error);
      toast.error(
        "Lỗi khi tải dữ liệu: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setLoading(false);
    }
  };

  // Load test data on component mount
  useEffect(() => {
    fetchTests();
  }, []);

  // Filter tests based on search term and filters
  useEffect(() => {
    let result = [...tests];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (test) =>
          test.customer?.name?.toLowerCase().includes(lowerSearchTerm) ||
          test.customer?.email?.toLowerCase().includes(lowerSearchTerm) ||
          test.customer?.phoneNumber?.includes(searchTerm) ||
          test.id?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      const statusValue = parseInt(filterStatus);
      result = result.filter((test) => test.status === statusValue);
    }

    // Apply package filter
    if (filterPackage !== "all") {
      const packageValue = parseInt(filterPackage);
      result = result.filter((test) => test.testPackage === packageValue);
    }

    setFilteredTests(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, filterStatus, filterPackage, tests]);

  // Pagination
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = filteredTests.slice(indexOfFirstTest, indexOfLastTest);
  const totalPages = Math.ceil(filteredTests.length / testsPerPage); // Handle opening test detail modal
  const handleViewTest = async (test) => {
    try {
      // Optionally fetch more detailed data if needed
      const response = await getSTITestingById(test.id);
      // API trả về cấu trúc { status_code, message, is_success, data }
      if (response?.data?.is_success && response.data.data) {
        setSelectedTest(response.data.data);
      } else {
        setSelectedTest(test);
      }
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching test details:", error);
      toast.error("Không thể tải chi tiết xét nghiệm");
      setSelectedTest(test); // Use existing data on error
      setIsDetailModalOpen(true);
    }
  };

  // Handle opening test result modal
  const handleManageResults = (test) => {
    setSelectedTest(test);
    setIsResultModalOpen(true);
  };

  // Handle delete confirmation modal
  const handleDeleteConfirmation = (test) => {
    setSelectedTest(test);
    setIsDeleteModalOpen(true);
  }; // Handle actual test deletion
  const handleDeleteTest = async () => {
    try {
      const response = await deleteSTITesting(selectedTest.id);
      // API trả về cấu trúc { status_code, message, is_success, data }
      if (response?.data?.is_success) {
        toast.success("Xét nghiệm đã được xóa thành công");
        fetchTests(); // Refresh the list
      } else {
        toast.error(
          "Không thể xóa xét nghiệm: " +
            (response?.data?.message || "Lỗi không xác định")
        );
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      toast.error(
        "Lỗi khi xóa xét nghiệm: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setIsDeleteModalOpen(false);
    }
  }; // Handle status change
  const handleStatusChange = async (testId, newStatus) => {
    try {
      console.log(
        "Updating status for test:",
        testId,
        "New status value:",
        newStatus
      );

      // Call updateTestingStatus with the new status
      const response = await updateTestingStatus(testId, newStatus);

      // API response structure: { status_code, message, is_success, data }
      console.log("API Response:", response);

      if (response?.data?.is_success) {
        toast.success("Trạng thái đã được cập nhật thành công");
        fetchTests(); // Refresh the list
      } else {
        console.error("API returned error:", response?.data);
        toast.error(
          "Không thể cập nhật trạng thái: " +
            (response?.data?.message || "Lỗi không xác định")
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);

      // Log detailed error information for debugging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        // Show more specific error message from the API if available
        if (error.response.data && error.response.data.message) {
          toast.error(`Lỗi: ${error.response.data.message}`);
          return;
        }
      }

      toast.error(
        "Lỗi khi cập nhật trạng thái: " +
          (error.message || "Lỗi không xác định")
      );
    }
  };

  // Test result updated callback
  const handleTestResultUpdated = () => {
    fetchTests(); // Refresh the list
    setIsResultModalOpen(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Quản lý xét nghiệm STI
        </h2>
        <button
          onClick={fetchTests}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150"
        >
          <RefreshCcw size={16} className="mr-2" />
          Làm mới
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex gap-4">
          <div className="w-48 relative">
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(statusLabels).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="w-48 relative">
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              value={filterPackage}
              onChange={(e) => setFilterPackage(e.target.value)}
            >
              <option value="all">Tất cả gói</option>
              {Object.entries(testPackageLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Không tìm thấy kết quả phù hợp</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gói xét nghiệm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày hẹn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khung giờ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {test.customer?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {test.customer?.email || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {test.customer?.phoneNumber || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {testPackageLabels[test.testPackage] || "Không xác định"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(test.scheduleDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {slotLabels[test.slot] || "Không xác định"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusLabels[test.status]?.color ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusLabels[test.status]?.label || "Không xác định"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        test.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {test.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewTest(test)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleManageResults(test)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Quản lý kết quả"
                        disabled={test.status < 1} // Only enabled after sample is taken
                      >
                        <Edit
                          size={18}
                          className={test.status < 1 ? "opacity-50" : ""}
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirmation(test)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                        disabled={test.status > 0} // Only enabled if not yet processed
                      >
                        <Trash2
                          size={18}
                          className={test.status > 0 ? "opacity-50" : ""}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredTests.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">{indexOfFirstTest + 1}</span>{" "}
            đến{" "}
            <span className="font-medium">
              {Math.min(indexOfLastTest, filteredTests.length)}
            </span>{" "}
            trong <span className="font-medium">{filteredTests.length}</span>{" "}
            kết quả
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Trước
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              // Show 5 pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Tiếp
            </button>
          </div>
        </div>
      )}

      {/* Test Detail Modal */}
      {isDetailModalOpen && selectedTest && (
        <TestDetailModal
          test={selectedTest}
          onClose={() => setIsDetailModalOpen(false)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Test Result Modal */}
      {isResultModalOpen && selectedTest && (
        <TestResultModal
          test={selectedTest}
          onClose={() => setIsResultModalOpen(false)}
          onTestResultUpdated={handleTestResultUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Xác nhận xóa
            </h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa xét nghiệm của khách hàng{" "}
              <span className="font-medium">
                {selectedTest.customer?.name || "N/A"}
              </span>
              ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteTest}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default STITestingManagementTab;
