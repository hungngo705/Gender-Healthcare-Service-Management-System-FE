import React, { useState } from 'react';

const OvulationPredictor = () => {
  const [cycleLength, setCycleLength] = useState(28);
  const [lastPeriodDate, setLastPeriodDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const calculateOvulationDate = () => {
    const periodDate = new Date(lastPeriodDate);
    const ovulationDate = new Date(periodDate);
    ovulationDate.setDate(periodDate.getDate() + cycleLength - 14); 
    return ovulationDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateFertileWindow = () => {
    const periodDate = new Date(lastPeriodDate);
    const startDate = new Date(periodDate);
    startDate.setDate(periodDate.getDate() + cycleLength - 19); // 5 days before ovulation
    
    const endDate = new Date(periodDate);
    endDate.setDate(periodDate.getDate() + cycleLength - 10); // 1 day after ovulation
    
    return {
      start: startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      end: endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    };
  };

  const handleCycleLengthChange = (e) => {
    setCycleLength(parseInt(e.target.value, 10));
  };

  const handleLastPeriodChange = (e) => {
    setLastPeriodDate(e.target.value);
  };

  const fertileWindow = calculateFertileWindow();

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            When did your last period start?
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
            Average cycle length (days)
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
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-indigo-900 mb-2">Your Predictions:</h3>
        <div className="space-y-2">
          <p className="text-indigo-800">
            <span className="font-medium">Ovulation Day:</span> {calculateOvulationDate()}
          </p>
          <p className="text-indigo-800">
            <span className="font-medium">Fertile Window:</span> {fertileWindow.start} - {fertileWindow.end}
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Understanding Your Fertility:</h3>
        <p className="text-blue-800 text-sm">
          Your most fertile days are during your fertile window, with peak fertility occurring on your ovulation day. 
          Having intercourse during these days increases your chances of conception.
        </p>
      </div>
    </div>
  );
};

export default OvulationPredictor;