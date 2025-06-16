import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// Import services
import appointmentService from "../../../services/appointmentService";
import userService from "../../../services/userService";
import testResultService from "../../../services/testResultService";
import { X } from "lucide-react"; // For close button icon

function ConsultantAppointmentsTab({ role }) {
  // Existing state variables
  const [filter, setFilter] = useState("all");
  const [consultantAppointments, setConsultantAppointments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state variables for customer detail popup
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [customerTests, setCustomerTests] = useState([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Get current user profile instead of relying on JWT token
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userService.getCurrentUserProfile();
        console.log("Current user profile:", response);

        // Extract user ID from response
        const extractedUserId = response.id || response.data?.id;
        console.log("User ID from profile:", extractedUserId);

        setUserId(extractedUserId);
      } catch (err) {
        console.error("Error fetching current user profile:", err);
        setError("Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.");
      }
    };

    fetchCurrentUser();
  }, []);

  // Map status numbers to strings
  const statusMap = {
    0: "scheduled",
    1: "completed",
    2: "cancelled",
  };

  // Process and fetch appointments when component mounts or userId changes
  useEffect(() => {
    if (!userId) return;

    // Show loading state
    setIsLoading(true);
    setError(null);

    // Fetch appointments for this consultant from API
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching appointments for consultant ID:", userId);
        const response = await appointmentService.getByConsultant(userId);
        console.log("Raw API response:", response);
        
        // Extract appointments array from the nested structure
        const appointmentsArray = response?.data?.data || [];
        
        // Now transform the appointments with the new structure
        const transformedAppointments = appointmentsArray.map((appointment) => {
          return {
            id: appointment.id,
            customerId: appointment.customerId,
            customerName: appointment.customer?.name || 'Khách hàng',
            customerEmail: appointment.customer?.email,
            phone: appointment.customer?.phoneNumber,
            avatarUrl: appointment.customer?.avatarUrl,
            serviceId: appointment.serviceId,
            type: getServiceType(appointment.serviceId),
            serviceType: getServiceType(appointment.serviceId),
            date: appointment.appointmentDate,
            slotNumber: appointment.slot,
            time: getTimeBySlot(appointment.slot),
            status: statusMap[appointment.status] || "unknown",
            statusCode: appointment.status,
            reason: appointment.notes || "Không có lý do",
            symptoms: appointment.notes || "Không có chi tiết",
            createdAt: appointment.createdAt
          };
        });
        
        setConsultantAppointments(transformedAppointments);
        console.log("Transformed appointments:", transformedAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Không thể tải danh sách cuộc hẹn. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  // Helper function to get time based on slot number
  const getTimeBySlot = (slot) => {
    const slotTimes = {
      0: "08:00",
      1: "10:00",
      2: "13:00",
      3: "15:00",
      4: "17:00",
    };
    return slotTimes[slot] || "Unknown";
  };

  // Helper function to get service type based on serviceId
  const getServiceType = (serviceId) => {
    // Placeholder - in a real app you'd have a mapping of service IDs to names
    if (serviceId?.includes("sti")) return "Xét nghiệm STI";
    if (serviceId?.includes("ultrasound")) return "Siêu âm";
    if (serviceId?.includes("checkup")) return "Khám định kỳ";
    return "Tư vấn";
  };

  // Filter appointments based on selected filter
  const filteredAppointments = 
    filter === "all"
      ? consultantAppointments
      : filter === "upcoming"
      ? consultantAppointments.filter((app) => app.status === "scheduled")
      : consultantAppointments.filter((app) => app.status === "completed" || app.status === "cancelled");

  const getStatusClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return "Đã hẹn";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Function to handle customer detail button click
  const handleViewCustomerDetail = async (customerId, appointmentId) => {
    setIsLoadingDetail(true);
    setDetailError(null);
    setSelectedCustomer(customerId);
    setShowCustomerDetail(true);

    try {
      // Fetch customer profile
      const userResponse = await userService.getUserById(customerId);
      setCustomerDetail(userResponse);
      console.log("Customer profile data:", userResponse);

      // Fetch test results for this customer
      try {
        setIsLoadingDetail(true);
        
        // Fetch all test results 
        const testsResponse = await testResultService.getAll();
        console.log("All test results:", testsResponse);
        
        // Extract the data array from the response
        const allTestResults = testsResponse.data || [];
        console.log("Extracted test results:", allTestResults);
        
        // Filter test results by customerId
        const filteredTests = allTestResults.filter(test => test.customerId === customerId);
        console.log("Filtered test results for customer:", filteredTests);

        // Process test results for display
        const processedTests = filteredTests.map(test => {
          // Extract test type from resultData (e.g., "HIV test: Negative" -> "HIV")
          const testTypeFull = test.resultData.split(':')[0] || '';
          const testType = testTypeFull.replace(' test', '').trim();
          
          // Determine result status
          let resultStatus = 'pending';
          if (test.resultData) {
            if (test.resultData.toLowerCase().includes('negative')) {
              resultStatus = 'negative';
            } else if (test.resultData.toLowerCase().includes('positive')) {
              resultStatus = 'positive'; 
            }
          }
          
          return {
            id: test.stiTestingId,
            testType: testType,
            resultData: test.resultData,
            result: resultStatus,
            status: test.status,
            examinedAt: test.examinedAt,
            sentAt: test.sentAt,
            examiner: test.staff?.name || 'Không có thông tin'
          };
        });
        
        setCustomerTests(processedTests);
        
      } catch (error) {
        console.error("Error fetching test results:", error);
        setDetailError("Không thể tải kết quả xét nghiệm.");
      } finally {
        setIsLoadingDetail(false);
      }
    } catch (err) {
      console.error("Error fetching customer details:", err);
      setDetailError("Không thể tải thông tin chi tiết khách hàng. Vui lòng thử lại.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Function to close the popup
  const closeCustomerDetail = () => {
    setShowCustomerDetail(false);
    setCustomerDetail(null);
    setCustomerTests([]);
    setSelectedCustomer(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Lịch hẹn của bạn
        </h2>
      </div>

      {/* Tab Navigation - Updated to match AppointmentsTab style */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setFilter("all")}
            className={`${
              filter === "all"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`${
              filter === "upcoming"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Sắp tới
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`${
              filter === "completed"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Hoàn thành
          </button>
        </nav>
      </div>

      {/* Show loading state */}
      {isLoading && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-500">Đang tải dữ liệu lịch hẹn...</p>
        </div>
      )}

      {/* Show error message if any */}
      {!isLoading && error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center mb-4">
          <p className="text-red-700">{error}</p>
          <button
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            onClick={() => {
              setIsLoading(true);
              setError(null);
              // Re-fetch appointments
              appointmentService
                .getByConsultant(userId)
                .then((response) => {
                  const formattedAppointments = (response.data || []).map(
                    (appointment) => ({
                      id: appointment.id,
                      customerName: appointment.customer?.name || "Unknown",
                      date: appointment.appointmentDate,
                      time: getTimeBySlot(appointment.slot),
                      type: getServiceType(appointment.serviceId),
                      status: statusMap[appointment.status] || "unknown",
                      phone: appointment.customer?.phoneNumber || "No phone",
                      symptoms: appointment.notes || "No symptoms recorded",
                      testResults:
                        appointment.serviceId?.includes("sti") &&
                        appointment.status !== 1
                          ? "Đang chờ kết quả"
                          : null,
                    })
                  );

                  setConsultantAppointments(formattedAppointments);
                  setIsLoading(false);
                })
                .catch((err) => {
                  console.error("Error re-fetching appointments:", err);
                  setError("Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.");
                  setIsLoading(false);
                });
            }}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Show message if no appointments */}
      {!isLoading && !error && filteredAppointments.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">
            {filter === "all"
              ? "Bạn chưa có lịch hẹn nào."
              : filter === "upcoming"
              ? "Không có lịch hẹn sắp tới."
              : "Không có lịch hẹn đã hoàn thành hoặc đã hủy."}
          </p>
        </div>
      )}

      {/* Show appointments table if available */}
      {!isLoading && !error && filteredAppointments.length > 0 && (
        <div className="overflow-hidden bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Khách hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày & Giờ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Loại hẹn
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.customerName}
                        <div className="text-sm text-gray-500">
                          {appointment.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.date}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.type}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {appointment.symptoms}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {getStatusText(appointment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {appointment.status === "scheduled" && (
                      <>
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          Bắt đầu khám
                        </button>
                      </>
                    )}
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() =>
                        handleViewCustomerDetail(appointment.customerId, appointment.id)
                      }
                    >
                      Chi tiết
                    </button>
                    {appointment.type && appointment.type.includes("Xét nghiệm") && (
                      <button className="text-purple-600 hover:text-purple-900">
                        {appointment.testResults
                          ? "Xem kết quả"
                          : "Cập nhật kết quả"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Detail Popup */}
      {showCustomerDetail && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-gray-300 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Thông tin chi tiết khách hàng
              </h3>
              <button
                onClick={closeCustomerDetail}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-4">
              {isLoadingDetail && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-500">Đang tải thông tin chi tiết...</p>
                </div>
              )}

              {detailError && (
                <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">
                  {detailError}
                </div>
              )}

              {!isLoadingDetail && customerDetail && (
                <div>
                  {/* Customer Profile Section */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Hồ sơ cá nhân
                    </h4>
                    <div className="flex items-start mb-4">
                      {/* Customer Avatar */}
                      <div className="mr-4">
                        {customerDetail.avatarUrl ? (
                          <img 
                            src={customerDetail.avatarUrl} 
                            alt={`${customerDetail.name}`}
                            className="h-32 w-32 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                            }}
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center border border-gray-200">
                            <span className="text-indigo-600 text-xl font-medium">
                              {customerDetail.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                        <p className="mt-1">{customerDetail.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1">{customerDetail.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                        <p className="mt-1">{customerDetail.phoneNumber || 'Không có'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                        <p className="mt-1">{customerDetail.address || 'Không có'}</p>
                      </div>
                      {customerDetail.dateOfBirth && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                          <p className="mt-1">{new Date(customerDetail.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                        </div>
                      )}
                      {customerDetail.gender && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Giới tính</p>
                          <p className="mt-1">
                            {customerDetail.gender === 'male' ? 'Nam' : 
                             customerDetail.gender === 'female' ? 'Nữ' : 'Khác'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* STI Testing Results Section */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Kết quả xét nghiệm ({customerTests.length})
                    </h4>

                    {customerTests.length === 0 ? (
                      <div className="bg-gray-50 p-4 text-center rounded-lg">
                        <p className="text-gray-500">Khách hàng chưa có kết quả xét nghiệm nào.</p>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày xét nghiệm
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Loại xét nghiệm
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kết quả
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Người xác nhận
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {customerTests.map(test => (
                              <tr key={test.id}>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  {test.examinedAt ? new Date(test.examinedAt).toLocaleDateString('vi-VN') : 'Không có thông tin'}
                                </td>
                                <td className="px-4 py-3">
                                  {test.testType}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    test.result === 'positive' ? 'bg-red-100 text-red-800' : 
                                    test.result === 'negative' ? 'bg-green-100 text-green-800' : 
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {test.result === 'positive' ? 'Dương tính' : 
                                     test.result === 'negative' ? 'Âm tính' : 
                                     'Đang chờ kết quả'}
                                  </span>
                                  <p className="text-xs text-gray-500 mt-1">{test.resultData}</p>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {test.examiner}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <button
                onClick={closeCustomerDetail}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// PropTypes remain the same
ConsultantAppointmentsTab.propTypes = {
  role: PropTypes.string.isRequired,
};

export default ConsultantAppointmentsTab;
