import { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import DailyIframe from "@daily-co/daily-js";
import {
  getMeetingInfo,
  createMeetingRoom,
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
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [dailyMessages, setDailyMessages] = useState([]);
  const [meetingEnded, setMeetingEnded] = useState(false);

  // Function to send message through Daily.co chat
  const sendDailyMessage = useCallback(async (message) => {
    try {
      console.log("Sending Daily.co message:", message);
      console.log("Current user:", currentUser);
      console.log("Appointment ID:", appointmentId);
      
      if (callFrameRef.current && message.trim()) {
        // Send message through Daily.co
        console.log("Sending through Daily.co...");
        await callFrameRef.current.sendAppMessage(
          { message: message.trim() },
          "*" // broadcast to all participants
        );
        console.log("Message sent through Daily.co successfully");
        
        // Add to local daily messages state (since sender doesn't receive app-message event)
        const newMessage = {
          id: `daily-${Date.now()}-${currentUser?.id || 'local'}`,
          fromId: currentUser?.id,
          fromName: currentUser?.fullName || currentUser?.email || 'Bạn',
          data: { message: message.trim() },
          timestamp: new Date(),
          isDailyMessage: true,
          isLocal: true
        };
        setDailyMessages(prev => [...prev, newMessage]);
        console.log("Added to local daily messages");
        
        // Also save to our database
        try {
          console.log("Saving to database...");
          const response = await chatService.sendMessage(
            appointmentId,
            `[Daily Chat] ${message.trim()}`,
            false
          );
          console.log("Database save response:", response);
          
          if (response.is_success || response.success) {
            console.log("Message sent through Daily.co and saved to database successfully");
          } else {
            console.error("Database save failed:", response);
          }
        } catch (dbError) {
          console.error("Failed to save message to database:", dbError);
          console.error("Error details:", dbError.response?.data || dbError.message);
          // Message still sent through Daily.co even if database save fails
        }
      } else {
        console.log("Cannot send message - missing callFrame or empty message");
      }
    } catch (error) {
      console.error("Failed to send Daily.co message:", error);
      throw error;
    }
  }, [appointmentId, currentUser]);

  useEffect(() => {
    if (!appointmentId) return;

    // Debug logging
    console.log(
      "DailyMeetingRoom initialized with appointmentId:",
      appointmentId,
      "type:",
      typeof appointmentId
    );
    console.log("Current user:", currentUser);

    // Validate appointmentId format (should be a valid GUID)
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(appointmentId)) {
      console.error("Invalid appointmentId format:", appointmentId);
      setError("Invalid appointment ID format");
      return;
    }

    // Clean up any existing frame BEFORE creating new one
    if (callFrameRef.current) {
      console.log("Cleaning up existing frame before creating new one");
      try {
        callFrameRef.current.destroy();
      } catch (e) {
        console.log("Error destroying existing frame:", e);
      }
      callFrameRef.current = null;
    }

    const join = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get meeting info
        const response = await getMeetingInfo(appointmentId, currentUser?.id);
        const payload = response.data || response;
        setMeetingInfo(payload);

        console.log("Meeting info:", payload);

        // Check if appointment has ended or has errors
        if (payload.error || payload.message) {
          const errorMessage = payload.error || payload.message;
          if (errorMessage.includes("appointment has already ended") || 
              errorMessage.includes("already ended") ||
              errorMessage.includes("not available yet")) {
            setMeetingEnded(true);
            setLoading(false);
            return;
          }
        }

        const roomUrl = payload.RoomUrl || payload.roomUrl;
        if (!roomUrl) {
          console.error("No room URL found in payload:", payload);
          throw new Error("No room URL provided");
        }
        
        console.log("Using room URL:", roomUrl);

        // Clean up any existing frame first to avoid duplication
        if (callFrameRef.current) {
          try {
            callFrameRef.current.destroy();
          } catch (e) {
            console.log("Error destroying existing frame:", e);
          }
          callFrameRef.current = null;
        }

        // Create new frame
        const frame = DailyIframe.createFrame(containerRef.current, {
          showLeaveButton: true,
          showFullscreenButton: true,
          showLocalVideo: true,
          showParticipantsBar: true,
          activeSpeakerMode: false,
          allowMultipleCallInstances: true, // Allow multiple instances to prevent duplicate error
          iframeStyle: {
            position: "absolute",
            inset: "0px",
            width: "100%",
            height: "100%",
          },
        });

        callFrameRef.current = frame;

        // Add event listeners only once when frame is first created
        frame.on("loading", () => {
          console.log("Daily.co loading...");
          setLoading(true);
        });

        frame.on("loaded", () => {
          console.log("Daily.co loaded");
          // Don't set loading to false here, wait for joined-meeting
        });

        frame.on("joining-meeting", () => {
          console.log("Joining Daily.co meeting...");
          setLoading(true);
        });

        frame.on("joined-meeting", async () => {
          console.log("Successfully joined Daily.co meeting");
          setLoading(false);

          // Debug: Check appointment and user info
          try {
            const debugInfo = await chatService.getDebugInfo(appointmentId);
            console.log("Debug info:", debugInfo);
          } catch (debugError) {
            console.error("Failed to get debug info:", debugError);
          }

          // Record check-in time when actually joined
          try {
            console.log(
              "Recording check-in for appointment:",
              appointmentId,
              "type:",
              typeof appointmentId
            );
            const checkInResponse = await appointmentService.checkIn(
              appointmentId
            );
            console.log(
              "Check-in recorded successfully, response:",
              checkInResponse
            );

            // Send system message for join
            try {
              await chatService.sendSystemMessage(
                appointmentId,
                `${currentUser?.fullName || currentUser?.email || 'Người dùng'} đã tham gia cuộc họp`
              );
            } catch (chatError) {
              console.error("Failed to send join message:", chatError);
            }
          } catch (err) {
            console.error("Failed to record check-in:", err);
            console.error(
              "Error details:",
              err.response?.data || err.message
            );
          }
        });

        // Listen for ALL Daily.co events to debug
        frame.on("*", (event) => {
          console.log("Daily.co event received:", event.action, event);
        });

        // Listen for Daily.co chat messages and save to database
        frame.on("app-message", async (event) => {
          try {
            console.log("=== DAILY.CO APP-MESSAGE EVENT ===");
            console.log("Received Daily.co app-message:", event);
            
            // Extract message data from Daily.co event
            const messageData = event.data;
            const fromParticipant = event.fromId;
            
            console.log("Message data:", messageData);
            console.log("From participant:", fromParticipant);
            console.log("Current user:", currentUser);
            
            // Get participant info to identify sender
            const participants = frame.participants();
            const sender = participants[fromParticipant];
            
            console.log("All participants:", participants);
            console.log("Sender info:", sender);
            
            if (sender && messageData?.message) {
              // Add to daily messages state for realtime display
              const newMessage = {
                id: `daily-${Date.now()}-${fromParticipant}`,
                fromId: fromParticipant,
                fromName: sender.user_name || sender.userName || 'Unknown',
                data: messageData,
                timestamp: new Date(),
                isDailyMessage: true
              };
              setDailyMessages(prev => [...prev, newMessage]);
              
              // Save the Daily.co chat message to our database
              try {
                console.log("Attempting to save to database with appointmentId:", appointmentId);
                console.log("Message to save:", `[Daily Chat] ${messageData.message}`);
                
                const response = await chatService.sendMessage(
                  appointmentId,
                  `[Daily Chat] ${messageData.message}`,
                  false // not a system message
                );
                
                console.log("Database save response:", response);
                
                if (response.is_success || response.success) {
                  console.log("Daily.co chat message saved to database successfully");
                } else {
                  console.error("Database save failed:", response);
                }
              } catch (dbError) {
                console.error("Failed to save Daily.co chat message to database:", dbError);
                console.error("Error details:", dbError.response?.data || dbError.message);
                // Still show the message in UI even if database save fails
              }
            } else {
              console.log("Message not saved - missing sender or message data");
              console.log("Sender exists:", !!sender);
              console.log("Message exists:", !!messageData?.message);
            }
          } catch (error) {
            console.error("Failed to process Daily.co chat message:", error);
          }
        });

        frame.on("left-meeting", async () => {
          console.log("Left Daily.co meeting");

          // Record check-out time when actually left
          try {
            console.log(
              "Recording check-out for appointment:",
              appointmentId,
              "type:",
              typeof appointmentId
            );
            const checkOutResponse = await appointmentService.checkOut(
              appointmentId
            );
            console.log(
              "Check-out recorded successfully, response:",
              checkOutResponse
            );

            // Send system message for leave
            try {
              await chatService.sendSystemMessage(
                appointmentId,
                `${currentUser?.fullName || currentUser?.email || 'Người dùng'} đã rời khỏi cuộc họp`
              );
            } catch (chatError) {
              console.error("Failed to send leave message:", chatError);
            }

            // Sync Daily.co chat history after leaving meeting
            try {
              console.log("Syncing Daily.co chat history after meeting...");
              const dailyChatService = (await import('../../services/dailyChatService')).default;
              const roomName = meetingInfo?.RoomName || `appointment-${appointmentId}`;
              const syncResult = await dailyChatService.syncChatHistory(appointmentId, roomName);
              console.log("Chat history sync result:", syncResult);
            } catch (syncError) {
              console.error("Failed to sync chat history:", syncError);
            }

            // Show completion message and redirect
            console.log("Meeting completed successfully!");
            
            // Redirect to profile appointments after meeting ends
            setTimeout(() => {
              console.log("Redirecting to profile appointments...");
              // Use React Router navigation if available, otherwise fallback to window.location
              if (window.location.pathname.includes('/meeting')) {
                window.location.href = '/profile?tab=appointments';
              }
            }, 2000); // Wait 2 seconds to allow sync to complete
          } catch (err) {
            console.error("Failed to record check-out:", err);
            console.error(
              "Error details:",
              err.response?.data || err.message
            );
          }
        });

        frame.on("error", (event) => {
          console.error("Daily.co meeting error:", event);
          setLoading(false);
          
          // Handle specific error types
          if (event.errorMsg && event.errorMsg.includes("not available yet")) {
            setMeetingEnded(true);
          } else if (event.errorMsg && event.errorMsg.includes("CORS")) {
            setError("Connection error - please try refreshing the page");
          } else {
            setError(event.errorMsg || event.error || "Meeting error occurred");
          }
        });

        frame.on("camera-error", (event) => {
          console.error("Daily.co camera error:", event);
          // Don't set error state for camera issues, just log
        });

        frame.on("fatal-error", (event) => {
          console.error("Daily.co fatal error:", event);
          setLoading(false);
          setError("Fatal meeting error - please refresh the page");
        });

        // Build join options dynamically so that we only include a token when it is provided
        const joinOptions = {
          url: roomUrl,
          userName: currentUser?.fullName || currentUser?.email || "Guest",
        };

        if (payload.MeetingToken || payload.meetingToken) {
          joinOptions.token = payload.MeetingToken || payload.meetingToken;
        }

        console.log("Joining with options:", joinOptions);
        
        // Set a timeout to prevent infinite loading
        const joinTimeout = setTimeout(() => {
          console.log("Join timeout - hiding loading overlay");
          setLoading(false);
        }, 15000); // 15 seconds timeout

        try {
          await frame.join(joinOptions);
          clearTimeout(joinTimeout);
          console.log("Join successful");
        } catch (joinError) {
          clearTimeout(joinTimeout);
          console.error("Join failed:", joinError);
          throw joinError;
        }

        // Fallback: hide loading overlay once join promise resolves
        setLoading(false);
      } catch (e) {
        console.error("Failed to join meeting:", e);
        
        // Check if it's an appointment ended error
        const errorMessage = e.response?.data?.message || e.response?.data?.error || e.message || '';
        if (errorMessage.includes("appointment has already ended") || 
            errorMessage.includes("already ended") ||
            errorMessage.includes("not available yet") ||
            errorMessage.includes("Cannot create room")) {
          setMeetingEnded(true);
        } else {
          setError(errorMessage || "Failed to join meeting");
        }
        setLoading(false);
      }
    };

    join();

    return () => {
      console.log("Cleaning up DailyMeetingRoom...");
      if (callFrameRef.current) {
        try {
          console.log("Destroying Daily.co frame...");
          callFrameRef.current.destroy();
          callFrameRef.current = null;
        } catch (e) {
          console.log("Error destroying frame on cleanup:", e);
        }
      }
    };
  }, [
    appointmentId,
    currentUser?.id,
    currentUser?.fullName,
    currentUser?.email,
  ]);

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Video container (Daily will fill this) */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full bg-black"
      />

      {/* Chat Toggle Button - Show if not loading and no error, or if meeting ended */}
      {((!loading && !error) || meetingEnded) && (
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-40 transition-colors duration-200"
          title="Toggle Chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Panel - Show if not loading and no error, or if meeting ended */}
      {(!loading && !error) || meetingEnded ? (
        <ChatPanel 
          appointmentId={appointmentId}
          isVisible={showChat}
          onToggle={() => setShowChat(false)}
          sendDailyMessage={meetingEnded ? null : sendDailyMessage}
          dailyMessages={dailyMessages}
        />
      ) : null}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 text-white z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Connecting to meeting room...</p>
            {meetingInfo && (
              <p className="text-sm text-gray-400 mt-2">
                Room: {meetingInfo.RoomName}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Meeting Ended State */}
      {meetingEnded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 text-white z-10">
          <div className="text-center max-w-md">
            <div className="text-yellow-400 text-4xl mb-4">⏰</div>
            <h3 className="text-xl font-semibold mb-2">
              Cuộc họp đã kết thúc
            </h3>
            <p className="text-gray-300 mb-6">
              Cuộc họp này đã kết thúc. Bạn có thể xem lại lịch sử chat hoặc quay lại trang chủ.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowChat(true)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Xem Chat History
              </button>
              <button
                onClick={() => window.location.href = '/profile?tab=appointments'}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
              >
                Quay lại Appointments
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 text-white z-10">
          <div className="text-center max-w-md">
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">
              Unable to Join Meeting
            </h3>
            <p className="text-red-400 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Try Again
              </button>
              {meetingInfo?.roomUrl && (
                <button
                  onClick={() => window.open(meetingInfo.roomUrl, '_blank')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                >
                  Open in New Tab
                </button>
              )}
            </div>
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
