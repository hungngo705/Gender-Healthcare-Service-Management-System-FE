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
    return "https://localhost:7050"; // Changed to remove
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
    return "https://your-production-api-domain.com"; // Changed to remove /api/v2.5
  }

  // Fallback for other hosts
  return `https://${currentHost}:7050`;
};

const config = {
  // API URLs
  api: {
    baseURL: getApiBaseURL(),
    timeout: 20000, // 20 seconds
    // Auth endpoints - add API prefix
    auth: {
      login: "/api/v2.5/login",
      register: "/api/v2.5/register",
      refreshToken: "/api/v2.5.5/refresh-token",
      logout: "/api/v2.5/logout",
      verifyEmail: "/api/v2.5/verify-email",
      forgotPassword: "/api/v2.5/send-reset-code",
      resetPassword: "/api/v2.5/verify-code-and-reset",
    }, // User endpoints - add API prefix
    users: {
      getAll: "/api/v2.5/user/getall",
      create: "/api/v2.5/user/create",
      getAllByRole: (role) => `/api/v2.5/user/getall/${role}`,
      getById: (id) => `/api/v2.5/user/${id}`,
      update: (id) => `/api/v2.5/user/update/${id}`,
      delete: (id) => `/api/v2.5/user/delete/${id}`,
      profile: "/api/v2.5/user/profile/me",
      changePassword: "/api/v2.5/user/change-password",
    }, // Consultant endpoints - add API prefix
    consultants: {
      getAll: "/api/v2.5/consultant/getall",
      getById: (id) => `/api/v2.5/consultant/${id}`,
      create: "/api/v2.5/consultant/create",
      update: (id) => `/api/v2.5/consultant/${id}`,
      delete: (id) => `/api/v2.5/consultant/${id}`,
      getAvailability: (id) => `/api/v2.5/consultant/${id}/availability`,
    }, // Appointment endpoints - add API prefix
    appointments: {
      getAll: "/api/v2.5/appointment/getall",
      create: "/api/v2.5/appointment/create",
      getById: (id) => `/api/v2.5/appointment/${id}`,
      update: (id) => `/api/v2.5/appointment/update/${id}`,
      cancel: (id) => `/api/v2.5/appointment/${id}/cancel`,
      getByUser: (userId) => `/api/v2.5/appointment/user/${userId}`,
      getByCurrentUser: "/api/v2.5/appointment/getall",
      getByConsultant: (consultantId) =>
        `/api/v2.5/appointment/consultant/${consultantId}`,
    }, // STI testing endpoints - add API prefix
    stiTesting: {
      getAll: "/api/v2.5/stitesting/getall",
      getForCustomer: "/api/v2.5/stitesting/currentuser", // Endpoint để lấy STI test của current user
      create: "/api/v2.5/stitesting/create",
      getById: (id) => `/api/v2.5/stitesting/${id}`,
      update: (id) => `/api/v2.5/stitesting/update/${id}`,
      delete: (id) => `/api/v2.5/stitesting/delete/${id}`,
    }, // Test Result endpoints
    testResult: {
      getAll: "/api/v2.5/testresult/getall",
      create: "/api/v2.5/testresult/create",
      getById: (id) => `/api/v2.5/testresult/${id}`,
      getByCustomerId: (id) => `/api/v2.5/testresult/customer/${id}`,
      update: (id) => `/api/v2.5/testresult/update/${id}`,
      delete: (id) => `/api/v2.5/testresult/delete/${id}`,
      getByTesting: (testingId) => `/api/v2.5/testresult/testing/${testingId}`,
    }, // Blog endpoints - add API prefix
    blog: {
      getAll: "/api/v2.5/blog/getall",
      create: "/api/v2.5/blog/create",
      getById: (id) => `/api/v2.5/blog/${id}`,
      update: (id) => `/api/v2.5/blog/${id}`,
      delete: (id) => `/api/v2.5/blog/${id}`,
      getComments: (blogId) => `/api/v2.5/blog/${blogId}/comments`,
      addComment: (blogId) => `/api/v2.5/blog/${blogId}/comments`,
    },

    // Service endpoints - add API prefix
    services: {
      getAll: "/api/v2.5/service/getall",
      create: "/api/v2.5/service/create",
      getById: (id) => `/api/v2.5/service/${id}`,
      update: (id) => `/api/v2.5/service/${id}`,
      delete: (id) => `/api/v2.5/service/${id}`,
    },

    // Dashboard endpoints - add API prefix
    dashboard: {
      stats: "/api/v2.5/dashboard/stats",
      data: "/api/v2.5/dashboard/data",
      usersByRole: "/api/v2.5/dashboard/users-by-role",
      appointmentsByStatus: "/api/v2.5/dashboard/appointments-by-status",
      statsByRole: (role) => `/api/v2.5/dashboard/stats/role/${role}`,
      activities: "/api/v2.5/dashboard/activities",
      monthlyStats: (year, month) =>
        `/api/v2.5/dashboard/stats/monthly/${year}/${month}`,
    }, // TestResult endpoints - add API prefix

    // Menstrual cycle tracking endpoints - add API prefix
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

    // Payment endpoints - add API prefix
    payment: {
      createPayment: "/api/payment/create-payment",
      vnpayCallback: "/api/payment/vnpay-callback",
      vnpayIpn: "/api/payment/vnpay-ipn",
      getTransaction: (id) => `/api/payment/transaction/${id}`,
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
