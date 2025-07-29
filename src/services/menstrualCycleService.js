import axios from "axios";
import config from "../utils/config";
import { handleApiError } from "../utils/errorUtils";
import authHeader from "../utils/authHeader";
import userService from "./userService";
import { formatDateForVietnamTimezone } from "../utils/timezoneUtils";

const baseURL = config.api.baseURL;

/**
 * Service for menstrual cycle tracking functionality
 */
const menstrualCycleService = {
  /**
   * Get all menstrual cycle trackings for the current user
   * @returns {Promise} Promise object with the response data
   */
  getAllTrackings: async () => {
    try {
      // First, get API data
      const response = await axios.get(
        `${baseURL}${config.api.menstrualCycle.getAll}`,
        {
          headers: authHeader(),
        }
      );

      // Then, get current user ID
      const currentUser = await userService.getCurrentUserProfile();

      if (!currentUser || !currentUser.id) {
        return [];
      }

      // Filter the data by current user's ID
      const userTrackings = response.data.filter(
        (tracking) => tracking.customerId === currentUser.id
      );

      return userTrackings;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Create a new menstrual cycle tracking
   * @param {Object} trackingData - The tracking data to create
   * @returns {Promise} Promise object with the response data
   */
  createTracking: async (trackingData) => {
    try {
      // Use the timezone utility for consistent date formatting

      // Transform camelCase frontend data to PascalCase backend format
      const backendData = {
        CycleStartDate: formatDateForVietnamTimezone(trackingData.cycleStartDate),
        CycleEndDate: formatDateForVietnamTimezone(trackingData.cycleEndDate),
        Symptoms: Array.isArray(trackingData.symptoms) 
          ? trackingData.symptoms.join(', ') 
          : (trackingData.symptoms || ''),
        Notes: trackingData.notes || '',
        NotifyBeforeDays: trackingData.notifyBeforeDays || 7,
        NotificationEnabled: trackingData.notificationEnabled !== undefined ? trackingData.notificationEnabled : true
      };
      
      // Debug logging
      console.log('Frontend data:', trackingData);
      console.log('Backend payload:', backendData);
      
      const response = await axios.post(
        `${baseURL}${config.api.menstrualCycle.create}`,
        backendData,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get a specific menstrual cycle tracking by ID
   * @param {string} id - The ID of the tracking to retrieve
   * @returns {Promise} Promise object with the response data
   */
  getTrackingById: async (id) => {
    try {
      const response = await axios.get(
        `${baseURL}${config.api.menstrualCycle.getById(id)}`,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Update a specific menstrual cycle tracking
   * @param {string} id - The ID of the tracking to update
   * @param {Object} trackingData - The updated tracking data
   * @returns {Promise} Promise object with the response data
   */
  updateTracking: async (id, trackingData) => {
    try {
      // Transform camelCase frontend data to PascalCase backend format
      const backendData = {
        CycleStartDate: trackingData.cycleStartDate,
        CycleEndDate: trackingData.cycleEndDate || null,
        Symptoms: Array.isArray(trackingData.symptoms) 
          ? trackingData.symptoms.join(', ') 
          : (trackingData.symptoms || ''),
        Notes: trackingData.notes || '',
        NotifyBeforeDays: trackingData.notifyBeforeDays || 7,
        NotificationEnabled: trackingData.notificationEnabled !== undefined ? trackingData.notificationEnabled : true
      };
      
      const response = await axios.put(
        `${baseURL}${config.api.menstrualCycle.update(id)}`,
        backendData,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Delete a specific menstrual cycle tracking
   * @param {string} id - The ID of the tracking to delete
   * @returns {Promise} Promise object with the response data
   */
  deleteTracking: async (id) => {
    try {
      const response = await axios.delete(
        `${baseURL}${config.api.menstrualCycle.delete(id)}`,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get menstrual cycle tracking history
   * @returns {Promise} Promise object with the response data
   */
  getHistory: async () => {
    try {
      const response = await axios.get(
        `${baseURL}${config.api.menstrualCycle.getHistory}`,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get prediction for next menstrual cycle
   * @returns {Promise} Promise object with the response data
   */
  predictNextCycle: async () => {
    try {
      const response = await axios.get(
        `${baseURL}${config.api.menstrualCycle.predictNext}`,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get fertility window prediction
   * @returns {Promise} Promise object with the response data
   */
  getFertilityWindow: async () => {
    try {
      const response = await axios.get(
        `${baseURL}${config.api.menstrualCycle.getFertilityWindow}`,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get menstrual cycle analytics
   * @returns {Promise} Promise object with the response data
   */
  getAnalytics: async () => {
    try {
      const response = await axios.get(
        `${baseURL}${config.api.menstrualCycle.getAnalytics}`,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get menstrual cycle insights
   * @returns {Promise} Promise object with the response data
   */
  getInsights: async () => {
    try {
      const response = await axios.get(
        `${baseURL}${config.api.menstrualCycle.getInsights}`,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get menstrual cycle notifications
   * @returns {Promise} Promise object with the response data
   */
  getNotifications: async () => {
    try {
      const response = await axios.get(
        `${baseURL}${config.api.menstrualCycle.getNotifications}`,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Set notification preferences for menstrual cycle tracking
   * @param {Object} preferences - The notification preferences
   * @returns {Promise} Promise object with the response data
   */
  setNotificationPreferences: async (preferences) => {
    try {
      const response = await axios.post(
        `${baseURL}${config.api.menstrualCycle.setNotificationPreferences}`,
        preferences,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get menstrual cycle trends
   * @returns {Promise} Promise object with the response data
   */
  getTrends: async () => {
    try {
      const response = await axios.get(
        `${baseURL}${config.api.menstrualCycle.getTrends}`,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default menstrualCycleService;
