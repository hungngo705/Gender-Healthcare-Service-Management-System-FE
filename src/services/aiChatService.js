import apiClient from "../utils/axiosConfig";

const aiChatService = {
  ask: async (message) => {
    const res = await apiClient.post("/api/v2.5/chat/gemini", { message });
    return res.data.answer;
  },
};

export default aiChatService; 