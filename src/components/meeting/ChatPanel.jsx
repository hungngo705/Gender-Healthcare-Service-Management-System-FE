import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import chatService from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';

const ChatPanel = ({ appointmentId, isVisible, onToggle, sendDailyMessage, dailyMessages = [] }) => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [chatMode, setChatMode] = useState('database'); // 'database' or 'daily'
    const [showHistory, setShowHistory] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history including Daily.co messages
    const loadChatHistory = async () => {
        if (!appointmentId) return;
        
        setLoading(true);
        try {
            const response = await chatService.getMessagesByGet(appointmentId, 1, 100);
            if (response.success) {
                // Filter to show Daily.co messages or all messages
                const allMessages = response.data.messages || [];
                const dailyOnlyMessages = allMessages.filter(msg => 
                    msg.message.startsWith('[Daily Chat]')
                );
                
                if (showHistory) {
                    setMessages(allMessages);
                } else {
                    setMessages(dailyOnlyMessages);
                }
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load history when showHistory changes
    useEffect(() => {
        if (showHistory) {
            loadChatHistory();
        }
    }, [showHistory, appointmentId]);

    // Load chat messages when component mounts or appointmentId changes
    useEffect(() => {
        if (appointmentId) {
            loadMessages();
        }
    }, [appointmentId]);

    const loadMessages = async () => {
        if (!appointmentId) return;
        
        setLoading(true);
        try {
            const response = await chatService.getMessagesByGet(appointmentId);
            if (response.success) {
                setMessages(response.data.messages || []);
            }
        } catch (error) {
            console.error('Error loading chat messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            if (chatMode === 'daily' && sendDailyMessage) {
                // Send through Daily.co chat
                await sendDailyMessage(newMessage.trim());
            } else {
                // Send through database chat
                const response = await chatService.sendMessage(appointmentId, newMessage.trim());
                if (response.success) {
                    setMessages(prev => [...prev, response.data]);
                }
            }
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
        } finally {
            setSending(false);
        }
    };

    const sendSystemMessage = async (message) => {
        try {
            const response = await chatService.sendSystemMessage(appointmentId, message);
            if (response.success) {
                setMessages(prev => [...prev, response.data]);
            }
        } catch (error) {
            console.error('Error sending system message:', error);
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMessageSenderClass = (senderId) => {
        return senderId === currentUser?.id ? 'sent' : 'received';
    };

    // Get messages to display based on chat mode and history setting
    const displayMessages = () => {
        if (showHistory) {
            return messages; // Show saved messages from database
        } else {
            return chatMode === 'daily' ? dailyMessages : messages;
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed right-4 bottom-4 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800">Chat</h3>
                    {sendDailyMessage && (
                        <select 
                            value={chatMode} 
                            onChange={(e) => setChatMode(e.target.value)}
                            className="text-xs border rounded px-1 py-0.5"
                        >
                            <option value="database">Database</option>
                            <option value="daily">Daily.co Live</option>
                        </select>
                    )}
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`text-xs px-2 py-1 rounded ${
                            showHistory 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        title="Xem lịch sử chat"
                    >
                        {showHistory ? 'Live' : 'Lịch sử'}
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                const debugInfo = await chatService.getDebugInfo(appointmentId);
                                console.log("Debug info:", debugInfo);
                                alert(`Debug Info: ${JSON.stringify(debugInfo, null, 2)}`);
                            } catch (error) {
                                console.error("Debug error:", error);
                                alert(`Debug Error: ${error.message}`);
                            }
                        }}
                        className="text-xs px-2 py-1 rounded bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                        title="Debug thông tin"
                    >
                        🐛
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                const dailyChatService = (await import('../../services/dailyChatService')).default;
                                const roomName = `appointment-${appointmentId}`;
                                const result = await dailyChatService.syncChatHistory(appointmentId, roomName);
                                console.log("Sync result:", result);
                                alert(`Sync Result: ${result.message}`);
                                // Reload messages after sync
                                loadMessages();
                            } catch (error) {
                                console.error("Sync error:", error);
                                alert(`Sync Error: ${error.message}`);
                            }
                        }}
                        className="text-xs px-2 py-1 rounded bg-green-200 text-green-800 hover:bg-green-300"
                        title="Sync Daily.co chat"
                    >
                        🔄
                    </button>
                </div>
                <button
                    onClick={onToggle}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                ) : displayMessages().length === 0 ? (
                    <div className="text-center text-gray-500 text-sm">
                        {showHistory 
                            ? 'Không có lịch sử chat' 
                            : chatMode === 'daily' 
                                ? 'Tin nhắn Daily.co sẽ hiện ở đây' 
                                : 'Chưa có tin nhắn nào'
                        }
                    </div>
                ) : (
                    displayMessages().map((message, index) => (
                        <div
                            key={message.id || `daily-${index}`}
                            className={`flex ${getMessageSenderClass(message.senderId || message.fromId) === 'sent' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                message.isSystemMessage 
                                    ? 'bg-gray-100 text-gray-600 text-center italic'
                                    : getMessageSenderClass(message.senderId || message.fromId) === 'sent'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}>
                                {!message.isSystemMessage && (
                                    <div className="font-semibold text-xs mb-1">
                                        {message.senderName || message.fromName || 'Unknown'}
                                        {message.senderRole && (
                                            <span className="ml-1 opacity-75">({message.senderRole})</span>
                                        )}
                                    </div>
                                )}
                                <div className="break-words">
                                    {message.message || message.data?.message || 'Tin nhắn không có nội dung'}
                                </div>
                                <div className={`text-xs mt-1 ${
                                    message.isSystemMessage 
                                        ? 'text-gray-500'
                                        : getMessageSenderClass(message.senderId || message.fromId) === 'sent'
                                        ? 'text-blue-200'
                                        : 'text-gray-500'
                                }`}>
                                    {message.sentAt ? formatTime(message.sentAt) : new Date().toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 border-t border-gray-200">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={chatMode === 'daily' ? 'Tin nhắn Daily.co...' : 'Nhập tin nhắn...'}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>
                {(chatMode === 'daily' && !showHistory) && (
                    <div className="text-xs text-gray-500 mt-1">
                        Tin nhắn sẽ được gửi qua Daily.co và lưu vào database
                    </div>
                )}
                {showHistory && (
                    <div className="text-xs text-gray-500 mt-1">
                        Đang xem lịch sử chat đã lưu
                    </div>
                )}
            </form>
        </div>
    );
};

ChatPanel.propTypes = {
    appointmentId: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    sendDailyMessage: PropTypes.func,
    dailyMessages: PropTypes.array
};

export default ChatPanel; 