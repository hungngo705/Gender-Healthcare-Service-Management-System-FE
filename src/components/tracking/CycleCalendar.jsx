import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Example period, fertile, and ovulation days - in a real app, these would come from user data
  const periodDays = [4, 5, 6, 7];
  const fertileWindowDays = [14, 15, 16, 17];
  const ovulationDay = 16;
  
  // Generate calendar days array
  const calendarDays = [];
  
  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: '', isEmpty: true });
  }
  
  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ day, isEmpty: false });
  }

  return (
    <div className="mt-4 mx-auto">
      {/* Calendar header with month/year and navigation */}
      <div className="flex justify-between items-center mb-5">
        <button 
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-7 w-7 text-gray-600" />
        </button>
        
        <h3 className="text-2xl font-bold text-gray-800">
          {monthName} {currentYear}
        </h3>
        
        <button 
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-7 w-7 text-gray-600" />
        </button>
      </div>
      
      {/* Days of week headers */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
          <div key={idx} className="text-center font-semibold text-base text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((calendarDay, index) => (
          <div 
            key={index} 
            className={`
              h-12 w-12 flex items-center justify-center rounded-full text-base
              ${calendarDay.isEmpty ? 'text-gray-300' : 'hover:bg-gray-100 cursor-pointer'}
              ${!calendarDay.isEmpty && periodDays.includes(calendarDay.day) ? 'bg-red-100 text-red-600' : ''}
              ${!calendarDay.isEmpty && fertileWindowDays.includes(calendarDay.day) ? 'bg-blue-100 text-blue-600' : ''}
              ${!calendarDay.isEmpty && calendarDay.day === ovulationDay ? 'bg-purple-100 text-purple-600' : ''}
            `}
          >
            {calendarDay.day}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex justify-center space-x-6 text-base">
        <div className="flex items-center">
          <span className="w-5 h-5 bg-red-500 rounded-full mr-2"></span>
          <span className="text-gray-700 font-medium">Period</span>
        </div>
        <div className="flex items-center">
          <span className="w-5 h-5 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-gray-700 font-medium">Fertile</span>
        </div>
        <div className="flex items-center">
          <span className="w-5 h-5 bg-purple-500 rounded-full mr-2"></span>
          <span className="text-gray-700 font-medium">Ovulation</span>
        </div>
      </div>
      
      {/* Today button */}
      <div className="mt-6 text-center">
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