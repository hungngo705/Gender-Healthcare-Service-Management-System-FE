import { apiService } from "../utils/axiosConfig";
import config from "../utils/config";

/**
 * Service for handling STI testing-related API calls
 */
const stiTestingService = {
  /**
   * Get all STI tests
   * @param {Object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise} - The STI tests response promise
   */
  getAll: (params = {}) => {
    return apiService.get(config.api.stiTesting.getAll, params);
  },

  /**
   * Get STI test by ID
   * @param {string|number} id - The STI test ID
   * @returns {Promise} - The STI test response promise
   */
  getById: (id) => {
    return apiService.get(config.api.stiTesting.getById(id));
  },

  /**
   * Create a new STI test booking
   * @param {Object} testData - The STI test booking data
   * @returns {Promise} - The create STI test booking response promise
   */
  create: (testData) => {
    return apiService.post(config.api.stiTesting.create, testData);
  },

  /**
   * Get STI tests by user ID
   * @param {string|number} userId - The user ID
   * @param {Object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise} - The STI tests response promise
   */
  getByUser: (userId, params = {}) => {
    return apiService.get(config.api.stiTesting.getByUser(userId), params);
  },

  /**
   * Update STI test result
   * @param {string|number} id - The STI test ID
   * @param {Object} resultData - The test result data
   * @returns {Promise} - The update STI test result response promise
   */
  updateResult: (id, resultData) => {
    return apiService.put(config.api.stiTesting.updateResult(id), resultData);
  },
};

export default stiTestingService;
