import { apiService } from "../utils/axiosConfig";
import config from "../utils/config";

/**
 * Service for handling dashboard-related API calls
 */
const dashboardService = {
  /**
   * Get dashboard statistics
   * @returns {Promise} - The dashboard stats response promise
   */
  getStats: () => {
    return apiService.get(config.api.dashboard.stats);
  },

  /**
   * Get dashboard data (comprehensive overview)
   * @returns {Promise} - The dashboard data response promise
   */
  getDashboardData: () => {
    return apiService.get(config.api.dashboard.data);
  },

  /**
   * Get user statistics by role
   * @param {string} role - User role to filter statistics
   * @returns {Promise} - The role-specific stats response promise
   */
  getStatsByRole: (role) => {
    return apiService.get(config.api.dashboard.statsByRole(role));
  },

  /**
   * Get recent activities
   * @param {Object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise} - The recent activities response promise
   */
  getRecentActivities: (params = {}) => {
    return apiService.get(config.api.dashboard.activities, params);
  },
  /**
   * Get monthly statistics
   * @param {number} year - Year for statistics
   * @param {number} month - Month for statistics
   * @returns {Promise} - The monthly stats response promise
   */
  getMonthlyStats: (year, month) => {
    return apiService.get(config.api.dashboard.monthlyStats(year, month));
  },

  /**
   * Get users grouped by role
   * @returns {Promise} - The users by role response promise
   */
  getUsersByRole: () => {
    return apiService.get(config.api.dashboard.usersByRole);
  },

  /**
   * Get appointments grouped by status
   * @returns {Promise} - The appointments by status response promise
   */
  getAppointmentsByStatus: () => {
    return apiService.get(config.api.dashboard.appointmentsByStatus);
  },
};

export default dashboardService;
