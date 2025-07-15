import { useState, useEffect } from "react";
import { MessageCircle, X, Minimize2, Maximize2, Bot, User } from "lucide-react";
import AiChatBox from "./AiChatBox";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const toggleChat = () => {
    setOpen(!open);
    if (!open) {
      setHasNewMessage(false);
      setMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  const handleMessageUpdate = (messages) => {
    setChatMessages(messages);
    if (messages.length > 0) {
      const latest = messages[messages.length - 1];
      setLastMessage(latest);
      
      // Show notification if chat is closed and it's an assistant message
      if (!open && latest.role === 'assistant') {
        setHasNewMessage(true);
      }
    }
  };

  // Simulate notification for demo
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setHasNewMessage(true);
      }, 10000); // Show notification after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [open]);

  const truncateMessage = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      {open && (
        <div className={`fixed bottom-20 right-4 shadow-2xl z-[9999] flex flex-col transition-all duration-300 ease-out ${
          minimized 
            ? 'w-80 h-20 animate-slideUpAndFadeIn' 
            : 'w-96 h-[calc(100vh-120px)] max-h-[600px] animate-slideUpAndFadeIn'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg flex-shrink-0 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <span className="font-semibold text-lg">Everwell AI</span>
                <div className="text-xs text-indigo-100">Trợ lý sức khỏe thông minh</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-110"
                onClick={toggleMinimize}
                aria-label={minimized ? "Maximize chat" : "Minimize chat"}
              >
                {minimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                className="p-1.5 rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-110"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Content - Always render but hide when minimized */}
          <div className={`flex-1 min-h-0 bg-white rounded-b-2xl overflow-hidden ${
            minimized ? 'hidden' : 'animate-expandDown'
          }`}>
            <AiChatBox 
              onMessagesUpdate={handleMessageUpdate} 
              initialMessages={chatMessages}
            />
          </div>
          
          {/* Minimized Message Preview */}
          {minimized && lastMessage && (
            <div className="flex-1 flex items-center px-4 py-2 animate-fadeIn cursor-pointer hover:bg-gray-50 transition-colors bg-white rounded-b-2xl" onClick={toggleMinimize}>
              <div className="mr-3 flex-shrink-0">
                {lastMessage.role === 'assistant' ? (
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Bot size={12} className="text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                    <User size={12} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium ${lastMessage.role === 'assistant' ? 'text-blue-600' : 'text-gray-600'}`}>
                  {lastMessage.role === 'assistant' ? 'Everwell AI' : 'Bạn'}
                </div>
                <div className="text-sm text-gray-700 truncate">
                  {truncateMessage(lastMessage.text)}
                </div>
              </div>
              <div className="text-xs text-gray-400 ml-2">
                {new Date(lastMessage.timestamp).toLocaleTimeString('vi-VN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          )}
          
          {/* Fallback for no messages */}
          {minimized && !lastMessage && (
            <div className="flex-1 flex items-center px-4 animate-fadeIn cursor-pointer hover:bg-gray-50 transition-colors bg-white rounded-b-2xl" onClick={toggleMinimize}>
              <div className="text-sm text-gray-600">Nhấn để mở rộng chat</div>
            </div>
          )}
        </div>
      )}

      {/* Chat Button */}
      {!open && (
        <div className="fixed bottom-4 right-4 z-[9999]">
          {/* Notification Badge */}
          {hasNewMessage && (
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
              1
            </div>
          )}
          
          {/* Main Button */}
          <button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl focus:outline-none transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-3xl group relative overflow-hidden"
            onClick={toggleChat}
            aria-label="Open chat"
          >
            {/* Ripple effect */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
            
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-75"></div>
            
            <MessageCircle size={24} className="relative z-10" />
          </button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Chat với trợ lý AI
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUpAndFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes expandDown {
          from {
            opacity: 0;
            transform: scaleY(0);
            transform-origin: top;
          }
          to {
            opacity: 1;
            transform: scaleY(1);
            transform-origin: top;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slideUpAndFadeIn {
          animation: slideUpAndFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-expandDown {
          animation: expandDown 0.3s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        /* Enhanced shadow */
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* Smooth backdrop blur for modern browsers */
        @supports (backdrop-filter: blur(10px)) {
          .chat-widget-backdrop {
            backdrop-filter: blur(10px);
            background-color: rgba(255, 255, 255, 0.9);
          }
        }
      `}</style>
    </>
  );
}

export default ChatWidget; 