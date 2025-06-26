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
    try {
      const token = localStorage.getItem(config.auth.storageKey);
      const response = await axios.get(
        `${config.api.baseURL}${config.api.feedback.getAll}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Authorization failed when getting all feedbacks");
      }
      throw error;
    }
  },

  /**
   * Get feedback by ID
   * @param {string} id - Feedback ID
   * @returns {Promise<Object>} Feedback object
   */
  getById: async (id) => {
    try {
      const token = localStorage.getItem(config.auth.storageKey);
      const response = await axios.get(
        `${config.api.baseURL}${config.api.feedback.getById(id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Authorization failed when getting feedback by ID");
      }
      throw error;
    }
  },

  /**
   * Create a new feedback
   * @param {Object} feedbackData - Feedback data to submit
   * @returns {Promise<Object>} Created feedback
   */
  create: async (feedbackData) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem(config.auth.storageKey);

      const response = await axios.post(
        `${config.api.baseURL}${config.api.feedback.create}`,
        feedbackData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Check if it's a 401 error
      if (error.response && error.response.status === 401) {
        console.error("Authorization failed when creating feedback");
        // You could redirect to login here or handle as needed
      }
      // Propagate the error for handling in the component
      throw error;
    }
  },

  /**
   * Update an existing feedback
   * @param {string} id - Feedback ID
   * @param {Object} feedbackData - Updated feedback data
   * @returns {Promise<Object>} Updated feedback
   */
  update: async (id, feedbackData) => {
    try {
      const token = localStorage.getItem(config.auth.storageKey);
      const response = await axios.put(
        `${config.api.baseURL}${config.api.feedback.update(id)}`,
        feedbackData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Authorization failed when updating feedback");
      }
      throw error;
    }
  },

  /**
   * Delete a feedback
   * @param {string} id - Feedback ID
   * @returns {Promise<Object>} Result of deletion
   */
  delete: async (id) => {
    try {
      const token = localStorage.getItem(config.auth.storageKey);
      const response = await axios.delete(
        `${config.api.baseURL}${config.api.feedback.delete(id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Authorization failed when deleting feedback");
      }
      throw error;
    }
  },

  /**
   * Get feedbacks for the current customer
   * @returns {Promise<Array>} Customer's feedbacks
   */
  getCustomerFeedbacks: async () => {
    try {
      const token = localStorage.getItem(config.auth.storageKey);
      const response = await axios.get(
        `${config.api.baseURL}${config.api.feedback.getCustomerFeedbacks}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Authorization failed when getting customer feedbacks");
      }
      throw error;
    }
  },

  /**
   * Get feedbacks for the current consultant
   * @returns {Promise<Array>} Consultant's feedbacks
   */
  getConsultantFeedbacks: async () => {
    try {
      const token = localStorage.getItem(config.auth.storageKey);
      const response = await axios.get(
        `${config.api.baseURL}${config.api.feedback.getConsultantFeedbacks}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Authorization failed when getting consultant feedbacks");
      }
      throw error;
    }
  },

  /**
   * Get feedbacks for a specific appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Array>} Feedbacks for the appointment
   */
  getByAppointment: async (appointmentId) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem(config.auth.storageKey);

      const response = await axios.get(
        `${config.api.baseURL}${config.api.feedback.getByAppointment(
          appointmentId
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Check if it's a 401 error (now properly handled)
      if (error.response && error.response.status === 401) {
        console.error("Authorization failed when fetching feedback");
        // You could redirect to login here or handle as needed
      }
      // Propagate the error for handling in the component
      throw error;
    }
  },

  /**
   * Check if user can provide feedback for an appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} Permission status
   */
  canProvideFeedback: async (appointmentId) => {
    try {
      const token = localStorage.getItem(config.auth.storageKey);
      const response = await axios.get(
        `${config.api.baseURL}${config.api.feedback.canProvideFeedback(
          appointmentId
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Authorization failed when checking feedback permissions");
      }
      throw error;
    }
  },

  /**
   * Get public feedbacks for a specific consultant
   * @param {string} consultantId - Consultant ID
   * @returns {Promise<Array>} Public feedbacks for the consultant
   */
  getConsultantPublicFeedbacks: async (consultantId) => {
    try {
      // Even for public endpoints, include token if available for consistent handling
      const token = localStorage.getItem(config.auth.storageKey);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        `${config.api.baseURL}${config.api.feedback.getConsultantPublicFeedbacks(
          consultantId
        )}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      // Don't throw a 401 error for public endpoints
      if (error.response && error.response.status === 401) {
        console.warn("Note: Authorization failed for public feedback endpoint");
      }
      throw error;
    }
  },
};

export default feedbackService;
