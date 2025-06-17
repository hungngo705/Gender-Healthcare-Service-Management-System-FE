import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import userService from "../services/userService";
import {
  Bell,
  X,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Shield,
  CreditCard,
  Clock,
} from "lucide-react";
import userUtils from "../utils/userUtils";

// Components
import ProfileTab from "../components/profile/tabs/ProfileTab";
import AppointmentsTab from "../components/profile/tabs/AppointmentsTab";
import MedicalRecordsTab from "../components/profile/tabs/MedicalRecordsTab";
import NotificationsTab from "../components/profile/tabs/NotificationsTab";
import SecurityTab from "../components/profile/tabs/SecurityTab";
import SecuritySessionsTab from "../components/profile/tabs/SecuritySessionsTab";
import PaymentsTab from "../components/profile/tabs/PaymentsTab";
import UserAvatar from "../components/user/UserAvatar";

/**
 * Improved Customer Profile page
 * Features enhanced navigation menu and better integration of user profile information
 */
function CustomerProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "profile");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsVisible, setNotificationsVisible] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    gender: "",
    createdAt: "",
    lastLoginAt: "",
    totalAppointments: 0,
    totalSTITests: 0,
    totalPosts: 0,
    isActive: true,
    emergencyContact: "",
  });

  // Mock notifications data for demo
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "Nhắc nhở cuộc hẹn",
        message: "Cuộc hẹn với bác sĩ vào ngày mai, 10:00 AM",
        date: "2025-06-04T10:00:00Z",
        type: "appointment",
        isRead: false,
      },
      {
        id: 2,
        title: "Kết quả xét nghiệm",
        message: "Kết quả xét nghiệm máu của bạn đã sẵn sàng",
        date: "2025-06-03T14:30:00Z",
        type: "medical",
        isRead: false,
      },
      {
        id: 3,
        title: "Thanh toán thành công",
        message: "Thanh toán dịch vụ khám sức khỏe thành công",
        date: "2025-06-01T09:15:00Z",
        type: "payment",
        isRead: true,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.isRead).length);
  }, []);

  // Load user profile data from API
  const loadUserProfile = useCallback(async () => {
    try {
      const userData = await userService.getCurrentUserProfile(); // Map API response to local state structure
      setProfileData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phoneNumber || "",
        address: userData.address || "",
        avatarUrl: userData.avatarUrl || "",
        totalAppointments: userData.totalAppointments || 0,
        totalSTITests: userData.totalSTITests || 0,
        totalPosts: userData.totalPosts || 0,
        isActive: userData.isActive || true,
      });
    } catch (error) {
      console.error("Failed to load user profile:", error);
      // Fallback to localStorage data if API fails
      if (currentUser) {
        setProfileData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          phone: currentUser.phoneNumber || currentUser.phone || "",
          address: currentUser.address || "",
          avatarUrl: currentUser.avatarUrl || "",
          totalAppointments: 0,
          totalSTITests: 0,
          totalPosts: 0,
          isActive: currentUser.isActive || true,
        });
      }
    }
  }, [currentUser]); // Update profile data when user data is available
  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser, loadUserProfile]); // Handle saving profile information
  const handleSaveProfile = async (updatedData) => {
    try {
      // Prepare data for API call - map to API expected format
      const apiData = {
        name: updatedData.name,
        email: updatedData.email,
        phoneNumber: updatedData.phone,
        address: updatedData.address,
      };

      // Call API to update profile
      const updatedProfile = await userService.updateCurrentUserProfile(
        apiData
      ); // Update local state with response data
      setProfileData({
        name: updatedProfile.name || updatedData.name,
        email: updatedProfile.email || updatedData.email,
        phone: updatedProfile.phoneNumber || updatedData.phone,
        address: updatedProfile.address || updatedData.address,
        avatarUrl: profileData.avatarUrl,
        totalAppointments: profileData.totalAppointments || 0,
        totalSTITests: profileData.totalSTITests || 0,
        totalPosts: profileData.totalPosts || 0,
        isActive: profileData.isActive || true,
      }); // Reload profile data to ensure consistency
      await loadUserProfile();
    } catch (error) {
      console.error("Failed to save profile:", error);
      // If API fails, keep local data and show error
      setProfileData(updatedData);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
    setUnreadCount(0);
  };

  // Mark a single notification as read
  const handleMarkAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "medical":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "payment":
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
    }
  };

  // Navigation tabs with icons
  const tabs = [
    {
      id: "profile",
      label: "Thông tin cá nhân",
      icon: <User size={16} className="mr-3" />,
    },
    {
      id: "appointments",
      label: "Lịch hẹn",
      icon: <Calendar size={16} className="mr-3" />,
    },
    {
      id: "medical-records",
      label: "Hồ sơ y tế",
      icon: <FileText size={16} className="mr-3" />,
    },
    {
      id: "notifications",
      label: "Thông báo",
      icon: <Bell size={16} className="mr-3" />,
    },
    {
      id: "security",
      label: "Bảo mật",
      icon: <Shield size={16} className="mr-3" />,
    },
    {
      id: "sessions",
      label: "Phiên đăng nhập",
      icon: <Clock size={16} className="mr-3" />,
    },
    {
      id: "payments",
      label: "Thanh toán",
      icon: <CreditCard size={16} className="mr-3" />,
    },
  ];

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab profileData={profileData} onSave={handleSaveProfile} />
        );
      case "appointments":
        return (
          <AppointmentsTab navigate={navigate} currentUser={profileData} />
        );
      case "medical-records":
        return <MedicalRecordsTab currentUser={profileData} />;
      case "notifications":
        return <NotificationsTab onMarkAllRead={handleMarkAllAsRead} />;
      case "security":
        return <SecurityTab />;
      case "sessions":
        return <SecuritySessionsTab currentUser={profileData} />;
      case "payments":
        return <PaymentsTab />;
      default:
        return (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Tab đang được phát triển</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Mobile Navigation - Clean tabs matching the mockup */}
      <div className="lg:hidden mb-6 overflow-x-auto sticky top-0 z-20 bg-white shadow-sm py-2 -mx-4 px-4">
        <div className="flex border-b border-gray-200">
          <div className="flex w-full overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const hasNotifications =
                tab.id === "notifications" && unreadCount > 0;

              return (
                <button
                  key={tab.id}
                  className={`whitespace-nowrap px-3 py-2 text-sm transition flex items-center justify-center ${
                    isActive
                      ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                  {hasNotifications && (
                    <span className="ml-1.5 inline-flex items-center justify-center h-4 w-4 text-xs font-bold rounded-full bg-red-100 text-red-800">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - User Information */}
        <div className="lg:w-1/3 space-y-6">
          {/* Combined User Profile Card and Navigation */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* User Info Section */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Thông tin cá nhân
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-shrink-0 relative">
                  <UserAvatar size="lg" />
                  <button
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm border border-gray-200 hover:bg-gray-50"
                    aria-label="Change profile picture"
                    title="Thay đổi ảnh đại diện"
                    onClick={() => setActiveTab("profile")}
                  >
                    <Edit className="h-3 w-3 text-gray-500" />
                  </button>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {currentUser?.name || profileData.name || ""}
                  </h3>

                  <span className="inline-block px-3 py-1 mt-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {currentUser
                      ? userUtils.formatRole(userUtils.getUserRole(currentUser))
                      : "Khách hàng"}
                  </span>

                  <button
                    onClick={() => setActiveTab("profile")}
                    className="mt-2 flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Chỉnh sửa thông tin
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="w-full mt-5 space-y-3 border-t border-gray-100 pt-4">
                {currentUser?.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{currentUser.email}</span>
                  </div>
                )}

                {(currentUser?.phone || currentUser?.phoneNumber) && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{currentUser.phone || currentUser.phoneNumber}</span>
                  </div>
                )}

                {currentUser?.address && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{currentUser.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="sticky top-4 z-10">
              <ul className="divide-y divide-gray-100">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const hasNotifications =
                    tab.id === "notifications" && unreadCount > 0;

                  return (
                    <li key={tab.id}>
                      <button
                        className={`w-full flex items-center px-6 py-3.5 text-sm transition ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {hasNotifications && (
                          <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-800">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-indigo-600" />
                <h3 className="font-medium text-gray-900">Thông báo gần đây</h3>
              </div>

              <div className="flex items-center">
                {unreadCount > 0 && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full mr-3">
                    {unreadCount}
                  </span>
                )}
                <button
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setNotificationsVisible(!notificationsVisible)}
                  aria-label={
                    notificationsVisible
                      ? "Hide notifications"
                      : "Show notifications"
                  }
                >
                  {notificationsVisible ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {notificationsVisible && (
              <div className="divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={36} className="mx-auto text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">
                      Không có thông báo nào
                    </p>
                  </div>
                ) : (
                  <>
                    {notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex p-4 ${
                          notification.isRead
                            ? ""
                            : "bg-blue-50 border-l-4 border-blue-500"
                        }`}
                      >
                        <div className="mr-3 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4
                              className={`text-sm font-medium ${
                                notification.isRead
                                  ? "text-gray-700"
                                  : "text-gray-900"
                              }`}
                            >
                              {notification.title}
                            </h4>

                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                aria-label="Mark as read"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>

                          <div className="mt-1 text-xs text-gray-500">
                            {formatDate(notification.date)}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="px-4 py-3 flex justify-between items-center bg-gray-50">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          Đánh dấu tất cả đã đọc
                        </button>
                      )}

                      {notifications.length > 3 && (
                        <button
                          onClick={() => setActiveTab("notifications")}
                          className={`text-sm font-medium text-indigo-600 hover:text-indigo-800 ${
                            unreadCount > 0 ? "ml-auto" : ""
                          }`}
                        >
                          Xem tất cả thông báo
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
