import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import testResultService from "../../../services/testResultService";
import { useAuth } from "../../../contexts/AuthContext";
import { FlaskConical } from "lucide-react";

function STITestResults({ userId }) {
  const { currentUser } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [uniqueTestings, setUniqueTestings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'positive', 'negative', 'processing'
  const [searchText, setSearchText] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  // Fetch test results from API
  useEffect(() => {
    const fetchTestResults = async () => {
      if (!currentUser) return;

      setIsLoading(true);
      try {
        const response = await testResultService.getAll();
        if (response?.data?.is_success) {
          console.log("API test results:", response.data.data); // Lấy ID của user hiện tại
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
          console.log("Current user ID:", currentUserId);

          // Lọc kết quả thuộc về user hiện tại và loại bỏ các phần tử null
          const userResults = (response.data.data || [])
            .filter((result) => result !== null && result.stiTesting !== null)
            .filter((result) => {
              const isMatch = result.stiTesting?.customerId === currentUserId;
              console.log(
                `Result ID ${result.id}, customerId: ${result.stiTesting?.customerId}, currentUserId: ${currentUserId}, match: ${isMatch}`
              );
              return isMatch;
            });

          // Lọc ra các stiTesting duy nhất từ kết quả
          const uniqueStiTestings = Array.from(
            new Map(
              userResults
                .filter((r) => r.stiTesting)
                .map((result) => [result.stiTesting.id, result.stiTesting])
            ).values()
          ); // Thêm thông tin về trạng thái thanh toán
          const processedResults = userResults.map((result) => ({
            ...result,
            isPaid: result.stiTesting?.isPaid || false,
            totalPrice: result.stiTesting?.totalPrice || 0,
          }));

          setTestResults(processedResults);
          setUniqueTestings(uniqueStiTestings);
          setFilteredResults(processedResults);
          console.log("User test results:", processedResults);
          console.log("Unique STI testings:", uniqueStiTestings);
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
  }, [currentUser, userId]);

  // Lọc kết quả dựa trên trạng thái và text tìm kiếm
  useEffect(() => {
    let filtered = [...testResults];

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

    // Lọc theo text tìm kiếm
    if (searchText.trim() !== "") {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((result) => {
        const testParamLabels = {
          0: "Chlamydia",
          1: "Gonorrhoeae (Lậu)",
          2: "Syphilis (Giang mai)",
          3: "HIV",
          4: "Herpes",
          5: "Viêm gan B",
          6: "Viêm gan C",
          7: "Trichomonas",
          8: "Mycoplasma Genitalium",
        };

        const paramName =
          testParamLabels[result.parameter] || `Loại ${result.parameter}`;
        return paramName.toLowerCase().includes(searchLower);
      });
    }

    setFilteredResults(filtered);
  }, [testResults, filterStatus, searchText]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Hàm để lấy class màu cho kết quả
  const getOutcomeColorClass = (outcome) => {
    switch (outcome) {
      case 0:
        return "bg-green-100 text-green-800"; // Negative/Âm tính
      case 1:
        return "bg-red-100 text-red-800"; // Positive/Dương tính
      case 2:
        return "bg-yellow-100 text-yellow-800"; // Processing/Đang xử lý
      default:
        return "bg-gray-100 text-gray-800"; // Unknown
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Vui lòng đăng nhập để xem kết quả xét nghiệm
          </p>
        </div>
      </div>
    );
  }

  if (uniqueTestings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Kết quả xét nghiệm STI
        </h4>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FlaskConical className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Chưa có kết quả xét nghiệm STI
          </p>
          <p className="text-sm text-gray-500">
            Kết quả xét nghiệm STI của bạn sẽ được hiển thị tại đây
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4">
        Kết quả xét nghiệm STI
      </h4>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Tìm kiếm xét nghiệm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label
            htmlFor="filterStatus"
            className="text-sm font-medium text-gray-700"
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
      </div>

      {/* Display unique STI testing sessions with their results */}
      <div className="space-y-6">
        {uniqueTestings.map((stiTesting) => (
          <div
            key={stiTesting.id}
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            {/* Header with STI Testing info */}
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="text-lg font-medium">
                    Phiên xét nghiệm ngày{" "}
                    {formatDate(
                      stiTesting.scheduleDate || stiTesting.createdAt
                    )}
                  </h5>
                  <p className="text-sm text-gray-500">
                    {stiTesting.testPackage === 0
                      ? "Gói cơ bản"
                      : stiTesting.testPackage === 1
                      ? "Gói nâng cao"
                      : "Gói tùy chỉnh"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(stiTesting.totalPrice)}
                  </p>{" "}
                  {stiTesting.isPaid ? (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Đã thanh toán
                    </span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Chưa thanh toán
                      </span>
                      <button
                        onClick={() => {
                          window.location.href = `/payment?testId=${stiTesting.id}&amount=${stiTesting.totalPrice}`;
                        }}
                        className="inline-block px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Thanh toán ngay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table of results for this STI Testing */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Loại xét nghiệm
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Kết quả
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ngày xử lý
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ghi chú
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults
                    .filter((result) => result.stiTestingId === stiTesting.id)
                    .map((result) => {
                      const testParamLabels = {
                        0: "Chlamydia",
                        1: "Gonorrhoeae (Lậu)",
                        2: "Syphilis (Giang mai)",
                        3: "HIV",
                        4: "Herpes",
                        5: "Viêm gan B",
                        6: "Viêm gan C",
                        7: "Trichomonas",
                        8: "Mycoplasma Genitalium",
                      };

                      const outcomeLabels = {
                        0: "Âm tính",
                        1: "Dương tính",
                        2: "Đang xử lý",
                      };

                      return (
                        <tr key={result.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-medium">
                              {testParamLabels[result.parameter] ||
                                `Loại ${result.parameter}`}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOutcomeColorClass(
                                result.outcome
                              )}`}
                            >
                              {outcomeLabels[result.outcome] ||
                                "Không xác định"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {result.processedAt
                              ? formatDate(result.processedAt)
                              : "Chưa xử lý"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {result.comments || "Không có ghi chú"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default STITestResults;
