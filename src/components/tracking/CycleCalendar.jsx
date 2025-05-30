import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CycleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get month details
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Navigation functions
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Get formatted month name
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Example period, fertile, and ovulation days - in a real app, these would come from user data
  const periodDays = [4, 5, 6, 7];
  const fertileWindowDays = [14, 15, 16, 17];
  const ovulationDay = 16;

  // Generate calendar days array
  const calendarDays = [];

  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: "", isEmpty: true });
  }

  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ day, isEmpty: false });
  }

  return (
    <div className="bg-white rounded-lg p-4 mt-4 mx-auto">
      {/* Calendar header with month/year and navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={prevMonth}
          className="text-gray-600 hover:text-indigo-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <h3 className="text-lg font-medium">
          {monthName} {currentYear}
        </h3>

        <button
          onClick={nextMonth}
          className="text-gray-600 hover:text-indigo-600"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-gray-600 font-medium text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((calendarDay, index) => (
          <div
            key={index}
            className={`
              aspect-square flex flex-col items-center justify-center rounded-full 
              ${calendarDay.isEmpty ? "opacity-0" : "cursor-pointer"} 
              ${
                !calendarDay.isEmpty && periodDays.includes(calendarDay.day)
                  ? "bg-red-100 text-red-800"
                  : ""
              }
              ${
                !calendarDay.isEmpty &&
                fertileWindowDays.includes(calendarDay.day)
                  ? "bg-blue-100 text-blue-600"
                  : ""
              }
              ${
                !calendarDay.isEmpty && calendarDay.day === ovulationDay
                  ? "bg-purple-100 text-purple-600"
                  : ""
              }
              ${
                !calendarDay.isEmpty && calendarDay.day === 15
                  ? "font-bold"
                  : ""
              }
            `}
          >
            {calendarDay.day > 0 && calendarDay.day <= 31 && (
              <>
                <span className={`text-sm`}>{calendarDay.day}</span>
                {calendarDay.day === 15 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1"></span>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex justify-center space-x-6 text-base">
        <div className="flex items-center">
          <span className="w-5 h-5 bg-red-500 rounded-full mr-2"></span>
          <span className="text-gray-700 font-medium">Kinh nguyệt</span>
        </div>
        <div className="flex items-center">
          <span className="w-5 h-5 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-gray-700 font-medium">Dễ thụ thai</span>
        </div>
        <div className="flex items-center">
          <span className="w-5 h-5 bg-purple-500 rounded-full mr-2"></span>
          <span className="text-gray-700 font-medium">Rụng trứng</span>
        </div>
      </div>

      {/* Today button */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-6 py-2.5 text-base bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 transition-colors"
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default CycleCalendar;
