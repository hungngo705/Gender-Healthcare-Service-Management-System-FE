import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import AgoraRTC from "agora-rtc-sdk-ng";
import { getAgoraMeetingInfo } from "../../services/meetingService";
import appointmentService from "../../services/appointmentService";
import { useAuth } from "../../contexts/AuthContext";

const AgoraMeetingRoom = ({ appointmentId }) => {
  const { currentUser } = useAuth();
  const containerRef = useRef(null);
  const clientRef = useRef(null);
  const localTracksRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appointmentId || !currentUser?.id) return;

    const join = async () => {
      try {
        setLoading(true);
        const info = await getAgoraMeetingInfo(appointmentId, currentUser.id);

        const { appId, channelName, rtcToken, uid } = {
          appId: info.appId || info.AppId,
          channelName: info.channelName || info.ChannelName,
          rtcToken: info.rtcToken || info.RtcToken,
          uid: info.uid || info.Uid,
        };

        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            const remoteContainer = document.createElement("div");
            remoteContainer.id = `${user.uid}`;
            remoteContainer.style.width = "100%";
            remoteContainer.style.height = "100%";
            containerRef.current.appendChild(remoteContainer);
            user.videoTrack.play(remoteContainer);
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });

        await client.join(appId, channelName, rtcToken || null, uid);

        const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = [micTrack, camTrack];
        await client.publish(localTracksRef.current);

        // Hiển thị local video
        const localContainer = document.createElement("div");
        localContainer.id = "local-player";
        localContainer.style.width = "100%";
        localContainer.style.height = "100%";
        containerRef.current.appendChild(localContainer);
        camTrack.play(localContainer);

        // Check-in khi join
        try {
          await appointmentService.checkIn(appointmentId);
        } catch (err) {
          console.error("Check-in failed", err);
        }

        setLoading(false);
      } catch (e) {
        console.error(e);
        setError(e.message || "Không thể tham gia cuộc họp");
        setLoading(false);
      }
    };

    join();

    return () => {
      const cleanup = async () => {
        if (localTracksRef.current.length) {
          localTracksRef.current.forEach((t) => t.close());
        }
        if (clientRef.current) {
          await clientRef.current.leave();
        }
        // Check-out khi leave
        try {
          await appointmentService.checkOut(appointmentId);
        } catch (err) {
          console.error("Check-out failed", err);
        }
      };

      cleanup();
    };
  }, [appointmentId, currentUser?.id]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full bg-black"
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 text-white z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Đang kết nối phòng họp...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 text-white z-10">
          <div className="text-center max-w-md">
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Không thể tham gia</h3>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Thử Lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

AgoraMeetingRoom.propTypes = {
  appointmentId: PropTypes.string.isRequired,
};

export default AgoraMeetingRoom; 