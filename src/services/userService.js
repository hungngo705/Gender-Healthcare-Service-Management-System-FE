import { apiService } from "../utils/axiosConfig";
import config from "../utils/config";
import toastService from "../utils/toastService";

/**
 * User service for handling user management operations
 */
export const userService = {
  /**
   * Get all users
   * @returns {Promise} Promise that resolves with users list
   */
  getAllUsers: async () => {
    try {
      const response = await apiService.get(config.api.users.getAll);
      return response.data?.data || response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Create a new user
   * @param {Object} userData - User data to create
   * @returns {Promise} Promise that resolves with created user
   */
  createUser: async (userData) => {
    try {
      const response = await apiService.post(config.api.users.create, userData);
      const responseData = response.data?.data || response.data;
      toastService.success("Người dùng đã được tạo thành công");
      return responseData;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Get user by ID
   * @param {string|number} id - User ID
   * @returns {Promise} Promise that resolves with user data
   */
  getUserById: async (id) => {
    try {
      const response = await apiService.get(config.api.users.getById(id));
      return response.data?.data || response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Update user by ID
   * @param {string|number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Promise that resolves with updated user
   */
  updateUser: async (id, userData) => {
    try {
      const response = await apiService.put(
        config.api.users.update(id),
        userData
      );
      const responseData = response.data?.data || response.data;
      toastService.success("Thông tin người dùng đã được cập nhật");
      return responseData;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Delete user by ID
   * @param {string|number} id - User ID
   * @returns {Promise} Promise that resolves when user is deleted
   */
  deleteUser: async (id) => {
    try {
      const response = await apiService.delete(config.api.users.delete(id));
      toastService.success("Người dùng đã được xóa thành công");
      return response.data?.data || response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Set user role
   * @param {string|number} id - User ID
   * @param {string} role - New role for the user
   * @returns {Promise} Promise that resolves when role is updated
   */
  setUserRole: async (id, role) => {
    try {
      const response = await apiService.put(`/api/v1/user/set-role/${id}`, {
        role,
      });
      const responseData = response.data?.data || response.data;
      toastService.success("Vai trò người dùng đã được cập nhật");
      return responseData;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Update user profile
   * @param {string|number} id - User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Promise that resolves with updated profile
   */
  updateUserProfile: async (id, profileData) => {
    try {
      const response = await apiService.put(
        `/api/v1/user/profile/${id}`,
        profileData
      );
      const responseData = response.data?.data || response.data;
      toastService.success("Hồ sơ đã được cập nhật thành công");
      return responseData;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Update user avatar
   * @param {string|number} id - User ID
   * @param {FormData} avatarData - Avatar file data
   * @returns {Promise} Promise that resolves with updated avatar info
   */
  updateUserAvatar: async (id, avatarData) => {
    try {
      const response = await apiService.put(
        `/api/v1/user/avatar/${id}`,
        avatarData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseData = response.data?.data || response.data;
      toastService.success("Ảnh đại diện đã được cập nhật");
      return responseData;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Get current user's profile
   * @returns {Promise} Promise that resolves with current user profile data
   */
  getCurrentUserProfile: async () => {
    try {
      const response = await apiService.get(config.api.users.myProfile);
      // Handle the unified response format with status_code, message, and data fields
      if (response.data && response.data.is_success) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return Promise.reject(error);
    }
  },

  /**
   * Update current user's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Promise that resolves with updated profile
   */
  updateCurrentUserProfile: async (profileData) => {
    try {
      const response = await apiService.put(
        config.api.users.myProfile,
        profileData
      );
      // Handle the unified response format
      if (response.data && response.data.is_success) {
        toastService.success("Thông tin đã được cập nhật thành công");
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      toastService.error("Không thể cập nhật thông tin. Vui lòng thử lại sau.");
      return Promise.reject(error);
    }
  },
};

export default userService;
