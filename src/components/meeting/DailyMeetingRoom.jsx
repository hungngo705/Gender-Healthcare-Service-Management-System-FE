import { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import DailyIframe from "@daily-co/daily-js";
import {
  getMeetingInfo,
} from "../../services/meetingService";
import appointmentService from "../../services/appointmentService";
import { useAuth } from "../../contexts/AuthContext";
import ChatPanel from "./ChatPanel";
import chatService from "../../services/chatService";

const DailyMeetingRoom = ({ appointmentId }) => {
  const { currentUser } = useAuth();
  const containerRef = useRef(null);
  const callFrameRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [meetingInfo, setMeetingInfo] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [dailyMessages, setDailyMessages] = useState([]);
  const [meetingEnded, setMeetingEnded] = useState(false);
  
  const [loggableEvents, setLoggableEvents] = useState([{
    type: 'system',
    message: '--- Chat Log Started ---',
    timestamp: new Date()
  }]);

  const saveChatToFile = () => {
    if (loggableEvents.length <= 1) { 
      alert("There are no events to save.");
      return;
    }

    const sortedEvents = [...loggableEvents].sort((a, b) => a.timestamp - b.timestamp);

    const formattedLog = sortedEvents
      .map((event) => {
        const time = new Date(event.timestamp).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

        switch (event.type) {
          case "chat":
            return `[${time}] ${event.userName}: ${event.message}`;
          case "join":
            return `[${time}] --- ${event.userName} has joined the meeting ---`;
          case "leave":
            return `[${time}] --- ${event.userName} has left the meeting ---`;
          case "system":
            return `[${time}] ${event.message}`;
          default:
            return "";
        }
      })
      .join("\n");

    const blob = new Blob([formattedLog], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-log-${appointmentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendDailyMessage = useCallback(async (message) => {
    if (!callFrameRef.current || !message.trim()) return;

    try {
      const userName = currentUser?.fullName || currentUser?.email || 'Bạn';
      const timestamp = new Date();
      
      await callFrameRef.current.sendAppMessage({ message: message.trim() }, "*");
      
      setDailyMessages(prev => [...prev, {
        id: `daily-${timestamp.getTime()}-local`,
        fromId: currentUser?.id,
        fromName: userName,
        data: { message: message.trim() },
        timestamp: timestamp,
      }]);
      setLoggableEvents(prev => [...prev, { type: 'chat', userName, message: message.trim(), timestamp }]);
      
      await chatService.sendMessage(appointmentId, `[Daily Chat] ${message.trim()}`, false);
    } catch (error) {
      console.error("Failed to send Daily.co message:", error);
    }
  }, [appointmentId, currentUser]);

  useEffect(() => {
    if (!appointmentId) return;

    const join = async () => {
      try {
        setLoading(true);
        const response = await getMeetingInfo(appointmentId, currentUser?.id);
        const payload = response.data || response;
        
        if (payload.error || (payload.message && (payload.message.includes("ended") || payload.message.includes("not available")))) {
            setMeetingEnded(true);
            setLoading(false);
            return;
        }

        const roomUrl = payload.RoomUrl || payload.roomUrl;
        if (!roomUrl) throw new Error("No room URL provided");

        const frame = DailyIframe.createFrame(containerRef.current, {
            showLeaveButton: true,
            showFullscreenButton: true,
            iframeStyle: { position: "absolute", inset: "0px", width: "100%", height: "100%" },
        });
        callFrameRef.current = frame;

        // --- FIX: Re-added missing event listeners ---
        frame.on("joined-meeting", async () => {
          setLoading(false);
          const userName = currentUser?.fullName || currentUser?.email || 'User';
          setLoggableEvents(prev => [...prev, { type: 'join', userName, timestamp: new Date() }]);
          await appointmentService.checkIn(appointmentId);
        });

        frame.on("participant-joined", (event) => {
          const userName = event.participant.user_name || 'Another user';
          setLoggableEvents(prev => [...prev, { type: 'join', userName, timestamp: new Date() }]);
        });

        frame.on("app-message", async (event) => {
          const { data, fromId } = event;
          const sender = frame.participants()[fromId];
          if (sender && data?.message) {
            const userName = sender.user_name || 'Unknown';
            const timestamp = new Date();
            setDailyMessages(prev => [...prev, { id: `daily-${timestamp.getTime()}-${fromId}`, fromName: userName, data, timestamp }]);
            setLoggableEvents(prev => [...prev, { type: 'chat', userName, message: data.message, timestamp }]);
          }
        });

        frame.on("participant-left", (event) => {
          const userName = event.participant.user_name || 'Another user';
          setLoggableEvents(prev => [...prev, { type: 'leave', userName, timestamp: new Date() }]);
        });
        // --- End of re-added listeners ---

        frame.on("left-meeting", async () => {
          console.log("Left meeting. Preparing to save chat log.");
          const finalLeaveEvent = {
            type: 'leave',
            userName: currentUser?.fullName || currentUser?.email || 'User',
            timestamp: new Date()
          };
          
          let finalLogContent = '';
          setLoggableEvents(currentEvents => {
            const updatedEvents = [...currentEvents, finalLeaveEvent];
            finalLogContent = updatedEvents
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((event) => {
                const time = new Date(event.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
                switch (event.type) {
                  case "chat": return `[${time}] ${event.userName}: ${event.message}`;
                  case "join": return `[${time}] --- ${event.userName} has joined the meeting ---`;
                  case "leave": return `[${time}] --- ${event.userName} has left the meeting ---`;
                  case "system": return `[${time}] ${event.message}`;
                  default: return "";
                }
              })
              .join("\n");
            return updatedEvents;
          });

          setTimeout(async () => {
            if (finalLogContent) {
              console.log("Sending log to backend...");
              const result = await chatService.saveChatLog(appointmentId, finalLogContent);
              if (result.success) {
                console.log("Chat log successfully saved to Supabase via backend:", result.path);
              } else {
                console.error("Failed to save chat log:", result.message);
              }
            }
          }, 100);

          try {
            await appointmentService.checkOut(appointmentId);
            // Optional: redirect after some time
            setTimeout(() => {
                if (window.location.pathname.includes('/meeting')) {
                    window.location.href = '/profile?tab=appointments';
                }
            }, 2000);
          } catch(err) {
            console.error("Failed during check-out:", err);
          }
        });

        // --- FIX: Re-added the missing joinOptions object ---
        const joinOptions = { 
            url: roomUrl, 
            userName: currentUser?.fullName || currentUser?.email || "Guest" 
        };
        if (payload.MeetingToken || payload.meetingToken) {
          joinOptions.token = payload.MeetingToken || payload.meetingToken;
        }
        // --- End of fix ---

        await frame.join(joinOptions);
        setLoading(false);
        
      } catch (e) {
        setError(e.message || "Failed to initialize the meeting.");
        setLoading(false);
      }
    };

    join();

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
  }, [appointmentId, currentUser]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <div ref={containerRef} className="absolute inset-0 w-full h-full bg-black" />

      {((!loading && !error) || meetingEnded) && (
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-40"
          title="Toggle Chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </button>
      )}

      {((!loading && !error) || meetingEnded) && (
        <ChatPanel 
          appointmentId={appointmentId}
          isVisible={showChat}
          onToggle={() => setShowChat(false)}
          sendDailyMessage={meetingEnded ? null : sendDailyMessage}
          dailyMessages={dailyMessages}
          onSaveChat={saveChatToFile}
        />
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 text-white z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Connecting to meeting room...</p>
          </div>
        </div>
      )}

      {meetingEnded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 text-white z-10">
          <div className="text-center max-w-md">
            <h3 className="text-xl font-semibold mb-2">Meeting has ended</h3>
            <p className="text-gray-300 mb-6">You can view the chat history or return home.</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setShowChat(true)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md">View Chat History</button>
              <button onClick={() => window.location.href = '/profile?tab=appointments'} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-md">Return</button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 text-white z-10">
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold mb-2">Unable to Join Meeting</h3>
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md">Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

DailyMeetingRoom.propTypes = {
  appointmentId: PropTypes.string.isRequired,
};

export default DailyMeetingRoom;