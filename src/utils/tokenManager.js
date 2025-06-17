import config from "./config";

/**
 * Utility for handling authentication tokens and cleanup
 */
export const tokenManager = {
  /**
   * Clean up all authentication data from localStorage
   */
  clearAuthData: () => {
    const keysToRemove = [
      config.auth.storageKey,
      config.auth.refreshStorageKey,
      "user",
      "token_expiration",
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    console.log("Authentication data cleared from localStorage");
  },

  /**
   * Check if current token is valid with server
   * @returns {Promise<boolean>} True if token is valid
   */
  validateTokenWithServer: async () => {
    const token = localStorage.getItem(config.auth.storageKey);
    if (!token) {
      console.log("No token found for server validation");
      return false;
    }
    try {
      // Skip server connectivity check
      // Always continue with token validation

      // Make a lightweight request to validate token
      const response = await fetch(
        `${config.api.baseURL}${config.api.users.profile}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(5000),
        }
      );

      if (response.ok) {
        console.log("Token validated successfully with server");
        return true;
      } else if (response.status === 401) {
        console.log("Token is invalid according to server");
        tokenManager.clearAuthData();
        return false;
      } else {
        console.log(
          "Server error during token validation, assuming token valid"
        );
        return true;
      }
    } catch (error) {
      console.log("Error validating token with server:", error.message);

      if (error.name === "TimeoutError" || error.message.includes("network")) {
        console.log("Network error during validation, assuming token valid");
        return true;
      }

      // For other errors, clear auth data to be safe
      tokenManager.clearAuthData();
      return false;
    }
  },

  /**
   * Handle app startup - validate existing tokens
   * @returns {Promise<boolean>} True if user should remain authenticated
   */
  handleAppStartup: async () => {
    const token = localStorage.getItem(config.auth.storageKey);
    const user = localStorage.getItem("user");

    if (!token || !user) {
      console.log("No authentication data found on startup");
      return false;
    }

    // First check if token is expired locally
    if (tokenManager.isTokenExpiredLocally(token)) {
      console.log("Token expired locally, clearing auth data");
      tokenManager.clearAuthData();
      return false;
    }

    // Then validate with server
    const isValid = await tokenManager.validateTokenWithServer();

    if (!isValid) {
      console.log("Token invalid on server, user logged out");
      return false;
    }

    console.log("User remains authenticated after startup validation");
    return true;
  },

  /**
   * Check if token is expired based on local expiration time
   * @param {string} token JWT token
   * @returns {boolean} True if token is expired
   */
  isTokenExpiredLocally: (token) => {
    if (!token) return true;

    try {
      // Parse JWT token to get expiration
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

      const decoded = JSON.parse(jsonPayload);

      if (decoded.exp) {
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        const bufferTime = 30000; // 30 seconds buffer

        return expirationTime <= currentTime + bufferTime;
      }

      // Check localStorage expiration as fallback
      const expiration = localStorage.getItem("token_expiration");
      if (expiration) {
        const expirationDate = new Date(expiration);
        const now = new Date();
        const bufferTime = 30000;

        return expirationDate.getTime() <= now.getTime() + bufferTime;
      }

      return false;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true; // Assume expired on error
    }
  },

  /**
   * Handle login success - store token and user data
   * @param {Object} authData Authentication response data
   */
  handleLoginSuccess: (authData) => {
    if (authData.token) {
      localStorage.setItem(config.auth.storageKey, authData.token);
    }

    if (authData.refreshToken) {
      localStorage.setItem(
        config.auth.refreshStorageKey,
        authData.refreshToken
      );
    }

    if (authData.expiration) {
      localStorage.setItem("token_expiration", authData.expiration);
    }

    // Store user data without sensitive information
    const userData = { ...authData };
    delete userData.token;
    delete userData.refreshToken;
    delete userData.password;

    localStorage.setItem("user", JSON.stringify(userData));

    console.log("Login data stored successfully");
  },

  /**
   * Handle logout - clean up all auth data and redirect
   */
  handleLogout: () => {
    tokenManager.clearAuthData();

    // Redirect to login if not already there
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  },
};

export default tokenManager;
