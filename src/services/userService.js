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
   * Get current user profile
   * @returns {Promise} Promise that resolves with current user profile
   */
  getCurrentUserProfile: async () => {
    try {
      const response = await apiService.get(config.api.users.profile);
      return response.data?.data || response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Update current user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Promise that resolves with updated profile
   */
  updateCurrentUserProfile: async (profileData) => {
    try {
      const response = await apiService.put(
        config.api.users.profile,
        profileData
      );
      const responseData = response.data?.data || response.data;

      // Update localStorage user data
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...responseData };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toastService.success("Hồ sơ của bạn đã được cập nhật");
      return responseData;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Get all users by role
   * @param {string} role - Role to filter users by
   * @returns {Promise} Promise that resolves with users list filtered by role
   */
  getAllByRole: async (role) => {
    try {
      const response = await apiService.get(config.api.users.getAllByRole(role));
      return response.data?.data || response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default userService;
