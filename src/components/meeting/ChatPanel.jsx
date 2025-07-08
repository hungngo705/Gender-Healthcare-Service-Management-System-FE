import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import chatService from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';

const ChatPanel = ({ appointmentId, isVisible, onToggle }) => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            const response = await chatService.sendMessage(appointmentId, newMessage.trim());
            if (response.success) {
                setMessages(prev => [...prev, response.data]);
                setNewMessage('');
            }
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

    if (!isVisible) return null;

    return (
        <div className="fixed right-4 bottom-4 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h3 className="font-semibold text-gray-800">Chat</h3>
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
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm">
                        Chưa có tin nhắn nào
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${getMessageSenderClass(message.senderId) === 'sent' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                message.isSystemMessage 
                                    ? 'bg-gray-100 text-gray-600 text-center italic'
                                    : getMessageSenderClass(message.senderId) === 'sent'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}>
                                {!message.isSystemMessage && (
                                    <div className="font-semibold text-xs mb-1">
                                        {message.senderName || 'Unknown'}
                                        {message.senderRole && (
                                            <span className="ml-1 opacity-75">({message.senderRole})</span>
                                        )}
                                    </div>
                                )}
                                <div className="break-words">{message.message}</div>
                                <div className={`text-xs mt-1 ${
                                    message.isSystemMessage 
                                        ? 'text-gray-500'
                                        : getMessageSenderClass(message.senderId) === 'sent'
                                        ? 'text-blue-200'
                                        : 'text-gray-500'
                                }`}>
                                    {formatTime(message.sentAt)}
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
                        placeholder="Nhập tin nhắn..."
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
            </form>
        </div>
    );
};

ChatPanel.propTypes = {
    appointmentId: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
};

export default ChatPanel; 