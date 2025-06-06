import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import config from "../utils/config";
import userUtils from "../utils/userUtils";

// Hàm decode JWT token (không sử dụng thư viện để tránh phụ thuộc)
const parseJwt = (token) => {
  try {
    // Tách phần payload của token (phần thứ 2 sau dấu .)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT token:", error);
    return null;
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Kiểm tra trạng thái đăng nhập từ localStorage khi tải trang và kiểm tra hạn token
  useEffect(() => {
    const checkAuthStatus = () => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem(config.auth.storageKey);

      // Kiểm tra nếu có user và token
      if (user && token) {
        try {
          const decodedToken = parseJwt(token);

          if (decodedToken) {
            // Kiểm tra nếu token có chứa thông tin hết hạn (exp)
            if (decodedToken.exp) {
              const expirationTime = decodedToken.exp * 1000; // Chuyển về milliseconds
              const currentTime = Date.now();

              if (expirationTime > currentTime) {
                // Token còn hạn sử dụng
                setCurrentUser(JSON.parse(user));
              } else {
                // Token đã hết hạn
                console.log("Token đã hết hạn, đăng xuất người dùng");
                authService.logout();
              }
            } else {
              // Không có thông tin hết hạn trong token, kiểm tra expiration từ localStorage
              const expiration = localStorage.getItem("token_expiration");
              if (expiration) {
                const expirationDate = new Date(expiration);
                const now = new Date();

                if (expirationDate > now) {
                  // Token còn hạn sử dụng
                  setCurrentUser(JSON.parse(user));
                } else {
                  // Token đã hết hạn
                  console.log("Token đã hết hạn, đăng xuất người dùng");
                  authService.logout();
                }
              } else {
                // Không có thông tin hết hạn, giả định token còn hạn
                setCurrentUser(JSON.parse(user));
              }
            }
          } else {
            // Không thể giải mã token, đăng xuất để an toàn
            authService.logout();
          }
        } catch (error) {
          console.error("Error checking auth status:", error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);
  // Hàm đăng nhập
  const login = (userData) => {
    if (!userData) {
      console.error("Không có dữ liệu người dùng");
      return false;
    }

    // Đảm bảo không lưu trữ mật khẩu trong state
    const { password: _, ...userWithoutPassword } = userData;

    setCurrentUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    return true;
  };
  // Hàm đăng xuất
  const logout = async () => {
    try {
      // Call the authService logout method which handles API call and local storage cleanup
      await authService.logout();
      // Update local state
      setCurrentUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback if service logout fails
      setCurrentUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem(config.auth.storageKey);
      localStorage.removeItem(config.auth.refreshStorageKey);
    }
  };

  // Kiểm tra nếu người dùng là staff hoặc cao hơn
  const isStaffOrHigher = () => {
    return userUtils.isStaffOrHigher(currentUser);
  };

  // Kiểm tra nếu người dùng là customer hoặc guest
  const isCustomerOrGuest = () => {
    if (!currentUser) return true; // Nếu chưa đăng nhập thì là guest
    const customerRoles = ["customer", "guest"];
    return userUtils.hasRole(currentUser, customerRoles);
  };

  // Kiểm tra vai trò cụ thể
  const hasRole = (role) => {
    return userUtils.hasRole(currentUser, role);
  };
  // Kiểm tra token JWT hiện tại có hợp lệ không
  const validateToken = () => {
    const token = localStorage.getItem(config.auth.storageKey);
    if (!token) return false;

    try {
      const decodedToken = parseJwt(token);
      if (!decodedToken) return false;

      // Kiểm tra thời gian hết hạn (exp là Unix timestamp)
      const expirationTime = decodedToken.exp * 1000; // Chuyển về milliseconds
      const currentTime = Date.now();

      return expirationTime > currentTime;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  };

  // Lấy thông tin từ token
  const getTokenInfo = () => {
    const token = localStorage.getItem(config.auth.storageKey);
    if (!token) return null;

    try {
      return parseJwt(token);
    } catch (error) {
      console.error("Error getting token info:", error);
      return null;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser && validateToken(),
    isStaffOrHigher,
    isCustomerOrGuest,
    hasRole,
    validateToken,
    getTokenInfo,
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
