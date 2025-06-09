import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import authService from "../services/authService";
import config from "../utils/config";
import userUtils from "../utils/userUtils";
import tokenManager from "../utils/tokenManager";

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
  // Helper function to clean up auth state
  const cleanupAuthState = async () => {
    setCurrentUser(null);
    tokenManager.clearAuthData();
  };

  // Helper function to validate token expiration
  const isTokenExpired = (decodedToken) => {
    if (decodedToken.exp) {
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();
      return expirationTime <= currentTime;
    }

    const expiration = localStorage.getItem("token_expiration");
    if (expiration) {
      const expirationDate = new Date(expiration);
      const now = new Date();
      return expirationDate <= now;
    }

    return false; // Assume not expired if no expiration info
  };

  // Helper function to set user from stored data
  const setUserFromStorage = (user) => {
    const userData = JSON.parse(user);
    setCurrentUser(userData);
    console.log("Auth status checked: User authenticated", userData);
  }; // Verify token with server to ensure it's still valid
  const verifyTokenWithServer = async (token) => {
    try {
      // Make a lightweight request to verify token validity
      const response = await fetch(
        `${config.api.baseURL}${config.api.users.profile}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // Set a shorter timeout for token verification
          signal: AbortSignal.timeout(5000),
        }
      );

      if (response.ok) {
        return true;
      } else if (response.status === 401) {
        console.log("Token is invalid or expired according to server");
        return false;
      } else {
        // For other errors, assume token might still be valid
        // to avoid logging out user due to temporary server issues
        console.log(
          "Server error during token verification, assuming token valid"
        );
        return true;
      }
    } catch (error) {
      // Network error or timeout - don't log out user immediately
      // as server might be temporarily down
      console.log("Network error during token verification:", error.message);
      if (error.name === "TimeoutError" || error.message.includes("network")) {
        console.log("Assuming token valid due to network issues");
        return true;
      }
      // For other errors, consider token invalid
      return false;
    }
  };
  // Enhanced startup validation using tokenManager
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const shouldRemainAuthenticated = await tokenManager.handleAppStartup();

        if (shouldRemainAuthenticated) {
          const user = localStorage.getItem("user");
          if (user) {
            setUserFromStorage(user);
          }
        } else {
          console.log("User authentication invalid on startup");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        await cleanupAuthState();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // Hàm đăng nhập
  const login = (userData) => {
    if (!userData) {
      console.error("Không có dữ liệu người dùng");
      return false;
    }

    try {
      // Đảm bảo không lưu trữ mật khẩu trong state
      // eslint-disable-next-line no-unused-vars
      const { password, ...userWithoutPassword } = userData;

      // Cập nhật state trước
      setCurrentUser(userWithoutPassword);

      // Đảm bảo dữ liệu được lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));

      console.log("Login successful, user data:", userWithoutPassword);
      return true;
    } catch (error) {
      console.error("Error during login state update:", error);
      return false;
    }
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
  }; // Improved token validation that checks with server
  const validateToken = async () => {
    const token = localStorage.getItem(config.auth.storageKey);
    if (!token) return false;

    try {
      const decodedToken = parseJwt(token);
      if (!decodedToken) return false;

      // First check local expiration
      const isLocallyExpired = isTokenExpired(decodedToken);
      if (isLocallyExpired) {
        console.log("Token expired locally");
        await cleanupAuthState();
        return false;
      }

      // Then verify with server if token is still valid
      const isValidOnServer = await verifyTokenWithServer(token);
      if (!isValidOnServer) {
        console.log("Token invalid on server, cleaning up");
        await cleanupAuthState();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error validating token:", error);
      await cleanupAuthState();
      return false;
    }
  };

  // Legacy sync token validation (for backwards compatibility)
  const validateTokenSync = () => {
    const token = localStorage.getItem(config.auth.storageKey);
    if (!token) return false;

    try {
      const decodedToken = parseJwt(token);
      if (!decodedToken) return false;

      // Kiểm tra thời gian hết hạn (exp là Unix timestamp)
      if (decodedToken.exp) {
        const expirationTime = decodedToken.exp * 1000; // Chuyển về milliseconds
        const currentTime = Date.now();
        const bufferTime = 30000; // 30 seconds buffer để tránh token hết hạn đột ngột

        return expirationTime > currentTime + bufferTime;
      }

      // Nếu không có exp trong token, kiểm tra expiration từ localStorage
      const expiration = localStorage.getItem("token_expiration");
      if (expiration) {
        const expirationDate = new Date(expiration);
        const now = new Date();
        const bufferTime = 30000; // 30 seconds buffer

        return expirationDate.getTime() > now.getTime() + bufferTime;
      }

      // Nếu không có thông tin hết hạn, coi như token còn hạn
      return true;
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
    isAuthenticated: !!currentUser && validateTokenSync(),
    isStaffOrHigher,
    isCustomerOrGuest,
    hasRole,
    validateToken,
    validateTokenSync,
    getTokenInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook sử dụng context
export function useAuth() {
  return useContext(AuthContext);
}
