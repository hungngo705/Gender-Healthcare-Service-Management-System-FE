import config from "./config";

/**
 * Utility for checking server health and connectivity
 */
export const serverHealth = {
  /**
   * Check if server is reachable
   * @returns {Promise<boolean>} True if server is reachable
   */
  checkServerHealth: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${config.api.baseURL}/health`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log("Server health check failed:", error.message);
      return false;
    }
  },

  /**
   * Check if server is reachable with a simple HEAD request to base URL
   * @returns {Promise<boolean>} True if server is reachable
   */
  checkServerConnectivity: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(config.api.baseURL, {
        method: "HEAD",
        signal: controller.signal,
        mode: "no-cors", // Allow checking even if CORS is not configured
      });

      clearTimeout(timeoutId);
      return true; // If we get here, server is reachable
    } catch (error) {
      console.log("Server connectivity check failed:", error.message);
      return false;
    }
  },

  /**
   * Wait for server to become available
   * @param {number} maxRetries Maximum number of retry attempts
   * @param {number} retryDelay Delay between retries in milliseconds
   * @returns {Promise<boolean>} True if server becomes available
   */
  waitForServer: async (maxRetries = 5, retryDelay = 2000) => {
    for (let i = 0; i < maxRetries; i++) {
      const isServerUp = await serverHealth.checkServerConnectivity();
      if (isServerUp) {
        console.log(`Server is available after ${i + 1} attempts`);
        return true;
      }

      if (i < maxRetries - 1) {
        // Don't wait after the last attempt
        console.log(
          `Server not available, retrying in ${retryDelay}ms... (${
            i + 1
          }/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    console.log(`Server not available after ${maxRetries} attempts`);
    return false;
  },
};

export default serverHealth;
