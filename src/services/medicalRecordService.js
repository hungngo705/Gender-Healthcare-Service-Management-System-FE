import { apiService } from "../utils/axiosConfig";
import config from "../utils/config";

/**
 * Service for handling medical record-related API calls
 */
const medicalRecordService = {
  /**
   * Get all medical records for a user
   * @param {string|number} userId - The user ID
   * @param {Object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise} - The medical records response promise
   */
  getAllByUserId: (userId, params = {}) => {
    return apiService.get(
      config.api.medicalRecords.getAllByUserId(userId),
      params
    );
  },

  /**
   * Get a single medical record by ID
   * @param {string|number} id - The medical record ID
   * @returns {Promise} - The medical record response promise
   */
  getById: (id) => {
    return apiService.get(config.api.medicalRecords.getById(id));
  },

  /**
   * Get all STI test results for a user
   * @param {string|number} userId - The user ID
   * @param {Object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise} - The STI test results response promise
   */
  getStiTestResults: (userId, params = {}) => {
    return apiService.get(
      config.api.medicalRecords.getStiTestResults(userId),
      params
    );
  },

  /**
   * Get STI test result by ID
   * @param {string|number} id - The STI test ID
   * @returns {Promise} - The STI test result response promise
   */
  getStiTestResultById: (id) => {
    return apiService.get(config.api.medicalRecords.getStiTestResultById(id));
  },

  /**
   * Download a medical record as PDF
   * @param {string|number} id - The medical record ID
   * @returns {Promise} - The download response promise (blob)
   */
  downloadPdf: (id) => {
    return apiService.get(config.api.medicalRecords.downloadPdf(id), {
      responseType: "blob",
    });
  },

  /**
   * Share a medical record with a healthcare provider
   * @param {string|number} id - The medical record ID
   * @param {Object} shareData - Data about who to share with
   * @returns {Promise} - The share response promise
   */
  shareRecord: (id, shareData) => {
    return apiService.post(
      config.api.medicalRecords.shareRecord(id),
      shareData
    );
  },

  /**
   * Get medical record summary statistics for a user
   * @param {string|number} userId - The user ID
   * @returns {Promise} - The summary statistics response promise
   */
  getUserStatistics: (userId) => {
    return apiService.get(config.api.medicalRecords.getUserStatistics(userId));
  },
};

export default medicalRecordService;
