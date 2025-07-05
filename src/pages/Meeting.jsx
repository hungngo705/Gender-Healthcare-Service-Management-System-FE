import { useParams } from "react-router-dom";
import { useState } from "react";
import AgoraMeetingRoom from "../components/meeting/AgoraMeetingRoom";
import AgoraMeetingLobby from "../components/meeting/AgoraMeetingLobby";

const MeetingPage = () => {
  const { appointmentId } = useParams();
  const [joined, setJoined] = useState(false);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black">
      {joined ? (
        <AgoraMeetingRoom appointmentId={appointmentId} />
      ) : (
        <AgoraMeetingLobby onJoin={() => setJoined(true)} />
      )}
    </div>
  );
};

export default MeetingPage; 