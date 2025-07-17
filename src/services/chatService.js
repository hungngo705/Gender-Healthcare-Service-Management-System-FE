import apiClient from '../utils/axiosConfig';

const chatService = {
    // Gửi tin nhắn chat
    async sendMessage(appointmentId, message, isSystemMessage = false) {
        try {
            console.log('ChatService.sendMessage called with:', {
                appointmentId,
                message,
                isSystemMessage
            });
            
            const response = await apiClient.post('/api/chat/send', {
                appointmentId,
                message,
                isSystemMessage
            });
            
            console.log('ChatService.sendMessage response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error sending chat message:', error);
            console.error('Error response:', error.response?.data);
            throw error;
        }
    },

    // Lấy danh sách tin nhắn chat
    async getMessages(appointmentId, page = 1, pageSize = 50, fromDate = null, toDate = null) {
        try {
            const response = await apiClient.post('/api/chat/messages', {
                appointmentId,
                page,
                pageSize,
                fromDate,
                toDate
            });
            return response.data;
        } catch (error) {
            console.error('Error getting chat messages:', error);
            throw error;
        }
    },

    // Lấy tin nhắn chat bằng GET (dễ sử dụng hơn)
    async getMessagesByGet(appointmentId, page = 1, pageSize = 50) {
        try {
            const response = await apiClient.get(`/api/chat/${appointmentId}?page=${page}&pageSize=${pageSize}`);
            return response.data;
        } catch (error) {
            console.error('Error getting chat messages by GET:', error);
            throw error;
        }
    },

    // Lấy tin nhắn gần đây
    async getRecentMessages(appointmentId, count = 10) {
        try {
            const response = await apiClient.get(`/api/chat/recent/${appointmentId}?count=${count}`);
            return response.data;
        } catch (error) {
            console.error('Error getting recent chat messages:', error);
            throw error;
        }
    },

    // Xóa tin nhắn chat
    async deleteMessage(messageId) {
        try {
            const response = await apiClient.delete(`/api/chat/${messageId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting chat message:', error);
            throw error;
        }
    },

    // Gửi tin nhắn hệ thống (như thông báo join/leave)
    async sendSystemMessage(appointmentId, message) {
        return this.sendMessage(appointmentId, message, true);
    },

    // Debug endpoint để kiểm tra thông tin appointment và user
    async getDebugInfo(appointmentId) {
        try {
            console.log('ChatService.getDebugInfo called with appointmentId:', appointmentId);
            
            const response = await apiClient.get(`/api/chat/debug/${appointmentId}`);
            
            console.log('ChatService.getDebugInfo response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting debug info:', error);
            console.error('Error response:', error.response?.data);
            throw error;
        }
    }
};

export default chatService; 