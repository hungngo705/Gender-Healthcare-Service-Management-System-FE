import axios from "axios";
import config from "./config";
import toastService from "./toastService";

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: config.api.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: config.api.timeout,
});

// Bộ chặn yêu cầu
apiClient.interceptors.request.use(
  (reqConfig) => {
    // Bạn có thể sửa đổi cấu hình yêu cầu tại đây
    // Ví dụ, thêm token xác thực

    const token = localStorage.getItem(config.auth.storageKey);
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging in development
    if (import.meta.env.DEV) {
      console.log("API Request:", {
        method: reqConfig.method,
        url: reqConfig.url,
        baseURL: reqConfig.baseURL,
        fullURL: `${reqConfig.baseURL}${reqConfig.url}`,
      });
    }

    return reqConfig;
  },
  (error) => {
    toastService.error(
      "Yêu cầu không thể gửi đi. Vui lòng kiểm tra kết nối của bạn."
    );
    return Promise.reject(error);
  }
);

// Bộ chặn phản hồi
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log("API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error("API Error:", {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        response: error.response?.data,
      });
    }

    // Bất kỳ mã trạng thái nào nằm ngoài phạm vi 2xx
    let errorMessage = "Đã xảy ra lỗi không mong muốn";

    // Xử lý các lỗi phổ biến
    if (error.response) {
      // Yêu cầu đã được thực hiện và máy chủ đã phản hồi với mã trạng thái
      // nằm ngoài phạm vi 2xx

      // Lấy thông báo lỗi từ phản hồi nếu có
      errorMessage = error.response.data?.message || errorMessage;

      // Xử lý lỗi 401 Không được phép
      if (error.response.status === 401) {
        console.log(
          "401 Không được phép - Token có thể không hợp lệ hoặc đã hết hạn"
        );

        // Thử làm mới token nếu chúng ta có
        const refreshToken = localStorage.getItem(
          config.auth.refreshStorageKey
        );
        if (refreshToken) {
          try {
            // Triển khai logic làm mới token tại đây
            const refreshResponse = await axios.post(
              `${config.api.baseURL}${config.api.auth.refreshToken}`,
              {
                refreshToken,
              }
            );

            if (refreshResponse.data && refreshResponse.data.token) {
              // Cập nhật token
              localStorage.setItem(
                config.auth.storageKey,
                refreshResponse.data.token
              );
              localStorage.setItem(
                config.auth.refreshStorageKey,
                refreshResponse.data.refreshToken
              );

              // Thử lại yêu cầu ban đầu
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
              return apiClient(originalRequest);
            }
          } catch (refreshError) {
            console.log("Làm mới token thất bại, xóa trạng thái xác thực");
            // Nếu làm mới token thất bại, dọn dẹp và chuyển hướng đến đăng nhập
            localStorage.removeItem(config.auth.storageKey);
            localStorage.removeItem(config.auth.refreshStorageKey);
            localStorage.removeItem("user");
            localStorage.removeItem("token_expiration");

            toastService.error(
              "Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại."
            );

            // Use modern navigation instead of window.location
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          }
        } else {
          // Không có refresh token - dọn dẹp trạng thái xác thực
          console.log("Không có refresh token, xóa trạng thái xác thực");
          localStorage.removeItem(config.auth.storageKey);
          localStorage.removeItem("user");
          localStorage.removeItem("token_expiration");

          toastService.error(errorMessage || "Vui lòng đăng nhập lại.");

          // Chỉ chuyển hướng nếu chưa ở trang đăng nhập
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
      }

      // Xử lý lỗi 403 Cấm truy cập
      if (error.response.status === 403) {
        toastService.error("Bạn không có quyền truy cập tài nguyên này");
      }

      // Xử lý lỗi 404 Không tìm thấy
      if (error.response.status === 404) {
        if (error.response.data?.message) {
          toastService.error(errorMessage);
        } else {
          toastService.error("Không tìm thấy tài nguyên yêu cầu");
        }
      }

      // Xử lý lỗi 422 Lỗi xác thực
      if (error.response.status === 422) {
        // Xử lý lỗi xác thực
        if (error.response.data?.errors) {
          const validationErrors = error.response.data.errors;
          // Trích xuất thông báo lỗi xác thực đầu tiên để hiển thị
          const firstErrorKey = Object.keys(validationErrors)[0];
          if (firstErrorKey) {
            errorMessage =
              validationErrors[firstErrorKey][0] || "Xác thực thất bại";
          }
        }
        toastService.warning(errorMessage);
        return Promise.reject(error);
      }

      // Xử lý lỗi 500 Lỗi máy chủ nội bộ
      if (error.response.status >= 500) {
        if (error.response.data?.details !== "No appointments found") {
          toastService.error("Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.");
        }
      }
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không nhận được phản hồi
      console.log("Lỗi mạng - không nhận được phản hồi từ máy chủ");

      if (error.code === "ECONNABORTED") {
        errorMessage = "Yêu cầu đã hết thời gian. Vui lòng thử lại sau.";
      } else if (error.message && error.message.includes("Network Error")) {
        errorMessage =
          "Lỗi mạng. Vui lòng kiểm tra kết nối internet và trạng thái máy chủ của bạn.";

        // Không hiển thị thông báo lỗi cho lỗi mạng trong quá trình xác minh token
        if (!error.config?.url?.includes("/profile")) {
          toastService.error("Đã có lỗi từ máy chủ. Vui lòng thử lại sau.");
        }

        console.log(
          "Máy chủ dường như đã ngừng hoạt động, tạm thời duy trì trạng thái xác thực"
        );

        return Promise.reject(error);
      } else {
        errorMessage =
          "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối của bạn.";
      }

      // Chỉ hiển thị thông báo nếu không phải là yêu cầu xác minh token
      if (!error.config?.url?.includes("/profile")) {
        toastService.error(errorMessage);
      }
    } else {
      // Đã xảy ra sự cố trong quá trình thiết lập yêu cầu gây ra Lỗi
      errorMessage = `Lỗi: ${error.message}`;
      toastService.error(errorMessage);
    }

    return Promise.reject("Đã xảy ra lỗi trong quá trình đăng nhập!");
  }
);

