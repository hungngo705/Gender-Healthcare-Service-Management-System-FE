import config from "../utils/config";
import { apiService } from "../utils/axiosConfig";
import { handleApiError } from "../utils/errorUtils";
import tokenHelper from "../utils/tokenHelper";

/**
 * Service for managing test results
 */
const testResultService = {
  /**
   * Get all test results
   * @returns {Promise} Promise resolving to test results data
   */
  getAll: async () => {
    try {
      const response = await apiService.get(config.api.testResult.getAll);
      return response.data || [];
    } catch (error) {
      return Promise.reject(error);
    }
  },
  /**
   * Get all test results for a specific STI testing
   * @param {string} stiTestingId - The ID of the STI testing
   * @returns {Promise<Object>} Response with list of test results
   */ getTestResults: async (stiTestingId) => {
    try {
      const response = await apiService.get(
        config.api.testResult.getByTesting(stiTestingId)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch test results");
    }
  },

  /**
   * Get a single test result by ID
   * @param {string} resultId - The ID of the test result
   * @returns {Promise<Object>} Response with test result details
   */
  getTestResultById: async (resultId) => {
    try {
      const response = await apiService.get(
        config.api.testResult.getById(resultId)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch test result");
    }
  },
  /**
   * Create a new test result
   * @param {string} stiTestingId - The ID of the STI testing
   * @param {number} parameter - The parameter being tested (e.g., 0 for HIV, 1 for Syphilis)
   * @param {number} outcome - The outcome of the test (0: negative, 1: positive, 2: inconclusive)
   * @param {string} comments - Additional comments about the result
   * @returns {Promise<Object>} Response with created test result
   */ createTestResult: async (
    stiTestingId,
    parameter,
    outcome,
    comments = "",
    staffId = null
  ) => {
    try {
      // Nếu không có staffId từ tham số, thử lấy từ token
      if (!staffId) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const decodedToken = JSON.parse(window.atob(base64));
            staffId =
              decodedToken.id || decodedToken.userId || decodedToken.sub;
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
      }

      // Fallback nếu không tìm thấy staffId
      staffId = staffId || "default-user-id";

      // Tạo payload với đúng định dạng API yêu cầu
      const payload = {
        stiTestingId: stiTestingId,
        outcome: parseInt(outcome),
        comments: comments || "",
        staffId: staffId,
        processedAt: new Date().toISOString(),
        parameter: [parseInt(parameter)],
      };

      console.log(
        `Creating test result for test ${stiTestingId} with payload:`,
        payload
      );

      const response = await apiService.post(
        config.api.testResult.create,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error creating test result:", error);
      throw error;
    }
  },
  /**
   * Update an existing test result
   * @param {string} resultId - The ID of the test result
   * @param {number} outcome - The outcome of the test
   * @param {string} comments - Additional comments about the result
   * @returns {Promise<Object>} Response with updated test result
   */ updateTestResult: async (
    resultId,
    outcome,
    comments = "",
    staffId = null,
    parameter = null
  ) => {
    try {
      // Nếu không có staffId từ tham số, thử lấy từ token
      if (!staffId) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const tokenInfo = tokenHelper.decodeToken(token);
            // Microsoft JWT format - lấy nameidentifier là ID user
            staffId =
              tokenInfo[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
              ] ||
              tokenInfo.nameid ||
              tokenInfo.sub;
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
      }

      // Sử dụng UUID mặc định khi không có staffId
      staffId = staffId || "00000000-0000-0000-0000-000000000000";

      // Đảm bảo parameter là một số nguyên
      let finalParameter = parameter;

      // Nếu parameter là null, gọi API để lấy giá trị
      if (finalParameter === null || finalParameter === undefined) {
        try {
          const existingResult = await testResultService.getTestResultById(
            resultId
          );
          if (
            existingResult?.is_success &&
            existingResult?.data?.parameter !== undefined
          ) {
            finalParameter = existingResult.data.parameter;
          } else {
            throw new Error(
              "Could not retrieve parameter value for test result"
            );
          }
        } catch (fetchError) {
          console.error("Error fetching test result parameter:", fetchError);
          throw fetchError;
        }
      }

      // Đảm bảo parameter là một số nguyên, không phải mảng
      const paramInt = parseInt(finalParameter);
      if (isNaN(paramInt)) {
        throw new Error("Invalid parameter value");
      }

      // Payload với parameter là số nguyên (không phải mảng)
      const payload = {
        outcome: parseInt(outcome),
        comments: comments || "",
        staffId: staffId,
        processedAt: new Date().toISOString(),
        parameter: paramInt, // Số nguyên, không phải mảng [paramInt]
      };

      console.log(`Updating test result ${resultId} with payload:`, payload);

      const response = await apiService.put(
        config.api.testResult.update(resultId),
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error updating test result:", error);
      throw error;
    }
  },

  /**
   * Delete a test result
   * @param {string} resultId - The ID of the test result to delete
   * @returns {Promise<Object>} Response indicating success or failure
   */ deleteTestResult: async (resultId) => {
    try {
      const response = await apiService.delete(
        config.api.testResult.delete(resultId)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to delete test result");
    }
  },

  /**
   * Get test result by ID
   * @param {string} id - Test result ID
   * @returns {Promise} Promise resolving to test result data
   */
  getById: async (id) => {
    try {
      const response = await apiService.get(config.api.testResult.getById(id));
      return response.data || {};
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Create new test result
   * @param {Object} data - Test result data
   * @returns {Promise} Promise resolving to created test result
   */
  create: async (data) => {
    try {
      const response = await apiService.post(
        config.api.testResult.create,
        data
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Update existing test result
   * @param {string} id - Test result ID
   * @param {Object} data - Updated test result data
   * @returns {Promise} Promise resolving to updated test result
   */
  update: async (id, data) => {
    try {
      const response = await apiService.put(
        config.api.testResult.update(id),
        data
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Get test results by appointment ID
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} Promise resolving to test results for the specified appointment
   */
  getByAppointment: async (appointmentId) => {
    try {
      const response = await apiService.get(
        config.api.testResult.getByAppointment(appointmentId)
      );
      return response.data || [];
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Get test results by patient ID
   * @param {string} patientId - Patient/customer ID
   * @returns {Promise} Promise resolving to test results for the specified patient
   */
  getByPatient: async (patientId) => {
    try {
      const response = await apiService.get(
        config.api.testResult.getByPatient(patientId)
      );
      return response.data || [];
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export const {
  getAll,
  getById,
  create,
  update,
  getByAppointment,
  getByPatient,
  getTestResults,
  getTestResultById,
  createTestResult,
  updateTestResult,
  deleteTestResult,
} = testResultService;

export default testResultService;
