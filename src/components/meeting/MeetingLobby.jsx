import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Video, 
  Users, 
  Info,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import * as meetingService from '../../services/meetingService';

const MeetingLobby = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [canJoin, setCanJoin] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [derivedAvailableFrom, setDerivedAvailableFrom] = useState(null);

  useEffect(() => {
    let intervalId;
    
    const fetchMeetingInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await meetingService.getMeetingInfo(appointmentId);
        console.log('Meeting info response:', response);
        
        setMeetingInfo(response);
        setCanJoin(response.canJoinEarly);
        
        if (!response.canJoinEarly) {
          // Start polling every 30 seconds when room is locked
          intervalId = setInterval(async () => {
            try {
              const updatedResponse = await meetingService.getMeetingInfo(appointmentId);
              setMeetingInfo(updatedResponse);
              setCanJoin(updatedResponse.canJoinEarly);
              
              if (updatedResponse.canJoinEarly) {
                clearInterval(intervalId);
              }
            } catch (err) {
              console.error('Error polling meeting info:', err);
            }
          }, 30000);
        }
        
      } catch (err) {
        console.error('Error fetching meeting info:', err);
        if (err.response?.status === 403) {
          setError('Bạn không có quyền truy cập phòng họp này.');
        } else if (err.response?.status === 401) {
          setError('Vui lòng đăng nhập để tiếp tục.');
        } else if (err.response?.status === 404) {
          setError('Không tìm thấy cuộc hẹn này.');
        } else {
          setError('Có lỗi xảy ra khi tải thông tin cuộc hẹn. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingInfo();

    // Update current time every second for countdown
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
      clearInterval(timeInterval);
    };
  }, [appointmentId]);

  // Calculate time remaining until room opens (5 minutes before start)
  useEffect(() => {
    if (!meetingInfo) return;

    // Derive the time when users are allowed to join (startTime - 5 minutes)
    const startTimeUtc = new Date(meetingInfo.startTime);
    const joinAvailable = new Date(startTimeUtc.getTime() - 5 * 60 * 1000);

    // Prefer backend field if provided
    const availableFrom = meetingInfo.availableFrom
      ? new Date(meetingInfo.availableFrom)
      : joinAvailable;

    // Save for displaying later
    setDerivedAvailableFrom(availableFrom);

    // Only show countdown if not yet joinable
    if (!canJoin) {
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
        setTimeRemaining('0s');
      }
    }
  }, [currentTime, meetingInfo, canJoin]);

  const handleJoinMeeting = () => {
    if (meetingInfo && meetingInfo.roomUrl) {
      window.open(meetingInfo.roomUrl, '_blank');
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh'
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
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Có lỗi xảy ra</h2>
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
                onClick={() => navigate('/profile?tab=appointments')}
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
          <div className={`p-4 rounded-lg mb-6 ${
            canJoin 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center justify-center">
              {canJoin ? (
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
                    {derivedAvailableFrom && derivedAvailableFrom.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: 'Asia/Ho_Chi_Minh'
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
                    {currentTime.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: 'Asia/Ho_Chi_Minh'
                    })} (UTC+7)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    canJoin 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {canJoin ? 'Có thể tham gia' : 'Đang chờ'}
                  </span>
                </div>
                {!canJoin && timeRemaining && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian còn lại:</span>
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
                Đảm bảo kết nối internet ổn định và thiết bị camera/microphone hoạt động
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Nếu gặp sự cố kỹ thuật, vui lòng liên hệ hỗ trợ
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleJoinMeeting}
              disabled={!canJoin || !meetingInfo?.roomUrl}
              className={`px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 flex items-center justify-center ${
                canJoin && meetingInfo?.roomUrl
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Video className="h-5 w-5 mr-2" />
              {canJoin ? 'Tham Gia Cuộc Hẹn' : `Phòng họp mở trong ${timeRemaining}`}
            </button>
            
            <button
              onClick={() => navigate('/profile?tab=appointments')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Quay lại lịch hẹn
            </button>
          </div>

          {/* Debug Information (for development)
          {process.env.NODE_ENV === 'development' && meetingInfo && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Debug Info:</h4>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify({
                  canJoinEarly: meetingInfo.canJoinEarly,
                  currentTimeLocal: meetingInfo.currentTimeLocal,
                  availableFrom: meetingInfo.availableFrom,
                  startTime: meetingInfo.startTime,
                  endTime: meetingInfo.endTime
                }, null, 2)}
              </pre>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default MeetingLobby; 