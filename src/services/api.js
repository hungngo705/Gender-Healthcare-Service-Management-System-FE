// This is a simulation of API calls for demo purposes
// In a real application, these would connect to your backend

import apiClient from "../utils/axiosConfig";

// Simulated data with 3 main services as shown in the image
const servicesData = [
  {
    id: 1,
    name: "Cycle Tracking",
    description: "Monitor and manage your menstrual cycle effectively",
    details:
      "Monitor your menstrual cycle, receive predictions for ovulation periods, fertility windows, and set reminders for birth control. Our smart algorithms adapt to your unique patterns.",
    icon: "calendar",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2080&h=1200",
  },
  {
    id: 2,
    name: "Online Consultations",
    description: "Private video consultations with healthcare experts",
    details:
      "Schedule private video consultations with our healthcare experts for personalized advice on reproductive health, sexual education, and any concerns you may have.",
    icon: "message-circle",
    image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2070&h=1200",
  },
  {
    id: 3,
    name: "STI Testing Services",
    description: "Confidential testing and follow-up care",
    details:
      "Order confidential STI tests, book appointments at nearby clinics, and receive your results securely through our platform, with follow-up care options if needed.",
    icon: "shield",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2070&h=1200",
  },
];

// For development/demo purposes we'll simulate API behavior using axios adapters
// In a real application, you would connect to your actual backend endpoints

// Response interceptor for simulated responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // For development, intercept actual API errors here
    return Promise.reject(error);
  }
);

// Simulated API functions using axios

// Get all services
export const getServices = async () => {
  try {
    // DEMO: In a real app, this would be:
    // const response = await apiClient.get('/services');

    // Simulated API response
    const mockResponse = {
      data: servicesData,
      status: 200,
    };

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockResponse.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

// Get a specific service by ID
export const getServiceById = async (id) => {
  try {
    // DEMO: In a real app, this would be:
    // const response = await apiClient.get(`/services/${id}`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const service = servicesData.find((service) => service.id === parseInt(id));

    if (!service) {
      throw new Error("Service not found");
    }

    return service;
  } catch (error) {
    console.error("Error fetching service:", error);
    throw error;
  }
};

// Submit contact form
export const submitContactForm = async (formData) => {
  try {
    // DEMO: In a real app, this would be:
    // const response = await apiClient.post('/contact', formData);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Form data submitted:", formData);

    // Simulated response
    return {
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

// Example of how to use axios in a real production implementation:
//
// export const getServices = async () => {
//   try {
//     const response = await apiClient.get('/services');
//     return response.data;
//   } catch (error) {
//     // Error handling is managed in axios interceptors
//     throw error;
//   }
// };
//
// export const getServiceById = async (id) => {
//   try {
//     const response = await apiClient.get(`/services/${id}`);
//     return response.data;
//   } catch (error) {
//     // Error handling is managed in axios interceptors
//     throw error;
//   }
// };
//
// export const submitContactForm = async (formData) => {
//   try {
//     const response = await apiClient.post('/contact', formData);
//     return response.data;
//   } catch (error) {
//     // Error handling is managed in axios interceptors
//     throw error;
//   }
// };
