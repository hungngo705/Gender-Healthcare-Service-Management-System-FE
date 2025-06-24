import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  X,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  FileText,
  ArrowLeft,
} from "lucide-react";
import testResultService from "../../../../services/testResultService";
import stiTestingService from "../../../../services/stiTestingService";
import { toast } from "react-toastify";
import UpdateTestResultModal from "./UpdateTestResultModal";
// Import các enum chung
import { PARAMETER_ENUM, OUTCOME_ENUM } from "../../../../constants/enums";

// Sử dụng enum chung
const parameterLabels = Object.values(PARAMETER_ENUM).reduce((acc, param) => {
  acc[param.id] = param.name;
  return acc;
}, {});

// Sử dụng enum chung
const outcomeLabels = Object.values(OUTCOME_ENUM).reduce((acc, outcome) => {
  acc[outcome.id] = { label: outcome.label, color: outcome.color };
  return acc;
}, {});

function TestResultModal({
  test: initialTest,
  onClose,
  onBackToDetails,
  onTestUpdated,
}) {
  const [test, setTest] = useState(initialTest);
  const [showUpdateResultModal, setShowUpdateResultModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "HH:mm - dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return "N/A";
    }
  };

  // Calculate pending parameters
  const calculatePendingCount = () => {
    if (!test.customParameters) return 0;

    const selectedParams = test.customParameters || [];
    const completedParams = (test.testResult || [])
      .filter((result) => result.outcome !== null && result.outcome !== 2)
      .map((result) => result.parameter);

    return selectedParams.filter((param) => !completedParams.includes(param))
      .length;
  };

  const pendingCount = calculatePendingCount();

  // Load test results
  useEffect(() => {
    const loadTestResults = async () => {
      if (!test?.id) return;

      setIsLoading(true);
      try {
        // Sử dụng stiTestingService.getById thay vì testResultService
        const response = await stiTestingService.getById(test.id);
        console.log("STI Testing API response:", response);

        if (response && response.data && response.data.is_success) {
          // Lấy đối tượng test từ response
          const testData = response.data.data;
          console.log("Test data from API:", testData);

          // Kiểm tra và lấy testResult từ response
          if (testData && Array.isArray(testData.testResult)) {
            console.log("Test results from API:", testData.testResult);

            // Xử lý dữ liệu để đảm bảo đủ các trường
            const processedResults = testData.testResult.map((result) => ({
              ...result,
              comments: result.comments || "",
              staff: result.staff || null,
              processedAt: result.processedAt || null,
              parameter: parseInt(result.parameter), // Đảm bảo parameter là số
            }));

            console.log("Processed test results:", processedResults);

            // Cập nhật state với cả đối tượng test và testResult
            setTest((prev) => ({
              ...prev,
              ...testData,
              testResult: processedResults,
            }));
          } else {
            console.warn("No test results found in API response");

            // Nếu không có testResult từ API nhưng có customParameters
            if (
              testData &&
              Array.isArray(testData.customParameters) &&
              testData.customParameters.length > 0
            ) {
              const tempResults = testData.customParameters.map((param) => ({
                id: `temp-${param}-${Date.now()}`,
                parameter: parseInt(param),
                outcome: 2, // Default to "Không xác định"
                comments: "",
                testingId: test.id,
                processedAt: null,
                staff: null,
                isPending: true,
              }));

              setTest((prev) => ({
                ...prev,
                ...testData,
                testResult: tempResults,
              }));
            } else {
              // Kiểm tra nếu đã có test result từ initialTest
              if (
                Array.isArray(test.testResult) &&
                test.testResult.length > 0
              ) {
                console.log("Using existing test results from props");
              } else {
                console.warn("No test results or custom parameters found");
              }
            }
          }
        } else {
          toast.error("Không thể tải dữ liệu xét nghiệm");
        }
      } catch (error) {
        console.error("Error loading test data:", error);
        toast.error("Có lỗi khi tải dữ liệu xét nghiệm");
      } finally {
        setIsLoading(false);
      }
    };

    loadTestResults();
  }, [test.id]);

  // Handle updating results
  const handleUpdateResults = () => {
    // Đảm bảo có dữ liệu test result trước khi mở modal
    if (!test.testResult || test.testResult.length === 0) {
      // Nếu không có test results nhưng có parameters
      if (test.customParameters && test.customParameters.length > 0) {
        // Tạo các kết quả tạm thời từ custom parameters
        const tempResults = test.customParameters.map((param) => ({
          id: `temp-${param}-${Date.now()}`,
          parameter: parseInt(param),
          outcome: 2,
          comments: "",
          testingId: test.id,
          isNew: true,
        }));

        // Cập nhật state với kết quả tạm thời
        setTest((prev) => ({
          ...prev,
          testResult: tempResults,
        }));

        // Sau khi cập nhật state, mở modal
        setShowUpdateResultModal(true);
      } else {
        // Nếu thực sự không có dữ liệu, hiển thị thông báo
        toast.warning("Không có thông số xét nghiệm nào để cập nhật");
      }
    } else {
      // Nếu có test results, mở modal bình thường
      setShowUpdateResultModal(true);
    }
  };

  // Handle results updated
  const handleResultsUpdated = (updatedResults) => {
    console.log("Received updated results:", updatedResults);

    if (!Array.isArray(updatedResults)) {
      console.error("Expected array of results but got:", updatedResults);
      toast.error("Định dạng dữ liệu không đúng. Vui lòng làm mới trang.");
      return;
    }

    // Nếu kết quả cập nhật rỗng, tải lại dữ liệu từ API
    if (updatedResults.length === 0) {
      handleRefreshData();
      return;
    }

    const updatedTest = {
      ...test,
      testResult: updatedResults,
    };

    setTest(updatedTest);
    toast.success("Đã cập nhật kết quả xét nghiệm thành công!");

    // Update parent component if callback provided
    if (onTestUpdated) {
      onTestUpdated(updatedTest);
    }
  };

  // Add this function in your TestResultModal component
  const handleDeleteResult = async (resultId, parameterName) => {
    if (!resultId || resultId.toString().startsWith("temp-")) {
      toast.error("Không thể xóa kết quả tạm thời");
      return;
    }

    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa kết quả xét nghiệm "${parameterName}" không?`
      )
    ) {
      return;
    }

    try {
      const response = await testResultService.deleteTestResult(resultId);
      console.log("Delete response:", response);

      if (response && response.is_success) {
        toast.success("Xóa kết quả xét nghiệm thành công!");

        // Tải lại dữ liệu từ API sau khi xóa
        const refreshResponse = await stiTestingService.getById(test.id);
        if (
          refreshResponse &&
          refreshResponse.data &&
          refreshResponse.data.is_success
        ) {
          const refreshedTest = refreshResponse.data.data;

          // Cập nhật state với dữ liệu mới
          setTest((prev) => ({
            ...prev,
            ...refreshedTest,
          }));

          // Thông báo cho component cha
          if (onTestUpdated) {
            onTestUpdated(refreshedTest);
          }
        } else {
          // Nếu không lấy được dữ liệu mới, cập nhật dữ liệu hiện tại
          const updatedResults = test.testResult.filter(
            (r) => r.id !== resultId
          );
          setTest((prev) => ({
            ...prev,
            testResult: updatedResults,
          }));

          if (onTestUpdated) {
            onTestUpdated({
              ...test,
              testResult: updatedResults,
            });
          }
        }
      } else {
        toast.error(`Lỗi: ${response?.message || "Không thể xóa kết quả"}`);
      }
    } catch (error) {
      console.error("Error deleting test result:", error);
      toast.error("Có lỗi khi xóa kết quả xét nghiệm");
    }
  };

  // Thêm hàm này vào component
  const handleBulkUpdate = async (parameters, outcome, comments) => {
    if (!parameters || parameters.length === 0) {
      toast.warning("Không có thông số nào được chọn");
      return;
    }

    try {
      let updatedCount = 0;
      let errors = [];

      // Xử lý từng parameter
      for (const param of parameters) {
        // Tìm xem kết quả đã tồn tại chưa
        const existingResult = test.testResult.find(
          (r) => r.parameter === param
        );

        try {
          let response;

          if (existingResult && !existingResult.isPending) {
            // Cập nhật kết quả đã tồn tại
            response = await testResultService.updateTestResult(
              existingResult.id,
              outcome,
              comments
            );
          } else {
            // Tạo kết quả mới
            response = await testResultService.createTestResult(
              test.id,
              param,
              outcome,
              comments
            );
          }

          if (response && response.is_success) {
            updatedCount++;
          } else {
            errors.push(
              `Thông số ${parameterLabels[param]}: ${
                response?.message || "Lỗi không xác định"
              }`
            );
          }
        } catch (err) {
          errors.push(
            `Thông số ${parameterLabels[param]}: ${
              err.message || "Lỗi không xác định"
            }`
          );
        }
      }

      // Hiển thị thông báo kết quả
      if (updatedCount > 0) {
        toast.success(
          `Đã cập nhật ${updatedCount}/${parameters.length} thông số thành công`
        );

        // Tải lại dữ liệu sau khi cập nhật
        const response = await testResultService.getTestResults(test.id);
        if (response && response.is_success) {
          const refreshedResults = response.data?.testResult || [];
          setTest((prev) => ({
            ...prev,
            testResult: refreshedResults.map((result) => ({
              ...result,
              comments: result.comments || "",
              staff: result.staff || null,
              processedAt: result.processedAt || null,
            })),
          }));

          // Thông báo cập nhật cho component cha
          if (onTestUpdated) {
            onTestUpdated({
              ...test,
              testResult: refreshedResults,
            });
          }
        }
      }

      if (errors.length > 0) {
        toast.error(
          `Có ${errors.length} lỗi khi cập nhật. Chi tiết trong console.`
        );
        console.error("Bulk update errors:", errors);
      }
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast.error("Có lỗi xảy ra khi cập nhật hàng loạt");
    }
  };

  // Debug log để kiểm tra dữ liệu
  useEffect(() => {
    console.log("Current test data:", test);
    console.log("Test result array:", test.testResult);
  }, [test]);

  // Thêm vào ngay sau khi khởi tạo state
  useEffect(() => {
    // Nếu không có testResult nhưng có customParameters, tạo kết quả tạm thời
    if (
      (!test.testResult || test.testResult.length === 0) &&
      test.customParameters &&
      test.customParameters.length > 0
    ) {
      // Tạo kết quả tạm thời từ customParameters
      const tempResults = test.customParameters.map((param) => ({
        id: `temp-${param}-${Date.now()}`,
        parameter: param,
        outcome: 2, // Mặc định là không xác định
        comments: "",
        testingId: test.id,
        processedAt: null,
        staff: null,
        isPending: true,
      }));

      // Cập nhật state
      setTest((prev) => ({
        ...prev,
        testResult: tempResults,
      }));
    }
  }, []);

  // Thêm hàm tạo kết quả mới
  const handleCreateNewParameter = async () => {
    // Hiển thị modal chọn thông số
    const parameters = Object.entries(parameterLabels).map(
      ([value, label]) => ({
        value: parseInt(value),
        label,
      })
    );

    // Tạo một modal đơn giản để chọn thông số (bạn có thể cải thiện phần UI này)
    const parameterInput = window.prompt(
      "Chọn thông số mới (nhập số):\n" +
        parameters.map((p) => `${p.value}: ${p.label}`).join("\n")
    );

    if (parameterInput === null) return; // Người dùng bấm Cancel

    const paramValue = parseInt(parameterInput.trim());

    // Kiểm tra giá trị hợp lệ
    if (isNaN(paramValue) || !parameterLabels[paramValue]) {
      toast.error("Thông số không hợp lệ");
      return;
    }

    // Kiểm tra thông số đã tồn tại trong test.testResult chưa
    if (
      test.testResult &&
      test.testResult.some((r) => r.parameter === paramValue)
    ) {
      toast.error(`Thông số ${parameterLabels[paramValue]} đã tồn tại`);
      return;
    }

    // Mở modal cập nhật với thông số mới
    const tempResult = {
      id: `new-${paramValue}-${Date.now()}`,
      parameter: paramValue,
      outcome: 2,
      comments: "",
      testingId: test.id,
      isNew: true,
    };

    // Đặt thông số mới làm selected result và mở modal cập nhật
    setSelectedResult(tempResult);
    setShowUpdateResultModal(true);
  };

  // Thêm hàm làm mới dữ liệu
  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      const response = await stiTestingService.getById(test.id);
      if (response && response.data && response.data.is_success) {
        const refreshedTest = response.data.data;
        setTest((prev) => ({
          ...prev,
          ...refreshedTest,
        }));
        toast.success("Đã làm mới dữ liệu");
      } else {
        toast.error("Không thể làm mới dữ liệu");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Có lỗi khi làm mới dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  // Time slot component for STI testing booking
  const TimeSlotSelector = ({
    selectedSlot,
    onChange,
    bookedSlots,
    selectedDate,
  }) => {
    const timeSlots = Object.values(TIME_SLOT_ENUM);

    // Check if selected date is today
    const isToday =
      format(new Date(selectedDate), "yyyy-MM-dd") ===
      format(new Date(), "yyyy-MM-dd");
    const currentHour = new Date().getHours();

    // Find the first available slot for today
    useEffect(() => {
      // If we don't have a selected slot yet, find the first available one
      if (selectedSlot === undefined || selectedSlot === "") {
        let firstAvailableSlot = null;

        for (const slot of timeSlots) {
          const isPastSlot = isToday && currentHour >= slot.endHour;
          const isBooked = bookedSlots[slot.id];

          if (!isPastSlot && !isBooked) {
            firstAvailableSlot = slot.id;
            break;
          }
        }

        if (firstAvailableSlot !== null) {
          onChange(firstAvailableSlot);
        }
      }
    }, [
      selectedDate,
      isToday,
      currentHour,
      bookedSlots,
      selectedSlot,
      onChange,
    ]);

    return (
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Chọn khung giờ xét nghiệm *
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {timeSlots.map((slot) => {
            // Slot is disabled if:
            // 1. It's today and the slot's end time has passed, OR
            // 2. The slot is already booked by this user on this date
            const isPastSlot = isToday && currentHour >= slot.endHour;
            const isBooked = bookedSlots[slot.id];
            const isDisabled = isPastSlot || isBooked;

            return (
              <div
                key={slot.id}
                onClick={() => !isDisabled && onChange(slot.id)}
                className={`cursor-pointer border rounded-lg p-4 transition-all ${
                  selectedSlot === slot.id
                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                    : isDisabled
                    ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                role="button"
                tabIndex={isDisabled ? -1 : 0}
                aria-disabled={isDisabled}
                aria-pressed={selectedSlot === slot.id}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-medium mb-1">{slot.time}</span>
                  <span className="text-xs text-gray-500 mb-1">
                    {slot.label}
                  </span>
                  {isPastSlot && (
                    <span className="text-xs text-red-500">Đã qua</span>
                  )}
                  {isBooked && (
                    <span className="text-xs text-amber-500">Đã đặt</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {isToday && (
          <p className="text-xs text-amber-600 mt-1">
            <span className="font-medium">Lưu ý:</span> Đối với đặt lịch ngày
            hôm nay, chỉ hiển thị các khung giờ còn khả dụng
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Kết quả xét nghiệm STI
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation button to go back to details */}
        <div className="mb-6 flex items-center">
          <button
            onClick={() => onBackToDetails(test)}
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" />
            Quay lại chi tiết xét nghiệm
          </button>
        </div>

        {/* Kết quả xét nghiệm */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Kết quả xét nghiệm
            </h3>

            <div className="flex space-x-2">
              {/* Nút làm mới */}
              <button
                onClick={handleRefreshData}
                className="inline-flex items-center p-2 text-gray-600 rounded-md hover:bg-gray-100"
                title="Làm mới dữ liệu"
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              {/* Nút thêm kết quả mới */}
              {(test.status === 1 || test.status === 2) && (
                <>
                  <button
                    onClick={() => {
                      setSelectedResult(null);
                      setShowUpdateResultModal(true);
                    }}
                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none"
                  >
                    <PlusCircle size={16} className="mr-2" />
                    Tạo kết quả mới
                  </button>

                  <button
                    onClick={handleUpdateResults}
                    className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none"
                  >
                    <PlusCircle size={16} className="mr-2" />
                    Cập nhật kết quả
                    {pendingCount > 0 && ` (${pendingCount})`}
                  </button>
                </>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Debug info */}
              <div className="mb-4 p-2 bg-gray-100 rounded text-xs overflow-auto">
                <p>Test ID: {test.id}</p>
                <p>
                  Test Result Count:{" "}
                  {Array.isArray(test.testResult)
                    ? test.testResult.length
                    : "N/A"}
                </p>
              </div>

              {/* Test results table */}
              {Array.isArray(test.testResult) && test.testResult.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
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
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {test.testResult.map((result) => (
                        <tr key={result.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {parameterLabels[result.parameter] ||
                              `Thông số ${result.parameter}`}
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
                            {result.processedAt
                              ? formatDateTime(result.processedAt)
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2 justify-end">
                              <button
                                onClick={() => {
                                  setSelectedResult(result);
                                  setShowUpdateResultModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Sửa kết quả"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteResult(
                                    result.id,
                                    parameterLabels[result.parameter]
                                  )
                                }
                                className="text-red-600 hover:text-red-900"
                                title="Xóa kết quả"
                                disabled={test.status === 3}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-500 mb-4">
                    Chưa có kết quả xét nghiệm.
                  </p>

                  {(test.status === 1 || test.status === 2) && (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={handleCreateNewParameter}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none"
                        >
                          <PlusCircle size={16} className="mr-2" />
                          Thêm thông số mới
                        </button>

                        {Array.isArray(test.customParameters) &&
                          test.customParameters.length > 0 && (
                            <button
                              onClick={handleUpdateResults}
                              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none"
                            >
                              <PlusCircle size={16} className="mr-2" />
                              Thêm từ tham số mặc định
                            </button>
                          )}
                      </div>

                      <p className="text-sm text-gray-500 mt-4">
                        Bạn cần thêm các thông số xét nghiệm trước khi nhập kết
                        quả.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {test.status === 2 &&
            pendingCount > 0 &&
            test.testResult?.length > 0 && (
              <div className="mt-3 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                <p className="text-sm text-yellow-700 flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  Còn {pendingCount} xét nghiệm chưa được cập nhật kết quả
                </p>
              </div>
            )}

          {test.testResult &&
            test.testResult.length > 0 &&
            test.status === 3 && (
              <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-green-700 flex items-center mb-3">
                  <CheckCircle size={18} className="mr-2" />
                  Tất cả kết quả đã hoàn thành
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  <FileText size={16} className="mr-2" />
                  Xuất báo cáo kết quả
                </button>
              </div>
            )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
          >
            Đóng
          </button>
        </div>

        {/* Modal cập nhật kết quả xét nghiệm */}
        {showUpdateResultModal && test && (
          <UpdateTestResultModal
            test={test}
            initialResult={selectedResult} // Pass the selected result if editing
            onClose={() => {
              setShowUpdateResultModal(false);
              setSelectedResult(null); // Clear selection on close
            }}
            onResultsUpdated={(updatedResults) => {
              handleResultsUpdated(updatedResults);
              setShowUpdateResultModal(false);
              setSelectedResult(null); // Clear selection after update
            }}
          />
        )}

        {/* Debug info - chỉ hiển thị trong môi trường phát triển */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 border-t pt-4">
            <summary className="cursor-pointer text-sm text-gray-500">
              Debug Info
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(
                {
                  testId: test.id,
                  status: test.status,
                  resultCount: test.testResult?.length || 0,
                  results: test.testResult,
                },
                null,
                2
              )}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default TestResultModal;
