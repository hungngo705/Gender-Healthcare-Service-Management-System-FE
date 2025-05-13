// Environment configuration

// In a real application, these would be loaded from environment variables
// Using import.meta.env (Vite) or process.env (Create React App)

const config = {
  // API URLs
  api: {
    baseURL: import.meta.env.VITE_API_URL || "https://api.example.com",
    timeout: 10000, // 10 seconds
  },

  // Feature flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true" || false,
    enableNotifications:
      import.meta.env.VITE_ENABLE_NOTIFICATIONS === "true" || false,
  },

  // Authentication
  auth: {
    storageKey: "auth_token",
    refreshStorageKey: "refresh_token",
  },
};

export default config;