// Các phương thức API hỗ trợ cho các thao tác thông dụng
const apiService = {
  /**
   * Thực hiện yêu cầu GET
   * @param {string} url - URL để gửi yêu cầu đến
   * @param {Object} params - Các tham số truy vấn
   * @param {Object} config - Cấu hình axios bổ sung
   * @returns {Promise} - Promise phản hồi
   */
  get: (url, params = {}, config = {}) => {
    return apiClient.get(url, { params, ...config });
  },

  /**
   * Thực hiện yêu cầu POST
   * @param {string} url - URL để gửi yêu cầu đến
   * @param {Object} data - Dữ liệu để gửi
   * @param {Object} config - Cấu hình axios bổ sung
   * @returns {Promise} - Promise phản hồi
   */
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },

  /**
   * Thực hiện yêu cầu PUT
   * @param {string} url - URL để gửi yêu cầu đến
   * @param {Object} data - Dữ liệu để gửi
   * @param {Object} config - Cấu hình axios bổ sung
   * @returns {Promise} - Promise phản hồi
   */
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },

  /**
   * Thực hiện yêu cầu PATCH
   * @param {string} url - URL để gửi yêu cầu đến
   * @param {Object} data - Dữ liệu để gửi
   * @param {Object} config - Cấu hình axios bổ sung
   * @returns {Promise} - Promise phản hồi
   */
  patch: (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config);
  },

  /**
   * Thực hiện yêu cầu DELETE
   * @param {string} url - URL để gửi yêu cầu đến
   * @param {Object} config - Cấu hình axios bổ sung
   * @returns {Promise} - Promise phản hồi
   */
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },

  /**
   * Tải lên tệp với theo dõi tiến trình
   * @param {string} url - URL để gửi yêu cầu đến
   * @param {FormData} formData - Form data chứa tệp để tải lên
   * @param {Function} onProgress - Hàm gọi lại tiến trình
   * @returns {Promise} - Promise phản hồi
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
  },

  /**
   * Tải xuống tệp với theo dõi tiến trình
   * @param {string} url - URL để gửi yêu cầu đến
   * @param {Function} onProgress - Hàm gọi lại tiến trình
   * @param {Object} params - Các tham số truy vấn
   * @returns {Promise} - Promise phản hồi
   */
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
