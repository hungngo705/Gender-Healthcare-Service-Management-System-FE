import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import DailyIframe from "@daily-co/daily-js";
import {
  getMeetingInfo,
  createMeetingRoom,
} from "../../services/meetingService";
import appointmentService from "../../services/appointmentService";
import { useAuth } from "../../contexts/AuthContext";

const DailyMeetingRoom = ({ appointmentId }) => {
  const { currentUser } = useAuth();
  const containerRef = useRef(null);
  const callFrameRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);

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

    const join = async () => {
      try {
        setLoading(true);

        // Get meeting info only if we don't already have it from props
        let payload;

        // We always need to call getMeetingInfo at this point because we need the room URL
        let res = await getMeetingInfo(appointmentId, currentUser?.id);
        payload = res.data?.data ?? res.data ?? res;

        // If no room exists, create one
        if (!payload || !payload.RoomUrl) {
          console.log(
            "No room found, creating an instant room (non-pre-scheduled)..."
          );
          // Create a room that opens immediately instead of waiting for the schedule
          const createRes = await createMeetingRoom(appointmentId, false);
          payload = createRes.data?.data ?? createRes.data ?? createRes;
        }

        setMeetingInfo(payload);

        const roomUrl = payload.RoomUrl ?? payload.roomUrl;
        if (!roomUrl) throw new Error("Room URL missing from API response");

        // Skip the early-join block entirely so users can enter at any time

        console.log("Joining Daily.co room:", roomUrl);

        // Reuse existing DailyIframe instance if we already created one to avoid duplication error
        let frame = callFrameRef.current;

        if (!frame) {
          frame = DailyIframe.createFrame(containerRef.current, {
            showLeaveButton: true,
            showFullscreenButton: true,
            showLocalVideo: true,
            showParticipantsBar: true,
            activeSpeakerMode: false,
            iframeStyle: {
              position: "absolute",
              inset: "0px",
              width: "100%",
              height: "100%",
            },
          });

          callFrameRef.current = frame;

          // Add event listeners only once when frame is first created
          frame.on("joined-meeting", async () => {
            console.log("Successfully joined Daily.co meeting");
            setLoading(false);

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
            } catch (err) {
              console.error("Failed to record check-in:", err);
              console.error(
                "Error details:",
                err.response?.data || err.message
              );
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
            setError(event.error || "Meeting error occurred");
          });
        }

        // Build join options dynamically so that we only include a token when it is provided
        const joinOptions = {
          url: roomUrl,
          userName: currentUser?.fullName || currentUser?.email || "Guest",
        };

        if (payload.MeetingToken) {
          joinOptions.token = payload.MeetingToken;
        }

        await frame.join(joinOptions);

        // Fallback: hide loading overlay once join promise resolves
        setLoading(false);
      } catch (e) {
        console.error("Failed to join meeting:", e);
        setError(e.message || "Failed to join meeting");
        setLoading(false);
      }
    };

    join();

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
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

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 text-white z-10">
          <div className="text-center max-w-md">
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">
              Unable to Join Meeting
            </h3>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Try Again
            </button>
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
