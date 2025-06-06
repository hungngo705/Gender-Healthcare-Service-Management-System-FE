import React from "react";

const TimeSlotSelector = ({ 
  timeSlots, 
  selectedTimeSlot, 
  onTimeSlotSelect, 
  checkIfBooked 
}) => {
  return (
    <div className="px-6 py-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Ca Làm Việc
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((slot) => {
          const isBooked = checkIfBooked(slot.id);
          
          return (
            <button
              key={slot.id}
              onClick={() => !isBooked && onTimeSlotSelect(slot)}
              disabled={isBooked}
              className={`px-4 py-3 border rounded-md h-[100px] ${
                isBooked
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : selectedTimeSlot?.id === slot.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 hover:border-indigo-300"
              }`}
            >
              <div className="flex flex-col items-center">
                <span>{slot.label}</span>
                <span className="text-xs">{slot.time}</span>
                {isBooked && (
                  <span className="mt-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                    Đã đặt
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotSelector;