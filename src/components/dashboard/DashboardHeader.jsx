import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, Menu, User, LogOut, Settings } from "lucide-react";
import logo from "../../assets/logo2.svg";
import UserAvatar from "../user/UserAvatar";
import userUtils from "../../utils/userUtils";
import { useAuth } from "../../contexts/AuthContext";

function DashboardHeader({
  title,
  activeTabLabel,
  searchQuery,
  setSearchQuery,
  setSidebarOpen,
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const profileMenuRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { displayName, formattedRole } = userUtils.useUserInfo();

  // Handle clicks outside of the profile menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      setIsLoggingOut(true);
      setIsFullScreenLoading(true);
      setIsProfileMenuOpen(false);

      await logout();
      
      setTimeout(() => {
        navigate("/login", { replace: true });
        setIsLoggingOut(false);
        setIsFullScreenLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error during logout:", error);
      setIsLoggingOut(false);
      setIsFullScreenLoading(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      {/* Main Header with Logo */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center">
                <img
                  src={logo}
                  alt="Gender HealthCare Logo"
                  className="h-10 w-auto mr-3"
                />
              </Link>
              <h1 className="text-xl font-bold text-gray-900 ml-2 border-l-2 border-indigo-500 pl-4">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          <div className="flex items-center">
            <button
              className="text-gray-500 focus:outline-none lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-medium text-gray-800 ml-4 lg:ml-0">
              {activeTabLabel || "Bảng điều khiển"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="relative p-1 text-gray-500 hover:text-gray-600 focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
            <div className="border-l h-6 mx-2 border-gray-200"></div>
            <div className="relative">
              <button
                className="flex items-center focus:outline-none"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-label="User profile"
              >
                <UserAvatar size="sm" />
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline-block">
                  {formattedRole}
                </span>
              </button>
              
              {/* User Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div
                  ref={profileMenuRef}
                  className="absolute right-[-20px] mt-2 w-46 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    <span>Hồ Sơ</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                  >
                    <div className="flex items-center">
                      {isLoggingOut ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full mr-2"></div>
                          <span>Đang đăng xuất...</span>
                        </>
                      ) : (
                        <>
                          <LogOut size={16} className="mr-2" />
                          <span>Đăng Xuất</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen loading overlay for logout */}
      {isFullScreenLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mt-4">
              Đang đăng xuất...
            </h3>
            <p className="text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      )}
    </>
  );
}

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  activeTabLabel: PropTypes.string,
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
  setSidebarOpen: PropTypes.func,
};

DashboardHeader.defaultProps = {
  activeTabLabel: "Bảng điều khiển",
  searchQuery: "",
};

export default DashboardHeader;
