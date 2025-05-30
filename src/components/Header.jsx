import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo2.svg";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileMenuOpen(false);
  };

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

              {isAuthenticated ? (
                <li className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                  >
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                      {currentUser?.profilePicture ? (
                        <img
                          src={currentUser.profilePicture}
                          alt={currentUser.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <span className="font-medium">
                      {currentUser?.name?.split(" ")[0] || "Người Dùng"}
                    </span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <NavLink
                        to="/protected/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Hồ Sơ
                      </NavLink>
                      <NavLink
                        to="/protected/appointments"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Lịch Hẹn
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut size={16} className="mr-2" />
                          <span>Đăng Xuất</span>
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
              {isAuthenticated ? (
                <>
                  <li>
                    <NavLink
                      to="/protected/profile"
                      className={({ isActive }) =>
                        isActive
                          ? "block text-blue-600 font-medium"
                          : "block text-gray-600 hover:text-blue-600"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hồ Sơ
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/protected/appointments"
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
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-red-600 hover:text-red-700"
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Đăng Xuất</span>
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
    </header>
  );
}

export default Header;