import axios from "axios";
import config from "../utils/config";

/**
 * Service for handling feedback-related API requests
 */
const feedbackService = {
  /**
   * Get all feedbacks
   * @returns {Promise<Array>} List of feedbacks
   */
  getAll: async () => {
    const response = await axios.get(
      `${config.api.baseURL}${config.api.feedback.getAll}`
    );
    return response.data;
  },

  /**
   * Get feedback by ID
   * @param {string} id - Feedback ID
   * @returns {Promise<Object>} Feedback object
   */
  getById: async (id) => {
    const response = await axios.get(
      `${config.api.baseURL}${config.api.feedback.getById(id)}`
    );
    return response.data;
  },

  /**
   * Create a new feedback
   * @param {Object} feedbackData - Feedback data to submit
   * @returns {Promise<Object>} Created feedback
   */
  create: async (feedbackData) => {
    const response = await axios.post(
      `${config.api.baseURL}${config.api.feedback.create}`,
      feedbackData
    );
    return response.data;
  },

  /**
   * Update an existing feedback
   * @param {string} id - Feedback ID
   * @param {Object} feedbackData - Updated feedback data
   * @returns {Promise<Object>} Updated feedback
   */
  update: async (id, feedbackData) => {
    const response = await axios.put(
      `${config.api.baseURL}${config.api.feedback.update(id)}`,
      feedbackData
    );
    return response.data;
  },

  /**
   * Delete a feedback
   * @param {string} id - Feedback ID
   * @returns {Promise<Object>} Result of deletion
   */
  delete: async (id) => {
    const response = await axios.delete(
      `${config.api.baseURL}${config.api.feedback.delete(id)}`
    );
    return response.data;
  },

  /**
   * Get feedbacks for the current customer
   * @returns {Promise<Array>} Customer's feedbacks
   */
  getCustomerFeedbacks: async () => {
    const response = await axios.get(
      `${config.api.baseURL}${config.api.feedback.getCustomerFeedbacks}`
    );
    return response.data;
  },

  /**
   * Get feedbacks for the current consultant
   * @returns {Promise<Array>} Consultant's feedbacks
   */
  getConsultantFeedbacks: async () => {
    const response = await axios.get(
      `${config.api.baseURL}${config.api.feedback.getConsultantFeedbacks}`
    );
    return response.data;
  },

  /**
   * Get feedbacks for a specific appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Array>} Feedbacks for the appointment
   */
  getByAppointment: async (appointmentId) => {
    const response = await axios.get(
      `${config.api.baseURL}${config.api.feedback.getByAppointment(
        appointmentId
      )}`
    );
    return response.data;
  },

  /**
   * Check if user can provide feedback for an appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} Permission status
   */
  canProvideFeedback: async (appointmentId) => {
    const response = await axios.get(
      `${config.api.baseURL}${config.api.feedback.canProvideFeedback(
        appointmentId
      )}`
    );
    return response.data;
  },

  /**
   * Get public feedbacks for a specific consultant
   * @param {string} consultantId - Consultant ID
   * @returns {Promise<Array>} Public feedbacks for the consultant
   */
  getConsultantPublicFeedbacks: async (consultantId) => {
    const response = await axios.get(
      `${config.api.baseURL}${config.api.feedback.getConsultantPublicFeedbacks(
        consultantId
      )}`
    );
    return response.data;
  },
};

export default feedbackService;
