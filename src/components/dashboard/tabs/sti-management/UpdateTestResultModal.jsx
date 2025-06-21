import React, { useState, useEffect } from "react";
import { X, Save, RefreshCw, Trash } from "lucide-react";
import { toast } from "react-toastify";
import testResultService from "../../../../services/testResultService";
import tokenHelper from "../../../../utils/tokenHelper"; // Thêm dòng này

// Parameters for STI tests - aligned with API enum
const parameterLabels = {
  0: "Chlamydia",
  1: "Lậu",
  2: "Giang mai",
  3: "HIV",
  4: "Herpes",
  5: "Viêm gan B",
  6: "Viêm gan C",
  7: "Trichomonas",
  8: "Mycoplasma Genitalium",
};

// Outcome options
const outcomeLabels = [
  { value: 0, label: "Âm tính", color: "text-green-600" },
  { value: 1, label: "Dương tính", color: "text-red-600" },
  { value: 2, label: "Không xác định", color: "text-yellow-600" },
];

function UpdateTestResultModal({ test, onClose, onResultsUpdated }) {
  const [allTestResults, setAllTestResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [formData, setFormData] = useState({
    outcome: 2, // Default to inconclusive
    comments: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("fullName"),
  });

  // Get current user
  /* const currentUser = {
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("userName")
  }; */

  useEffect(() => {
    // Sử dụng tokenHelper để lấy thông tin từ token
    const tokenInfo = tokenHelper.getCurrentTokenInfo();
    let userId = null;
    let fullNameFromToken = null;
    let roleFromToken = null;

    if (tokenInfo) {
      console.log("Token info from tokenHelper:", tokenInfo);

      // Lấy định danh người dùng từ claim Microsoft
      userId =
        tokenInfo[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      // Lấy tên người dùng từ claim Microsoft
      fullNameFromToken =
        tokenInfo["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

      // Lấy vai trò từ claim Microsoft
      roleFromToken =
        tokenInfo[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      console.log(
        "Extracted from token - userId:",
        userId,
        "name:",
        fullNameFromToken,
        "role:",
        roleFromToken
      );

      // Nếu tìm thấy tên từ token, cập nhật state
      if (fullNameFromToken) {
        setCurrentUser((prev) => ({
          ...prev,
          name: fullNameFromToken,
          role: roleFromToken || prev.role,
        }));
      }
    }

    // Lấy thông tin từ localStorage như trước đây
    try {
      const userJson = localStorage.getItem("user");
      let userInfo = null;

      if (userJson) {
        try {
          userInfo = JSON.parse(userJson);
          console.log("User info from localStorage:", userInfo);
        } catch (e) {
          console.error("Error parsing user JSON:", e);
        }
      }

      const fullName =
        localStorage.getItem("fullName") ||
        userInfo?.fullName ||
        "Nhân viên y tế";
      const email = localStorage.getItem("email") || userInfo?.email || "";
      const role = localStorage.getItem("role") || userInfo?.role || "Staff";

      console.log("User info from localStorage:", { fullName, email, role });

      // Cập nhật state với thông tin đã lấy được
      setCurrentUser({
        id: userId || localStorage.getItem("userId") || "default-user-id",
        name: fullName,
        email: email,
        role: role,
      });

      console.log("Updated currentUser state:", {
        id: userId || localStorage.getItem("userId") || "default-user-id",
        name: fullName,
        email: email,
        role: role,
      });
    } catch (error) {
      console.error("Error getting user info from localStorage:", error);
    }
  }, []);

  // Thêm useEffect để debug currentUser khi thay đổi
  useEffect(() => {
    console.log("Current user after update:", currentUser);
  }, [currentUser]);

  // Load test results on component mount
  useEffect(() => {
    const fetchTestResults = async () => {
      if (!test || !test.id) return;

      setIsLoading(true);
      try {
        // Thử lấy dữ liệu từ API
        const response = await testResultService.getTestResults(test.id);
        console.log("UpdateModal - API response:", response);

        // Xử lý dữ liệu
        let resultsToUse = [];

        // Trường hợp 1: Có dữ liệu từ API
        if (
          response &&
          response.is_success &&
          response.data?.testResult?.length > 0
        ) {
          resultsToUse = response.data.testResult.map((result) => ({
            ...result,
            parameter: parseInt(result.parameter),
            outcome: result.outcome !== null ? parseInt(result.outcome) : 2,
          }));
        }
        // Trường hợp 2: Có sẵn trong test prop
        else if (test.testResult && test.testResult.length > 0) {
          resultsToUse = test.testResult.map((result) => ({
            ...result,
            parameter: parseInt(result.parameter),
            outcome: result.outcome !== null ? parseInt(result.outcome) : 2,
          }));
        }
        // Trường hợp 3: Tạo từ customParameters
        else if (test.customParameters && test.customParameters.length > 0) {
          resultsToUse = test.customParameters.map((param) => ({
            id: `new-${param}-${Date.now()}`,
            parameter: parseInt(param),
            outcome: 2,
            comments: "",
            testingId: test.id,
            isNew: true,
          }));
        }
        // Trường hợp 4: Tạo mặc định từ parameterLabels nếu không có gì
        else {
          // Tạo các thông số xét nghiệm mặc định
          resultsToUse = Object.keys(parameterLabels).map((param) => ({
            id: `new-${param}-${Date.now()}`,
            parameter: parseInt(param),
            outcome: 2,
            comments: "",
            testingId: test.id,
            isNew: true,
          }));
        }

        console.log("Using test results:", resultsToUse);
        setAllTestResults(resultsToUse);

        // Chọn kết quả đầu tiên
        if (resultsToUse.length > 0) {
          setSelectedResult(resultsToUse[0]);
          setFormData({
            outcome:
              resultsToUse[0].outcome !== null ? resultsToUse[0].outcome : 2,
            comments: resultsToUse[0].comments || "",
          });
        }
      } catch (error) {
        console.error("Error fetching test results:", error);
        toast.error("Có lỗi khi tải dữ liệu kết quả xét nghiệm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestResults();
  }, [test]);

  // Handle result selection
  const handleResultChange = async (e) => {
    const resultId = e.target.value;
    const selectedFromList = allTestResults.find((r) => r.id === resultId);

    // Nếu đây là kết quả mới (chưa có trong database)
    if (selectedFromList?.isNew) {
      setSelectedResult(selectedFromList);
      setFormData({
        outcome:
          selectedFromList.outcome !== null ? selectedFromList.outcome : 2,
        comments: selectedFromList.comments || "",
      });
      return;
    }

    // Nếu là kết quả có sẵn trong database, gọi API để lấy thông tin chi tiết nhất
    try {
      setIsLoading(true);
      console.log("Fetching details for test result ID:", resultId);

      // Gọi API GET /api/v2.5/testresult/{id} để lấy thông tin chi tiết
      const response = await testResultService.getTestResultById(resultId);
      console.log("Test result detail response:", response);

      if (response && response.is_success) {
        const detailedResult = response.data;

        // Cập nhật selectedResult với thông tin mới nhất từ API
        const updatedResult = {
          ...detailedResult,
          parameter: parseInt(detailedResult.parameter),
          outcome:
            detailedResult.outcome !== null
              ? parseInt(detailedResult.outcome)
              : 2,
        };

        console.log("Updated result with fresh data:", updatedResult);

        // Cập nhật state với thông tin mới nhất
        setSelectedResult(updatedResult);
        setFormData({
          outcome: updatedResult.outcome !== null ? updatedResult.outcome : 2,
          comments: updatedResult.comments || "",
        });
      } else {
        // Nếu API call thất bại, sử dụng dữ liệu từ list
        toast.warning(
          "Không thể lấy thông tin chi tiết, sử dụng dữ liệu sẵn có"
        );
        setSelectedResult(selectedFromList);
        setFormData({
          outcome:
            selectedFromList.outcome !== null ? selectedFromList.outcome : 2,
          comments: selectedFromList.comments || "",
        });
      }
    } catch (error) {
      console.error("Error fetching test result details:", error);
      toast.error("Lỗi khi lấy thông tin chi tiết xét nghiệm");

      // Vẫn sử dụng dữ liệu từ list nếu có lỗi
      setSelectedResult(selectedFromList);
      setFormData({
        outcome:
          selectedFromList.outcome !== null ? selectedFromList.outcome : 2,
        comments: selectedFromList.comments || "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "outcome" ? parseInt(value) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked!");

    // UUID mặc định nếu không tìm thấy
    let staffId = "00000000-0000-0000-0000-000000000000";

    // Lấy thông tin từ token theo định dạng Microsoft claims
    const tokenInfo = tokenHelper.getCurrentTokenInfo();
    console.log("Current token info:", tokenInfo);

    if (tokenInfo) {
      // Lấy nameidentifier (Microsoft format)
      const nameIdentifier =
        tokenInfo[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      // Nếu có nameidentifier, sử dụng nó làm staffId
      if (nameIdentifier) {
        staffId = nameIdentifier;
        console.log("Found staffId from nameidentifier claim:", staffId);
      }
      // Nếu không có nameidentifier, thử các trường khác
      else {
        const possibleIds = [
          tokenInfo.nameid,
          tokenInfo.nameidentifier,
          tokenInfo.sub,
          tokenInfo.id,
          tokenInfo.userId,
        ].filter(Boolean);

        console.log("Possible IDs from token:", possibleIds);

        // Tìm ID đầu tiên là UUID hợp lệ
        const validId = possibleIds.find((id) =>
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            id
          )
        );

        if (validId) {
          staffId = validId;
          console.log("Found valid UUID from token:", staffId);
        }
      }
    }

    console.log("Final staffId to be used:", staffId);

    if (!selectedResult) {
      toast.error("Vui lòng chọn kết quả xét nghiệm cần cập nhật");
      return;
    }

    setIsSubmitting(true);

    try {
      // Log thông tin debug
      console.log("Selected result:", selectedResult);
      console.log("Form data:", formData);

      let response;

      // Nếu là kết quả mới (chưa có trong database)
      if (
        selectedResult.isNew ||
        selectedResult.id.toString().startsWith("new-") ||
        selectedResult.id.toString().startsWith("temp-")
      ) {
        console.log(
          "Creating new test result with parameter:",
          selectedResult.parameter
        );

        // Tạo mới với parameter
        response = await testResultService.createTestResult(
          test.id,
          selectedResult.parameter,
          parseInt(formData.outcome),
          formData.comments,
          staffId
        );
      } else {
        console.log("Updating existing test result:", selectedResult.id);
        console.log("Using parameter value:", selectedResult.parameter);

        // Lấy parameter từ selectedResult làm tham số cụ thể
        const parameterValue = selectedResult.parameter;

        // Kiểm tra nếu parameter là hợp lệ
        if (parameterValue === undefined || parameterValue === null) {
          console.error(
            "Parameter is undefined or null, trying to fetch from API"
          );
          try {
            const detailResponse = await testResultService.getTestResultById(
              selectedResult.id
            );
            if (
              detailResponse?.is_success &&
              detailResponse?.data?.parameter !== undefined
            ) {
              const parameterFromAPI = parseInt(detailResponse.data.parameter);
              console.log(
                "Retrieved parameter from API call:",
                parameterFromAPI
              );

              // Đảm bảo parameter là số nguyên
              if (isNaN(parameterFromAPI)) {
                throw new Error("Invalid parameter value from API");
              }

              response = await testResultService.updateTestResult(
                selectedResult.id,
                parseInt(formData.outcome),
                formData.comments,
                staffId,
                parameterFromAPI
              );
            } else {
              throw new Error("Could not retrieve parameter value");
            }
          } catch (paramError) {
            console.error("Error getting parameter:", paramError);
            toast.error("Lỗi: Không thể xác định thông số xét nghiệm");
            setIsSubmitting(false);
            return;
          }
        } else {
          // Sử dụng parameter có sẵn
          response = await testResultService.updateTestResult(
            selectedResult.id,
            parseInt(formData.outcome),
            formData.comments,
            staffId,
            parseInt(parameterValue)
          );
        }
      }

      console.log("API response:", response);

      if (response && response.is_success) {
        toast.success("Cập nhật kết quả xét nghiệm thành công!");

        // Tải lại dữ liệu sau khi cập nhật thành công
        await handleRefreshData();

        // Thông báo cho component cha
        if (onResultsUpdated) {
          const refreshedResults = await testResultService.getTestResults(
            test.id
          );
          if (refreshedResults?.is_success) {
            onResultsUpdated(refreshedResults.data?.testResult || []);
          }
        }

        // Đóng modal nếu cần
        // onClose();
      } else {
        toast.error(
          `Lỗi: ${response?.message || "Không thể cập nhật kết quả"}`
        );
      }
    } catch (error) {
      console.error("Error updating/creating test result:", error);
      toast.error(
        `Lỗi: ${error.message || "Đã xảy ra lỗi khi lưu kết quả xét nghiệm"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deletion of test result
  const handleDeleteResult = async () => {
    if (!selectedResult || selectedResult.isNew) {
      toast.error("Không thể xóa kết quả này");
      return;
    }

    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa kết quả xét nghiệm "${
          parameterLabels[selectedResult.parameter]
        }" không?`
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await testResultService.deleteTestResult(
        selectedResult.id
      );

      if (response && response.is_success) {
        toast.success("Xóa kết quả xét nghiệm thành công!");

        // Update the list of results
        const updatedResults = allTestResults.filter(
          (r) => r.id !== selectedResult.id
        );
        setAllTestResults(updatedResults);

        // Select another result if available
        if (updatedResults.length > 0) {
          setSelectedResult(updatedResults[0]);
          setFormData({
            outcome:
              updatedResults[0].outcome !== null
                ? updatedResults[0].outcome
                : 2,
            comments: updatedResults[0].comments || "",
          });
        } else {
          setSelectedResult(null);
          setFormData({ outcome: 2, comments: "" });
        }

        // Notify the parent component
        if (onResultsUpdated) {
          onResultsUpdated(updatedResults);
        }
      } else {
        toast.error(`Lỗi: ${response?.message || "Không thể xóa kết quả"}`);
      }
    } catch (error) {
      console.error("Error deleting test result:", error);
      toast.error(
        `Lỗi: ${error.message || "Đã xảy ra lỗi khi xóa kết quả xét nghiệm"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle refreshing data
  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      const response = await testResultService.getTestResults(test.id);

      if (response && response.is_success) {
        const refreshedResults = response.data?.testResult || [];
        setAllTestResults(refreshedResults);

        if (refreshedResults.length > 0) {
          // Try to keep the same selection if possible
          const currentSelection = selectedResult
            ? refreshedResults.find((r) => r.id === selectedResult.id)
            : null;

          const resultToSelect = currentSelection || refreshedResults[0];
          setSelectedResult(resultToSelect);
          setFormData({
            outcome:
              resultToSelect.outcome !== null ? resultToSelect.outcome : 2,
            comments: resultToSelect.comments || "",
          });
        } else {
          setSelectedResult(null);
          setFormData({ outcome: 2, comments: "" });
        }

        toast.success("Đã tải lại dữ liệu thành công!");
      } else {
        toast.error(`Không thể tải lại dữ liệu: ${response?.message || ""}`);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Có lỗi khi tải lại dữ liệu kết quả xét nghiệm");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a new test parameter
  const handleAddParameter = () => {
    // This would be used if you allow adding new parameters on-the-fly
    // Would need to be implemented based on your requirements
    toast.info("Chức năng thêm thông số mới chưa được hỗ trợ");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-medium">Cập nhật kết quả xét nghiệm</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : allTestResults.length > 0 ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="staffInfo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nhân viên xử lý
                </label>
                <input
                  type="text"
                  id="staffInfo"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                  value={currentUser?.name || "Nhân viên y tế"}
                  readOnly
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">
                  Thông tin được lấy từ tài khoản đang đăng nhập
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="testResult"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Chọn loại xét nghiệm
                </label>
                <select
                  id="testResult"
                  value={selectedResult?.id || ""}
                  onChange={handleResultChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  {allTestResults.map((result) => (
                    <option key={result.id} value={result.id}>
                      {parameterLabels[result.parameter] ||
                        `Thông số ${result.parameter}`}
                      {result.isNew
                        ? " (Chưa có kết quả)"
                        : result.staffId
                        ? ` - ${
                            outcomeLabels.find(
                              (o) => o.value === result.outcome
                            )?.label || "Không xác định"
                          } (Đã xử lý)`
                        : " - Chưa xử lý"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kết quả
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {outcomeLabels.map((outcome) => (
                    <label
                      key={outcome.value}
                      className={`flex items-center justify-center p-3 border rounded-md cursor-pointer ${
                        formData.outcome === outcome.value
                          ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="outcome"
                        value={outcome.value}
                        checked={formData.outcome === outcome.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className={`font-medium ${outcome.color}`}>
                        {outcome.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nhập ghi chú về kết quả xét nghiệm..."
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-6">
                {/* Left side - Delete button (only shows when a non-new result is selected) */}
                <div>
                  {selectedResult && !selectedResult.isNew && (
                    <button
                      type="button"
                      onClick={handleDeleteResult}
                      className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      disabled={isSubmitting}
                    >
                      <Trash size={16} className="mr-2" />
                      Xóa kết quả
                    </button>
                  )}
                </div>

                {/* Right side - Refresh, Close and Save buttons */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleRefreshData}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting || isLoading}
                  >
                    <RefreshCw
                      size={16}
                      className={`mr-1 inline ${
                        isLoading ? "animate-spin" : ""
                      }`}
                    />
                    Tải lại
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    Đóng
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Lưu kết quả
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500 mb-4">
                Không có thông số xét nghiệm nào để cập nhật.
              </p>
              <button
                onClick={handleAddParameter}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Thêm thông số mới
              </button>
            </div>
          )}
        </div>

        {/* Thông tin người xử lý */}
        <div className="border-t mt-4 pt-4 px-4 pb-4">
          <h4 className="font-medium text-sm text-gray-700 mb-2">
            Thông tin người xử lý
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm bg-blue-50 p-3 rounded-lg">
            <div>
              <p className="text-gray-600">Tên nhân viên:</p>
              <p className="font-medium">
                {currentUser?.name ||
                  localStorage.getItem("fullName") ||
                  "Nhân viên y tế"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Vai trò:</p>
              <p className="font-medium">
                {currentUser?.role || localStorage.getItem("role") || "Staff"}
              </p>
            </div>
            <div className="col-span-2 mt-1">
              <p className="text-gray-600">Thời gian xử lý:</p>
              <p className="font-medium">
                {new Date().toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateTestResultModal;
