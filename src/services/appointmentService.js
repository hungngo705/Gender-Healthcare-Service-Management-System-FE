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
    return apiService.put(config.api.appointments.cancel(id));
  },

  /**
   * Get appointments by user ID
   * @param {string|number} userId - The user ID
   * @param {Object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise} - The appointments response promise
   */
  getByUser: (userId, params = {}) => {
    // Nếu không có userId cụ thể, sử dụng endpoint 'me' để lấy cuộc hẹn của người dùng hiện tại
    const endpoint = userId
      ? config.api.appointments.getByUser(userId)
      : config.api.appointments.getByCurrentUser;
    return apiService.get(endpoint, { params });
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

  // Attendance
  checkIn: (id) => apiService.put(config.api.appointments.checkIn(id)),
  checkOut: (id) => apiService.put(config.api.appointments.checkOut(id)),

  /**
   * Update meeting link for an appointment
   * @param {string|number} id - The appointment ID
   * @param {Object} meetingLinkData - The meeting link data
   * @returns {Promise} - The update meeting link response promise
   */
  updateMeetingLink: (id, meetingLinkData) => {
    return apiService.put(
      config.api.appointments.updateMeetingLink(id),
      meetingLinkData
    );
  },

  /**
   * Delete an appointment
   * @param {string|number} id - The appointment ID
   * @returns {Promise} - The delete appointment response promise
   */
  delete: (id) => {
    return apiService.delete(config.api.appointments.delete(id));
  },

  /**
   * Get all consultant schedules
   * @param {Object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise} - The consultant schedules response promise
   */
  getConsultantSchedules: (params = {}) => {
    return apiService.get(
      config.api.appointments.getConsultantSchedules,
      params
    );
  },

  /**
   * Get consultant schedule by ID
   * @param {string|number} id - The schedule ID
   * @returns {Promise} - The consultant schedule response promise
   */
  getConsultantScheduleById: (id) => {
    return apiService.get(
      config.api.appointments.getConsultantScheduleById(id)
    );
  },

  /**
   * Create a new consultant schedule
   * @param {Object} scheduleData - The schedule data
   * @returns {Promise} - The create schedule response promise
   */
  createConsultantSchedule: (scheduleData) => {
    return apiService.post(
      config.api.appointments.createConsultantSchedule,
      scheduleData
    );
  },
};

export default appointmentService;
