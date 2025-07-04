import apiClient from "../utils/axiosConfig";
import config from "../utils/config";

// ---------------------------------------------
// Meeting (Daily.co) service
// ---------------------------------------------

/**
 * Fetch meeting room info for a specific appointment
 * @param {string|number} appointmentId
 * @param {string} userId - GUID of current user
 */
export const getMeetingInfo = async (appointmentId, userId) => {
  const url = config.api.meeting.getMeetingInfo(appointmentId);
  const response = await apiClient.get(url, { params: { userId } });
  return response.data;
};

/**
 * Create a Daily.co room for an appointment
 * @param {string|number} appointmentId
 * @param {boolean} preScheduled - Whether to create a pre-scheduled room
 */
export const createMeetingRoom = async (appointmentId, preScheduled = true) => {
  const url = config.api.meeting.createRoom(appointmentId);
  const response = await apiClient.post(url, null, {
    params: { preScheduled },
  });
  return response.data;
};

/**
 * Delete a Daily.co room
 * @param {string} roomName
 */
export const deleteMeetingRoom = async (roomName) => {
  const url = config.api.meeting.deleteRoom(roomName);
  const response = await apiClient.delete(url);
  return response.data;
};

/**
 * Get room status
 * @param {string} roomName
 */
export const getRoomStatus = async (roomName) => {
  const url = config.api.meeting.getRoomStatus(roomName);
  const response = await apiClient.get(url);
  return response.data;
};

/**
 * Quick test endpoint that creates a temp Daily.co room instantly
 * @param {string} userRole eg. "user1", "user2"
 */
export const testJoinNow = async (userRole = "user1") => {
  const response = await apiClient.get(config.api.meeting.testJoinNow, {
    params: { userRole },
  });
  return response.data;
};
