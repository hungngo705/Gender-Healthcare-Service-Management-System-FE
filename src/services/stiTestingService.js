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
    return apiService.get(config.api.stiTesting.getAll, { params });
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
   * Update STI test
   * @param {string} id - The STI test ID
   * @param {Object} testData - The test data to update
   * @returns {Promise} - The update STI test response promise
   */
  update: (id, testData) => {
    return apiService.put(config.api.stiTesting.update(id), testData);
  },

  /**
   * Delete STI test
   * @param {string} id - The STI test ID
   * @returns {Promise} - The delete STI test response promise
   */
  delete: (id) => {
    return apiService.delete(config.api.stiTesting.delete(id));
  },
};

export default stiTestingService;
