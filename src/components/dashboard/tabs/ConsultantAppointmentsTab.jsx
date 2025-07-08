import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
// Import services
import appointmentService from "../../../services/appointmentService";
import userService from "../../../services/userService";
import testResultService from "../../../services/testResultService";
import feedbackService from "../../../services/feedbackService";
import {
  X,
  Check,
  X as XIcon,
  AlertCircle,
  ChevronDown,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react"; // Added pagination icons
import { te } from "date-fns/locale";

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

  // New state variables for status update
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const confirmationRef = useRef(null);

  // New state variables after your other state declarations
  const [showMeetingLinkModal, setShowMeetingLinkModal] = useState(false);
  const [selectedAppointmentForLink, setSelectedAppointmentForLink] =
    useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [googleMeetLink, setGoogleMeetUrl] = useState("");
  const [isUpdatingLink, setIsUpdatingLink] = useState(false);
  const [linkUpdateError, setLinkUpdateError] = useState(null);
  const [linkUpdateSuccess, setLinkUpdateSuccess] = useState(false);
  const meetingLinkModalRef = useRef(null);

  // Ref for customer detail popup
  const customerDetailRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef({}); // Using object to store multiple button refs

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
            customerName: appointment.customer?.name || "Khách hàng",
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
            createdAt: appointment.createdAt,
            googleMeetLink: appointment.googleMeetLink || "",
          };
        });

        setConsultantAppointments(transformedAppointments);
        console.log("Transformed appointments:", transformedAppointments);

        // Check for feedback on completed appointments
        const completedAppointments = transformedAppointments.filter(
          (appointment) => appointment.status === "completed"
        );

        // Initialize feedback lookup object
        const feedbackLookup = {};

        // Check each completed appointment for feedback
        await Promise.all(
          completedAppointments.map(async (appointment) => {
            try {
              const feedbackResponse = await feedbackService.getByAppointment(
                appointment.id
              );

              if (feedbackResponse && feedbackResponse.data) {
                feedbackLookup[appointment.id] = feedbackResponse.data;
                console.log(
                  `Found feedback for appointment ${appointment.id}:`,
                  feedbackResponse.data
                );
              }
            } catch (error) {
              console.log(
                `No feedback found for appointment ${appointment.id}`
              );
            }
          })
        );

        setAppointmentsWithFeedback(feedbackLookup);
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
      : consultantAppointments.filter(
          (app) => app.status === "completed" || app.status === "cancelled"
        );

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
  // Update the handleViewCustomerDetail function to use the correct API endpoint
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

      // Fetch test results for this customer using proper API endpoint
      try {
        // Call the specific API for customer test results
        const testsResponse = await testResultService.getByCustomerId(
          customerId
        );
        console.log("Test results for customer:", testsResponse);

        if (testsResponse && testsResponse.is_success) {
          // Extract the data array from the response
          const testResults = testsResponse.data || [];

          // Define mappings for parameter and outcome codes using the provided enums
          const parameterMap = {
            0: "Chlamydia",
            1: "Gonorrhoeae (Vi khuẩn lậu cầu)",
            2: "Syphilis (Giang mai)",
            3: "HIV",
            4: "Herpes simplex virus",
            5: "Viêm gan B",
            6: "Viêm gan C",
            7: "Trichomonas vaginalis",
            8: "Mycoplasma genitalium",
            9: "HPV",
          };

          const outcomeMap = {
            0: "Negative (Âm tính)",
            1: "Positive (Dương tính)",
            2: "Pending (Chờ kết quả)",
          };

          // Create status map for styling
          const resultStatusMap = {
            0: "negative",
            1: "positive",
            2: "pending",
          };

          // Process test results for display
          const processedTests = testResults.map((test) => {
            // Get test name from parameter code
            const testType =
              parameterMap[test.parameter] || `Test ${test.parameter}`;

            // Get result text from outcome code
            const outcomeText = outcomeMap[test.outcome] || "Pending";

            // Determine result status for styling
            const resultStatus = resultStatusMap[test.outcome] || "pending";

            return {
              id: test.id,
              testType: testType,
              resultData: outcomeText,
              result: resultStatus,
              stiTestingId: test.stiTestingId,
              scheduleDate: test.scheduleDate,
              examinedAt: test.processedAt || test.scheduleDate,
              sentAt: test.processedAt,
              examiner: test.staff?.name || "Chưa xác nhận",
              comments: test.comments || "Không có ghi chú",
            };
          });

          setCustomerTests(processedTests);
          console.log("Processed test results:", processedTests);
        } else {
          console.warn("API response indicates failure:", testsResponse);
          setDetailError(
            testsResponse?.message || "Không thể tải kết quả xét nghiệm"
          );
        }
      } catch (error) {
        console.error("Error fetching test results:", error);
        setDetailError(
          "Không thể tải kết quả xét nghiệm. Vui lòng thử lại sau."
        );
      }
    } catch (err) {
      console.error("Error fetching customer details:", err);
      setDetailError(
        "Không thể tải thông tin chi tiết khách hàng. Vui lòng thử lại."
      );
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

  // Close popup on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        customerDetailRef.current &&
        !customerDetailRef.current.contains(event.target)
      ) {
        setShowCustomerDetail(false);
      }
    }

    // Add event listener when the popup is shown
    if (showCustomerDetail) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCustomerDetail]);

  // Function to handle status update confirmation
  const handleStatusUpdateConfirm = async () => {
    if (!selectedAppointment || statusToUpdate === null) return;

    setIsUpdatingStatus(true);
    setUpdateError(null);

    try {
      // Create the complete payload required by the API
      const updatePayload = {
        appointmentDate: selectedAppointment.date, // Keep existing date
        slot: selectedAppointment.slotNumber, // Keep existing slot
        status: statusToUpdate, // Update with new status
        notes: selectedAppointment.reason || "", // Keep existing notes
      };

      console.log("Updating appointment with payload:", updatePayload);

      // Call API with complete payload
      await appointmentService.update(selectedAppointment.id, updatePayload);

      // Update local state to reflect the change
      const updatedAppointments = consultantAppointments.map((appointment) => {
        if (appointment.id === selectedAppointment.id) {
          return {
            ...appointment,
            status: statusMap[statusToUpdate] || "unknown",
            statusCode: statusToUpdate,
          };
        }
        return appointment;
      });

      // Update state with new appointments
      setConsultantAppointments(updatedAppointments);

      // Show success notification
      setSuccessMessage(
        statusToUpdate === 1
          ? "Cuộc hẹn đã được đánh dấu là hoàn thành thành công!"
          : "Cuộc hẹn đã được hủy thành công!"
      );
      setShowSuccessNotification(true);

      // Close confirmation dialog
      setShowConfirmation(false);
      setSelectedAppointment(null);
      setStatusToUpdate(null);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setUpdateError(
        "Không thể cập nhật trạng thái cuộc hẹn. Vui lòng thử lại."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Function to handle viewing feedback
  const handleViewFeedback = async (appointmentId) => {
    setLoadingFeedback(true);
    try {
      const feedback = appointmentsWithFeedback[appointmentId];
      setCurrentFeedback(feedback);
      setShowFeedbackModal(true);
    } catch (error) {
      console.error("Error loading feedback details:", error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  // Function to open update status confirmation
  const openStatusUpdateConfirmation = (appointment, newStatus) => {
    setSelectedAppointment(appointment);
    setStatusToUpdate(newStatus);
    setShowConfirmation(true);
  };

  // Handle outside click for confirmation dialog
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        confirmationRef.current &&
        !confirmationRef.current.contains(event.target)
      ) {
        setShowConfirmation(false);
      }
    }

    if (showConfirmation) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConfirmation]);

  // Add state to track open dropdown
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Add this state to track dropdown positioning
  const [dropdownPosition, setDropdownPosition] = useState({});

  // Toggle dropdown visibility
  const toggleDropdown = (appointmentId, event) => {
    // Stop event propagation to prevent document click handler from firing immediately
    if (event) {
      event.stopPropagation();

      // Calculate if we should show dropdown above or below
      if (openDropdownId !== appointmentId) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const shouldFlip = spaceBelow < 150; // If less than 150px below, flip to above

        setDropdownPosition({
          id: appointmentId,
          flip: shouldFlip,
        });
      }
    }
    setOpenDropdownId(openDropdownId === appointmentId ? null : appointmentId);
  };

  // Handle outside click for dropdown menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (openDropdownId !== null) {
        // Get the button that opened the dropdown
        const buttonEl = dropdownButtonRef.current[openDropdownId];

        // If clicking outside both dropdown and button, close the dropdown
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          buttonEl &&
          !buttonEl.contains(event.target)
        ) {
          setOpenDropdownId(null);
        }
      }
    }

    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  // Add state for success notification
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Auto-hide success notification after timeout
  useEffect(() => {
    let timer;
    if (showSuccessNotification) {
      timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000); // Hide after 5 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccessNotification]);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Fixed at 8 items per page

  // Calculate the currently displayed appointments
  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Add these state variable declarations with your other state variables (after line 41)
  const [appointmentsWithFeedback, setAppointmentsWithFeedback] = useState({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const feedbackModalRef = useRef(null);

  // Add these functions before the return statement

  // Function to open the meeting link modal
  const handleOpenMeetingLinkModal = (appointment) => {
    setSelectedAppointmentForLink(appointment);
    setLinkUpdateError(null);
    setLinkUpdateSuccess(false);
    setShowMeetingLinkModal(true);
  };

  // Function to handle meeting link submission
  const handleUpdateMeetingLink = async (e) => {
    e.preventDefault();

    if (!selectedAppointmentForLink) return;

    // Basic URL validation for meetingLink
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (meetingLink && !urlPattern.test(meetingLink)) {
      setLinkUpdateError("Vui lòng nhập đường dẫn hợp lệ (https://...)");
      return;
    }

    // Basic URL validation for googleMeetLink
    if (googleMeetLink && !urlPattern.test(googleMeetLink)) {
      setLinkUpdateError(
        "Vui lòng nhập đường dẫn Google Meet hợp lệ (https://...)"
      );
      return;
    }

    setIsUpdatingLink(true);
    setLinkUpdateError(null);

    try {
      await appointmentService.updateMeetingLink(
        selectedAppointmentForLink.id,
        {
          meetingLink: meetingLink,
          googleMeetLink: googleMeetLink, // Add Google Meet URL to payload
        }
      );

      // Update local state
      const updatedAppointments = consultantAppointments.map((appointment) => {
        if (appointment.id === selectedAppointmentForLink.id) {
          return {
            ...appointment,
            meetingLink: meetingLink,
            googleMeetLink: googleMeetLink, // Update Google Meet URL in local state
          };
        }
        return appointment;
      });

      setConsultantAppointments(updatedAppointments);
      setLinkUpdateSuccess(true);

      // Close modal after success
      setTimeout(() => {
        setShowMeetingLinkModal(false);
        setSelectedAppointmentForLink(null);
        setMeetingLink("");
        setGoogleMeetUrl(""); // Reset Google Meet URL
        setLinkUpdateSuccess(false);

        // Show success notification
        setSuccessMessage("Liên kết cuộc họp đã được cập nhật thành công!");
        setShowSuccessNotification(true);
      }, 1500);
    } catch (error) {
      console.error("Error updating meeting link:", error);
      setLinkUpdateError(
        "Không thể cập nhật liên kết cuộc họp. Vui lòng thử lại sau."
      );
    } finally {
      setIsUpdatingLink(false);
    }
  };

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        meetingLinkModalRef.current &&
        !meetingLinkModalRef.current.contains(event.target)
      ) {
        setShowMeetingLinkModal(false);
      }
    }

    if (showMeetingLinkModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMeetingLinkModal]);

  return (
    <div>
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-md w-full bg-white shadow-lg rounded-lg border-l-4 border-green-500 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">
                  Cập nhật thành công
                </p>
                <p className="mt-1 text-sm text-gray-500">{successMessage}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => setShowSuccessNotification(false)}
                  className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  setError(
                    "Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau."
                  );
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
        <div>
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
                {currentAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
                      <div className="flex flex-col items-end gap-2">
                        {/* View customer details button */}
                        <button
                          className="inline-flex items-center px-3.5 py-1.5 rounded-md text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all duration-200"
                          onClick={() =>
                            handleViewCustomerDetail(
                              appointment.customerId,
                              appointment.id
                            )
                          }
                        >
                          Chi tiết
                        </button>

                        {/* Add feedback button for completed appointments */}
                        {appointment.status === "completed" &&
                          appointmentsWithFeedback[appointment.id] && (
                            <button
                              className="inline-flex items-center px-3.5 py-1.5 rounded-md text-amber-600 hover:text-amber-900 hover:bg-amber-50 border border-transparent hover:border-amber-100 transition-all duration-200"
                              onClick={() => handleViewFeedback(appointment.id)}
                            >
                              <Star className="mr-1 h-4 w-4" />
                              Xem đánh giá
                            </button>
                          )}

                        {/* Add this new button for scheduled appointments */}
                        {appointment.status === "scheduled" && (
                          <button
                            className="mt-2 inline-flex items-center px-3.5 py-1.5 rounded-md text-blue-600 hover:text-blue-900 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all duration-200"
                            onClick={() =>
                              handleOpenMeetingLinkModal(appointment)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1.5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {appointment.googleMeetLink
                              ? "Xem liên kết họp"
                              : "Chưa có liên kết"}
                          </button>
                        )}

                        {/* Status update dropdown - only show for scheduled appointments */}
                        {appointment.status === "scheduled" && (
                          <div className="relative w-50%">
                            <button
                              ref={(el) =>
                                (dropdownButtonRef.current[appointment.id] = el)
                              }
                              className="inline-flex justify-center items-center w-full rounded-md border border-gray-200 px-3.5 py-1.5 bg-white text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                              onClick={(e) => toggleDropdown(appointment.id, e)}
                              aria-expanded={openDropdownId === appointment.id}
                              aria-haspopup="true"
                            >
                              Đổi trạng thái
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </button>

                            {/* Dropdown menu */}
                            {openDropdownId === appointment.id && (
                              <div
                                ref={dropdownRef}
                                className={`absolute ${
                                  dropdownPosition.id === appointment.id &&
                                  dropdownPosition.flip
                                    ? "bottom-full mb-1" // Position above button
                                    : "top-full mt-1" // Position below button
                                } right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-40`}
                                role="menu"
                                aria-orientation="vertical"
                              >
                                <div className="py-1 divide-y divide-gray-100">
                                  <button
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                                    onClick={() => {
                                      openStatusUpdateConfirmation(
                                        appointment,
                                        1
                                      );
                                      setOpenDropdownId(null);
                                    }}
                                    role="menuitem"
                                  >
                                    <Check size={16} className="mr-2" />
                                    Hoàn thành
                                  </button>
                                  <button
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                    onClick={() => {
                                      openStatusUpdateConfirmation(
                                        appointment,
                                        2
                                      );
                                      setOpenDropdownId(null);
                                    }}
                                    role="menuitem"
                                  >
                                    <XIcon size={16} className="mr-2" />
                                    Hủy
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* View test results button - if applicable */}
                        {appointment.type &&
                          appointment.type.includes("Xét nghiệm") && (
                            <button className="inline-flex items-center px-3.5 py-1.5 rounded-md text-purple-600 hover:text-purple-900 hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all duration-200">
                              {appointment.testResults
                                ? "Xem kết quả"
                                : "Cập nhật kết quả"}
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow-md">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Trước
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị{" "}
                    <span className="font-medium">
                      {indexOfFirstAppointment + 1}
                    </span>{" "}
                    đến{" "}
                    <span className="font-medium">
                      {Math.min(
                        indexOfLastAppointment,
                        filteredAppointments.length
                      )}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="font-medium">
                      {filteredAppointments.length}
                    </span>{" "}
                    cuộc hẹn
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 ${
                        currentPage === 1
                          ? "cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === index + 1
                            ? "bg-indigo-600 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 ${
                        currentPage === totalPages
                          ? "cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Customer Detail Popup */}
      {showCustomerDetail && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
          <div
            ref={customerDetailRef}
            className="bg-white rounded-lg border border-gray-300 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
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
                  <p className="text-gray-500">
                    Đang tải thông tin chi tiết...
                  </p>
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
                              e.target.src =
                                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
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
                        <p className="text-sm font-medium text-gray-500">
                          Họ và tên
                        </p>
                        <p className="mt-1">{customerDetail.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="mt-1">{customerDetail.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Số điện thoại
                        </p>
                        <p className="mt-1">
                          {customerDetail.phoneNumber || "Không có"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Địa chỉ
                        </p>
                        <p className="mt-1">
                          {customerDetail.address || "Không có"}
                        </p>
                      </div>
                      {customerDetail.dateOfBirth && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Ngày sinh
                          </p>
                          <p className="mt-1">
                            {new Date(
                              customerDetail.dateOfBirth
                            ).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      )}
                      {customerDetail.gender && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Giới tính
                          </p>
                          <p className="mt-1">
                            {customerDetail.gender === "male"
                              ? "Nam"
                              : customerDetail.gender === "female"
                              ? "Nữ"
                              : "Khác"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* STI Testing Results Section - Updated to show more details */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Kết quả xét nghiệm ({customerTests.length})
                    </h4>

                    {customerTests.length === 0 ? (
                      <div className="bg-gray-50 p-4 text-center rounded-lg">
                        <p className="text-gray-500">
                          Khách hàng chưa có kết quả xét nghiệm nào.
                        </p>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Ngày xét nghiệm
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Loại xét nghiệm
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Kết quả
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Người xử lý
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Ghi chú
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {customerTests.map((test) => (
                              <tr
                                key={test.id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-4 py-3 whitespace-nowrap">
                                  {test.scheduleDate || "N/A"}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="font-medium">
                                    {test.testType}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      test.result === "positive"
                                        ? "bg-red-100 text-red-800"
                                        : test.result === "negative"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {test.result === "positive"
                                      ? "Dương tính"
                                      : test.result === "negative"
                                      ? "Âm tính"
                                      : "Đang chờ kết quả"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                  {test.examiner}
                                  {test.sentAt && (
                                    <div className="text-xs text-gray-400">
                                      {new Date(test.sentAt).toLocaleString()}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                  {test.comments}
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

      {/* Status Update Confirmation Dialog */}
      {showConfirmation && selectedAppointment && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div
            ref={confirmationRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="text-center mb-5">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-3">
                {statusToUpdate === 1
                  ? "Xác nhận hoàn thành cuộc hẹn"
                  : "Xác nhận hủy cuộc hẹn"}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {statusToUpdate === 1
                    ? "Bạn có chắc chắn muốn đánh dấu cuộc hẹn này là đã hoàn thành không?"
                    : "Bạn có chắc chắn muốn hủy cuộc hẹn này không?"}
                </p>
                <p className="mt-2 font-medium">
                  Cuộc hẹn: {selectedAppointment.customerName} -{" "}
                  {selectedAppointment.date} {selectedAppointment.time}
                </p>
              </div>

              {updateError && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
                  {updateError}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-5">
              <button
                type="button"
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowConfirmation(false)}
                disabled={isUpdatingStatus}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  statusToUpdate === 1
                    ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                }`}
                onClick={handleStatusUpdateConfirm}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? (
                  <>
                    <span className="inline-block mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Đang xử lý...
                  </>
                ) : statusToUpdate === 1 ? (
                  "Xác nhận hoàn thành"
                ) : (
                  "Xác nhận hủy"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Feedback Modal */}
      {showFeedbackModal && currentFeedback && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
          <div
            ref={feedbackModalRef}
            className="bg-white rounded-lg border border-gray-300 shadow-2xl max-w-lg w-full"
          >
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Đánh giá từ khách hàng
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {loadingFeedback ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-500">Đang tải đánh giá...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Rating */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Đánh giá
                    </h4>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= currentFeedback.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-700">
                        {currentFeedback.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Nhận xét
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md text-gray-700">
                      {currentFeedback.comment || "Không có nhận xét"}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Thời gian đánh giá
                    </h4>
                    <p className="text-gray-700">
                      {new Date(currentFeedback.createdAt).toLocaleString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Link Modal */}
      {showMeetingLinkModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
          <div
            ref={meetingLinkModalRef}
            className="bg-white rounded-lg border border-gray-300 shadow-2xl max-w-lg w-full"
          >
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Liên kết cuộc họp Google Meet
              </h3>
              <button
                onClick={() => setShowMeetingLinkModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {linkUpdateSuccess ? (
                <div className="rounded-md bg-green-50 p-4 mb-4 flex items-center justify-center">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle
                        className="h-6 w-6 text-green-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-green-800">
                        Liên kết cuộc họp đã được sao chép vào clipboard!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <div className="mb-4">
                      <label
                        htmlFor="appointmentInfo"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Thông tin cuộc hẹn
                      </label>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">Khách hàng:</span>{" "}
                          {selectedAppointmentForLink?.customerName}
                        </p>
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">Ngày hẹn:</span>{" "}
                          {selectedAppointmentForLink?.date}
                        </p>
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">Giờ:</span>{" "}
                          {selectedAppointmentForLink?.time}
                        </p>
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">Loại hẹn:</span>{" "}
                          {selectedAppointmentForLink?.type}
                        </p>
                      </div>
                    </div>

                    {/* Google Meet Link Display - Read-only */}
                    <div className="mt-4">
                      <label
                        htmlFor="googleMeetLink"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Liên kết Google Meet (tự động tạo)
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="googleMeetLink"
                          name="googleMeetLink"
                          className="shadow-sm bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2"
                          value={
                            selectedAppointmentForLink?.googleMeetLink ||
                            "Liên kết chưa được tạo"
                          }
                          readOnly
                        />
                        <button
                          type="button"
                          className="ml-2 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                          onClick={() => {
                            if (selectedAppointmentForLink?.googleMeetLink) {
                              navigator.clipboard.writeText(
                                selectedAppointmentForLink.googleMeetLink
                              );
                              setLinkUpdateSuccess(true);
                              setTimeout(
                                () => setLinkUpdateSuccess(false),
                                2000
                              );
                            }
                          }}
                          disabled={!selectedAppointmentForLink?.googleMeetLink}
                        >
                          <svg
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          Sao chép
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Liên kết Google Meet được tạo tự động cho cuộc hẹn này.
                      </p>
                    </div>
                  </div>

                  {linkUpdateError && (
                    <div className="rounded-md bg-red-50 p-3 border border-red-200">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          />
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800">
                            {linkUpdateError}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 mt-5 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowMeetingLinkModal(false)}
                      className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Đóng
                    </button>
                    {selectedAppointmentForLink?.googleMeetLink && (
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() =>
                          window.open(
                            selectedAppointmentForLink.googleMeetLink,
                            "_blank"
                          )
                        }
                      >
                        <svg
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Tham gia cuộc họp
                      </button>
                    )}
                  </div>
                </div>
              )}
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
