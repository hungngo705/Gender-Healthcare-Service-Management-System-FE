import { useState } from "react";
import { testJoinNow } from "../services/meetingService";
import DailyMeetingRoom from "../components/meeting/DailyMeetingRoom";

const MeetingTestPage = () => {
  const [testAppointmentId, setTestAppointmentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStartTestMeeting = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // This function calls the backend's quick test endpoint
      const response = await testJoinNow("test-user");
      
      if (response.success && response.data.appointmentId) {
        setTestAppointmentId(response.data.appointmentId);
      } else {
        throw new Error(response.message || "Failed to create a test meeting.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // If we have an ID, render the meeting room
  if (testAppointmentId) {
    return <DailyMeetingRoom appointmentId={testAppointmentId} />;
  }

  // Otherwise, show the button to start a test
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Meeting Component Test</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to bypass scheduling and start an instant test meeting.
        </p>
        <button
          onClick={handleStartTestMeeting}
          disabled={isLoading}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
        >
          {isLoading ? "Starting..." : "Start Test Meeting"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default MeetingTestPage;