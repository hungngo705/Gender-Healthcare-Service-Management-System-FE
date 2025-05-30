import React, { useState } from "react";

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate calendar days
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

      // Sample period and ovulation days - in a real app this would come from user data
      const isPeriod = day >= 1 && day <= 5;
      const isOvulation = day === 14;
      const isFertileWindow = day >= 11 && day <= 17 && !isOvulation;

      calendar.push({
        day,
        date,
        isCurrentMonth: true,
        isPeriod,
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

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Lịch Theo Dõi Chu Kỳ</h2>

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
                        day.isOvulation
                          ? "bg-indigo-600 text-white font-bold"
                          : ""
                      }
                      ${
                        day.isFertileWindow
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
                      {day.isOvulation && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
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
            <span className="text-sm text-gray-600">Kỳ Kinh Nguyệt</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full bg-indigo-600 mr-2"></span>
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