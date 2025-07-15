import apiClient from '../utils/axiosConfig';

class DailyChatService {
  constructor() {
    this.baseUrl = 'https://api.daily.co/v1';
    this.apiKey = '4fddf52313211c260e059fb854b732f63c63dea725b0ee01ff67e7e8bb102cf2'; // Từ config
  }

  // Lấy chat history từ Daily.co REST API
  async getChatHistory(roomName, sessionId = null) {
    try {
      console.log('Fetching chat history from Daily.co for room:', roomName);
      
      const url = sessionId 
        ? `${this.baseUrl}/rooms/${roomName}/sessions/${sessionId}/chat`
        : `${this.baseUrl}/rooms/${roomName}/chat`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Daily.co API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Daily.co chat history:', data);
      
      return data;
    } catch (error) {
      console.error('Failed to fetch chat history from Daily.co:', error);
      throw error;
    }
  }

  // Lấy thông tin sessions của room
  async getRoomSessions(roomName) {
    try {
      console.log('Fetching room sessions from Daily.co for room:', roomName);
      
      const response = await fetch(`${this.baseUrl}/rooms/${roomName}/sessions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Daily.co API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Daily.co room sessions:', data);
      
      return data;
    } catch (error) {
      console.error('Failed to fetch room sessions from Daily.co:', error);
      throw error;
    }
  }

  // Sync chat history từ Daily.co vào database
  async syncChatHistory(appointmentId, roomName) {
    try {
      console.log('Syncing chat history for appointment:', appointmentId, 'room:', roomName);
      
      // Lấy chat history từ Daily.co
      const chatHistory = await this.getChatHistory(roomName);
      
      if (!chatHistory || !chatHistory.data || chatHistory.data.length === 0) {
        console.log('No chat history found in Daily.co');
        return { success: true, message: 'No chat history to sync' };
      }

      // Lưu từng tin nhắn vào database
      const savedMessages = [];
      for (const message of chatHistory.data) {
        try {
          // Gọi API backend để lưu tin nhắn
          const response = await apiClient.post('/chat/sync-daily-message', {
            appointmentId: appointmentId,
            message: `[Daily Chat] ${message.message}`,
            senderName: message.user_name || message.userName || 'Unknown',
            sentAt: message.timestamp,
            isSystemMessage: false
          });

          if (response.data.success) {
            savedMessages.push(response.data.data);
          }
        } catch (error) {
          console.error('Failed to save message to database:', error);
        }
      }

      console.log('Synced messages:', savedMessages);
      return { 
        success: true, 
        message: `Synced ${savedMessages.length} messages`,
        data: savedMessages 
      };
    } catch (error) {
      console.error('Failed to sync chat history:', error);
      throw error;
    }
  }
}

export default new DailyChatService(); 