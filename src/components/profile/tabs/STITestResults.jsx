/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import stiTestingService from "../../../services/stiTestingService";
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
  FilePlus,
  AlertTriangle,
  BugPlay,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
// Import các enum chung
import { PARAMETER_ENUM, OUTCOME_ENUM } from "../../../constants/enums";

// Sử dụng enum chung
const TEST_PARAMETERS = PARAMETER_ENUM;

// Sử dụng enum chung
const OUTCOME_TYPES = OUTCOME_ENUM;

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
  const [sortOrder, setSortOrder] = useState("desc");
  const [apiError, setApiError] = useState(null);
  const [debugMode, setDebugMode] = useState(false); // Chế độ debug để xem thông tin API raw
  const [expandedTestings, setExpandedTestings] = useState({}); // Theo dõi các phiên đang mở

  // Hàm toggle được di chuyển ra đây - ngoài fetchTestData
  const toggleTesting = (testingId) => {
    console.log("Toggling testing:", testingId);
    setExpandedTestings((prev) => {
      const newState = {
        ...prev,
        [testingId]: !prev[testingId],
      };
      console.log("New expanded state:", newState);
      return newState;
    });
  };

  // useEffect để khởi tạo trạng thái đóng/mở (di chuyển ra khỏi fetchTestData)
  useEffect(() => {
    if (uniqueTestings.length > 0) {
      const initialExpandState = {};
      uniqueTestings.forEach((testing) => {
        // Mặc định mở phiên đầu tiên, các phiên khác đóng
        initialExpandState[testing.id] = uniqueTestings.indexOf(testing) === 0;
      });
      console.log("Initial expand state:", initialExpandState);
      setExpandedTestings(initialExpandState);
    }
  }, [uniqueTestings]);

  // Hàm xử lý lấy dữ liệu từ API
  useEffect(() => {
    const fetchTestData = async () => {
      if (!currentUser) return;

      setIsLoading(true);
      setApiError(null);

      try {
        console.log("Đang gọi API lấy danh sách phiên xét nghiệm...");

        // Lấy danh sách phiên xét nghiệm STI
        const response = await stiTestingService.getForCustomer();

        // Debug: Log raw response
        console.log("Raw API response:", response);

        // Kiểm tra xem response có đúng cấu trúc không
        if (!response) {
          throw new Error("Không nhận được phản hồi từ API");
        }

        // Kiểm tra lỗi unauthorized
        if (response.status === 401) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          setApiError({
            type: "AUTH_ERROR",
            message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
          });
          setIsLoading(false);
          return;
        }

        // Kiểm tra dữ liệu trả về
        let testingsData = [];

        // Kiểm tra 3 trường hợp response structure
        if (response.data && Array.isArray(response.data)) {
          // Trường hợp 1: response.data là array
          console.log("Dữ liệu API trả về dạng array trực tiếp");
          testingsData = response.data;
        } else if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          // Trường hợp 2: response.data.data là array
          console.log("Dữ liệu API trả về trong response.data.data");
          testingsData = response.data.data;
        } else if (
          response.data &&
          response.data.is_success &&
          Array.isArray(response.data.data)
        ) {
          // Trường hợp 3: response.data.is_success & response.data.data là array
          console.log("Dữ liệu API trả về dạng standard với is_success");
          testingsData = response.data.data;
        } else {
          // Không tìm thấy dữ liệu ở định dạng phù hợp
          console.error(
            "Không tìm thấy dữ liệu ở định dạng mong đợi:",
            response
          );
          setApiError({
            type: "DATA_FORMAT_ERROR",
            message: "Định dạng dữ liệu không đúng",
            response: response,
          });

          // Kiểm tra nếu empty array
          if (
            (response.data &&
              Array.isArray(response.data) &&
              response.data.length === 0) ||
            (response.data &&
              response.data.data &&
              Array.isArray(response.data.data) &&
              response.data.data.length === 0)
          ) {
            console.log("API trả về mảng rỗng - không có phiên xét nghiệm");
            // Mảng rỗng là hợp lệ, không phải lỗi
            testingsData = [];
          } else {
            toast.warning(
              "Định dạng dữ liệu từ máy chủ không đúng như mong đợi"
            );
          }
        }

        // Xử lý dữ liệu phiên xét nghiệm
        console.log("Số lượng phiên xét nghiệm tìm thấy:", testingsData.length);
        processTestData(testingsData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu xét nghiệm:", error);

        setApiError({
          type: "FETCH_ERROR",
          message: error.message || "Lỗi không xác định khi tải dữ liệu",
          error: error,
        });

        // Thông báo lỗi
        if (error.response) {
          console.error("Chi tiết lỗi response:", error.response);
          if (error.response.status === 401) {
            toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
          } else {
            toast.error(`Lỗi từ máy chủ: ${error.response.status}`);
          }
        } else if (error.request) {
          toast.error(
            "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng."
          );
        } else {
          toast.error(`Lỗi: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Hàm xử lý dữ liệu phiên xét nghiệm
    const processTestData = (testingsData) => {
      try {
        // Lọc các phiên xét nghiệm đã hoàn thành hoặc đang xử lý
        const relevantTestings = testingsData.filter(
          (testing) => testing && (testing.status === 3 || testing.status === 2)
        );

        console.log("Các phiên xét nghiệm đã lọc:", relevantTestings);

        // Sắp xếp theo thời gian
        relevantTestings.sort((a, b) =>
          sortOrder === "desc"
            ? new Date(b.createdAt || b.scheduleDate) -
              new Date(a.createdAt || a.scheduleDate)
            : new Date(a.createdAt || a.scheduleDate) -
              new Date(b.createdAt || b.scheduleDate)
        );

        // Lưu danh sách phiên xét nghiệm
        setUniqueTestings(relevantTestings);

        // Xử lý kết quả từ phản hồi API
        const allResults = [];

        // Duyệt qua từng phiên xét nghiệm
        for (const testing of relevantTestings) {
          // Kiểm tra xem phiên có mảng testResult không
          if (testing.testResult && Array.isArray(testing.testResult)) {
            // Thêm thông tin phiên xét nghiệm vào mỗi kết quả
            const resultsWithTestingInfo = testing.testResult.map((result) => ({
              ...result,
              stiTesting: {
                id: testing.id,
                customerId: testing.customerId,
                customer: testing.customer,
                testPackage: testing.testPackage,
                status: testing.status,
                scheduleDate: testing.scheduleDate,
                slot: testing.slot,
                totalPrice: testing.totalPrice,
                isPaid: testing.isPaid,
                createdAt: testing.createdAt,
                sampleTakenAt: testing.sampleTakenAt,
                completedAt: testing.completedAt,
              },
              stiTestingId: testing.id,
              isPaid: testing.isPaid || false,
              totalPrice: testing.totalPrice || 0,
            }));

            allResults.push(...resultsWithTestingInfo);
          }
        }

        console.log("Tất cả kết quả xét nghiệm sau khi xử lý:", allResults);

        // Lưu kết quả
        setTestResults(allResults);
        setFilteredResults(allResults);
      } catch (processError) {
        console.error("Lỗi khi xử lý dữ liệu:", processError);
        toast.error("Có lỗi xảy ra khi xử lý dữ liệu kết quả xét nghiệm");
      }
    };

    fetchTestData();
  }, [currentUser, userId, sortOrder]);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setApiError(null);

    try {
      const response = await stiTestingService.getForCustomer();
      console.log("Refresh response:", response);

      // Xác định nơi chứa dữ liệu
      let testingsData = [];
      if (response.data && Array.isArray(response.data)) {
        testingsData = response.data;
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        testingsData = response.data.data;
      } else if (
        response.data &&
        response.data.is_success &&
        Array.isArray(response.data.data)
      ) {
        testingsData = response.data.data;
      } else {
        throw new Error("Định dạng dữ liệu không đúng");
      }

      // Lọc phiên đã hoàn thành hoặc đang xử lý
      const relevantTestings = testingsData.filter(
        (testing) => testing && (testing.status === 3 || testing.status === 2)
      );

      // Sắp xếp theo thời gian
      relevantTestings.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.createdAt || b.scheduleDate) -
            new Date(a.createdAt || a.scheduleDate)
          : new Date(a.createdAt || a.scheduleDate) -
            new Date(b.createdAt || b.scheduleDate)
      );

      setUniqueTestings(relevantTestings);

      // Xử lý kết quả
      const allResults = [];
      for (const testing of relevantTestings) {
        if (testing.testResult && Array.isArray(testing.testResult)) {
          const resultsWithTestingInfo = testing.testResult.map((result) => ({
            ...result,
            stiTesting: {
              id: testing.id,
              customerId: testing.customerId,
              customer: testing.customer,
              testPackage: testing.testPackage,
              status: testing.status,
              scheduleDate: testing.scheduleDate,
              slot: testing.slot,
              totalPrice: testing.totalPrice,
              isPaid: testing.isPaid,
              createdAt: testing.createdAt,
              sampleTakenAt: testing.sampleTakenAt,
              completedAt: testing.completedAt,
            },
            stiTestingId: testing.id,
            isPaid: testing.isPaid || false,
            totalPrice: testing.totalPrice || 0,
          }));

          allResults.push(...resultsWithTestingInfo);
        }
      }

      setTestResults(allResults);
      applyFilters(allResults);

      toast.success("Dữ liệu đã được cập nhật");
    } catch (error) {
      console.error("Lỗi khi refresh dữ liệu:", error);
      toast.error(
        "Không thể cập nhật dữ liệu: " + (error.message || "Lỗi không xác định")
      );

      setApiError({
        type: "REFRESH_ERROR",
        message: error.message,
        error: error,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Lọc kết quả
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
      endDateTime.setHours(23, 59, 59, 999);

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

  // Apply filters when criteria change
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

  // Các hàm tiện ích
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

  // Các hàm bộ lọc
  const resetAllFilters = () => {
    setFilterStatus("all");
    setSearchText("");
    setStartDate("");
    setEndDate("");
    setIsDateFilterActive(false);
  };

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

  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsDateFilterActive(false);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    toast.info(
      `Sắp xếp theo ${sortOrder === "desc" ? "cũ nhất" : "mới nhất"} trước`
    );
  };

  // Modal chi tiết kết quả
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

  // Hiển thị thông tin debug API
  const renderDebugInfo = () => {
    if (!debugMode || !apiError) return null;

    return (
      <div className="mt-4 p-4 border border-red-300 rounded-md bg-red-50">
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-md font-medium text-red-800 flex items-center">
            <BugPlay size={18} className="mr-2" />
            API Debug Information
          </h5>
          <button
            className="text-xs text-gray-500 hover:text-gray-700"
            onClick={() => setApiError(null)}
          >
            Clear
          </button>
        </div>
        <div className="overflow-auto max-h-60 text-sm">
          <p className="mb-2">
            <strong>Error Type:</strong> {apiError.type}
          </p>
          <p className="mb-2">
            <strong>Message:</strong> {apiError.message}
          </p>
          {apiError.error && (
            <pre className="bg-gray-800 text-white p-2 rounded text-xs overflow-auto">
              {JSON.stringify(apiError.error, null, 2)}
            </pre>
          )}
          {apiError.response && (
            <pre className="bg-gray-800 text-white p-2 rounded text-xs overflow-auto mt-2">
              {JSON.stringify(apiError.response, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-medium text-gray-900">
            Kết quả xét nghiệm STI
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={() => setDebugMode(!debugMode)}
              className="text-xs text-gray-500 px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
            >
              {debugMode ? "Ẩn debug" : "Debug"}
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="mt-4 text-gray-600">
            Đang tải dữ liệu xét nghiệm...
          </span>
          <span className="mt-2 text-sm text-gray-500">
            Vui lòng đợi trong giây lát
          </span>
        </div>
        {renderDebugInfo()}
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
        {renderDebugInfo()}
      </div>
    );
  }

  // Không có kết quả xét nghiệm hoặc có lỗi API
  if (uniqueTestings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FlaskConical className="text-indigo-600 h-6 w-6 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">
                Kết quả xét nghiệm STI
              </h3>
            </div>

            <div className="flex items-center gap-2">
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
                <span className="hidden sm:inline">Làm mới</span>
              </button>

              <button
                onClick={() => {
                  window.location.href = "/sti-booking";
                }}
                className="hidden sm:flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <FilePlus size={16} className="mr-1" />
                Đặt lịch xét nghiệm
              </button>

              <button
                onClick={() => setDebugMode(!debugMode)}
                className="text-xs text-gray-500 px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
              >
                {debugMode ? "Ẩn debug" : "Debug"}
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Xem kết quả các xét nghiệm STI đã thực hiện và lọc theo các tiêu chí
            khác nhau.
          </p>
        </div>

        <div className="text-center py-16 bg-gray-50 rounded-lg">
          {apiError ? (
            <>
              <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Không thể tải kết quả xét nghiệm
              </p>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                Có lỗi xảy ra khi tải dữ liệu kết quả xét nghiệm. Vui lòng thử
                làm mới trang hoặc quay lại sau.
              </p>
            </>
          ) : (
            <>
              <FlaskConical className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                Chưa có kết quả xét nghiệm STI
              </p>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                Kết quả xét nghiệm STI của bạn sẽ được hiển thị tại đây sau khi
                mẫu xét nghiệm đã được xử lý và có kết quả.
              </p>
            </>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              onClick={() => (window.location.href = "/sti-booking")}
            >
              <FilePlus size={16} className="mr-2" />
              Đặt lịch xét nghiệm mới
            </button>
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() =>
                (window.location.href = "/profile/testing-history")
              }
            >
              <Calendar size={16} className="mr-2 inline" />
              Xem lịch sử xét nghiệm
            </button>
          </div>
        </div>
        {renderDebugInfo()}
      </div>
    );
  }

  // UI chính khi có dữ liệu
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FlaskConical className="text-indigo-600 h-6 w-6 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">
              Kết quả xét nghiệm STI
            </h3>
          </div>

          <div className="flex items-center gap-2">
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
              <span className="hidden sm:inline">Làm mới</span>
            </button>

            <button
              onClick={() => {
                window.location.href = "/sti-booking";
              }}
              className="hidden sm:flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FilePlus size={16} className="mr-1" />
              Đặt lịch xét nghiệm
            </button>

            <button
              onClick={() => setDebugMode(!debugMode)}
              className="text-xs text-gray-500 px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
            >
              {debugMode ? "Ẩn debug" : "Debug"}
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Xem kết quả các xét nghiệm STI đã thực hiện và lọc theo các tiêu chí
          khác nhau.
        </p>
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

        {/* Bộ lọc ngày - đã được cải tiến */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
            <h6 className="text-sm font-medium">Lọc theo ngày:</h6>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
            <div className="flex items-center col-span-1">
              <span className="text-sm text-gray-600 mr-2">Từ:</span>
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="flex items-center col-span-1">
              <span className="text-sm text-gray-600 mr-2">Đến:</span>
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-4 rounded-md text-sm font-medium flex items-center justify-center"
              onClick={() => {
                if (startDate && endDate) {
                  applyDateFilter();
                } else {
                  toast.warning("Vui lòng chọn cả ngày bắt đầu và kết thúc");
                }
              }}
            >
              <span className="mr-1">Áp dụng</span>
              <Filter size={14} />
            </button>

            {isDateFilterActive && (
              <button
                type="button"
                className="border border-gray-300 text-gray-700 py-1.5 px-4 rounded-md text-sm hover:bg-gray-100 flex items-center justify-center"
                onClick={resetDateFilter}
              >
                <span className="mr-1">Xóa bộ lọc</span>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Hiển thị bộ lọc đang hoạt động */}
        {(filterStatus !== "all" || isDateFilterActive || searchText) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h6 className="text-sm font-medium text-blue-700">
                Bộ lọc đang áp dụng
              </h6>
              <button
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                onClick={resetAllFilters}
              >
                <span>Xóa tất cả</span>
                <X size={12} className="ml-1" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {filterStatus !== "all" && (
                <div className="flex items-center bg-white px-3 py-1.5 rounded-md shadow-sm border border-blue-100">
                  <span className="text-xs text-blue-700 mr-2">Kết quả:</span>
                  <span className="text-xs px-2 py-0.5 rounded flex items-center bg-blue-100 text-blue-800">
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
                <div className="flex items-center bg-white px-3 py-1.5 rounded-md shadow-sm border border-purple-100">
                  <span className="text-xs text-purple-700 mr-2">
                    Thời gian:
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded flex items-center bg-purple-100 text-purple-800">
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
                <div className="flex items-center bg-white px-3 py-1.5 rounded-md shadow-sm border border-green-100">
                  <span className="text-xs text-green-700 mr-2">Tìm kiếm:</span>
                  <span className="text-xs px-2 py-0.5 rounded flex items-center bg-green-100 text-green-800">
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
            </div>
          </div>
        )}
      </div>

      {renderDebugInfo()}

      {/* Hiển thị các phiên xét nghiệm với kết quả của chúng */}
      <div className="space-y-6">
        {uniqueTestings.length > 0 ? (
          uniqueTestings.map((stiTesting) => {
            // Lọc các kết quả thuộc về phiên xét nghiệm hiện tại
            const testingResults = filteredResults.filter(
              (result) => result.stiTestingId === stiTesting.id
            );

            // Nếu không có kết quả nào sau khi lọc, không hiển thị phiên xét nghiệm
            if (
              (testingResults.length === 0 && filterStatus !== "all") ||
              searchText ||
              isDateFilterActive
            ) {
              return null;
            }

            const isExpanded = expandedTestings[stiTesting.id] || false;

            return (
              <div
                key={stiTesting.id}
                className="border rounded-lg overflow-hidden shadow-sm mb-6"
              >
                {/* Header with STI Testing info and toggle button */}
                <div
                  className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 border-b cursor-pointer"
                  onClick={() => toggleTesting(stiTesting.id)} // Gọi hàm toggleTesting đúng cách
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <Calendar size={18} className="mr-2 text-indigo-600" />
                        <h5 className="text-lg font-medium">
                          Phiên xét nghiệm ngày{" "}
                          {formatDate(
                            stiTesting.scheduleDate || stiTesting.createdAt
                          )}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {stiTesting.testPackage === 0
                          ? "Gói cơ bản"
                          : stiTesting.testPackage === 1
                          ? "Gói nâng cao"
                          : "Gói tùy chỉnh"}
                        {" • "}
                        <span className="text-indigo-600 font-medium">
                          {testingResults.length} kết quả
                        </span>
                        {testingResults.filter((r) => r.outcome === 1).length >
                          0 && (
                          <span className="ml-2 text-red-600">
                            <AlertCircle size={14} className="inline mr-1" />
                            Có kết quả dương tính
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <div className="text-right mr-3">
                        <p className="text-sm font-bold text-gray-900">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 0,
                          }).format(stiTesting.totalPrice || 0)}
                        </p>
                        {stiTesting.isPaid ? (
                          <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            <CheckCircle size={12} className="mr-1" />
                            Đã thanh toán
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            <AlertCircle size={12} className="mr-1" />
                            Chưa thanh toán
                          </span>
                        )}
                      </div>

                      <button
                        className="p-1.5 rounded-full hover:bg-indigo-100"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn event bubbling
                          toggleTesting(stiTesting.id);
                        }}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
                        title={isExpanded ? "Thu gọn" : "Mở rộng"}
                      >
                        <svg
                          className={`w-5 h-5 text-indigo-600 transition-transform ${
                            isExpanded ? "transform rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bảng kết quả xét nghiệm - chỉ hiển thị khi mở rộng */}
                {isExpanded && (
                  <>
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
                          {testingResults.length > 0 ? (
                            testingResults.map((result) => {
                              const parameterInfo = TEST_PARAMETERS[
                                result.parameter
                              ] || {
                                name: `Loại ${result.parameter}`,
                                icon: "🔬",
                              };
                              const outcomeInfo = OUTCOME_TYPES[
                                result.outcome
                              ] || {
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
                                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs px-3 py-1 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedTest(result);
                                        setShowDetailModal(true);
                                      }}
                                    >
                                      Xem chi tiết
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td
                                colSpan="5"
                                className="px-4 py-6 text-center text-gray-500"
                              >
                                Không tìm thấy kết quả xét nghiệm nào cho phiên
                                này
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer với thông tin tổng hợp */}
                    <div className="bg-gray-50 px-4 py-3 border-t">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">
                            {testingResults.length} kết quả xét nghiệm
                          </span>
                        </div>
                        {!stiTesting.isPaid && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/payment?testId=${stiTesting.id}&amount=${stiTesting.totalPrice}`;
                            }}
                            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Thanh toán ngay
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
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
