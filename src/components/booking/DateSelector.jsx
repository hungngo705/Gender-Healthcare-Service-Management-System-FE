import React from "react";
import { format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";

const DateSelector = ({ dateOptions, selectedDate, onDateSelect }) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Ngày</h3>
      <div className="flex flex-wrap gap-2">
        {dateOptions.map((date) => (
          <button
            key={date.toString()}
            onClick={() => onDateSelect(date)}
            className={`px-3 py-1.5 text-sm border rounded-md ${
              isSameDay(selectedDate, date)
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-300 hover:border-indigo-300"
            }`}
          >
            <div className="font-medium">
              {format(date, "EEEE", { locale: vi })}
            </div>
            <div className="text-xs">
              {format(date, "dd/MM/yyyy")}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;