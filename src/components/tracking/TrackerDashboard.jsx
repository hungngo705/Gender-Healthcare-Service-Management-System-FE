import React, { useState } from "react";
import HeroSection from "./HeroSection";
import TabNavigator from "./TabNavigator";
import TabContent from "./TabContent";
import Breadcrumbs from "./Breadcrumbs";
import CallToAction from "./CallToAction";

const TrackerDashboard = () => {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs />

      {/* Hero Section */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          id="calendar"
        >
          {/* Tab Navigation */}
          <TabNavigator activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Tab Content */}
          <TabContent activeTab={activeTab} />
        </div>

        {/* Call to Action */}
        <CallToAction />
      </div>
    </div>
  );
};

export default TrackerDashboard;
