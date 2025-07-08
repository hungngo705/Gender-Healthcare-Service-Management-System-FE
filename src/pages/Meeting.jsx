import { useParams } from "react-router-dom";
import { useState } from "react";
import DailyMeetingRoom from "../components/meeting/DailyMeetingRoom";
import MeetingLobby from "../components/meeting/MeetingLobby";

const MeetingPage = () => {
  const { appointmentId } = useParams();
  const [joined, setJoined] = useState(false);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black">
      {joined ? (
        <DailyMeetingRoom appointmentId={appointmentId} />
      ) : (
        <MeetingLobby appointmentId={appointmentId} onJoin={() => setJoined(true)} />
      )}
    </div>
  );
};

export default MeetingPage; 