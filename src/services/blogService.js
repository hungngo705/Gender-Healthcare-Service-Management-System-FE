import axios from "axios";
import config from "../utils/config";

const API_URL = config.api.baseURL;

// Tạo hàm helper để lấy token từ localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem(config.auth.storageKey);
  if (!token) {
    console.warn("No authentication token found");
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

const blogService = {
  // Get all blog posts
  getAll: async () => {
    try {
      console.log("Calling getAll API:", `${API_URL}${config.api.blog.getAll}`);
      const response = await axios.get(`${API_URL}${config.api.blog.getAll}`, {
        headers: getAuthHeader(),
      });
      console.log("API response:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw error;
    }
  },

  // Get a single blog post by ID
  getById: async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}${config.api.blog.getById(id)}`,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching blog post with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new blog post
  create: async (blogData) => {
    try {
      const response = await axios.post(
        `${API_URL}${config.api.blog.create}`,
        blogData,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  },

  // Update an existing blog post
  update: async (id, blogData) => {
    try {
      const response = await axios.put(
        `${API_URL}${config.api.blog.update(id)}`,
        blogData,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating blog post with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a blog post
  delete: async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}${config.api.blog.delete(id)}`,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting blog post with id ${id}:`, error);
      throw error;
    }
  },

  // Get comments for a blog post
  getComments: async (blogId) => {
    try {
      const response = await axios.get(
        `${API_URL}${config.api.blog.getComments(blogId)}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error(
        `Error fetching comments for blog post with id ${blogId}:`,
        error
      );
      throw error;
    }
  },

  // Add a comment to a blog post
  addComment: async (blogId, commentData) => {
    try {
      const response = await axios.post(
        `${API_URL}${config.api.blog.addComment(blogId)}`,
        commentData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error adding comment to blog post with id ${blogId}:`,
        error
      );
      throw error;
    }
  },
};

export default blogService;
