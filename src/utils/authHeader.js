/**
 * Utility function to create authentication headers
 * @returns {Object} Authentication headers for API requests
 */
import config from "./config";

const authHeader = () => {
  // Get token from local storage
  const token = localStorage.getItem(config.auth.storageKey);

  // Return auth header object
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } else {
    return {
      "Content-Type": "application/json",
    };
  }
};

export default authHeader;
