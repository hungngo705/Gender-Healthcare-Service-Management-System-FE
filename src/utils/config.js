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
    return "https://localhost:7050/api/v2";
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
    return "https://your-production-api-domain.com/api/v2"; 
  }

  // Fallback for other hosts
  return `https://${currentHost}:7050/api/v2`; 
};

const config = {
  // API URLs
  api: {
    baseURL: getApiBaseURL(),
    timeout: 20000, // 20 seconds
    // Auth endpoints
    auth: {
      login: "/login",
      register: "/register",
      refreshToken: "/refresh-token",
      logout: "/logout",
      verifyEmail: "/verify-email",
      forgotPassword: "/send-reset-code",
      resetPassword: "/verify-code-and-reset",
    }, // User endpoints
    users: {
      getAll: "/user/getall",
      create: "/user/create",
      getAllByRole: (role) => `/user/getall/${role}`,
      getById: (id) => `/user/${id}`,
      update: (id) => `/user/update/${id}`,
      delete: (id) => `/user/delete/${id}`,
      profile: "/user/profile/me",
      changePassword: "/user/change-password",
    },

    // Consultant endpoints
    consultants: {
      getAll: "/consultant/getall",
      getById: (id) => `/consultant/${id}`,
      create: "/consultant/create",
      update: (id) => `/consultant/${id}`,
      delete: (id) => `/consultant/${id}`,
      getAvailability: (id) => `/consultant/${id}/availability`,
    },

    // Appointment endpoints
    appointments: {
      getAll: "/appointment/getall",
      create: "/appointment/create",
      getById: (id) => `/appointment/${id}`,
      update: (id) => `/appointment/update/${id}`,
      cancel: (id) => `/appointment/${id}/cancel`,
      getByUser: (userId) => `/appointment/user/${userId}`,
      getByConsultant: (consultantId) =>
        `/appointment/consultant/${consultantId}`,
    },

    // STI testing endpoints
    stiTesting: {
      getAll: "/sti-test/getall",
      create: "/sti-test/create",
      getById: (id) => `/sti-test/${id}`,
      getByUser: (userId) => `/sti-test/user/${userId}`,
      updateResult: (id) => `/sti-test/${id}/result`,
    },

    // Blog endpoints
    blog: {
      getAll: "/blog/getall",
      create: "/blog/create",
      getById: (id) => `/blog/${id}`,
      update: (id) => `/blog/${id}`,
      delete: (id) => `/blog/${id}`,
      getComments: (blogId) => `/blog/${blogId}/comments`,
      addComment: (blogId) => `/blog/${blogId}/comments`,
    }, // Service endpoints
    services: {
      getAll: "/service/getall",
      create: "/service/create",
      getById: (id) => `/service/${id}`,
      update: (id) => `/service/${id}`,
      delete: (id) => `/service/${id}`,
    }, // Dashboard endpoints
    dashboard: {
      stats: "/dashboard/stats",
      data: "/dashboard/data",
      usersByRole: "/dashboard/users-by-role",
      appointmentsByStatus: "/dashboard/appointments-by-status",
      statsByRole: (role) => `/dashboard/stats/role/${role}`,
      activities: "/dashboard/activities",
      monthlyStats: (year, month) =>
        `/dashboard/stats/monthly/${year}/${month}`,
    },

    // TestResult endpoints
    testResult: {
      getAll: "/testresult/getall",
      getById: (id) => `/testresult/${id}`,
      create: "/testresult/create",
      update: (id) => `/testresult/${id}`,
      getByAppointment: (appointmentId) =>
        `/testresult/appointment/${appointmentId}`,
      getByPatient: (patientId) => `/testresult/patient/${patientId}`,
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
