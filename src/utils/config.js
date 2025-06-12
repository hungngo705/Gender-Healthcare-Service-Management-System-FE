// Environment configuration

// Environment detection and API URL configuration
const getApiBaseURL = () => {
  // First check environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Auto-detect based on current host
  const currentHost = window.location.hostname;

  if (currentHost === "localhost" || currentHost === "127.0.0.1") {
    return "https://localhost:7050";
  }

  // For production, you need to set the correct API URL
  // This should match your backend server URL
  if (
    currentHost.includes("github.io") ||
    currentHost.includes("vercel.app") ||
    currentHost.includes("netlify.app")
  ) {
    // Common hosting platforms - update with your actual production API URL
    console.warn(
      "Production API URL not configured! Please set VITE_API_URL environment variable."
    );
    return "https://your-production-api-domain.com"; // Replace with actual production URL
  }

  // Fallback for other hosts
  return `https://${currentHost}:7050`;
};

const config = {
  // API URLs
  api: {
    baseURL: getApiBaseURL(),
    timeout: 20000, // 20 seconds
    // Auth endpoints
    auth: {
      login: "/api/v1/login",
      register: "/api/v1/register",
      refreshToken: "/api/v1/refresh-token",
      logout: "/api/v1/logout",
      verifyEmail: "/api/v1/verify-email",
      forgotPassword: "/send-reset-code",
      resetPassword: "/verify-code-and-reset",
    },

    // User endpoints
    users: {
      getAll: "/api/v1/user/getall",
      create: "/api/v1/user/create",
      getById: (id) => `/api/v1/user/${id}`,
      update: (id) => `/api/v1/user/update/${id}`,
      delete: (id) => `/api/v1/user/delete/${id}`,
      profile: "/api/v1/user/profile",
      changePassword: "/api/v1/user/change-password",
    },

    // Consultant endpoints
    consultants: {
      getAll: "/api/v1/consultant/getall",
      getById: (id) => `/api/v1/consultant/${id}`,
      create: "/api/v1/consultant/create",
      update: (id) => `/api/v1/consultant/${id}`,
      delete: (id) => `/api/v1/consultant/${id}`,
      getAvailability: (id) => `/api/v1/consultant/${id}/availability`,
    },

    // Appointment endpoints
    appointments: {
      getAll: "/api/v1/appointment/getall",
      create: "/api/v1/appointment/create",
      getById: (id) => `/api/v1/appointment/${id}`,
      update: (id) => `/api/v1/appointment/${id}`,
      cancel: (id) => `/api/v1/appointment/${id}/cancel`,
      getByUser: (userId) => `/api/v1/appointment/user/${userId}`,
      getByConsultant: (consultantId) =>
        `/api/v1/appointment/consultant/${consultantId}`,
    },

    // STI testing endpoints
    stiTesting: {
      getAll: "/api/v1/sti-test/getall",
      create: "/api/v1/sti-test/create",
      getById: (id) => `/api/v1/sti-test/${id}`,
      getByUser: (userId) => `/api/v1/sti-test/user/${userId}`,
      updateResult: (id) => `/api/v1/sti-test/${id}/result`,
    },

    // Blog endpoints
    blog: {
      getAll: "/api/v1/blog/getall",
      create: "/api/v1/blog/create",
      getById: (id) => `/api/v1/blog/${id}`,
      update: (id) => `/api/v1/blog/${id}`,
      delete: (id) => `/api/v1/blog/${id}`,
      getComments: (blogId) => `/api/v1/blog/${blogId}/comments`,
      addComment: (blogId) => `/api/v1/blog/${blogId}/comments`,
    }, // Service endpoints
    services: {
      getAll: "/api/v1/service/getall",
      create: "/api/v1/service/create",
      getById: (id) => `/api/v1/service/${id}`,
      update: (id) => `/api/v1/service/${id}`,
      delete: (id) => `/api/v1/service/${id}`,
    }, // Dashboard endpoints
    dashboard: {
      stats: "/api/v1/dashboard/stats",
      data: "/api/v1/dashboard/data",
      usersByRole: "/api/v1/dashboard/users-by-role",
      appointmentsByStatus: "/api/v1/dashboard/appointments-by-status",
      statsByRole: (role) => `/api/v1/dashboard/stats/role/${role}`,
      activities: "/api/v1/dashboard/activities",
      monthlyStats: (year, month) =>
        `/api/v1/dashboard/stats/monthly/${year}/${month}`,
    },
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
