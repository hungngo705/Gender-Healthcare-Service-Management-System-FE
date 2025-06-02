import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardConfig } from "../utils/dashboardUtils";
import userUtils from "../utils/userUtils";

// Dashboard Components
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import UserAvatar from "../components/user/UserAvatar";

// Tab Components
import OverviewTab from "../components/dashboard/tabs/OverviewTab";
import AppointmentsTab from "../components/dashboard/tabs/AppointmentsTab";
import CustomersTab from "../components/dashboard/tabs/CustomersTab";
import PatientsTab from "../components/dashboard/tabs/PatientsTab";

// Lucide Icons
import {
  LayoutDashboard,
  X,
  Users,
  Calendar,
  ClipboardList,
  MessageSquare,
  BarChart3,
  FileText,
  Settings,
  Package2,
  UserCog,
  Receipt,
} from "lucide-react";

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [greeting, setGreeting] = useState("Chào buổi sáng");
  const [searchQuery, setSearchQuery] = useState("");

  // Xác định lời chào dựa trên thời gian trong ngày
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Chào buổi sáng");
    } else if (hour < 18) {
      setGreeting("Chào buổi chiều");
    } else {
      setGreeting("Chào buổi tối");
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userRole = currentUser?.role || "staff";
  const dashboardConfig = getDashboardConfig(userRole);
  // Get menu items from config with icons
  const menuItems = dashboardConfig.menuItems.map((item) => {
    // Mapping from icon names to actual Lucide icon components
    const iconMap = {
      "chart-pie": <BarChart3 size={20} />,
      calendar: <Calendar size={20} />,
      users: <Users size={20} />,
      chat: <MessageSquare size={20} />,
      document: <FileText size={20} />,
      archive: <Package2 size={20} />,
      "user-group": <UserCog size={20} />,
      "chart-bar": <BarChart3 size={20} />,
      clipboard: <ClipboardList size={20} />,
      cash: <Receipt size={20} />,
      cog: <Settings size={20} />,
      "document-text": <FileText size={20} />,
    };

    return {
      ...item,
      iconComponent: iconMap[item.icon] || <LayoutDashboard size={20} />,
    };
  });

  // Xác định tab nội dung hiện tại
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab role={userRole} />;
      case "appointments":
        return <AppointmentsTab />;
      case "customers":
        return <CustomersTab />;
      case "records":
      case "patients":
        return <PatientsTab />;
      default:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Tab đang được phát triển</p>
          </div>
        );
    }
  };
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {" "}
      {/* Dashboard Header */}
      <DashboardHeader
        title={dashboardConfig.title}
        activeTabLabel={menuItems.find((item) => item.id === activeTab)?.label}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        {" "}
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <Sidebar
            menuItems={menuItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
          />
        </div>
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSidebarOpen(false);
            }}
            aria-label="Close sidebar"
          ></div>
        )}
        {/* Sidebar - Mobile */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:hidden transition duration-300 ease-in-out`}
        >
          <div className="flex items-center justify-between h-16 px-6 bg-indigo-600 text-white">
            <div className="flex items-center">
              <LayoutDashboard className="h-6 w-6 mr-2" />
              <span className="font-medium">Gender HealthCare</span>
            </div>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-full overflow-y-auto">
            <div className="px-4 py-2">
              {" "}
              <div className="flex items-center p-3 mb-4">
                <UserAvatar size="sm" />
                <div className="ml-3">
                  <div className="font-medium text-sm">
                    {userUtils.useUserInfo().displayName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userUtils.useUserInfo().formattedRole}
                  </div>
                </div>
              </div>{" "}
              <Sidebar
                menuItems={menuItems}
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setSidebarOpen(false);
                }}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>{" "}
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content */}
          <main className="flex-1 overflow-auto p-4 lg:p-8">
            <WelcomeBanner greeting={greeting} />

            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
