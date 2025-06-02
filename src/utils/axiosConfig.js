import axios from "axios";
import config from "./config";
import toastService from "./toastService";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: config.api.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: config.api.timeout,
});

// Request interceptor
apiClient.interceptors.request.use(
  (reqConfig) => {
    // You can modify the request config here
    // For example, adding authentication token

    const token = localStorage.getItem(config.auth.storageKey);
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }

    return reqConfig;
  },
  (error) => {
    toastService.error("Request failed to send. Please check your connection.");
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx
    // You can show success messages here if your API returns specific success messages
    if (response.data?.message) {
      toastService.success(response.data.message);
    }
    return response;
  },
  async (error) => {
    // Any status codes that falls outside the range of 2xx
    let errorMessage = "An unexpected error occurred";

    // Handle common errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      // Get the error message from the response if available
      errorMessage = error.response.data?.message || errorMessage;

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Try to refresh token if we have one
        const refreshToken = localStorage.getItem(
          config.auth.refreshStorageKey
        );
        if (refreshToken) {
          try {
            // Implement refreshing token logic here
            const refreshResponse = await axios.post(
              `${config.api.baseURL}${config.api.auth.refreshToken}`,
              {
                refreshToken,
              }
            );

            if (refreshResponse.data && refreshResponse.data.token) {
              // Update tokens
              localStorage.setItem(
                config.auth.storageKey,
                refreshResponse.data.token
              );
              localStorage.setItem(
                config.auth.refreshStorageKey,
                refreshResponse.data.refreshToken
              );

              // Retry the original request
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
              return apiClient(originalRequest);
            }
          } catch (refreshError) {
            // If refresh token fails, redirect to login
            toastService.error("Your session has expired. Please login again.");
            localStorage.removeItem(config.auth.storageKey);
            localStorage.removeItem(config.auth.refreshStorageKey);
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token available
          toastService.error("Please login to continue");
          window.location.href = "/login";
        }
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        toastService.error("You don't have permission to access this resource");
      } // Handle 404 Not Found
      if (error.response.status === 404) {
        toastService.error("The requested resource was not found");
        // You can also navigate to a 404 page for critical resources
        // if (error.config.url.includes('critical-endpoint')) {
        //   window.location.href = '/not-found';
        // }
      }

      // Handle 422 Validation error
      if (error.response.status === 422) {
        // Handle validation errors
        if (error.response.data?.errors) {
          const validationErrors = error.response.data.errors;
          // Extract first validation error message to display
          const firstErrorKey = Object.keys(validationErrors)[0];
          if (firstErrorKey) {
            errorMessage =
              validationErrors[firstErrorKey][0] || "Validation failed";
          }
        }
        toastService.warning(errorMessage);
        return Promise.reject(error);
      }

      // Handle 500 Internal Server Error
      if (error.response.status >= 500) {
        toastService.error("A server error occurred. Please try again later.");
      }
    } else if (error.request) {
      // The request was made but no response was received
      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again later.";
      } else if (error.message && error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else {
        errorMessage =
          "No response received from server. Please check your connection.";
      }
      toastService.error(errorMessage);
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = `Error: ${error.message}`;
      toastService.error(errorMessage);
    }

    // Show error notification for any unhandled errors
    if (
      !error.response ||
      ![401, 403, 404, 422, 500].includes(error.response.status)
    ) {
      toastService.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

// API helper methods for common operations
const apiService = {
  /**
   * Make GET request
   * @param {string} url - The URL to make the request to
   * @param {Object} params - Query parameters
   * @param {Object} config - Additional axios config
   * @returns {Promise} - The response promise
   */
  get: (url, params = {}, config = {}) => {
    return apiClient.get(url, { params, ...config });
  },

  /**
   * Make POST request
   * @param {string} url - The URL to make the request to
   * @param {Object} data - The data to send
   * @param {Object} config - Additional axios config
   * @returns {Promise} - The response promise
   */
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },

  /**
   * Make PUT request
   * @param {string} url - The URL to make the request to
   * @param {Object} data - The data to send
   * @param {Object} config - Additional axios config
   * @returns {Promise} - The response promise
   */
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },

  /**
   * Make PATCH request
   * @param {string} url - The URL to make the request to
   * @param {Object} data - The data to send
   * @param {Object} config - Additional axios config
   * @returns {Promise} - The response promise
   */
  patch: (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config);
  },

  /**
   * Make DELETE request
   * @param {string} url - The URL to make the request to
   * @param {Object} config - Additional axios config
   * @returns {Promise} - The response promise
   */
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },
  /**
   * Upload a file with progress tracking
   * @param {string} url - The URL to make the request to
   * @param {FormData} formData - The form data containing files to upload
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise} - The response promise
   */
  upload: (url, formData, onProgress = null) => {
    return apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress
        ? (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        : undefined,
    });
  }
  /**
   * Download a file with progress tracking
   * @param {string} url - The URL to make the request to
   * @param {Function} onProgress - Progress callback function
   * @param {Object} params - Query parameters
   * @returns {Promise} - The response promise
   */,
  download: (url, onProgress = null, params = {}) => {
    return apiClient.get(url, {
      params,
      responseType: "blob",
      onDownloadProgress: onProgress
        ? (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        : undefined,
    });
  },
};

export { apiClient, apiService };
export default apiClient;
