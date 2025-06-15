import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Calendar, CheckCircle } from "lucide-react";
import userService from "../../../services/userService";
import appointmentService from "../../../services/appointmentService";

function AppointmentsTab({ navigate }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "completed"

  // Helper function to convert slot number to time string
  const getTimeBySlot = (slotNumber) => {
    const slotMap = {
      0: "08:00 - 10:00",
      1: "10:00 - 12:00",
      2: "13:00 - 15:00",
      3: "15:00 - 17:00",
    };
    return slotMap[slotNumber] || "Không xác định";
  };

  // Helper function to get status text and class
  const getStatusInfo = (statusCode) => {
    // Convert to number if it's a string
    const status = typeof statusCode === 'string' ? parseInt(statusCode, 10) : statusCode;
    
    switch (status) {
      case 0:
        return {
          text: "Đã đặt lịch",
          className: "bg-yellow-100 text-yellow-800",
        };
      case 1:
        return {
          text: "Hoàn thành",
          className: "bg-green-100 text-green-800",
        };
      case 2:
        return {
          text: "Đã hủy",
          className: "bg-red-100 text-red-800",
        };
      case 3:
        return {
          text: "Đang tiến hành",
          className: "bg-blue-100 text-blue-800",
        };
      default:
        return {
          text: "Không xác định",
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Step 1: Get current user profile
        const userResponse = await userService.getCurrentUserProfile();
        console.log("User profile:", userResponse);
        
        // Extract user ID from response
        const currentUserId = userResponse.id || userResponse.data?.id;
        setUserId(currentUserId);
        
        if (!currentUserId) {
          throw new Error("Không thể xác định người dùng hiện tại");
        }
        
        // Step 2: Get all appointments
        const appointmentsResponse = await appointmentService.getAll();
        console.log("All appointments:", appointmentsResponse);
        
        // Step 3: Filter appointments for this user
        const allAppointments = appointmentsResponse.data?.data || [];
        const userAppointments = allAppointments.filter(appointment => 
          appointment.customerId === currentUserId
        );
        
        console.log("User appointments:", userAppointments);
        setAppointments(userAppointments);
        setError(null);
        
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    const status = typeof appointment.status === 'string' 
      ? parseInt(appointment.status, 10) 
      : appointment.status;
    
    if (activeTab === "upcoming") {
      // Show scheduled (0) and in progress (3) appointments
      return status === 0 || status === 3;
    } else {
      // Show completed (1) and cancelled (2) appointments
      return status === 1 || status === 2;
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lịch hẹn của bạn</h3>
        <div className="text-center py-8">
          <div className="animate-pulse flex justify-center">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">Đang tải lịch hẹn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lịch hẹn của bạn</h3>
        <div className="text-center py-8 bg-red-50 rounded-lg">
          <Calendar size={48} className="mx-auto text-red-400" />
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Lịch hẹn của bạn
      </h3>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`${
              activeTab === "upcoming"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Sắp tới
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`${
              activeTab === "completed"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Hoàn thành
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {filteredAppointments.length === 0 ? (
        // No appointments for current tab
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          {activeTab === "upcoming" ? (
            <>
              <Calendar size={48} className="mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Bạn chưa có lịch hẹn nào sắp tới</p>
              <button
                type="button"
                className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate("/services")}
              >
                Đặt lịch hẹn ngay
              </button>
            </>
          ) : (
            <>
              <CheckCircle size={48} className="mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Bạn chưa có lịch hẹn nào đã hoàn thành</p>
            </>
          )}
        </div>
      ) : (
        // Show appointments for current tab
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tư vấn viên
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày hẹn
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => {
                const statusInfo = getStatusInfo(appointment.status);
                return (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {appointment.consultant?.avatarUrl && (
                          <div className="flex-shrink-0 h-8 w-8 mr-2">
                            <img 
                              className="h-8 w-8 rounded-full" 
                              src={appointment.consultant.avatarUrl} 
                              alt="" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/40";
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.consultant?.name || "Không xác định"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(appointment.appointmentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getTimeBySlot(appointment.slot)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.className}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.notes || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {activeTab === "upcoming" && (
            <div className="mt-4 text-right">
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate("/services")}
              >
                Đặt thêm lịch hẹn
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

AppointmentsTab.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default AppointmentsTab;
