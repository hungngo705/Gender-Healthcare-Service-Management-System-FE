import { apiService } from "../utils/axiosConfig";
import config from "../utils/config";

/**
 * Service for handling notification-related API calls
 */
const notificationService = {
  /**
   * Get all notifications for a specific user.
   * In a real app, this would likely be for the currently logged-in user,
   * so the `userId` might be handled by the backend session.
   * For this implementation, we'll pass it, but it might be redundant
   * if the backend already knows the user from the auth token.
   * @returns {Promise} - The notifications response promise
   */
  getNotificationsForUser: () => {
    // The backend should identify the user from the auth token,
    // so no userId is needed in the call.
    // The config requires a userId, so we pass a placeholder. This is a bit of a workaround.
    // A better approach would be to have a dedicated endpoint like `/api/v2.5/notification/me`
    return apiService.get(config.api.notification.getForUser("me"));
  },

  /**
   * Marks a specific notification as read.
   * @param {string} notificationId - The ID of the notification to mark as read.
   * @returns {Promise} - The API call promise.
   */
  markAsRead: (notificationId) => {
    // Using POST for this action. The body can be empty.
    return apiService.put(
      config.api.notification.markAsRead(notificationId),
      {}
    );
  },
};

export default notificationService;
