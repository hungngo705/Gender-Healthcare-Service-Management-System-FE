import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  Video,
  Users,
  Info,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import * as meetingService from "../../services/meetingService";
import appointmentService from "../../services/appointmentService";

const MeetingLobby = () => {
  const { appointmentId } = useParams();
  const [searchParams] = useSearchParams();
  const shouldStartMeeting = searchParams.get("start") === "true";

  const navigate = useNavigate();
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [canJoin, setCanJoin] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [derivedAvailableFrom, setDerivedAvailableFrom] = useState(null);
  const [joiningMeeting, setJoiningMeeting] = useState(false);
  const [meetingWindow, setMeetingWindow] = useState(null);
  const [fetchingMeetingInfo, setFetchingMeetingInfo] = useState(false);

  // Update current time every second for countdown
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  // Only fetch meeting info when the component mounts AND the start parameter is true
  useEffect(() => {
    if (shouldStartMeeting && !meetingInfo && !fetchingMeetingInfo) {
      fetchMeetingInfo();
    }
  }, [shouldStartMeeting, meetingInfo, fetchingMeetingInfo]);

  // Function to fetch meeting information
  const fetchMeetingInfo = async () => {
    try {
      setFetchingMeetingInfo(true);
      setLoading(true);
      setError(null);

      const response = await meetingService.getMeetingInfo(appointmentId);
      console.log("Meeting info response:", response);

      setMeetingInfo(response);
      setCanJoin(response.canJoinEarly);
      setIsExpired(response.isExpired || false);

      // Calculate time remaining until room opens (5 minutes before start)
      if (response) {
        // Derive the time when users are allowed to join (startTime - 5 minutes)
        const startTimeUtc = new Date(response.startTime);
        const joinAvailable = new Date(startTimeUtc.getTime() - 5 * 60 * 1000);

        // Prefer backend field if provided
        const availableFrom = response.availableFrom
          ? new Date(response.availableFrom)
          : joinAvailable;

        // Save for displaying later
        setDerivedAvailableFrom(availableFrom);
      }
    } catch (err) {
      console.error("Error fetching meeting info:", err);
      if (err.response?.status === 403) {
        setError("Bạn không có quyền truy cập phòng họp này.");
      } else if (err.response?.status === 401) {
        setError("Vui lòng đăng nhập để tiếp tục.");
      } else if (err.response?.status === 404) {
        setError("Không tìm thấy cuộc hẹn này.");
      } else {
        setError(
          "Có lỗi xảy ra khi tải thông tin cuộc hẹn. Vui lòng thử lại sau."
        );
      }
    } finally {
      setLoading(false);
      setFetchingMeetingInfo(false);
    }
  };

  // Calculate time remaining until room opens
  useEffect(() => {
    if (!meetingInfo) return;

    // Only show countdown if not yet joinable
    if (!canJoin) {
      const availableFrom = derivedAvailableFrom;
      if (!availableFrom) return;

      const now = new Date();
      const diff = availableFrom.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeRemaining(`${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining(`${seconds}s`);
        }
      } else {
        setTimeRemaining("0s");
      }
    }
  }, [currentTime, meetingInfo, canJoin, derivedAvailableFrom]);

  const handleJoinMeeting = async () => {
    if (!meetingInfo || !meetingInfo.roomUrl) return;

    setJoiningMeeting(true);

    try {
      // Check-in when user clicks "Tham gia cuộc hẹn"
      console.log(
        "Auto check-in when joining meeting for appointment:",
        appointmentId
      );
      await appointmentService.checkIn(appointmentId);
      console.log("Check-in successful, opening meeting room");

      // Open Daily.co meeting in new tab và giữ reference để theo dõi
      const newWindow = window.open(meetingInfo.roomUrl, "_blank");
      setMeetingWindow(newWindow);
    } catch (error) {
      console.error("Check-in failed:", error);
      // Still allow user to join meeting even if check-in fails
      console.log("Check-in failed, but opening meeting room anyway");
      const fallbackWindow = window.open(meetingInfo.roomUrl, "_blank");
      setMeetingWindow(fallbackWindow);

      // Optional: Show toast notification about check-in failure
      alert(
        "Ghi nhận tham gia thất bại, nhưng bạn vẫn có thể tham gia cuộc họp"
      );
    } finally {
      setJoiningMeeting(false);
    }
  };

  /* -------------------------------------------------
     Theo dõi khi tab Daily.co bị đóng để tự động check-out
     -------------------------------------------------*/
  useEffect(() => {
    if (!meetingWindow) return;

    const interval = setInterval(async () => {
      if (meetingWindow.closed) {
        console.log("Detected Daily.co tab closed – performing auto check-out");

        try {
          await appointmentService.checkOut(appointmentId);
          console.log("Auto check-out (from lobby) thành công");
        } catch (err) {
          console.error("Auto check-out (fallback) thất bại:", err);
        }

        // Chuyển về trang lịch hẹn / feedback
        navigate("/profile?tab=appointments");
      }
    }, 2000); // kiểm tra mỗi 2s

    return () => clearInterval(interval);
  }, [meetingWindow, appointmentId, navigate]);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin cuộc hẹn...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Có lỗi xảy ra
            </h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </button>
              <button
                onClick={() => navigate("/profile?tab=appointments")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Quay lại lịch hẹn
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Background overlay with blur effect
    <div className="fixed inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      {/* Main card */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 rounded-t-lg">
          <div className="text-center">
            <Video className="h-12 w-12 mx-auto mb-3" />
            <h1 className="text-2xl font-bold">Phòng Họp Trực Tuyến</h1>
            <p className="text-indigo-100 mt-1">Cuộc hẹn #{appointmentId}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-lg mb-6 ${
              !meetingInfo
                ? "bg-blue-50 border border-blue-200"
                : isExpired
                ? "bg-red-50 border border-red-200"
                : canJoin
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <div className="flex items-center justify-center">
              {!meetingInfo ? (
                <>
                  <Info className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-medium">
                    {loading
                      ? "Đang kiểm tra thông tin phòng họp..."
                      : "Nhấn nút 'Kiểm Tra Phòng Họp' để tiếp tục"}
                  </span>
                </>
              ) : isExpired ? (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">
                    Phòng họp đã kết thúc
                  </span>
                </>
              ) : canJoin ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    Phòng họp đã sẵn sàng - Bạn có thể tham gia ngay
                  </span>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-medium">
                    Phòng họp mở trong {timeRemaining}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Only show meeting details if we have meeting info */}
          {meetingInfo ? (
            <>
              {/* Meeting Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Schedule Card */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                    Lịch Trình Cuộc Hẹn
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian bắt đầu:</span>
                      <span className="font-medium text-gray-900">
                        {formatDateTime(meetingInfo?.startTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian kết thúc:</span>
                      <span className="font-medium text-gray-900">
                        {formatDateTime(meetingInfo?.endTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Có thể tham gia từ:</span>
                      <span className="font-medium text-gray-900">
                        {derivedAvailableFrom &&
                          derivedAvailableFrom.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            timeZone: "Asia/Ho_Chi_Minh",
                          })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-indigo-600" />
                    Thông Tin Cuộc Hẹn
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian hiện tại:</span>
                      <span className="font-medium text-gray-900">
                        {currentTime.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          timeZone: "Asia/Ho_Chi_Minh",
                        })}{" "}
                        (UTC+7)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          isExpired
                            ? "bg-red-100 text-red-800"
                            : canJoin
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {isExpired
                          ? "Đóng"
                          : canJoin
                          ? "Có thể tham gia"
                          : "Đang chờ"}
                      </span>
                    </div>
                    {!canJoin && timeRemaining && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Thời gian còn lại:
                        </span>
                        <span className="font-mono text-lg font-bold text-indigo-600">
                          {timeRemaining}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Hướng Dẫn Tham Gia
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Phòng họp sẽ mở 5 phút trước giờ hẹn đã lên lịch
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Vui lòng tham gia đúng giờ để cuộc hẹn diễn ra thuận lợi
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Đảm bảo kết nối internet ổn định và thiết bị
                    camera/microphone hoạt động
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Nếu gặp sự cố kỹ thuật, vui lòng liên hệ hỗ trợ
                  </li>
                </ul>
              </div>

              {/* Join Meeting Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleJoinMeeting}
                  disabled={
                    isExpired ||
                    !canJoin ||
                    !meetingInfo?.roomUrl ||
                    joiningMeeting
                  }
                  className={`px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 flex items-center justify-center ${
                    isExpired
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : canJoin && meetingInfo?.roomUrl && !joiningMeeting
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isExpired ? (
                    <>Đã kết thúc</>
                  ) : joiningMeeting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang tham gia...
                    </>
                  ) : (
                    <>
                      <Video className="h-5 w-5 mr-2" />
                      {isExpired
                        ? "Đã kết thúc"
                        : canJoin
                        ? "Tham Gia Cuộc Hẹn"
                        : `Phòng họp mở trong ${timeRemaining}`}
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/profile?tab=appointments")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Quay lại lịch hẹn
                </button>
              </div>
            </>
          ) : (
            // Show a more basic UI when we haven't fetched meeting info yet
            <div className="space-y-6">
              <div className="text-center py-6">
                <Video className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Thông tin cuộc hẹn #{appointmentId}
                </h2>
                <p className="text-gray-600">
                  Nhấn nút "Kiểm Tra Phòng Họp" để xem chi tiết về phòng họp của
                  bạn.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={fetchMeetingInfo}
                  disabled={loading || fetchingMeetingInfo}
                  className={`px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 flex items-center justify-center 
                    ${
                      loading || fetchingMeetingInfo
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                >
                  {loading || fetchingMeetingInfo ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang kiểm tra...
                    </>
                  ) : (
                    <>
                      <Info className="h-5 w-5 mr-2" />
                      Kiểm Tra Phòng Họp
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/profile?tab=appointments")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Quay lại lịch hẹn
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add any missing helper functions from the original
const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

export default MeetingLobby;
