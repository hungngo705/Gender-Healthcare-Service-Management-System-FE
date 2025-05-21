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

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
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
