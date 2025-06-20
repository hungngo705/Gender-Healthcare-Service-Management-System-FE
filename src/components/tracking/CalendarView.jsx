import React, { useState, useEffect } from "react";
import menstrualCycleService from "../../services/menstrualCycleService";
import { Loader, RefreshCw } from "lucide-react";

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trackingData, setTrackingData] = useState([]);
  const [predictionData, setPredictionData] = useState(null);
  const [fertilityData, setFertilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all tracked cycles and predictions in parallel
      const [trackingResponse, predictionResponse, fertilityResponse] =
        await Promise.all([
          menstrualCycleService.getAllTrackings(),
          menstrualCycleService.predictNextCycle(),
          menstrualCycleService.getFertilityWindow(),
        ]);

      setTrackingData(trackingResponse);
      setPredictionData(predictionResponse);
      setFertilityData(fertilityResponse);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  // Generate calendar days with actual tracking data and predictions
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday
    const daysInMonth = lastDayOfMonth.getDate();

    const calendar = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendar.push({ day: "", isCurrentMonth: false });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD

      // Check if this day falls within any tracked period
      const isPeriod = trackingData.some((cycle) => {
        if (!cycle.cycleStartDate) return false;

        const start = new Date(cycle.cycleStartDate);
        let end;

        if (cycle.cycleEndDate) {
          end = new Date(cycle.cycleEndDate);
        } else {
          // If end date not set, assume 5 days duration
          end = new Date(start);
          end.setDate(start.getDate() + 4); // 5 days total (start day + 4)
        }

        // Format dates to compare just the date part
        const startStr = start.toISOString().split("T")[0];
        const endStr = end.toISOString().split("T")[0];

        return dateString >= startStr && dateString <= endStr;
      });

      // Check if this day is in predicted period
      let isPredictedPeriod = false;
      if (predictionData && predictionData.predictedNextPeriodStart) {
        const predictedStart = new Date(
          predictionData.predictedNextPeriodStart
        );
        const predictedEnd = new Date(
          predictionData.predictedNextPeriodEnd ||
            predictionData.predictedNextPeriodStart
        );

        if (predictionData.predictedPeriodLength) {
          predictedEnd.setDate(
            predictedStart.getDate() +
              (predictionData.predictedPeriodLength - 1)
          );
        } else {
          predictedEnd.setDate(predictedStart.getDate() + 4); // Default 5 days
        }

        const predictedStartStr = predictedStart.toISOString().split("T")[0];
        const predictedEndStr = predictedEnd.toISOString().split("T")[0];

        isPredictedPeriod =
          dateString >= predictedStartStr && dateString <= predictedEndStr;
      }

      // Check if this day is ovulation day
      let isOvulation = false;
      if (fertilityData && fertilityData.ovulationDate) {
        const ovulationDate = new Date(fertilityData.ovulationDate);
        const ovulationDateStr = ovulationDate.toISOString().split("T")[0];
        isOvulation = dateString === ovulationDateStr;
      }

      // Check if this day is in fertile window
      let isFertileWindow = false;
      if (
        fertilityData &&
        fertilityData.fertileWindowStart &&
        fertilityData.fertileWindowEnd
      ) {
        const fertileStart = new Date(fertilityData.fertileWindowStart);
        const fertileEnd = new Date(fertilityData.fertileWindowEnd);

        const fertileStartStr = fertileStart.toISOString().split("T")[0];
        const fertileEndStr = fertileEnd.toISOString().split("T")[0];

        isFertileWindow =
          dateString >= fertileStartStr &&
          dateString <= fertileEndStr &&
          dateString !== (isOvulation ? dateString : null); // Don't mark ovulation day as fertile window
      }

      calendar.push({
        day,
        date,
        isCurrentMonth: true,
        isPeriod,
        isPredictedPeriod,
        isOvulation,
        isFertileWindow,
      });
    }

    return calendar;
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const calendarDays = generateCalendar();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
        <p>{error}</p>
        <button
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md flex items-center justify-center mx-auto"
          onClick={() => fetchData()}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Lịch Theo Dõi Chu Kỳ
        </h2>
        <button
          onClick={fetchData}
          className="flex items-center px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Làm mới
        </button>
      </div>

      {/* Prediction Info */}
      {predictionData && (
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <h3 className="text-sm font-semibold text-indigo-800 mb-2">
            Dự đoán chu kỳ tiếp theo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-indigo-700">
                <span className="font-medium">Chu kỳ tiếp theo:</span>{" "}
                {new Date(
                  predictionData.predictedNextPeriodStart
                ).toLocaleDateString("vi-VN")}
                {predictionData.predictedNextPeriodEnd &&
                  ` - ${new Date(
                    predictionData.predictedNextPeriodEnd
                  ).toLocaleDateString("vi-VN")}`}
              </p>
              <p className="text-indigo-700">
                <span className="font-medium">Độ chính xác:</span>{" "}
                {predictionData.confidenceScore
                  ? `${predictionData.confidenceScore}%`
                  : "Chưa xác định"}
              </p>
            </div>
            {fertilityData && (
              <div>
                <p className="text-indigo-700">
                  <span className="font-medium">Ngày rụng trứng:</span>{" "}
                  {fertilityData.ovulationDate
                    ? new Date(fertilityData.ovulationDate).toLocaleDateString(
                        "vi-VN"
                      )
                    : "Chưa xác định"}
                </p>
                <p className="text-indigo-700">
                  <span className="font-medium">Thời kỳ sinh sản:</span>{" "}
                  {fertilityData.fertileWindowStart &&
                  fertilityData.fertileWindowEnd
                    ? `${new Date(
                        fertilityData.fertileWindowStart
                      ).toLocaleDateString("vi-VN")} - ${new Date(
                        fertilityData.fertileWindowEnd
                      ).toLocaleDateString("vi-VN")}`
                    : "Chưa xác định"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calendar Widget */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              Hôm Nay
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Days */}
        <div className="p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
              <div
                key={day}
                className="text-center text-gray-500 text-sm font-medium"
              >
                {day}
              </div>
            ))}
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <div
                key={`calendar-day-${
                  day.isCurrentMonth ? day.day : "empty"
                }-${index}`}
                onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
                className={`
                  relative h-16 p-1 border rounded-lg flex flex-col items-center justify-start cursor-pointer
                  ${
                    !day.isCurrentMonth
                      ? "bg-gray-50 border-gray-100"
                      : "hover:bg-gray-50 border-gray-200"
                  }
                  ${
                    day.date &&
                    day.date.toDateString() === selectedDate.toDateString()
                      ? "ring-2 ring-indigo-500"
                      : ""
                  }
                `}
              >
                {day.isCurrentMonth && (
                  <>
                    <span
                      className={`
                      w-7 h-7 flex items-center justify-center rounded-full text-sm
                      ${day.isPeriod ? "bg-red-100 text-red-800" : ""}
                      ${
                        day.isPredictedPeriod && !day.isPeriod
                          ? "bg-rose-50 text-red-600 border border-dashed border-red-300"
                          : ""
                      }
                      ${
                        day.isOvulation
                          ? "bg-green-600 text-white font-bold"
                          : ""
                      }
                      ${
                        day.isFertileWindow && !day.isOvulation
                          ? "bg-indigo-100 text-indigo-800"
                          : ""
                      }
                    `}
                    >
                      {day.day}
                    </span>

                    {/* Indicator dots */}
                    <div className="mt-1 flex space-x-1">
                      {day.isPeriod && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      )}
                      {day.isPredictedPeriod && !day.isPeriod && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-300"></span>
                      )}
                      {day.isOvulation && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      )}
                      {day.isFertileWindow && !day.isOvulation && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-300"></span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Chú Thích Lịch
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full bg-red-100 mr-2"></span>
            <span className="text-sm text-gray-600">Kỳ Kinh Nguyệt Đã Qua</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full bg-rose-50 border border-dashed border-red-300 mr-2"></span>
            <span className="text-sm text-gray-600">
              Kỳ Kinh Nguyệt Dự Đoán
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full bg-green-600 mr-2"></span>
            <span className="text-sm text-gray-600">Ngày Rụng Trứng</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full bg-indigo-100 mr-2"></span>
            <span className="text-sm text-gray-600">Thời Kỳ Sinh Sản</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
