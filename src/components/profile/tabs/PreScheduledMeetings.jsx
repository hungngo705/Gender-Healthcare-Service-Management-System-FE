import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { getMeetingInfo, createMeetingRoom, deleteMeetingRoom, getRoomStatus } from "../../../services/meetingService";
import * as appointmentService from "../../../services/appointmentService";
import { useNavigate } from "react-router-dom";

const PreScheduledMeetings = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRooms, setProcessingRooms] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAll();
      const allAppointments = response.data?.data || [];
      
      // Filter appointments for current user that are upcoming
      const userAppointments = allAppointments.filter(appointment => {
        const isUserAppointment = appointment.customerId === currentUser.id || appointment.consultantId === currentUser.id;
        const appointmentDate = new Date(appointment.appointmentDate);
        const now = new Date();
        const isUpcoming = appointmentDate >= now.setHours(0, 0, 0, 0); // Today or future
        return isUserAppointment && isUpcoming;
      });

      // Get room status for each appointment
      const appointmentsWithRoomInfo = await Promise.all(
        userAppointments.map(async (appointment) => {
          try {
            const meetingInfo = await getMeetingInfo(appointment.id, currentUser.id);
            return {
              ...appointment,
              roomInfo: meetingInfo.data || meetingInfo,
              hasRoom: !!(meetingInfo.data?.RoomUrl || meetingInfo.RoomUrl)
            };
          } catch (error) {
            return {
              ...appointment,
              roomInfo: null,
              hasRoom: false
            };
          }
        })
      );

      setAppointments(appointmentsWithRoomInfo);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (appointmentId) => {
    setProcessingRooms(prev => new Set(prev).add(appointmentId));
    try {
      await createMeetingRoom(appointmentId, true); // Pre-scheduled room
      await loadAppointments(); // Reload to get updated info
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create meeting room: " + error.message);
    } finally {
      setProcessingRooms(prev => {
        const newSet = new Set(prev);
        newSet.delete(appointmentId);
        return newSet;
      });
    }
  };

  const handleDeleteRoom = async (roomName, appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this meeting room?")) return;
    
    setProcessingRooms(prev => new Set(prev).add(appointmentId));
    try {
      await deleteMeetingRoom(roomName);
      await loadAppointments(); // Reload to get updated info
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete meeting room: " + error.message);
    } finally {
      setProcessingRooms(prev => {
        const newSet = new Set(prev);
        newSet.delete(appointmentId);
        return newSet;
      });
    }
  };

  const joinMeeting = (appointmentId) => {
    navigate(`/meeting/${appointmentId}`);
  };

  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const [hours, minutes] = timeStr.split(':');
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleString();
  };

  const isRoomAvailable = (roomInfo) => {
    if (!roomInfo) return false;
    const now = new Date();
    const startTime = new Date(roomInfo.StartTime);
    const endTime = new Date(roomInfo.EndTime);
    return now >= startTime.setMinutes(startTime.getMinutes() - 5) && now <= endTime;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-2">Loading meetings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pre-scheduled Meetings</h2>
        <button
          onClick={loadAppointments}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No upcoming appointments with meetings</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Appointment with {appointment.consultantName || appointment.customerName}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {formatDateTime(appointment.appointmentDate, appointment.startTime)} - 
                    {appointment.endTime}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Status: <span className="font-medium">{appointment.status}</span>
                  </p>

                  {appointment.hasRoom && appointment.roomInfo ? (
                    <div className="bg-green-50 p-4 rounded-md mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-green-800">
                            Meeting Room Ready
                          </p>
                          <p className="text-sm text-green-600">
                            Room: {appointment.roomInfo.RoomName}
                          </p>
                          <p className="text-xs text-green-600">
                            Available: {new Date(appointment.roomInfo.StartTime).toLocaleString()} - 
                            {new Date(appointment.roomInfo.EndTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-4 rounded-md mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-yellow-800">
                            No Meeting Room Created
                          </p>
                          <p className="text-sm text-yellow-600">
                            Create a pre-scheduled room for this appointment
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {appointment.hasRoom && appointment.roomInfo ? (
                    <>
                      <button
                        onClick={() => joinMeeting(appointment.id)}
                        disabled={!isRoomAvailable(appointment.roomInfo)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          isRoomAvailable(appointment.roomInfo)
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isRoomAvailable(appointment.roomInfo) ? "Join Meeting" : "Not Available Yet"}
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(appointment.roomInfo.RoomName, appointment.id)}
                        disabled={processingRooms.has(appointment.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {processingRooms.has(appointment.id) ? "Deleting..." : "Delete Room"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleCreateRoom(appointment.id)}
                      disabled={processingRooms.has(appointment.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {processingRooms.has(appointment.id) ? "Creating..." : "Create Meeting Room"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreScheduledMeetings; 