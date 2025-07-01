import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import appointmentService from "../../services/appointmentService";
import { format } from "date-fns";

const pad = (n) => String(n).padStart(2, "0");

const getTimeDiff = (target) => {
  const diffMs = target - Date.now();
  const diffMin = Math.max(0, Math.floor(diffMs / 60000));
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  return `${hours}h ${pad(mins)}m`;
};

const MeetingLobby = ({ appointmentId, onJoin }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await appointmentService.getById(appointmentId);
        setAppointment(res.data?.data ?? res.data); // support wrapped ApiResponse
      } catch (e) {
        console.error(e);
        setError("Failed to load appointment details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appointmentId]);

  if (loading) return <div>Loading schedule…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!appointment) return null;

  const startDateTime = new Date(
    `${appointment.appointmentDate}T${appointment.slot === "Morning1" ? "08:00:00" : appointment.slot === "Morning2" ? "10:00:00" : appointment.slot === "Afternoon1" ? "13:00:00" : "15:00:00"}`
  );
  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // assume 2h
  const availableFrom = new Date(startDateTime.getTime() - 5 * 60 * 1000);

  const canJoin = now <= endDateTime;
  const untilStart = getTimeDiff(startDateTime);
  const untilEnd = getTimeDiff(endDateTime);

  const status = now < startDateTime ? "Upcoming" : now <= endDateTime ? "Active" : "Ended";

  return (
    <div className="mx-auto max-w-2xl bg-white shadow rounded-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Virtual Meeting Room</h2>
      <p className="text-center text-sm text-gray-500">Appointment ID: {appointment.id}</p>

      <div className="bg-yellow-100 text-yellow-800 py-2 px-4 rounded text-center">
        {now < startDateTime && "You can join this meeting ahead of schedule"}
        {now >= startDateTime && now <= endDateTime && "Meeting in progress"}
        {now > endDateTime && "Meeting ended"}
        <div className="text-xs text-gray-600 mt-1">
          Current time: {format(now, "HH:mm:ss")}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold mb-2">Meeting Schedule</h3>
          <div className="flex justify-between text-sm mb-1">
            <span>Start Time:</span>
            <span>{format(startDateTime, "hh:mm a")}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>End Time:</span>
            <span>{format(endDateTime, "hh:mm a")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Available From:</span>
            <span>{format(availableFrom, "hh:mm a")}</span>
          </div>
        </div>
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold mb-2">Time Remaining</h3>
          <div className="flex justify-between text-sm mb-1">
            <span>Until Start:</span>
            <span>{untilStart}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Until End:</span>
            <span>{untilEnd}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Status:</span>
            <span className={status === "Active" ? "text-green-600" : "text-gray-500"}>{status}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          className={`px-6 py-2 rounded-md text-white font-semibold transition-colors ${canJoin ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
          disabled={!canJoin}
          onClick={() => canJoin && onJoin()}
        >
          Join Meeting Now
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-md text-sm">
        <h3 className="font-semibold mb-2">Meeting Instructions</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>The meeting room becomes available 5 minutes before your scheduled time</li>
          <li>Please join on time as the room will automatically close after the scheduled end time</li>
          <li>Ensure you have a stable internet connection and working camera/microphone</li>
          <li>If you experience any issues, please contact support</li>
        </ul>
      </div>
    </div>
  );
};

MeetingLobby.propTypes = {
  appointmentId: PropTypes.string.isRequired,
  onJoin: PropTypes.func.isRequired,
};

export default MeetingLobby; 