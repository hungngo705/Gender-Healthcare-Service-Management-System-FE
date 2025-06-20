import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X, Plus, Save, Trash2 } from "lucide-react";

// Import API services
import {
  getTestResults,
  createTestResult,
  updateTestResult,
  deleteTestResult,
} from "../../../../services/testResultService";
import { updateTestingStatus } from "../../../../services/stiTestingService";

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
  0: "Âm tính",
  1: "Dương tính",
  2: "Không xác định",
};

// Test package mapping
const testPackageParameters = {
  0: [0, 1, 2], // Basic: HIV, Syphilis, Gonorrhea
  1: [0, 1, 2, 3, 4, 5], // Advanced: All parameters
  // Custom: depends on user selection
};

function TestResultModal({ test, onClose, onTestResultUpdated }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parameterOptions, setParameterOptions] = useState([]);

  // Form state for adding/editing a result
  const [editingResult, setEditingResult] = useState(null);
  const [formData, setFormData] = useState({
    parameter: "",
    outcome: "",
    comments: "",
  }); // Fetch test results on mount
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await getTestResults(test.id);
        if (response?.data?.is_success && Array.isArray(response.data.data)) {
          setResults(response.data.data);
          // Determine available parameters based on package type
          generateParameterOptions(response.data.data);
        } else {
          setResults([]);
          generateParameterOptions([]);
          console.log("API response structure:", response); // For debugging
        }
      } catch (error) {
        console.error("Error fetching test results:", error);
        toast.error("Không thể tải kết quả xét nghiệm");
        setResults([]);
        generateParameterOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [test.id]);

  // Generate parameter options based on package type and existing results
  const generateParameterOptions = (currentResults) => {
    let availableParameters = [];

    if (test.testPackage === 0 || test.testPackage === 1) {
      // For basic and advanced packages, use predefined parameters
      availableParameters = [...testPackageParameters[test.testPackage]];
    } else if (test.testPackage === 2) {
      // For custom package, check the custom parameters
      // Assuming custom parameters are stored somewhere in the test object
      // This might need adjustment based on your actual data structure
      if (test.customParameters && Array.isArray(test.customParameters)) {
        availableParameters = [...test.customParameters];
      } else if (typeof test.customParameters === "string") {
        // If it's a string like "0,1,2", convert to array of numbers
        availableParameters = test.customParameters
          .split(",")
          .map((p) => parseInt(p.trim()))
          .filter((p) => !isNaN(p));
      }
    }

    // Filter out parameters that already have results
    const usedParameters = currentResults.map((r) => r.parameter);
    const options = availableParameters
      .filter((p) => !usedParameters.includes(p))
      .map((p) => ({
        value: p,
        label: parameterLabels[p] || `Thông số ${p}`,
      }));

    setParameterOptions(options);

    // If we're editing, add the current parameter back to options
    if (editingResult) {
      const usedParameter = editingResult.parameter;
      if (!options.some((o) => o.value === usedParameter)) {
        options.push({
          value: usedParameter,
          label: parameterLabels[usedParameter] || `Thông số ${usedParameter}`,
        });
      }
    }

    // Set default parameter if available
    if (options.length > 0 && !formData.parameter) {
      setFormData((prev) => ({ ...prev, parameter: options[0].value }));
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "parameter" || name === "outcome" ? parseInt(value) : value,
    }));
  };

  // Start adding a new result
  const handleAddResult = () => {
    setEditingResult(null);
    setFormData({
      parameter: parameterOptions.length > 0 ? parameterOptions[0].value : "",
      outcome: 0, // Default to negative
      comments: "",
    });
  };

  // Start editing an existing result
  const handleEditResult = (result) => {
    setEditingResult(result);
    setFormData({
      parameter: result.parameter,
      outcome: result.outcome,
      comments: result.comments || "",
    });

    // Regenerate options to include the current parameter
    generateParameterOptions(results);
  };

  // Save result (create or update)
  const handleSaveResult = async () => {
    // Validate form
    if (formData.parameter === "" || formData.outcome === "") {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setSaving(true);
    try {
      let response;

      if (editingResult) {
        // Update existing result
        response = await updateTestResult(
          editingResult.id,
          test.id,
          formData.parameter,
          formData.outcome,
          formData.comments
        );
      } else {
        // Create new result
        response = await createTestResult(
          test.id,
          formData.parameter,
          formData.outcome,
          formData.comments
        );
      }
      if (response?.data?.is_success) {
        toast.success(
          editingResult ? "Cập nhật thành công" : "Thêm kết quả thành công"
        );

        // Refresh results
        const updatedResponse = await getTestResults(test.id);
        if (
          updatedResponse?.data?.is_success &&
          Array.isArray(updatedResponse.data.data)
        ) {
          setResults(updatedResponse.data.data);
          generateParameterOptions(updatedResponse.data.data);
        }

        // Update test status to "processing" if it wasn't already
        if (test.status < 2) {
          await updateTestingStatus(test.id, 2); // Set to "processing"
        } // Check if all parameters have results, and update status to "completed" if so
        const allParametersProcessed = checkAllParametersProcessed(
          updatedResponse?.data?.data || []
        );
        if (allParametersProcessed && test.status < 3) {
          await updateTestingStatus(test.id, 3); // Set to "completed"
        }

        // Close form
        setEditingResult(null);
        setFormData({
          parameter: "",
          outcome: "",
          comments: "",
        });

        // Notify parent component
        onTestResultUpdated && onTestResultUpdated();
      } else {
        toast.error("Lỗi: " + (response.message || "Không thể lưu kết quả"));
      }
    } catch (error) {
      console.error("Error saving test result:", error);
      toast.error(
        "Lỗi khi lưu kết quả: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete result
  const handleDeleteResult = async (resultId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa kết quả này?")) {
      return;
    }

    setSaving(true);
    try {
      const response = await deleteTestResult(resultId);
      if (response?.data?.is_success) {
        toast.success("Xóa kết quả thành công");

        // Refresh results
        const updatedResponse = await getTestResults(test.id);
        if (
          updatedResponse?.data?.is_success &&
          Array.isArray(updatedResponse.data.data)
        ) {
          setResults(updatedResponse.data.data);
          generateParameterOptions(updatedResponse.data.data);
        }

        // If editing this result, close form
        if (editingResult && editingResult.id === resultId) {
          setEditingResult(null);
          setFormData({
            parameter: "",
            outcome: "",
            comments: "",
          });
        }

        // Notify parent component
        onTestResultUpdated && onTestResultUpdated();
      } else {
        toast.error(
          "Lỗi: " + (response?.data?.message || "Không thể xóa kết quả")
        );
      }
    } catch (error) {
      console.error("Error deleting test result:", error);
      toast.error(
        "Lỗi khi xóa kết quả: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setSaving(false);
    }
  };

  // Check if all parameters for this test package have results
  const checkAllParametersProcessed = (currentResults) => {
    let requiredParameters = [];

    if (test.testPackage === 0 || test.testPackage === 1) {
      // For basic and advanced packages, use predefined parameters
      requiredParameters = [...testPackageParameters[test.testPackage]];
    } else if (test.testPackage === 2 && test.customParameters) {
      // For custom package, check the custom parameters
      if (Array.isArray(test.customParameters)) {
        requiredParameters = [...test.customParameters];
      } else if (typeof test.customParameters === "string") {
        requiredParameters = test.customParameters
          .split(",")
          .map((p) => parseInt(p.trim()))
          .filter((p) => !isNaN(p));
      }
    }

    // If no parameters are defined, we can't complete
    if (requiredParameters.length === 0) {
      return false;
    }

    // Check if all required parameters have results
    const processedParameters = currentResults.map((r) => r.parameter);
    return requiredParameters.every((p) => processedParameters.includes(p));
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingResult(null);
    setFormData({
      parameter: "",
      outcome: "",
      comments: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Quản lý kết quả xét nghiệm - {test.customer?.name || "Khách hàng"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Thông tin xét nghiệm:</span>{" "}
                  {test.id}
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Gói xét nghiệm:</span>{" "}
                  {test.testPackage === 0
                    ? "Gói Cơ Bản"
                    : test.testPackage === 1
                    ? "Gói Nâng Cao"
                    : test.testPackage === 2
                    ? "Gói Tùy Chọn"
                    : "Không xác định"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Kết quả xét nghiệm
            </h3>
            {parameterOptions.length > 0 && !editingResult && (
              <button
                onClick={handleAddResult}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                disabled={saving}
              >
                <Plus size={16} className="mr-2" />
                Thêm kết quả
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : results.length === 0 && !editingResult ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500 mb-4">
                Chưa có kết quả xét nghiệm. Thêm kết quả để bắt đầu.
              </p>
              {parameterOptions.length > 0 && (
                <button
                  onClick={handleAddResult}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  disabled={saving}
                >
                  <Plus size={16} className="mr-2" />
                  Thêm kết quả
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white border rounded-lg overflow-hidden">
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {parameterLabels[result.parameter] ||
                          `Thông số ${result.parameter}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block font-medium ${
                            result.outcome === 0
                              ? "text-green-600"
                              : result.outcome === 1
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {outcomeLabels[result.outcome] || "Không xác định"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {result.comments || "Không có ghi chú"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditResult(result)}
                            className="text-indigo-600 hover:text-indigo-900"
                            disabled={saving}
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleDeleteResult(result.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={saving}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Form */}
        {(editingResult || formData.parameter !== "") && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingResult ? "Chỉnh sửa kết quả" : "Thêm kết quả mới"}
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thông số xét nghiệm
                </label>
                <select
                  name="parameter"
                  value={formData.parameter}
                  onChange={handleInputChange}
                  disabled={saving || parameterOptions.length === 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {parameterOptions.length === 0 ? (
                    <option value="">Không có thông số nào khả dụng</option>
                  ) : (
                    parameterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kết quả
                </label>
                <select
                  name="outcome"
                  value={formData.outcome}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Object.entries(outcomeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  disabled={saving}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nhập ghi chú (nếu có)"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                disabled={saving}
              >
                Hủy
              </button>
              <button
                onClick={handleSaveResult}
                disabled={saving || formData.parameter === ""}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={16} className="mr-2" />
                )}
                {editingResult ? "Cập nhật" : "Lưu kết quả"}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          {/* Check if all parameters have results */}
          {checkAllParametersProcessed(results) && test.status < 3 && (
            <button
              onClick={async () => {
                try {
                  await updateTestingStatus(test.id, 3); // Set to "completed"
                  toast.success("Xét nghiệm đã được đánh dấu là hoàn thành");
                  onTestResultUpdated && onTestResultUpdated();
                } catch (error) {
                  console.error("Error updating status:", error);
                  toast.error("Không thể cập nhật trạng thái");
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Hoàn thành xét nghiệm
            </button>
          )}

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

export default TestResultModal;
