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
    return "https://your-production-api-domain.com";
  }

  // Fallback for other hosts
  return `https://${currentHost}:7050`;
};

const config = {
  // API URLs
  api: {
    baseURL: getApiBaseURL(),
    timeout: 20000, // 20 seconds    // Auth endpoints
    auth: {
      login: "/api/v2/login",
      register: "/api/v2/register",
      refreshToken: "/api/v2/refresh-token",
      logout: "/api/v2/logout",
      verifyEmail: "/api/v2/verify-email",
      forgotPassword: "/api/v2/send-reset-code",
      resetPassword: "/api/v2/verify-code-and-reset",
    }, // User endpoints    users: {
    getAll: "/api/v2/user/getall",
    create: "/api/v2/user/create",
    getAllByRole: (role) => `/api/v2/user/getall/${role}`,
    getById: (id) => `/api/v2/user/${id}`,
    update: (id) => `/api/v2/user/update/${id}`,
    delete: (id) => `/api/v2/user/delete/${id}`,
    profile: "/api/v2/user/profile/me",
    changePassword: "/api/v2/user/change-password",
  }, // Consultant endpoints
  consultants: {
    getAll: "/api/v2/consultant/getall",
    getById: (id) => `/api/v2/consultant/${id}`,
    create: "/api/v2/consultant/create",
    update: (id) => `/api/v2/consultant/${id}`,
    delete: (id) => `/api/v2/consultant/${id}`,
    getAvailability: (id) => `/api/v2/consultant/${id}/availability`,
  }, // Appointment endpoints
  appointments: {
    getAll: "/api/v2/appointment/getall",
    create: "/api/v2/appointment/create",
    getById: (id) => `/api/v2/appointment/${id}`,
    update: (id) => `/api/v2/appointment/update/${id}`,
    cancel: (id) => `/api/v2/appointment/${id}/cancel`,
    getByUser: (userId) => `/api/v2/appointment/user/${userId}`,
    getByCurrentUser: "/api/v2/appointment/getall",
    getByConsultant: (consultantId) =>
      `/api/v2/appointment/consultant/${consultantId}`,
  }, // STI testing endpoints
  stiTesting: {
    getAll: "/api/v2/stitesting/getall",
    create: "/api/v2/stitesting/create",
    getById: (id) => `/api/v2/stitesting/${id}`,
    update: (id) => `/api/v2/stitesting/update/${id}`,
    delete: (id) => `/api/v2/stitesting/delete/${id}`,
  }, // Blog endpoints
  blog: {
    getAll: "/api/v2/blog/getall",
    create: "/api/v2/blog/create",
    getById: (id) => `/api/v2/blog/${id}`,
    update: (id) => `/api/v2/blog/${id}`,
    delete: (id) => `/api/v2/blog/${id}`,
    getComments: (blogId) => `/api/v2/blog/${blogId}/comments`,
    addComment: (blogId) => `/api/v2/blog/${blogId}/comments`,
  }, // Service endpoints
  services: {
    getAll: "/api/v2/service/getall",
    create: "/api/v2/service/create",
    getById: (id) => `/api/v2/service/${id}`,
    update: (id) => `/api/v2/service/${id}`,
    delete: (id) => `/api/v2/service/${id}`,
  }, // Dashboard endpoints
  dashboard: {
    stats: "/api/v2/dashboard/stats",
    data: "/api/v2/dashboard/data",
    usersByRole: "/api/v2/dashboard/users-by-role",
    appointmentsByStatus: "/api/v2/dashboard/appointments-by-status",
    statsByRole: (role) => `/api/v2/dashboard/stats/role/${role}`,
    activities: "/api/v2/dashboard/activities",
    monthlyStats: (year, month) =>
      `/api/v2/dashboard/stats/monthly/${year}/${month}`,
  }, // TestResult endpoints
  testResult: {
    getAll: "/api/v2/testresult/getall",
    getById: (id) => `/api/v2/testresult/${id}`,
    create: "/api/v2/testresult/create",
    update: (id) => `/api/v2/testresult/${id}`,
    getByAppointment: (appointmentId) =>
      `/api/v2/testresult/appointment/${appointmentId}`,
    getByPatient: (patientId) => `/api/v2/testresult/patient/${patientId}`,
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
