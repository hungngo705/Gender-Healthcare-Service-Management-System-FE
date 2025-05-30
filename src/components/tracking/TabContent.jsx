import React from "react";
import CalendarView from "./CalendarView";
import OvulationPredictor from "./OvulationPrediction";
import CycleHistory from "./CycleHistory";
import SymptomsTracker from "./SymptomsTracker";
import Settings from "./Settings";

const TabContent = ({ activeTab }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "calendar":
        return <CalendarView />;
      case "prediction":
        return <OvulationPredictor />;
      case "history":
        return <CycleHistory />;
      case "symptoms":
        return <SymptomsTracker />;
      case "settings":
        return <Settings />;
      default:
        return <CalendarView />;
    }
  };

  return <div className="p-6 md:p-8">{renderTabContent()}</div>;
};

export default TabContent;
