import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo2.svg";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import userService from "../services/userService"; // Changed from userUtils

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const { logout, isAuthenticated, isStaffOrHigher } = useAuth();
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    avatarInfo: { imageUrl: "", initial: "" },
  });
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  // Fetch user profile data using userService
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const userData = await userService.getCurrentUserProfile();

          // Extract display name from user data
          const displayName = userData.name || "User";

          // Create avatar info
          const avatarInfo = {
            imageUrl: userData.avatarUrl || "",
            initial: displayName ? displayName.charAt(0).toUpperCase() : "U",
          };

          setUserProfile({ displayName, avatarInfo });
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  // Handle clicks outside of the profile menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    // Add event listener when the menu is open
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
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
      setIsMenuOpen(false);

      await logout();

      setTimeout(() => {
        setIsLoggingOut(false);
        setIsFullScreenLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error during logout:", error);
      setIsLoggingOut(false);
      setIsFullScreenLoading(false);
    }
  };

  // Use the values from userProfile state
  const { displayName, avatarInfo } = userProfile;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <NavLink to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto cursor-pointer" />
          </NavLink>

          {/* Desktop menu */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 items-center">
              {/* Hiển thị menu Home cho người dùng thông thường */}
              {!isStaffOrHigher() && (
                <>
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 font-medium"
                          : "text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      }
                    >
                      Trang Chủ
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/services"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 font-medium"
                          : "text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      }
                    >
                      Dịch Vụ
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/about"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 font-medium"
                          : "text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      }
                    >
                      Giới Thiệu
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/contact"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 font-medium"
                          : "text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      }
                    >
                      Liên Hệ
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/Blog"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 font-medium"
                          : "text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      }
                    >
                      Bài Viết
                    </NavLink>
                  </li>
                </>
              )}

              {/* Hiển thị liên kết Dashboard cho nhân viên */}
              {isAuthenticated && isStaffOrHigher() && (
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? "text-blue-600 font-medium"
                        : "text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}

              {/* User profile menu */}
              {isAuthenticated ? (
                <li className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                  >
                    {" "}
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                      {avatarInfo.imageUrl ? (
                        <img
                          src={avatarInfo.imageUrl}
                          alt={displayName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : avatarInfo.initial ? (
                        <span className="font-semibold">
                          {avatarInfo.initial}
                        </span>
                      ) : (
                        <User size={18} />
                      )}
                    </div>{" "}
                    <span className="font-medium">{displayName}</span>
                  </button>

                  {isProfileMenuOpen && (
                    <div
                      ref={profileMenuRef} // Add ref here
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    >
                      {" "}
                      {!isStaffOrHigher() && (
                        <>
                          <NavLink
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Hồ Sơ
                          </NavLink>{" "}
                          <NavLink
                            to="/profile?tab=appointments"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Lịch Hẹn
                          </NavLink>
                        </>
                      )}
                      {isStaffOrHigher() && (
                        <NavLink
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Dashboard
                        </NavLink>
                      )}
                      {/* Desktop logout button */}
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
                </li>
              ) : (
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
                        : "bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    }
                  >
                    Đăng Nhập
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="px-4 pt-2 pb-4">
            <ul className="space-y-3">
              {/* Menu cho người dùng thông thường trên mobile */}
              {!isStaffOrHigher() && (
                <>
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "block text-blue-600 font-medium"
                          : "block text-gray-600 hover:text-blue-600"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Trang Chủ
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/services"
                      className={({ isActive }) =>
                        isActive
                          ? "block text-blue-600 font-medium"
                          : "block text-gray-600 hover:text-blue-600"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dịch Vụ
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/about"
                      className={({ isActive }) =>
                        isActive
                          ? "block text-blue-600 font-medium"
                          : "block text-gray-600 hover:text-blue-600"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Giới Thiệu
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/contact"
                      className={({ isActive }) =>
                        isActive
                          ? "block text-blue-600 font-medium"
                          : "block text-gray-600 hover:text-blue-600"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Liên Hệ
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/Blog"
                      className={({ isActive }) =>
                        isActive
                          ? "block text-blue-600 font-medium"
                          : "block text-gray-600 hover:text-blue-600"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Bài Viết
                    </NavLink>
                  </li>
                </>
              )}

              {/* Menu Dashboard cho nhân viên trên mobile */}
              {isAuthenticated && isStaffOrHigher() && (
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? "block text-blue-600 font-medium"
                        : "block text-gray-600 hover:text-blue-600"
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}

              {/* User authentication menu trên mobile */}
              {isAuthenticated ? (
                <>
                  {!isStaffOrHigher() && (
                    <>
                      {" "}
                      <li>
                        <NavLink
                          to="/profile"
                          className={({ isActive }) =>
                            isActive
                              ? "block text-blue-600 font-medium"
                              : "block text-gray-600 hover:text-blue-600"
                          }
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Hồ Sơ
                        </NavLink>
                      </li>{" "}
                      <li>
                        <NavLink
                          to="/profile?tab=appointments"
                          className={({ isActive }) =>
                            isActive
                              ? "block text-blue-600 font-medium"
                              : "block text-gray-600 hover:text-blue-600"
                          }
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Lịch Hẹn
                        </NavLink>
                      </li>
                    </>
                  )}
                  {/* Mobile logout button - update this one too */}
                  <li>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center text-red-600 hover:text-red-700"
                    >
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
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <NavLink
                    to="/login"
                    className="block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng Nhập
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}

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
    </header>
  );
}

export default Header;
