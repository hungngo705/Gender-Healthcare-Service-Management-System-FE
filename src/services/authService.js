import { apiService } from "../utils/axiosConfig";
import config from "../utils/config";
import toastService from "../utils/toastService";

// JWT Token decode function
const decodeJWT = (token) => {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const base64Url = token.split(".")[1]; // Get payload part
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
  } catch {
    return null;
  }
};

/**
 * Auth service for handling authentication with API
 */
export const authService = {
  /**
   * Authenticate user with email and password
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise} Promise that resolves with user data or rejects with error message
   */ login: async (email, password) => {
    try {
      const response = await apiService.post(config.api.auth.login, {
        email,
        password,
      });

      // Check if the response has the expected structure
      const responseData = response.data?.data || response.data;

      // Store token
      if (responseData?.token) {
        localStorage.setItem(config.auth.storageKey, responseData.token);

        // Decode token to get role and other info
        const decodedToken = decodeJWT(responseData.token);

        if (decodedToken) {
          // Look for role in various possible claim names
          const role =
            decodedToken.role ||
            decodedToken.Role ||
            decodedToken.roles ||
            decodedToken[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] ||
            decodedToken["role"];

          // Store role in userData for easy access
          if (role) {
            responseData.role = role;
          }
        }
      } else {
        throw new Error("Token không được tìm thấy trong phản hồi");
      }

      // Store token expiration if available
      if (responseData?.expiration) {
        localStorage.setItem("token_expiration", responseData.expiration);
      }

      // Store user info without sensitive data
      const userData = { ...responseData };
      delete userData.token;
      delete userData.password;

      if (userData && (userData.fullName || userData.email)) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        throw new Error(
          "Thông tin người dùng không được tìm thấy trong phản hồi"
        );
      }

      return userData;
    } catch (error) {
      // Error handling is done by the axios interceptors
      return Promise.reject("Lỗi trong quá trình đăng nhập");
    }
  },
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - The registration response promise
   */ register: async (userData) => {
    try {
      const response = await apiService.post(
        config.api.auth.register,
        userData
      );

      // Check if the response has the expected structure
      const responseData = response.data?.data || response.data;

      // Check if response contains token and user data
      if (responseData?.token) {
        // Store tokens
        localStorage.setItem(config.auth.storageKey, responseData.token);

        if (responseData.expiration) {
          localStorage.setItem("token_expiration", responseData.expiration);
        }

        // Store user info without sensitive data
        const userInfo = { ...responseData };
        delete userInfo.token;
        delete userInfo.password;

        localStorage.setItem("user", JSON.stringify(userInfo));
      }

      toastService.success("Đăng ký thành công");
      return responseData?.user || responseData;
    } catch (error) {
      // Error handling is done by the axios interceptors
      return Promise.reject(error);
    }
  },

  /**
   * Check if user is authenticated (has valid token)
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(config.auth.storageKey);
    return !!token;
  },

  /**
   * Get current user from JWT token with localStorage fallback

   */
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get user profile from API
   * @returns {Promise} - The user profile response promise
   */
  getUserProfile: async () => {
    try {
      const response = await apiService.get(config.api.users.profile);
      // Update stored user data
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      // Error handling is done by the axios interceptors
      return Promise.reject(error);
    }
  },
  /**
   * Log out user by removing tokens and user data
   */
  logout: async () => {
    try {
      const token = localStorage.getItem(config.auth.storageKey);

      // Only make the API call if we have a token
      if (token) {
        // Call logout endpoint to invalidate the token on the server
        await apiService.post(config.api.auth.logout);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Continue with logout even if the API call fails
    } finally {
      // Remove tokens and user data from local storage
      localStorage.removeItem(config.auth.storageKey);
      localStorage.removeItem(config.auth.refreshStorageKey);
      localStorage.removeItem("user");

      toastService.success("Bạn đã đăng xuất thành công");
      // Redirect to login page
      window.location.href = "/login";
    }
  },
  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @param {string} passwordData.confirmPassword - Confirm new password
   * @returns {Promise} - The change password response promise
   */
  changePassword: async (passwordData) => {
    try {
      const response = await apiService.post(
        config.api.users.changePassword,
        passwordData
      );
      toastService.success("Đổi mật khẩu thành công");
      return response.data;
    } catch (error) {
      // Error handling is done by the axios interceptors
      return Promise.reject(error);
    }
  },

  /**
   * Verify email address with token
   * @param {string} token - Email verification token
   * @returns {Promise} - The verification response promise
   */
  verifyEmail: async (token) => {
    try {
      const response = await apiService.get(
        `${config.api.auth.verifyEmail}?token=${token}`
      );
      toastService.success("Email đã được xác minh thành công");
      return response.data;
    } catch (error) {
      // Error handling is done by the axios interceptors
      return Promise.reject(error);
    }
  },
  /**
   * Request password reset email
   * @param {string} email - User email address
   * @returns {Promise} - The forgot password response promise
   */
  forgotPassword: async (email) => {
    try {
      const response = await apiService.post(config.api.auth.forgotPassword, {
        email,
      });
      toastService.success("Mã xác nhận đã được gửi đến email của bạn");
      return response.data;
    } catch (error) {
      // Error handling is done by the axios interceptors
      return Promise.reject(error);
    }
  },
  /**
   * Reset password with verification code
   * @param {Object} resetData - Reset password data
   * @param {string} resetData.email - User email address
   * @param {string} resetData.code - Password reset verification code
   * @param {string} resetData.newPassword - New password
   * @returns {Promise} - The reset password response promise
   */
  resetPassword: async (resetData) => {
    try {
      const response = await apiService.post(
        config.api.auth.resetPassword,
        resetData
      );
      toastService.success("Mật khẩu đã được đặt lại thành công");
      return response.data;
    } catch (error) {
      // Error handling is done by the axios interceptors
      return Promise.reject(error);
    }
  },
  /**
   * Get redirect path based on user role
   * @param {string} role - User role
   * @returns {string} Redirect path
   */ getRedirectPath: (role) => {
    if (!role) {
      console.log("No role provided, defaulting to home");
      return "/";
    }

    const roleStr = role.toLowerCase();
    console.log("Getting redirect path for role:", roleStr);

    // Define role-based redirects
    const roleRedirects = {
      admin: "/dashboard",
      staff: "/dashboard",
      consultant: "/dashboard",
      manager: "/dashboard",
      customer: "/",
      guest: "/",
    };

    const redirectPath = roleRedirects[roleStr] || "/";
    console.log("Redirect path determined:", redirectPath);
    return redirectPath;
  },
  /**
   * Perform login and redirect based on role
   * @param {string} email User email
   * @param {string} password User password
   * @param {Function} navigate - React Router navigate function
   * @returns {Promise} Promise that resolves with redirect info
   */
  loginAndRedirect: async (email, password, navigate) => {
    try {
      const userData = await authService.login(email, password);

      // Get role from token
      const role = authService.getUserRole();

      // Get redirect path
      const redirectPath = authService.getRedirectPath(role);

      // Navigate to appropriate page
      if (navigate) {
        navigate(redirectPath);
      }

      return {
        success: true,
        userData,
        role,
        redirectPath,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
  /**
   * Get user role from token
   * @returns {string|null} User role or null if not found
   */
  getUserRole: () => {
    const token = localStorage.getItem(config.auth.storageKey);
    if (!token) {
      console.log("No token found for role extraction");
      return null;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
      console.log("Could not decode token for role extraction");
      return null;
    }

    // Check common JWT claim names for role
    const role =
      decoded.role ||
      decoded.Role ||
      decoded.roles ||
      decoded.Roles ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded["role"] ||
      null;

    console.log("Role extracted from token:", role);
    return role;
  },
  /**
   * Get decoded token payload
   * @returns {Object|null} Decoded token payload or null
   */
  getDecodedToken: () => {
    const token = localStorage.getItem(config.auth.storageKey);
    if (!token) return null;
    return decodeJWT(token);
  },
};

export default authService;
