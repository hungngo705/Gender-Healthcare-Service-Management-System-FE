// filepath: /Users/hungngokhanh/Desktop/Term 5/SWP/Gender-Healthcare-Service-Management-System-FE/src/hooks/useTracking.js

import { useState, useEffect } from 'react';

const useTracking = () => {
  const [cycleData, setCycleData] = useState([]);
  const [ovulationPrediction, setOvulationPrediction] = useState(null);
  const [reminders, setReminders] = useState([]);

  const addCycleData = (data) => {
    setCycleData((prevData) => [...prevData, data]);
  };

  const predictOvulation = () => {
    // Logic to predict ovulation based on cycleData
    if (cycleData.length > 0) {
      const lastCycle = cycleData[cycleData.length - 1];
      const predictedDate = new Date(lastCycle.startDate);
      predictedDate.setDate(predictedDate.getDate() + 14); // Assuming a 28-day cycle
      setOvulationPrediction(predictedDate);
    }
  };

  const addReminder = (reminder) => {
    setReminders((prevReminders) => [...prevReminders, reminder]);
  };

  useEffect(() => {
    predictOvulation();
  }, [cycleData]);

  return {
    cycleData,
    addCycleData,
    ovulationPrediction,
    reminders,
    addReminder,
  };
};

export default useTracking;