import React, { createContext, useContext, useState } from 'react';

// Create a context for tracking
const TrackingContext = createContext();

// Create a provider component
export const TrackingProvider = ({ children }) => {
  const [cycleData, setCycleData] = useState([]);
  const [ovulationData, setOvulationData] = useState([]);
  const [reminders, setReminders] = useState([]);

  const addCycleData = (data) => {
    setCycleData((prevData) => [...prevData, data]);
  };

  const predictOvulation = (cycleLength) => {
    // Logic to predict ovulation based on cycle length
    // This is a placeholder for actual prediction logic
    const predictedDate = new Date();
    predictedDate.setDate(predictedDate.getDate() + cycleLength - 14); // Example logic
    setOvulationData((prevData) => [...prevData, predictedDate]);
  };

  const addReminder = (reminder) => {
    setReminders((prevReminders) => [...prevReminders, reminder]);
  };

  return (
    <TrackingContext.Provider
      value={{
        cycleData,
        addCycleData,
        ovulationData,
        predictOvulation,
        reminders,
        addReminder,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

// Custom hook to use the TrackingContext
export const useTracking = () => {
  return useContext(TrackingContext);
};