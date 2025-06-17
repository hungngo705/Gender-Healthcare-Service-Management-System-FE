import React, { useState, useEffect } from "react";
import menstrualCycleService from "../../services/menstrualCycleService";
import { Loader, AlertCircle } from "lucide-react";

const OvulationPredictor = () => {
  const [cycleLength, setCycleLength] = useState(28);
  const [lastPeriodDate, setLastPeriodDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [fertilityWindow, setFertilityWindow] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get prediction for next cycle
        const predictionData = await menstrualCycleService.predictNextCycle();
        setPrediction(predictionData);

        // Get fertility window data
        const fertilityData = await menstrualCycleService.getFertilityWindow();
        setFertilityWindow(fertilityData);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch prediction data:", err);
        setError("Không thể tải dữ liệu dự đoán. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const handleCycleLengthChange = (e) => {
    setCycleLength(parseInt(e.target.value, 10));
  };

  const handleLastPeriodChange = (e) => {
    setLastPeriodDate(e.target.value);
  };

  const handleSubmitCustomData = async () => {
    setLoading(true);
    try {
      // In a real implementation, we would send this data to the backend
      // For now, just simulate API call and refresh predictions
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Refetch predictions with new parameters
      const predictionData = await menstrualCycleService.predictNextCycle();
      setPrediction(predictionData);

      const fertilityData = await menstrualCycleService.getFertilityWindow();
      setFertilityWindow(fertilityData);

      setLoading(false);
    } catch (err) {
      console.error("Failed to update predictions:", err);
      setError("Không thể cập nhật dữ liệu dự đoán. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kỳ kinh nguyệt gần đây nhất của bạn bắt đầu khi nào?
          </label>
          <input
            type="date"
            value={lastPeriodDate}
            onChange={handleLastPeriodChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Độ dài chu kỳ trung bình (ngày)
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="21"
              max="35"
              value={cycleLength}
              onChange={handleCycleLengthChange}
              className="w-full mr-4"
            />
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
              {cycleLength}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>21</span>
            <span>28</span>
            <span>35</span>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmitCustomData}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Đang tính toán..." : "Cập nhật dự đoán"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin h-6 w-6 text-indigo-600 mr-2" />
          <span className="text-gray-600">Đang tính toán...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <>
          <div className="bg-indigo-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-indigo-900 mb-2">
              Kết Quả Dự Đoán:
            </h3>
            <div className="space-y-2">
              {prediction && (
                <div>
                  <p className="text-indigo-800">
                    <span className="font-medium">Chu kỳ tiếp theo:</span>{" "}
                    {formatDateString(prediction.predictedNextPeriodStart)} đến{" "}
                    {formatDateString(prediction.predictedNextPeriodEnd)}
                  </p>
                  <p className="text-indigo-800">
                    <span className="font-medium">Độ dài chu kỳ dự đoán:</span>{" "}
                    {prediction.predictedCycleLength} ngày
                  </p>
                  <p className="text-indigo-800">
                    <span className="font-medium">Độ dài kỳ kinh dự đoán:</span>{" "}
                    {prediction.predictedPeriodLength} ngày
                  </p>
                  <p className="text-indigo-800">
                    <span className="font-medium">Độ chính xác:</span>{" "}
                    {prediction.confidenceLevel} ({prediction.confidenceScore}%)
                  </p>
                </div>
              )}

              {fertilityWindow && (
                <div className="mt-4">
                  <p className="text-indigo-800">
                    <span className="font-medium">Ngày Rụng Trứng:</span>{" "}
                    {formatDateString(fertilityWindow.ovulationDate)}
                  </p>
                  <p className="text-indigo-800">
                    <span className="font-medium">Thời Kỳ Dễ Thụ Thai:</span>{" "}
                    {formatDateString(fertilityWindow.fertileWindowStart)} -{" "}
                    {formatDateString(fertilityWindow.fertileWindowEnd)}
                  </p>
                  <p className="text-indigo-800">
                    <span className="font-medium">Giai đoạn sinh sản:</span>{" "}
                    {fertilityWindow.fertilityPhase}
                  </p>
                </div>
              )}
            </div>
          </div>

          {fertilityWindow && fertilityWindow.recommendations && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Lời khuyên:</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                {fertilityWindow.recommendations.map((rec, index) => (
                  <li key={index} className="ml-4 list-disc">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OvulationPredictor;
