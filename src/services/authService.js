import users from "../data/users";

/**
 * Auth service for handling authentication with mock data
 */
export const authService = {
  /**
   * Authenticate user with email and password
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise} Promise that resolves with user data or rejects with error message
   */
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        const user = users.find(
          (user) =>
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
        );

        if (user) {
          // Never send password to client in real applications
          const { password: _, ...userWithoutPassword } = user;
          resolve(userWithoutPassword);
        } else {
          reject({ message: "Invalid email or password" });
        }
      }, 800); // Simulate API delay
    });
  },

  /**
   * Check if user is authenticated (has valid token)
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated: () => {
    const user = localStorage.getItem("user");
    return !!user;
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} Current user object or null
   */
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Log out user by removing from localStorage
   */
  logout: () => {
    localStorage.removeItem("user");
  },
};

export default authService;
