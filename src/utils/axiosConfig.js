import axios from "axios";
import config from "./config";

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
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx

    // Handle common errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Redirect to login or refresh token
        console.error("Unauthorized access, please login again");

        // Example: Redirect to login
        // window.location.href = '/login';
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error("Access forbidden");
      }

      // Handle 404 Not Found
      if (error.response.status === 404) {
        console.error("Resource not found");
      }

      // Handle 500 Internal Server Error
      if (error.response.status >= 500) {
        console.error("Server error occurred");
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
