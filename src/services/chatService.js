import apiClient from './api';

const chatService = {
    // Gửi tin nhắn chat
    async sendMessage(appointmentId, message, isSystemMessage = false) {
        try {
            const response = await apiClient.post('/api/chat/send', {
                appointmentId,
                message,
                isSystemMessage
            });
            return response.data;
        } catch (error) {
            console.error('Error sending chat message:', error);
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
    }
};

export default chatService; 