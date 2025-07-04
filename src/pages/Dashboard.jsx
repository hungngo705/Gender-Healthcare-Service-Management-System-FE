import { useState, useEffect, useCallback } from "react";
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

// New Role-Based Tab Components
import ConsultantAppointmentsTab from "../components/dashboard/tabs/ConsultantAppointmentsTab";
import TestProcessingTab from "../components/dashboard/tabs/TestProcessingTab";
import BlogManagementTab from "../components/dashboard/tabs/BlogManagementTab";
import ServicesManagementTab from "../components/dashboard/tabs/ServicesManagementTab";
import UserManagementTab from "../components/dashboard/tabs/UserManagementTab";
import STITestingManagementTab from "../components/dashboard/tabs/STITestingManagementTab";

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
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // Custom setter for activeTab
  const handleSetActiveTab = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);
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
  }; // Get user role information using the useUserInfo hook from userUtils
  const { userRole: currentUserRole } = userUtils.useUserInfo();
  // Determine the user's role with proper prioritization
  let userRole = currentUserRole?.toLowerCase() || "staff";

  // Bỏ qua logic xác định vai trò ban đầu để debug
  /*
  // Define role priority order (higher priority roles first)
  const priorityOrder = ["admin", "manager", "consultant", "staff"];

  // Check if user has multiple roles and get the highest priority one
  if (rolesList && rolesList.length > 0) {
    for (const role of priorityOrder) {
      if (
        rolesList.some((r) => {
          const roleLower =
            typeof r === "string"
              ? r.toLowerCase()
              : r?.name?.toLowerCase() || r?.role?.toLowerCase() || "";
          return roleLower === role;
        })
      ) {
        userRole = role;
        break;
      }
    }
  } else if (currentUserRole) {
    // If single role, normalize it
    if (typeof currentUserRole === "string") {
      userRole = currentUserRole.toLowerCase();
    } else if (typeof currentUserRole === "object") {
      const roleName =
        currentUserRole.name || currentUserRole.role || currentUserRole.type;
      if (roleName) {
        userRole = roleName.toLowerCase();
      }
    }
  }
  */
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
  }); // Kiểm tra quyền truy cập tab dựa trên vai trò
  const checkTabAccess = useCallback(
    (tabId) => {
      // Define role-based tab access permissions
      const tabPermissions = {
        // Tabs for all roles
        overview: ["admin", "manager", "staff", "consultant"],

        // Consultant-specific tabs
        consultantAppointments: ["consultant"],
        testProcessing: ["consultant"],

        // Staff-specific tabs
        blogManagement: ["staff", "manager", "admin"],
        appointments: ["staff", "manager", "admin", "consultant"],
        stiTestingManagement: ["staff", "manager", "admin"],

        // Manager-specific tabs
        servicesManagement: ["manager", "admin"],
        reports: ["manager", "admin"],

        // Admin-specific tabs
        userManagement: ["admin"],
        system: ["admin"],
        logs: ["admin"],

        // Common tabs with different content based on role
        customers: ["staff", "manager", "admin", "consultant"],
        patients: ["staff", "manager", "admin", "consultant"],
      };

      // Check if the current user has permission for the tab
      const permissions = tabPermissions[tabId] || [];
      const hasAccess = permissions.includes(userRole);
      return hasAccess;
    },
    [userRole]
  ); // Mở tab đầu tiên có quyền truy cập khi tải trang
  useEffect(() => {
    // Find first accessible tab from menu items
    const firstAccessibleTab =
      menuItems.find((item) => checkTabAccess(item.id))?.id || "overview"; // Only set the active tab on initial load or if the current one is invalid
    if (!activeTab || !menuItems.find((item) => item.id === activeTab)) {
      handleSetActiveTab(firstAccessibleTab);
    }
  }, [userRole, menuItems, checkTabAccess, activeTab, handleSetActiveTab]);
  // Xác định tab nội dung hiện tại
  const renderTabContent = () => {
    // Check if user has access to this tab, if not redirect to overview
    if (!checkTabAccess(activeTab)) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-red-500">
            Chức năng đang được phát triển. Vui lòng quay lại sau.
          </p>
        </div>
      );
    }
    switch (activeTab) {
      case "overview":
        console.log(`🎯 Rendering OverviewTab with role: ${userRole}`);
        return <OverviewTab role={userRole} />;
      case "appointments":
        console.log(`Rendering AppointmentsTab with role: ${userRole}`);
        return <AppointmentsTab role={userRole} />;
      case "consultantAppointments":
        console.log(
          `Rendering ConsultantAppointmentsTab with role: ${userRole}`
        );
        return <ConsultantAppointmentsTab role={userRole} />;
      case "testProcessing":
        console.log(`Rendering TestProcessingTab with role: ${userRole}`);
        return <TestProcessingTab role={userRole} />;
      case "blogManagement":
        console.log(`Rendering BlogManagementTab with role: ${userRole}`);
        return <BlogManagementTab role={userRole} />;
      case "servicesManagement":
        console.log(`Rendering ServicesManagementTab with role: ${userRole}`);
        return <ServicesManagementTab role={userRole} />;
      case "userManagement":
        console.log(`Rendering UserManagementTab with role: ${userRole}`);
        return <UserManagementTab role={userRole} />;
      case "stiTestingManagement":
        console.log(`Rendering STITestingManagementTab with role: ${userRole}`);
        return <STITestingManagementTab role={userRole} />;
      case "customers":
        console.log(`Rendering CustomersTab with role: ${userRole}`);
        return <CustomersTab role={userRole} />;
      case "records":
      case "patients":
        console.log(`Rendering PatientsTab with role: ${userRole}`);
        return <PatientsTab role={userRole} />;
      default:
        console.log(`Tab ${activeTab} is under development`);
        return (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Tab đang được phát triển</p>
          </div>
        );
    }
  };
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Dashboard Header */}
      <DashboardHeader
        title={dashboardConfig.title}
        activeTabLabel={menuItems.find((item) => item.id === activeTab)?.label}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <Sidebar
            menuItems={menuItems}
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab}
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
          </div>{" "}
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
                  handleSetActiveTab(tab);
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
