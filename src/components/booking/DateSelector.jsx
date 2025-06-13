import React, { useState } from "react";
import { format, isSameDay, isWithinInterval, startOfToday, addDays, addMonths, subMonths,
  startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isAfter } from "date-fns";
import { vi } from "date-fns/locale";

const DateSelector = ({ dateOptions, selectedDate, onDateSelect }) => {
  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Calculate start and end of the 2-week period (for list view only)
  const today = startOfToday();
  const twoWeeksLater = addDays(today, 13);
  const threeMonthsLater = addMonths(today, 3);
  
  // Generate all potential bookable dates (2 weeks for list view)
  const generateTwoWeekDates = () => {
    return eachDayOfInterval({ 
      start: today, 
      end: twoWeeksLater 
    });
  };
  
  // Get all dates for the next 2 weeks
  const allTwoWeekDates = generateTwoWeekDates();
  
  // Filter out fully booked dates
  const twoWeekAvailableDates = allTwoWeekDates.filter(date => {
    // If the date is explicitly in dateOptions, it's already known to be available
    if (dateOptions.some(availableDate => isSameDay(availableDate, date))) {
      return true;
    }
    
    // If the date isn't in dateOptions, it means it's not in bookedShifts
    // We'll consider it available by default
    return true;
  });
  
  if (!twoWeekAvailableDates || twoWeekAvailableDates.length === 0) {
    return (
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Ngày</h3>
        <p className="text-sm text-gray-500 italic">
          Không có lịch làm việc trống trong thời gian sắp tới
        </p>
      </div>
    );
  }
  
  // Determine if a date is available for booking
  const isDateAvailable = (date) => {
    // Past days are not available
    if (!isAfter(date, today) && !isSameDay(date, today)) {
      return false;
    }
    
    // Future days beyond 3 months are not available
    if (isAfter(date, threeMonthsLater)) {
      return false;
    }
    
    // If the date is explicitly in dateOptions, it's known to be available
    if (dateOptions.some(availableDate => isSameDay(availableDate, date))) {
      return true;
    }
    
    // For dates not in bookedShifts, consider them available
    return true;
  };
  
  // Generate calendar days for current month
  const generateMonthCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Get all days in the current month
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add days to complete weeks (for display purposes)
    const firstDayOfWeek = monthStart.getDay(); // 0 = Sunday
    const lastDayOfWeek = monthEnd.getDay();
    
    // Add days from previous month to complete first week
    const previousMonthDays = [];
    for (let i = firstDayOfWeek; i > 0; i--) {
      previousMonthDays.push(addDays(monthStart, -i));
    }
    
    // Add days from next month to complete last week
    const nextMonthDays = [];
    for (let i = 1; i < (7 - lastDayOfWeek); i++) {
      nextMonthDays.push(addDays(monthEnd, i));
    }
    
    return [...previousMonthDays, ...days, ...nextMonthDays];
  };
  
  const calendarDays = generateMonthCalendar();
  
  // Navigation for calendar
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToCurrentMonth = () => setCurrentMonth(new Date());
  
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Ngày</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode("list")}
            className={`px-2 py-1 text-xs rounded-md flex items-center ${
              viewMode === "list" 
                ? "bg-indigo-100 text-indigo-700" 
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Danh sách
          </button>
          <button 
            onClick={() => setViewMode("calendar")}
            className={`px-2 py-1 text-xs rounded-md flex items-center ${
              viewMode === "calendar" 
                ? "bg-indigo-100 text-indigo-700" 
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Lịch
          </button>
        </div>
      </div>
      
      {viewMode === "list" ? (
        // List view - shows only next 2 weeks
        <div>
          <div className="mb-2 text-xs text-gray-500">
            Chọn ngày trong 2 tuần tới ({format(today, "yyyy-MM-dd")} - {format(twoWeeksLater, "yyyy-MM-dd")})
          </div>
          
          <div className="flex flex-wrap gap-2 pb-2">
            {twoWeekAvailableDates.map((date) => {
              // Check if this date is in bookedShifts (dateOptions)
              const isInBookedShifts = dateOptions.some(availableDate => 
                isSameDay(availableDate, date)
              );
              
              return (
                <button
                  key={date.toString()}
                  onClick={() => onDateSelect(date)}
                  className={`px-3 py-1.5 text-sm border rounded-md w-25 ${
                    selectedDate && isSameDay(selectedDate, date)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-300 hover:border-indigo-300"
                  }`}
                >
                  <div className="font-medium">
                    {format(date, "EEEE", { locale: vi })}
                  </div>
                  <div className="text-xs">
                    {format(date, "yyyy-MM-dd")}
                  </div>
                  
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // Calendar view - allows browsing up to 3 months
        <div className="mt-2">
          {/* Calendar navigation controls */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={goToPreviousMonth} 
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={isSameMonth(currentMonth, today)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isSameMonth(currentMonth, today) ? "text-gray-300" : "text-gray-600"}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="flex items-center">
              <span className="text-sm font-medium">
                {format(currentMonth, "MMMM yyyy", { locale: vi })}
              </span>
              
            </div>
            
            <button 
              onClick={goToNextMonth} 
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={isAfter(currentMonth, addMonths(today, 2))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isAfter(currentMonth, addMonths(today, 2)) ? "text-gray-300" : "text-gray-600"}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Days of week headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const available = isDateAvailable(day);
              const isSelected = selectedDate && isSameDay(selectedDate, day);
              const isPast = !isAfter(day, today) && !isSameDay(day, today);
              const isInBookedShifts = dateOptions.some(d => isSameDay(d, day));
              const isToday = isSameDay(day, today);

              return (
                <button
                  key={day.toString()}
                  onClick={() => available && isCurrentMonth && !isPast && onDateSelect(day)}
                  disabled={!available || !isCurrentMonth || isPast}
                  className={`
                    p-2 rounded-md text-center h-10
                    ${!isCurrentMonth ? "text-gray-300" : 
                      isSelected ? "bg-indigo-600 text-white" : 
                      available && !isPast ? "hover:bg-indigo-100" : 
                      "text-gray-400 cursor-not-allowed"}
                    ${isPast ? "bg-gray-50" : ""}
                  `}
                >
                  <div className="text-sm">
                    {format(day, "d")}
                  </div>
                  {/* Dot indicators: red for today */}
                  {isToday && isCurrentMonth && !isPast && (
                    <div className="h-1 w-1 rounded-full bg-red-400 mx-auto mt-0.5"></div>
                  )}
                  
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;