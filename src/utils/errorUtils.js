/**
 * Utility functions for handling API errors
 */

import toastService from "./toastService";

/**
 * Handles API errors consistently across the application
 * @param {Error} error - The error object from axios
 * @param {boolean} showToast - Whether to show a toast notification (default: true)
 * @returns {Object} Standardized error response
 */
export const handleApiError = (error, showToast = true) => {
  console.error("API Error:", error);

  // Default error response
  const errorResponse = {
    success: false,
    message: "Có lỗi xảy ra, vui lòng thử lại.",
    statusCode: 500,
  };

  // Check if the error has a response from the server
  if (error.response) {
    const { status, data } = error.response;

    errorResponse.statusCode = status;

    // Extract error message from response if available
    if (data && data.message) {
      errorResponse.message = data.message;
    } else if (data && data.error) {
      errorResponse.message = data.error;
    } else if (typeof data === "string") {
      errorResponse.message = data;
    }

    // Handle specific status codes
    switch (status) {
      case 401:
        errorResponse.message =
          "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.";
        // You might want to trigger a logout or token refresh here
        break;
      case 403:
        errorResponse.message = "Bạn không có quyền thực hiện hành động này.";
        break;
      case 404:
        errorResponse.message = "Không tìm thấy tài nguyên yêu cầu.";
        break;
      // Add more specific error handling as needed
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorResponse.message =
      "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
    errorResponse.statusCode = -1;
  }

  // Show toast notification if requested
  if (showToast) {
    toastService.error(errorResponse.message);
  }

  return errorResponse;
};
