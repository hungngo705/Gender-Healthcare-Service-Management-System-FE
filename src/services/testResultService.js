import config from "../utils/config";
import { apiService } from "../utils/axiosConfig";
import { handleApiError } from "../utils/errorUtils";

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
  }
  /**
   * Get all test results for a specific STI testing
   * @param {string} stiTestingId - The ID of the STI testing
   * @returns {Promise<Object>} Response with list of test results
   */,
  getTestResults: async (stiTestingId) => {
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
    comments = ""
  ) => {
    try {
      const staffId = localStorage.getItem("userId") || ""; // Get current staff ID from localStorage

      const response = await apiService.post(config.api.testResult.create, {
        stiTestingId,
        parameter,
        outcome,
        comments,
        staffId,
        processedAt: new Date().toISOString(), // Current timestamp
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to create test result");
    }
  },
  /**
   * Update an existing test result
   * @param {string} resultId - The ID of the test result
   * @param {number} outcome - The outcome of the test
   * @param {string} comments - Additional comments about the result
   * @returns {Promise<Object>} Response with updated test result
   */ updateTestResult: async (resultId, outcome, comments = "") => {
    try {
      const staffId = localStorage.getItem("userId") || ""; // Get current staff ID from localStorage

      const response = await apiService.put(
        config.api.testResult.update(resultId),
        {
          outcome,
          comments,
          staffId,
          processedAt: new Date().toISOString(), // Update processed timestamp
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to update test result");
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
