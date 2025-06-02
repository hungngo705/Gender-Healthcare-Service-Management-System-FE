import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái đăng nhập từ localStorage khi tải trang
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Hàm đăng nhập
  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return true;
  };

  // Hàm đăng xuất
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  // Kiểm tra nếu người dùng là staff hoặc cao hơn
  const isStaffOrHigher = () => {
    if (!currentUser) return false;
    const staffRoles = ["admin", "manager", "consultant", "staff"];
    return staffRoles.includes(currentUser.role);
  };

  // Kiểm tra nếu người dùng là customer hoặc guest
  const isCustomerOrGuest = () => {
    if (!currentUser) return true; // Nếu chưa đăng nhập thì là guest
    return currentUser.role === "customer" || currentUser.role === "guest";
  };

  // Kiểm tra vai trò cụ thể
  const hasRole = (role) => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isStaffOrHigher,
    isCustomerOrGuest,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook sử dụng context
export function useAuth() {
  return useContext(AuthContext);
}
