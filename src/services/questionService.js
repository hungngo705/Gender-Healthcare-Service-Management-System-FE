import apiClient from "../utils/axiosConfig";

// Base URL dựa trên ApiEndpointConstants ở backend (v2.5)
const BASE = "/api/v2.5/question";

const questionService = {
  // Customer gửi câu hỏi (consultantId optional)
  createQuestion: async (data) => {
    const response = await apiClient.post(`${BASE}/create`, data);
    return response.data;
  },

  // Lấy tất cả câu hỏi (Admin/Staff)
  getAllQuestions: async () => {
    const response = await apiClient.get(`${BASE}/getall`);
    return response.data;
  },

  // Lấy câu hỏi theo Id
  getQuestionById: async (id) => {
    const response = await apiClient.get(`${BASE}/${id}`);
    return response.data;
  },

  // Lấy câu hỏi của 1 customer
  getQuestionsByCustomer: async (customerId) => {
    const response = await apiClient.get(`${BASE}/customer/${customerId}`);
    return response.data;
  },

  // Lấy câu hỏi assigned cho consultant
  getQuestionsByConsultant: async (consultantId) => {
    const response = await apiClient.get(`${BASE}/consultant/${consultantId}`);
    return response.data;
  },

  // Lấy câu hỏi chưa gán consultant (dành cho consultant claim)
  getUnassignedQuestions: async () => {
    const response = await apiClient.get(`${BASE}/unassigned`);
    return response.data;
  },

  // Consultant claim câu hỏi
  assignQuestion: async (questionId, consultantId) => {
    const response = await apiClient.put(
      `${BASE}/assign/${questionId}/consultant/${consultantId}`
    );
    return response.data;
  },

  // Consultant trả lời câu hỏi
  answerQuestion: async (questionId, answerText) => {
    const response = await apiClient.put(
      `${BASE}/answer/${questionId}`,
      JSON.stringify(answerText),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  },

  // Xoá câu hỏi
  deleteQuestion: async (questionId) => {
    const response = await apiClient.delete(`${BASE}/delete/${questionId}`);
    return response.data;
  },
};

export default questionService; 