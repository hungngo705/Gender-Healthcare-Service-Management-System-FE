import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getDashboardConfig,
  getTimeBasedGreeting,
} from "../utils/dashboardUtils";

// Import các component đã tách
import DashboardHeader from "../components/dashboard/DashboardHeader";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import Sidebar from "../components/dashboard/Sidebar";
import OverviewTab from "../components/dashboard/tabs/OverviewTab";
import AppointmentsTab from "../components/dashboard/tabs/AppointmentsTab";
import CustomersTab from "../components/dashboard/tabs/CustomersTab";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { currentUser, userRole, isStaffOrHigher } = useAuth();
  const [greeting, setGreeting] = useState("");

  // Set greeting based on time of day
  useEffect(() => {
    setGreeting(getTimeBasedGreeting());
  }, []);

  // Redirect non-staff users if they try to access the dashboard
  if (!isStaffOrHigher()) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          from: "/dashboard",
          requiredRole: "staff",
          currentRole: userRole,
        }}
      />
    );
  }

  // Get dashboard configuration based on user role
  const config = getDashboardConfig(userRole);

  // Nội dung tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab role={userRole} />;
      case "appointments":
        return <AppointmentsTab />;
      case "customers":
        return <CustomersTab />;
      // For simplicity, only include the implemented tabs
      // Add placeholder for other tabs
      default:
        return (
          <div className="p-8 text-center text-gray-500">
            <p>Tab "{activeTab}" đang được phát triển</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader title={config.title} />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome banner */}
        <WelcomeBanner greeting={greeting} userName={currentUser?.name} />

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <Sidebar
            menuItems={config.menuItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Content area */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
