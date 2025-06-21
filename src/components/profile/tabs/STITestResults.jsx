import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import testResultService from "../../../services/testResultService";
import { useAuth } from "../../../contexts/AuthContext";
import {
  FlaskConical,
  Calendar,
  Download,
  Filter,
  X,
  Search,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Các constant cho tham số xét nghiệm STI - đồng bộ với API enum
const TEST_PARAMETERS = {
  0: { name: "Chlamydia", shortName: "CLM", icon: "🔬" },
  1: { name: "Lậu (Gonorrhoeae)", shortName: "GNR", icon: "🧫" },
  2: { name: "Giang mai (Syphilis)", shortName: "SYP", icon: "🦠" },
  3: { name: "HIV", shortName: "HIV", icon: "🧬" },
  4: { name: "Herpes", shortName: "HSV", icon: "🧪" },
  5: { name: "Viêm gan B", shortName: "HBV", icon: "💉" },
  6: { name: "Viêm gan C", shortName: "HCV", icon: "💊" },
  7: { name: "Trichomonas", shortName: "TCH", icon: "🔬" },
  8: { name: "Mycoplasma Genitalium", shortName: "MPG", icon: "🦠" },
};

// Các constant cho kết quả xét nghiệm
const OUTCOME_TYPES = {
  0: {
    label: "Âm tính",
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    icon: <CheckCircle size={14} className="mr-1" />,
  },
  1: {
    label: "Dương tính",
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    icon: <AlertCircle size={14} className="mr-1" />,
  },
  2: {
    label: "Chưa xác định",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    icon: <RefreshCw size={14} className="mr-1" />,
  },
};

function STITestResults({ userId }) {
  const { currentUser } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [uniqueTestings, setUniqueTestings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc"); // desc = mới nhất trước, asc = cũ nhất trước

  // Lấy kết quả xét nghiệm từ API
  useEffect(() => {
    const fetchTestResults = async () => {
      if (!currentUser) return;

      setIsLoading(true);
      try {
        const response = await testResultService.getAll();
        if (response?.data?.is_success) {
          console.log("API test results:", response.data.data);

          // Lấy ID của user hiện tại
          const currentUserId =
            userId ||
            (currentUser &&
              (currentUser.id || currentUser.userId || currentUser.customerId));

          if (!currentUserId) {
            console.error(
              "Cannot determine current user ID. Current user object:",
              currentUser
            );
            toast.error(
              "Không thể xác định người dùng hiện tại. Vui lòng đăng nhập lại."
            );
            setIsLoading(false);
            return;
          }

          // Lọc kết quả thuộc về user hiện tại và loại bỏ null
          const userResults = (response.data.data || [])
            .filter((result) => result !== null && result.stiTesting !== null)
            .filter((result) => {
              const isMatch = result.stiTesting?.customerId === currentUserId;
              return isMatch;
            });

          // Lọc ra các stiTesting duy nhất từ kết quả
          const uniqueStiTestings = Array.from(
            new Map(
              userResults
                .filter((r) => r.stiTesting)
                .map((result) => [result.stiTesting.id, result.stiTesting])
            ).values()
          );

          // Sắp xếp theo thời gian tạo, mới nhất lên đầu
          uniqueStiTestings.sort((a, b) =>
            sortOrder === "desc"
              ? new Date(b.createdAt) - new Date(a.createdAt)
              : new Date(a.createdAt) - new Date(b.createdAt)
          );

          // Thêm thông tin về trạng thái thanh toán
          const processedResults = userResults.map((result) => ({
            ...result,
            isPaid: result.stiTesting?.isPaid || false,
            totalPrice: result.stiTesting?.totalPrice || 0,
          }));

          setTestResults(processedResults);
          setUniqueTestings(uniqueStiTestings);
          setFilteredResults(processedResults);
        }
      } catch (error) {
        console.error("Error fetching test results:", error);
        toast.error(
          "Không thể tải dữ liệu kết quả xét nghiệm. Vui lòng thử lại sau."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestResults();
  }, [currentUser, userId, sortOrder]);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await testResultService.getAll();
      if (response?.data?.is_success) {
        const currentUserId =
          userId ||
          (currentUser &&
            (currentUser.id || currentUser.userId || currentUser.customerId));

        // Lọc kết quả thuộc về user hiện tại và loại bỏ null
        const userResults = (response.data.data || [])
          .filter((result) => result !== null && result.stiTesting !== null)
          .filter((result) => result.stiTesting?.customerId === currentUserId);

        // Lọc ra các stiTesting duy nhất
        const uniqueStiTestings = Array.from(
          new Map(
            userResults
              .filter((r) => r.stiTesting)
              .map((result) => [result.stiTesting.id, result.stiTesting])
          ).values()
        );

        // Sắp xếp theo thời gian
        uniqueStiTestings.sort((a, b) =>
          sortOrder === "desc"
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt)
        );

        // Thêm thông tin về trạng thái thanh toán
        const processedResults = userResults.map((result) => ({
          ...result,
          isPaid: result.stiTesting?.isPaid || false,
          totalPrice: result.stiTesting?.totalPrice || 0,
        }));

        setTestResults(processedResults);
        setUniqueTestings(uniqueStiTestings);
        // Áp dụng bộ lọc đang hoạt động
        applyFilters(processedResults);

        toast.success("Dữ liệu đã được cập nhật");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Không thể cập nhật dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Lọc kết quả dựa trên trạng thái và text tìm kiếm
  const applyFilters = (results) => {
    let filtered = [...results];

    // Lọc theo trạng thái
    if (filterStatus !== "all") {
      filtered = filtered.filter((result) => {
        switch (filterStatus) {
          case "positive":
            return result.outcome === 1;
          case "negative":
            return result.outcome === 0;
          case "processing":
            return result.outcome === 2;
          default:
            return true;
        }
      });
    }

    // Lọc theo khoảng thời gian
    if (isDateFilterActive && startDate && endDate) {
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999); // Đặt thời gian kết thúc là cuối ngày

      filtered = filtered.filter((result) => {
        const resultDate = new Date(result.processedAt || result.createdAt);
        return resultDate >= startDateTime && resultDate <= endDateTime;
      });
    }

    // Lọc theo text tìm kiếm
    if (searchText.trim() !== "") {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((result) => {
        const paramName =
          TEST_PARAMETERS[result.parameter]?.name || `Loại ${result.parameter}`;
        const comments = result.comments || "";

        return (
          paramName.toLowerCase().includes(searchLower) ||
          comments.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredResults(filtered);
  };

  useEffect(() => {
    applyFilters(testResults);
  }, [
    testResults,
    filterStatus,
    searchText,
    isDateFilterActive,
    startDate,
    endDate,
  ]);

  // Định dạng ngày giờ
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

  // Reset tất cả các bộ lọc
  const resetAllFilters = () => {
    setFilterStatus("all");
    setSearchText("");
    setStartDate("");
    setEndDate("");
    setIsDateFilterActive(false);
  };

  // Áp dụng bộ lọc theo ngày
  const applyDateFilter = () => {
    if (startDate && endDate) {
      setIsDateFilterActive(true);
      toast.info(
        `Đã lọc kết quả từ ${formatDate(startDate)} đến ${formatDate(endDate)}`
      );
    } else {
      toast.warning("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc");
    }
  };

  // Reset bộ lọc ngày
  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsDateFilterActive(false);
  };

  // Toggle thứ tự sắp xếp
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    toast.info(
      `Sắp xếp theo ${sortOrder === "desc" ? "cũ nhất" : "mới nhất"} trước`
    );
  };

  // Modal chi tiết kết quả xét nghiệm
  const renderDetailModal = () => {
    if (!selectedTest || !showDetailModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
        <div className="relative w-full max-w-2xl mx-auto my-6">
          <div className="relative flex flex-col w-full bg-white rounded-lg shadow-lg outline-none focus:outline-none">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">
                {TEST_PARAMETERS[selectedTest.parameter]?.icon}{" "}
                {TEST_PARAMETERS[selectedTest.parameter]?.name ||
                  `Loại xét nghiệm ${selectedTest.parameter}`}
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-900 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowDetailModal(false)}
              >
                <span className="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>

            {/* Body */}
            <div className="relative p-6 flex-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Kết quả</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                        OUTCOME_TYPES[selectedTest.outcome]?.bgColor
                      } ${OUTCOME_TYPES[selectedTest.outcome]?.color}`}
                    >
                      {OUTCOME_TYPES[selectedTest.outcome]?.icon}
                      {OUTCOME_TYPES[selectedTest.outcome]?.label ||
                        "Không xác định"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày xử lý</p>
                  <p className="text-base font-medium">
                    {formatDateTime(
                      selectedTest.processedAt || selectedTest.createdAt
                    )}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Nhận xét của bác sĩ
                </p>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                  {selectedTest.comments || "Không có nhận xét"}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Thông tin xét nghiệm
                </p>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center mb-1">
                    <span className="w-20 text-xs text-blue-700">
                      Mã xét nghiệm
                    </span>
                    <span className="text-sm font-mono bg-white px-2 py-0.5 rounded border border-blue-100">
                      {selectedTest.id.substring(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="w-20 text-xs text-blue-700">
                      Mẫu xét nghiệm
                    </span>
                    <span className="text-sm">
                      {selectedTest.sampleType || "Mẫu máu tiêu chuẩn"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 text-xs text-blue-700">
                      Phương pháp
                    </span>
                    <span className="text-sm">
                      {selectedTest.testMethod || "RT-PCR"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Khuyến nghị</p>
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-800 text-sm">
                  {selectedTest.outcome === 1 ? (
                    <div>
                      <p className="font-medium mb-1">
                        Kết quả dương tính với{" "}
                        {TEST_PARAMETERS[selectedTest.parameter]?.name}
                      </p>
                      <p>
                        Vui lòng liên hệ bác sĩ ngay để được tư vấn và điều trị
                        kịp thời. Đừng lo lắng, hầu hết các bệnh lây truyền qua
                        đường tình dục đều có thể được điều trị hiệu quả nếu
                        được phát hiện sớm.
                      </p>
                    </div>
                  ) : selectedTest.outcome === 0 ? (
                    <div>
                      <p className="font-medium mb-1">
                        Kết quả âm tính với{" "}
                        {TEST_PARAMETERS[selectedTest.parameter]?.name}
                      </p>
                      <p>
                        Tiếp tục duy trì lối sống lành mạnh và thực hiện các
                        biện pháp an toàn tình dục. Nên tái kiểm tra định kỳ 3-6
                        tháng/lần hoặc khi có triệu chứng bất thường.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium mb-1">
                        Kết quả chưa xác định với{" "}
                        {TEST_PARAMETERS[selectedTest.parameter]?.name}
                      </p>
                      <p>
                        Cần thực hiện xét nghiệm lại để có kết quả chính xác.
                        Vui lòng liên hệ với trung tâm để được hướng dẫn cụ thể.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-5 border-t border-gray-200 rounded-b">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md mr-3 hover:bg-gray-200"
                type="button"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center hover:bg-indigo-700"
                type="button"
                onClick={() => {
                  // Logic tải báo cáo chi tiết
                  toast.info("Đang chuẩn bị tải báo cáo chi tiết...");
                }}
              >
                <Download size={16} className="mr-2" />
                Tải báo cáo chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">
            Đang tải dữ liệu xét nghiệm...
          </span>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!currentUser) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-4">
            Vui lòng đăng nhập để xem kết quả xét nghiệm
          </p>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => (window.location.href = "/login")}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  // Không có kết quả xét nghiệm
  if (uniqueTestings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-medium text-gray-900">
            Kết quả xét nghiệm STI
          </h4>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
            title="Làm mới dữ liệu"
          >
            <RefreshCw
              size={16}
              className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Làm mới
          </button>
        </div>

        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FlaskConical className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-2">
            Chưa có kết quả xét nghiệm STI
          </p>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Kết quả xét nghiệm STI của bạn sẽ được hiển thị tại đây sau khi mẫu
            xét nghiệm đã được xử lý và có kết quả.
          </p>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => (window.location.href = "/sti-booking")}
          >
            Đặt lịch xét nghiệm ngay
          </button>
        </div>
      </div>
    );
  }

  // UI chính khi có dữ liệu
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium text-gray-900">
          Kết quả xét nghiệm STI
        </h4>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
          title="Làm mới dữ liệu"
        >
          <RefreshCw
            size={16}
            className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tìm kiếm xét nghiệm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <label
                htmlFor="filterStatus"
                className="text-sm font-medium text-gray-700 mr-2"
              >
                Kết quả:
              </label>
              <select
                id="filterStatus"
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="negative">Âm tính</option>
                <option value="positive">Dương tính</option>
                <option value="processing">Đang xử lý</option>
              </select>
            </div>

            <button
              onClick={toggleSortOrder}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              title={`Sắp xếp theo ${
                sortOrder === "desc" ? "cũ nhất" : "mới nhất"
              } trước`}
            >
              <svg
                className={`w-4 h-4 ${
                  sortOrder === "desc" ? "" : "transform rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Bộ lọc ngày */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Lọc theo ngày:
            </span>
          </div>

          <div className="flex flex-wrap gap-3 flex-grow">
            <div className="flex items-center gap-2">
              <label htmlFor="startDate" className="text-sm text-gray-600">
                Từ:
              </label>
              <input
                type="date"
                id="startDate"
                className="border border-gray-300 rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="endDate" className="text-sm text-gray-600">
                Đến:
              </label>
              <input
                type="date"
                id="endDate"
                className="border border-gray-300 rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="ml-auto flex gap-2">
              <button
                type="button"
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                onClick={applyDateFilter}
              >
                Áp dụng
              </button>
              {isDateFilterActive && (
                <button
                  type="button"
                  className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-100"
                  onClick={resetDateFilter}
                >
                  Đặt lại
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hiển thị bộ lọc đang hoạt động */}
        {(filterStatus !== "all" || isDateFilterActive || searchText) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filterStatus !== "all" && (
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-md">
                <span className="text-xs text-blue-700 mr-2">Kết quả:</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded flex items-center">
                  {filterStatus === "positive"
                    ? "Dương tính"
                    : filterStatus === "negative"
                    ? "Âm tính"
                    : "Đang xử lý"}
                  <button
                    onClick={() => setFilterStatus("all")}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X size={12} />
                  </button>
                </span>
              </div>
            )}

            {isDateFilterActive && (
              <div className="flex items-center bg-purple-50 px-3 py-1 rounded-md">
                <span className="text-xs text-purple-700 mr-2">Thời gian:</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded flex items-center">
                  {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                  <button
                    onClick={resetDateFilter}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    <X size={12} />
                  </button>
                </span>
              </div>
            )}

            {searchText && (
              <div className="flex items-center bg-green-50 px-3 py-1 rounded-md">
                <span className="text-xs text-green-700 mr-2">Tìm kiếm:</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded flex items-center">
                  {searchText}
                  <button
                    onClick={() => setSearchText("")}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X size={12} />
                  </button>
                </span>
              </div>
            )}

            <button
              className="flex items-center px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
              onClick={resetAllFilters}
            >
              <Filter size={12} className="mr-1" />
              Đặt lại tất cả
            </button>
          </div>
        )}
      </div>

      {/* Hiển thị các phiên xét nghiệm với kết quả của chúng */}
      <div className="space-y-6">
        {uniqueTestings.length > 0 ? (
          uniqueTestings.map((stiTesting) => (
            <div
              key={stiTesting.id}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              {/* Header with STI Testing info */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h5 className="text-lg font-medium flex items-center">
                      <Calendar size={18} className="mr-2 text-indigo-600" />
                      Phiên xét nghiệm ngày{" "}
                      {formatDate(
                        stiTesting.scheduleDate || stiTesting.createdAt
                      )}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {stiTesting.testPackage === 0
                        ? "Gói cơ bản"
                        : stiTesting.testPackage === 1
                        ? "Gói nâng cao"
                        : "Gói tùy chỉnh"}
                      {stiTesting.location && ` • ${stiTesting.location}`}
                    </p>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
                    <p className="text-sm font-bold text-gray-900">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(stiTesting.totalPrice)}
                    </p>
                    {stiTesting.isPaid ? (
                      <span className="inline-flex items-center px-2 py-1 mt-1 bg-green-100 text-green-700 text-xs rounded-full">
                        <CheckCircle size={12} className="mr-1" />
                        Đã thanh toán
                      </span>
                    ) : (
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          <AlertCircle size={12} className="mr-1" />
                          Chưa thanh toán
                        </span>
                        <button
                          onClick={() => {
                            window.location.href = `/payment?testId=${stiTesting.id}&amount=${stiTesting.totalPrice}`;
                          }}
                          className="inline-flex items-center justify-center px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Thanh toán ngay
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bảng kết quả xét nghiệm */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Loại xét nghiệm
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Kết quả
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ngày xử lý
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ghi chú
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Chi tiết
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResults
                      .filter((result) => result.stiTestingId === stiTesting.id)
                      .map((result) => {
                        const parameterInfo = TEST_PARAMETERS[
                          result.parameter
                        ] || { name: `Loại ${result.parameter}`, icon: "🔬" };
                        const outcomeInfo = OUTCOME_TYPES[result.outcome] || {
                          label: "Không xác định",
                          color: "text-gray-600",
                          bgColor: "bg-gray-100",
                        };

                        return (
                          <tr
                            key={result.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <span className="mr-2 text-lg">
                                  {parameterInfo.icon}
                                </span>
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {parameterInfo.name}
                                  </span>
                                  {parameterInfo.shortName && (
                                    <span className="ml-2 text-xs text-gray-500">
                                      ({parameterInfo.shortName})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${outcomeInfo.bgColor} ${outcomeInfo.color}`}
                              >
                                {outcomeInfo.icon}
                                {outcomeInfo.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {result.processedAt
                                ? formatDateTime(result.processedAt)
                                : "Chưa xử lý"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                              {result.comments || "Không có ghi chú"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                className="text-indigo-600 hover:text-indigo-900 font-medium text-sm underline"
                                onClick={() => {
                                  setSelectedTest(result);
                                  setShowDetailModal(true);
                                }}
                              >
                                Xem chi tiết
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Footer với thông tin tổng hợp và cảnh báo cần thiết */}
              <div className="bg-gray-50 px-4 py-3 border-t">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Tổng cộng:{" "}
                      <span className="font-medium">
                        {
                          filteredResults.filter(
                            (r) => r.stiTestingId === stiTesting.id
                          ).length
                        }{" "}
                        kết quả xét nghiệm
                      </span>
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    {filteredResults.filter(
                      (r) => r.stiTestingId === stiTesting.id && r.outcome === 1
                    ).length > 0 && (
                      <div className="flex items-center text-red-600 text-sm">
                        <AlertCircle size={16} className="mr-1" />
                        <span>Có kết quả dương tính, cần liên hệ bác sĩ!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Không tìm thấy kết quả xét nghiệm phù hợp với bộ lọc
            </p>
          </div>
        )}
      </div>

      {/* Modal chi tiết */}
      {renderDetailModal()}
    </div>
  );
}

export default STITestResults;
