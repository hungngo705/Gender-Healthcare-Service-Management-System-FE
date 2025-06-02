import { apiService } from "../utils/axiosConfig";
import config from "../utils/config";

/**
 * Service for handling appointment-related API calls
 */
const appointmentService = {
  /**
   * Get all appointments
   * @param {Object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise} - The appointments response promise
   */
  getAll: (params = {}) => {
    return apiService.get(config.api.appointments.getAll, params);
  },

  /**
   * Get appointment by ID
   * @param {string|number} id - The appointment ID
   * @returns {Promise} - The appointment response promise
   */
  getById: (id) => {
    return apiService.get(config.api.appointments.getById(id));
  },

  /**
   * Create a new appointment
   * @param {Object} appointmentData - The appointment data
   * @returns {Promise} - The create appointment response promise
   */
  create: (appointmentData) => {
    return apiService.post(config.api.appointments.create, appointmentData);
  },

  /**
   * Update an appointment
   * @param {string|number} id - The appointment ID
   * @param {Object} appointmentData - The updated appointment data
   * @returns {Promise} - The update appointment response promise
   */
  update: (id, appointmentData) => {
    return apiService.put(config.api.appointments.update(id), appointmentData);
  },

  /**
   * Cancel an appointment
   * @param {string|number} id - The appointment ID
   * @returns {Promise} - The cancel appointment response promise
   */
  cancel: (id) => {
    return apiService.post(config.api.appointments.cancel(id));
  },

  /**
   * Get appointments by user ID
   * @param {string|number} userId - The user ID
   * @param {Object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise} - The appointments response promise
   */
  getByUser: (userId, params = {}) => {
    return apiService.get(config.api.appointments.getByUser(userId), params);
  },

  /**
   * Get appointments by consultant ID
   * @param {string|number} consultantId - The consultant ID
   * @param {Object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise} - The appointments response promise
   */
  getByConsultant: (consultantId, params = {}) => {
    return apiService.get(
      config.api.appointments.getByConsultant(consultantId),
      params
    );
  },
};

export default appointmentService;
