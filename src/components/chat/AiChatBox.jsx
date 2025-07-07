import { useState, useRef, useEffect } from "react";
import aiChatService from "../../services/aiChatService";
import LoadingSpinner from "../ui/LoadingSpinner";
import { User, Bot, Send, Smile, Paperclip } from "lucide-react";
import dayjs from "dayjs";

function AiChatBox({ onMessagesUpdate, initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isTyping]);

  // Call parent callback when messages change
  useEffect(() => {
    if (onMessagesUpdate && messages.length > 0) {
      onMessagesUpdate(messages);
    }
  }, [messages, onMessagesUpdate]);

  // Update local state when initialMessages prop changes
  useEffect(() => {
    if (initialMessages.length > 0 && messages.length === 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Auto-send a welcome message when the chatbox opens for the first time
  useEffect(() => {
    if (messages.length === 0 && initialMessages.length === 0) {
      const welcomeMessage = {
        role: "assistant",
        text: "👋 Xin chào! Tôi là trợ lý AI của Everwell Healthcare. Tôi có thể giúp bạn:\n\n• Tư vấn sức khỏe sinh sản\n• Hướng dẫn theo dõi chu kỳ kinh nguyệt\n• Giải đáp thắc mắc về sức khỏe phụ nữ\n• Đặt lịch hẹn với bác sĩ\n\nBạn cần hỗ trợ gì hôm nay? 😊",
        timestamp: Date.now(),
      };
      
      // Simulate typing effect for welcome message
      setTimeout(() => {
        setMessages([welcomeMessage]);
      }, 500);
    }
  }, []); // Keep empty dependency to run only once

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userText = input.trim();
    const userMessage = { 
      role: "user", 
      text: userText, 
      timestamp: Date.now() 
    };
    
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);
    setIsTyping(true);
    
    try {
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const answer = await aiChatService.ask(userText);
      setIsTyping(false);
      
      const assistantMessage = { 
        role: "assistant", 
        text: answer, 
        timestamp: Date.now() 
      };
      
      setMessages((m) => [...m, assistantMessage]);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages((m) => [...m, { 
        role: "assistant", 
        text: "😔 Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.", 
        timestamp: Date.now(),
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const TypingIndicator = () => (
    <div className="flex justify-start animate-fadeIn">
      <div className="mr-3 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <Bot size={16} className="text-white" />
        </div>
      </div>
      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border border-gray-100 max-w-[70%]">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );

  const quickReplies = [
    "Chu kỳ kinh nguyệt của tôi",
    "Đặt lịch khám",
    "Tư vấn sức khỏe",
    "Xét nghiệm STI"
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Messages Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent min-h-0"
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            } animate-fadeIn`}
          >
            {m.role === "assistant" && (
              <div className="mr-3 flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <Bot size={16} className="text-white" />
                </div>
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-lg text-sm whitespace-pre-line transition-all duration-200 hover:shadow-xl ${
                m.role === "user"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md"
                  : m.isError 
                    ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-md"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
              }`}
            >
              <div className="leading-relaxed">{m.text}</div>
              <div className={`text-[10px] mt-2 text-right ${
                m.role === "user" ? "text-indigo-100" : "text-gray-400"
              }`}>
                {dayjs(m.timestamp).format("HH:mm")}
              </div>
            </div>
            {m.role === "user" && (
              <div className="ml-3 flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                  <User size={16} className="text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && <TypingIndicator />}
        
        {/* Quick replies for first time users */}
        {messages.length <= 1 && !loading && (
          <div className="animate-fadeIn">
            <div className="text-xs text-gray-500 mb-2 px-1">Gợi ý câu hỏi:</div>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(reply)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs border border-blue-200 transition-all duration-200 hover:scale-105"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              value={input}
              placeholder="Nhập tin nhắn..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '120px',
                overflow: 'auto'
              }}
            />
            
            {/* Character count */}
            {input.length > 0 && (
              <div className="absolute bottom-1 right-12 text-xs text-gray-400">
                {input.length}/500
              </div>
            )}
          </div>
          
          <button
            className={`p-3 rounded-full transition-all duration-200 shadow-lg flex-shrink-0 ${
              loading || !input.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 active:scale-95"
            }`}
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Send size={18} className="text-white" />
            )}
          </button>
        </div>
        
        {/* Additional tools */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <Smile size={16} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <Paperclip size={16} />
            </button>
          </div>
          <div className="text-xs text-gray-400">
            Nhấn Enter để gửi
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 2px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </div>
  );
}

export default AiChatBox; 