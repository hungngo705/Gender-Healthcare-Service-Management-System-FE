import { apiService } from "../utils/axiosConfig";
import config from "../utils/config";
import toastService from "../utils/toastService";

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

      // Store token
      if (response.data?.token) {
        localStorage.setItem(config.auth.storageKey, response.data.token);
      } else {
        throw new Error("Token không được tìm thấy trong phản hồi");
      }

      // Store token expiration if available
      if (response.data?.expiration) {
        localStorage.setItem("token_expiration", response.data.expiration);
      }

      // Store user info without sensitive data
      if (response.data?.user) {
        // Ensure password is not stored in local storage even if API returns it
        const { password: _, ...userWithoutPassword } = response.data.user;
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      } else {
        throw new Error(
          "Thông tin người dùng không được tìm thấy trong phản hồi"
        );
      }

      toastService.success("Đăng nhập thành công");
      return response.data.user;
    } catch (error) {
      // Error handling is done by the axios interceptors
      return Promise.reject(error);
    }
  },
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - The registration response promise
   */
  register: async (userData) => {
    try {
      const response = await apiService.post(
        config.api.auth.register,
        userData
      );

      // Check if response contains token and user data
      if (response.data?.token && response.data?.user) {
        // Store tokens
        localStorage.setItem(config.auth.storageKey, response.data.token);

        if (response.data.expiration) {
          localStorage.setItem("token_expiration", response.data.expiration);
        }

        // Store user info without sensitive data
        const { password: _, ...userWithoutPassword } = response.data.user;
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      }

      toastService.success("Đăng ký thành công");
      return response.data.user || response.data;
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
   * Get current user from localStorage
   * @returns {Object|null} Current user object or null
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

      toastService.info("You have been logged out");
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
      toastService.success("Password changed successfully");
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
      toastService.success("Email verified successfully");
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
      toastService.success(
        "Password reset instructions have been sent to your email"
      );
      return response.data;
    } catch (error) {
      // Error handling is done by the axios interceptors
      return Promise.reject(error);
    }
  },

  /**
   * Reset password with token
   * @param {Object} resetData - Reset password data
   * @param {string} resetData.token - Password reset token
   * @param {string} resetData.newPassword - New password
   * @param {string} resetData.confirmPassword - Confirm new password
   * @returns {Promise} - The reset password response promise
   */
  resetPassword: async (resetData) => {
    try {
      const response = await apiService.post(
        config.api.auth.resetPassword,
        resetData
      );
      toastService.success("Password has been reset successfully");
      return response.data;
    } catch (error) {
      // Error handling is done by the axios interceptors
      return Promise.reject(error);
    }
  },
};

export default authService;
