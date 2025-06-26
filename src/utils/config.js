// Environment detection and API URL configuration
const getApiBaseURL = () => {
  // First check environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Auto-detect based on current host
  const currentHost = window.location.hostname;

  // Development environment
  if (currentHost === "localhost" || currentHost === "127.0.0.1") {
    return "https://localhost:7050";
  }

  // Netlify deployment detection
  if (
    currentHost.includes("netlify.app") ||
    currentHost.includes("netlify.com")
  ) {
    return "https://everwell-1127.azurewebsites.net";
  }

  // Other production environments
  if (
    currentHost.includes("github.io") ||
    currentHost.includes("vercel.app") ||
    currentHost.includes("azurewebsites.net")
  ) {
    return (
      import.meta.env.VITE_API_URL || "https://everwell-1127.azurewebsites.net"
    );
  }

  // Fallback for custom domains
  return (
    import.meta.env.VITE_API_URL || "https://everwell-1127.azurewebsites.net"
  );
};

const config = {
  // API URLs
  api: {
    baseURL: getApiBaseURL(),
    timeout: 30000, // Increased timeout for slower Azure connections
    // Auth endpoints
    auth: {
      login: "/api/v2.5/login",
      register: "/api/v2.5/register",
      refreshToken: "/api/v2.5/refresh-token", // Fixed typo: was v2.5.5
      logout: "/api/v2.5/logout",
      verifyEmail: "/api/v2.5/verify-email",
      forgotPassword: "/api/v2.5/send-reset-code",
      resetPassword: "/api/v2.5/verify-code-and-reset",
    },
    // User endpoints
    users: {
      getAll: "/api/v2.5/user/getall",
      create: "/api/v2.5/user/create",
      getAllByRole: (role) => `/api/v2.5/user/getall/${role}`,
      getById: (id) => `/api/v2.5/user/${id}`,
      update: (id) => `/api/v2.5/user/update/${id}`,
      delete: (id) => `/api/v2.5/user/delete/${id}`,
      profile: "/api/v2.5/user/profile/me",
      changePassword: "/api/v2.5/user/change-password",
    },
    // Consultant endpoints
    consultants: {
      getAll: "/api/v2.5/consultant/getall",
      getById: (id) => `/api/v2.5/consultant/${id}`,
      create: "/api/v2.5/consultant/create",
      update: (id) => `/api/v2.5/consultant/${id}`,
      delete: (id) => `/api/v2.5/consultant/${id}`,
      getAvailability: (id) => `/api/v2.5/consultant/${id}/availability`,
    },
    // Appointment endpoints
    appointments: {
      getAll: "/api/v2.5/appointment/getall",
      create: "/api/v2.5/appointment/create",
      getById: (id) => `/api/v2.5/appointment/${id}`,
      update: (id) => `/api/v2.5/appointment/update/${id}`,
      cancel: (id) => `/api/v2.5/appointment/cancel/${id}`,
      getByUser: (userId) => `/api/v2.5/appointment/user/${userId}`,
      getByCurrentUser: "/api/v2.5/appointment/getall",
      getByConsultant: (consultantId) =>
        `/api/v2.5/appointment/consultant/${consultantId}`,
    },
    // STI testing endpoints
    stiTesting: {
      getAll: "/api/v2.5/stitesting/getall",
      getForCustomer: "/api/v2.5/stitesting/currentuser",
      create: "/api/v2.5/stitesting/create",
      getById: (id) => `/api/v2.5/stitesting/${id}`,
      update: (id) => `/api/v2.5/stitesting/update/${id}`,
      delete: (id) => `/api/v2.5/stitesting/delete/${id}`,
    },
    // Test Result endpoints
    testResult: {
      getAll: "/api/v2.5/testresult/getall",
      create: "/api/v2.5/testresult/create",
      getById: (id) => `/api/v2.5/testresult/${id}`,
      getByCustomerId: (id) => `/api/v2.5/testresult/customer/${id}`,
      update: (id) => `/api/v2.5/testresult/update/${id}`,
      delete: (id) => `/api/v2.5/testresult/delete/${id}`,
      getByTesting: (testingId) => `/api/v2.5/testresult/testing/${testingId}`,
    },
    // Blog endpoints
    blog: {
      getAll: "/api/v2.5/blog/getall",
      create: "/api/v2.5/blog/create",
      getById: (id) => `/api/v2.5/blog/${id}`,
      update: (id) => `/api/v2.5/blog/${id}`,
      delete: (id) => `/api/v2.5/blog/${id}`,
      getComments: (blogId) => `/api/v2.5/blog/${blogId}/comments`,
      addComment: (blogId) => `/api/v2.5/blog/${blogId}/comments`,
    },
    // Service endpoints
    services: {
      getAll: "/api/v2.5/service/getall",
      create: "/api/v2.5/service/create",
      getById: (id) => `/api/v2.5/service/${id}`,
      update: (id) => `/api/v2.5/service/${id}`,
      delete: (id) => `/api/v2.5/service/${id}`,
    },
    // Dashboard endpoints
    dashboard: {
      stats: "/api/v2.5/dashboard/stats",
      data: "/api/v2.5/dashboard/data",
      usersByRole: "/api/v2.5/dashboard/users-by-role",
      appointmentsByStatus: "/api/v2.5/dashboard/appointments-by-status",
      statsByRole: (role) => `/api/v2.5/dashboard/stats/role/${role}`,
      activities: "/api/v2.5/dashboard/activities",
      monthlyStats: (year, month) =>
        `/api/v2.5/dashboard/stats/monthly/${year}/${month}`,
    },
    // Menstrual cycle tracking endpoints
    menstrualCycle: {
      getAll: "/api/menstrual-cycle-trackings",
      create: "/api/menstrual-cycle-trackings",
      getById: (id) => `/api/menstrual-cycle-trackings/${id}`,
      update: (id) => `/api/menstrual-cycle-trackings/${id}`,
      delete: (id) => `/api/menstrual-cycle-trackings/${id}`,
      getHistory: "/api/menstrual-cycle-trackings/history",
      predictNext: "/api/menstrual-cycle-trackings/predict-next",
      getFertilityWindow: "/api/menstrual-cycle-trackings/fertility-window",
      getAnalytics: "/api/menstrual-cycle-trackings/analytics",
      getInsights: "/api/menstrual-cycle-trackings/insights",
      getNotifications: "/api/menstrual-cycle-trackings/notifications",
      setNotificationPreferences:
        "/api/menstrual-cycle-trackings/notification-preferences",
      getTrends: "/api/menstrual-cycle-trackings/trends",
    },
    // Payment endpoints
    payment: {
      createPayment: "/api/payment/create-payment",
      vnpayCallback: "/api/payment/vnpay-callback",
      vnpayIpn: "/api/payment/vnpay-ipn",
      getTransaction: (id) => `/api/payment/transaction/${id}`,
    },
    // Feedback endpoints
    feedback: {
      getAll: "/api/v2.5/feedback/getall",
      getById: (id) => `/api/v2.5/feedback/${id}`,
      create: "/api/v2.5/feedback/create",
      update: (id) => `/api/v2.5/feedback/update/${id}`,
      delete: (id) => `/api/v2.5/feedback/delete/${id}`,
      getCustomerFeedbacks: "/api/v2.5/feedback/customer",
      getConsultantFeedbacks: "/api/v2.5/feedback/consultant",
      getByAppointment: (appointmentId) =>
        `/api/v2.5/feedback/appointment/${appointmentId}`,
      canProvideFeedback: (appointmentId) =>
        `/api/v2.5/feedback/can-provide/${appointmentId}`,
      getConsultantPublicFeedbacks: (consultantId) =>
        `/api/v2.5/feedback/consultant/${consultantId}/public`,
    },
  },

  // Feature flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true" || false,
    enableNotifications:
      import.meta.env.VITE_ENABLE_NOTIFICATIONS === "true" || false,
    enableDebugLogging: import.meta.env.DEV || false,
  },

  // Authentication
  auth: {
    storageKey: "auth_token",
    refreshStorageKey: "refresh_token",
  },

  // Environment info
  environment: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  },
};

// Log configuration in development
if (import.meta.env.DEV) {
  console.log("App Configuration:", {
    apiBaseURL: config.api.baseURL,
    environment: config.environment,
    features: config.features,
  });
}

export default config;
