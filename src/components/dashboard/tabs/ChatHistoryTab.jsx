import { useState, useEffect } from 'react';
import chatService from '../../../services/chatService';
import appointmentService from '../../../services/appointmentService';
import { useAuth } from '../../../contexts/AuthContext';

const ChatHistoryTab = () => {
    const { currentUser } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const response = await appointmentService.getAppointments();
            if (response.data?.success) {
                // Filter appointments that have been completed or are in progress
                const completedAppointments = response.data.data.filter(apt => 
                    apt.status === 'Completed' || apt.status === 'InProgress'
                );
                setAppointments(completedAppointments);
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadChatMessages = async (appointmentId) => {
        setMessagesLoading(true);
        try {
            const response = await chatService.getMessagesByGet(appointmentId);
            if (response.success) {
                setChatMessages(response.data.messages || []);
            }
        } catch (error) {
            console.error('Error loading chat messages:', error);
            setChatMessages([]);
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleAppointmentSelect = (appointment) => {
        setSelectedAppointment(appointment);
        loadChatMessages(appointment.id);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatMessageTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const exportChatHistory = async () => {
        if (!selectedAppointment || chatMessages.length === 0) return;

        const chatText = chatMessages.map(msg => {
            const time = formatMessageTime(msg.sentAt);
            const sender = msg.isSystemMessage ? 'Hệ thống' : `${msg.senderName} (${msg.senderRole})`;
            return `[${time}] ${sender}: ${msg.message}`;
        }).join('\n');

        const content = `Lịch sử chat - Cuộc hẹn ${selectedAppointment.id}\n` +
                       `Ngày: ${formatDate(selectedAppointment.appointmentDate)}\n` +
                       `Bệnh nhân: ${selectedAppointment.customerName}\n` +
                       `Bác sĩ: ${selectedAppointment.consultantName}\n\n` +
                       `--- CHAT HISTORY ---\n${chatText}`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chat-history-${selectedAppointment.id}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Lịch sử Chat</h2>
                <p className="text-gray-600">Xem lại các cuộc trò chuyện trong các buổi tư vấn</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Appointments List */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow border border-gray-200">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Cuộc hẹn</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                    <p className="mt-2 text-gray-600">Đang tải...</p>
                                </div>
                            ) : appointments.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    Không có cuộc hẹn nào
                                </div>
                            ) : (
                                appointments.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        onClick={() => handleAppointmentSelect(appointment)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedAppointment?.id === appointment.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                        }`}
                                    >
                                        <div className="font-medium text-gray-900">
                                            {appointment.customerName}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Bác sĩ: {appointment.consultantName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formatDate(appointment.appointmentDate)}
                                        </div>
                                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                                            appointment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {appointment.status === 'Completed' ? 'Hoàn thành' : 'Đang diễn ra'}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow border border-gray-200">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selectedAppointment ? `Chat - ${selectedAppointment.customerName}` : 'Chọn cuộc hẹn để xem chat'}
                            </h3>
                            {selectedAppointment && chatMessages.length > 0 && (
                                <button
                                    onClick={exportChatHistory}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                    Xuất file
                                </button>
                            )}
                        </div>
                        <div className="h-96 overflow-y-auto p-4">
                            {!selectedAppointment ? (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Chọn một cuộc hẹn để xem lịch sử chat
                                </div>
                            ) : messagesLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    <p className="ml-3 text-gray-600">Đang tải tin nhắn...</p>
                                </div>
                            ) : chatMessages.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Không có tin nhắn chat nào trong cuộc hẹn này
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {chatMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${
                                                message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                                            }`}
                                        >
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                message.isSystemMessage 
                                                    ? 'bg-gray-100 text-gray-600 text-center italic'
                                                    : message.senderId === currentUser?.id
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-800'
                                            }`}>
                                                {!message.isSystemMessage && (
                                                    <div className="font-semibold text-xs mb-1">
                                                        {message.senderName}
                                                        {message.senderRole && (
                                                            <span className="ml-1 opacity-75">({message.senderRole})</span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="break-words">{message.message}</div>
                                                <div className={`text-xs mt-1 ${
                                                    message.isSystemMessage 
                                                        ? 'text-gray-500'
                                                        : message.senderId === currentUser?.id
                                                        ? 'text-blue-200'
                                                        : 'text-gray-500'
                                                }`}>
                                                    {formatMessageTime(message.sentAt)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHistoryTab; 