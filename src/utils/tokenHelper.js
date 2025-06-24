// Token helper utilities
import config from "./config";
import authService from "../services/authService";

/**
 * Token helper utilities for working with JWT tokens in Microsoft and standard formats
 */
const tokenHelper = {
  /**
   * Decodes a JWT token without validation
   * @param {string} token - The JWT token to decode
   * @returns {object|null} - The decoded token payload or null if invalid
   */
  decodeToken: (token) => {
    try {
      if (
        !token ||
        typeof token !== "string" ||
        token.split(".").length !== 3
      ) {
        return null;
      }

      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const padding = "=".repeat((4 - (base64.length % 4)) % 4);
      const normalizedBase64 = base64 + padding;

      let jsonPayload;
      try {
        jsonPayload = decodeURIComponent(
          atob(normalizedBase64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
      } catch (e) {
        // Fallback method
        jsonPayload = atob(normalizedBase64);
      }

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  },

  /**
   * Get the current user's token from localStorage
   * @returns {string|null} - The JWT token or null if not found
   */
  getCurrentToken: () => {
    return localStorage.getItem(config.auth.storageKey);
  },

  /**
   * Get information from the current token
   * @returns {object|null} - The decoded token payload or null if no valid token
   */
  getCurrentTokenInfo: () => {
    const token = tokenHelper.getCurrentToken();
    if (!token) return null;

    return tokenHelper.decodeToken(token);
  },

  /**
   * Get the expiration time from a token
   * @param {string} token - The JWT token
   * @returns {number|null} - The expiration timestamp in milliseconds or null if not found
   */
  getTokenExpiration: (token) => {
    const decoded = tokenHelper.decodeToken(token);
    if (!decoded) return null;

    // Check for Microsoft format expiration claim
    const expirationClaims = [
      "exp", // Standard JWT
      "expiration", // Custom format
      "expires_at", // OAuth format
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration", // Microsoft format
    ];

    // Try different expiration claim formats
    for (const claim of expirationClaims) {
      if (decoded[claim]) {
        // Convert to milliseconds if it's a Unix timestamp (seconds)
        if (typeof decoded[claim] === "number" && decoded[claim] < 2000000000) {
          return decoded[claim] * 1000;
        } else {
          // Try to parse as ISO date string
          const parsedDate = new Date(decoded[claim]);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate.getTime();
          }
        }
      }
    }

    return null;
  },

  /**
   * Check if the current token is valid and not expired
   * @returns {boolean} - True if token is valid and not expired
   */
  isTokenValid: () => {
    const token = tokenHelper.getCurrentToken();
    if (!token) return false;

    const expiration = tokenHelper.getTokenExpiration(token);
    if (!expiration) return false; // No expiration info

    return expiration > Date.now();
  },

  /**
   * Get user role from current token
   * @returns {string} - The user role or "guest" if none found
   */
  getRoleFromCurrentToken: () => {
    const token = tokenHelper.getCurrentToken();
    if (!token) return "guest";

    return authService.extractRoleFromToken(token);
  },

  /**
   * Test a sample token for debugging
   * @param {string} token - A JWT token to test
   * @returns {object} - Test results including decoded payload, extracted role, etc.
   */
  testToken: (token) => {
    if (!token) {
      return { error: "No token provided" };
    }

    try {
      const decoded = tokenHelper.decodeToken(token);
      const role = authService.extractRoleFromToken(token);
      const expiration = tokenHelper.getTokenExpiration(token);
      const expired = expiration ? expiration < Date.now() : null;

      return {
        decoded,
        role,
        expiration: expiration ? new Date(expiration).toISOString() : null,
        expired,
        isValid: !!decoded && (!expiration || !expired),
      };
    } catch (error) {
      return { error: error.message };
    }
  },

  /**
   * Trích xuất ID người dùng từ token JWT
   * @returns {string} ID người dùng hoặc chuỗi rỗng nếu không tìm thấy
   */
  getUserIdFromToken: () => {
    const tokenInfo = tokenHelper.getCurrentTokenInfo();
    if (!tokenInfo) return "";

    // Log toàn bộ cấu trúc token để debug
    console.log("Full token structure:", tokenInfo);

    // Tìm kiếm ID trong các trường thông dụng
    const userId =
      tokenInfo.sub ||
      tokenInfo.id ||
      tokenInfo.userId ||
      tokenInfo.nameid ||
      tokenInfo.oid ||
      tokenInfo[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ||
      tokenInfo[
        "http://schemas.microsoft.com/identity/claims/objectidentifier"
      ] ||
      "";

    return userId;
  },
};

export default tokenHelper;
