import { apiService } from "../utils/axiosConfig";
import config from "../utils/config";

/**
 * Service for handling consultant-related API calls
 */
const consultantService = {
  /**
   * Get all consultants
   * @param {Object} params - Query parameters for filtering, sorting, pagination
   * @returns {Promise} - The consultants response promise
   */
  getAll: (params = {}) => {
    return apiService.get(config.api.consultants.getAll, params);
  },

  /**
   * Get consultant by ID
   * @param {string|number} id - The consultant ID
   * @returns {Promise} - The consultant response promise
   */
  getById: (id) => {
    return apiService.get(config.api.consultants.getById(id));
  },

  /**
   * Create a new consultant
   * @param {Object} consultantData - The consultant data
   * @returns {Promise} - The create consultant response promise
   */
  create: (consultantData) => {
    return apiService.post(config.api.consultants.create, consultantData);
  },

  /**
   * Update a consultant
   * @param {string|number} id - The consultant ID
   * @param {Object} consultantData - The updated consultant data
   * @returns {Promise} - The update consultant response promise
   */
  update: (id, consultantData) => {
    return apiService.put(config.api.consultants.update(id), consultantData);
  },

  /**
   * Delete a consultant
   * @param {string|number} id - The consultant ID
   * @returns {Promise} - The delete consultant response promise
   */
  delete: (id) => {
    return apiService.delete(config.api.consultants.delete(id));
  },

  /**
   * Get consultant availability
   * @param {string|number} id - The consultant ID
   * @param {Object} params - Query parameters for date range
   * @returns {Promise} - The consultant availability response promise
   */
  getAvailability: (id, params = {}) => {
    return apiService.get(config.api.consultants.getAvailability(id), params);
  },

  /**
   * Upload consultant profile photo
   * @param {string|number} id - The consultant ID
   * @param {FormData} formData - Form data containing the photo file
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise} - The upload response promise
   */
  uploadPhoto: (id, formData, onProgress) => {
    return apiService.upload(
      `/api/v1/consultant/${id}/photo`,
      formData,
      onProgress
    );
  },
};

export default consultantService;
