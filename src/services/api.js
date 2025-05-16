// This is a simulation of API calls for demo purposes
// In a real application, these would connect to your backend

import apiClient from "../utils/axiosConfig";

// Simulated data
const servicesData = [
  {
    id: 1,
    name: "Menstrual Cycle Tracking",
    description:
      "Track, predict, and manage your menstrual cycles for better reproductive health.",
    details:
      "Our menstrual cycle tracking service helps you monitor your periods, predict ovulation and fertile windows, and receive timely reminders. The platform is designed to support individual health needs, offering insights and guidance tailored to your reproductive health journey.",
  },
  {
    id: 2,
    name: "Mental Health",
    description: "Gender-affirming mental health services and counseling.",
    details:
      "Our mental health services include individual therapy, group counseling, and psychiatric care. We provide a safe and affirming environment for all patients to address their mental health needs.",
  },
  {
    id: 3,
    name: "Reproductive Health",
    description: "Specialized reproductive health services for all genders.",
    details:
      "We offer comprehensive reproductive healthcare including family planning, STI testing and treatment, and reproductive health education. Our services are designed to be inclusive and respectful of all gender identities.",
  },
  {
    id: 4,
    name: "Hormone Therapy",
    description: "Specialized hormone replacement therapy and management.",
    details:
      "Our hormone therapy services include comprehensive assessment, prescription, and ongoing monitoring of hormone treatments. We follow the latest evidence-based protocols and individualize care based on patient needs and goals.",
  },
  {
    id: 5,
    name: "Preventive Care",
    description: "Gender-specific preventive care and screenings.",
    details:
      "We offer a range of preventive healthcare services including screenings, vaccinations, and health education. Our preventive care is tailored to address gender-specific health risks and needs.",
  },
  {
    id: 6,
    name: "Support Groups",
    description: "Community support groups for various healthcare needs.",
    details:
      "Our support groups provide a space for individuals to connect with others who share similar experiences. Groups are facilitated by trained professionals and cover a variety of topics related to health and well-being.",
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
