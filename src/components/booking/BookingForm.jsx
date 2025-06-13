import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import authService from "../../services/authService";
import appointmentService from "../../services/appointmentService";
import toastService from "../../utils/toastService";
import PropTypes from 'prop-types';

const BookingForm = ({
  selectedConsultant,
  selectedDate,
  selectedTimeSlot,
  formData = {}, // Add default value here
  onInputChange,
  onSubmit,
  isSubmitting: parentIsSubmitting,
  setFormData,
  onBookingSuccess
}) => {
  // Initialize internal form data with an empty object explicitly
  const [userId, setUserId] = useState(null);
  const [internalFormData, setInternalFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  // Initialize internal form data from props on mount, with safety check
  useEffect(() => {
    if (formData) {
      setInternalFormData(formData);
    }
  }, []);
  
  // Get the user ID and auto-fill user data when component mounts
  useEffect(() => {
    setIsLoadingUser(true);
    
    const fetchUserData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser) {
          // Store userId for API submission
          setUserId(currentUser.id);
          
          // Create user data object with exact property matches from the user object
          const userData = {
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phoneNumber, // Note: using phoneNumber from user object
            customerId: currentUser.id
          };
          
          console.log("Prepared user data for form:", userData);
          
          // Update form data either through prop or internal state
          if (typeof setFormData === 'function') {
            try {
              setFormData(prevData => {
                const newData = {
                  ...(prevData || {}),
                  ...userData
                };
                return newData;
              });
            } catch (error) {
              console.error("Error updating parent form data:", error);
            }
          }
          
          // Always update internal state regardless
          setInternalFormData(prevData => {
            const newData = {
              ...prevData,
              ...userData
            };
            return newData;
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchUserData();
  }, [setFormData]);
  
  // Handle input changes - update both internal state and parent state if available
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Always update internal state to ensure the component works even without parent handlers
    setInternalFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Also call parent's handler if provided
    if (typeof onInputChange === 'function') {
      onInputChange(e);
    }
  };
  
  // Use internal data as primary source, and only use formData if it exists
  const displayFormData = {
    ...internalFormData,  // Base with internal data
    ...(formData || {}),  // Override with parent data if available
  };

  
  // Create a handler that directly calls the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if reason is provided with failsafe
    if (!displayFormData?.reason) {
      toastService.warning("Vui lòng nhập lý do tư vấn");
      return;
    }
    
    // Use parent submission handler if provided
    if (typeof onSubmit === 'function') {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      const appointmentData = {
        customerId: displayFormData?.customerId || userId,
        consultantId: selectedConsultant.id,
        serviceId: "c8d9e0f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f", // Default service ID
        appointmentDate: formattedDate,
        slot: selectedTimeSlot.id,
        notes: displayFormData?.reason || "None"
      };
      
      onSubmit(e, appointmentData);
      return;
    }
    
    // Otherwise handle submission directly
    setIsSubmitting(true);
    
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      // Create API-compatible appointment data
      const appointmentData = {
        customerId: displayFormData.customerId || userId,
        consultantId: selectedConsultant.id,
        serviceId: "c8d9e0f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f", // Default service ID
        appointmentDate: formattedDate,
        slot: selectedTimeSlot.id,
        notes: displayFormData.reason
      };
      
      console.log("Submitting appointment data:", appointmentData);
      
      // Call API to create appointment
      const response = await appointmentService.create(appointmentData);
      
      console.log("API response:", response);
      
      // Show success message
      toastService.success("Đặt lịch hẹn thành công!");
      
      // Notify parent of success if callback provided
      if (typeof onBookingSuccess === 'function') {
        onBookingSuccess(response.data);
      }
      
    } catch (error) {
      console.error("Failed to create appointment:", error);
      toastService.error(
        error.response?.data?.message || 
        "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Use either parent's isSubmitting state or internal one
  const submitting = parentIsSubmitting || isSubmitting;
  
  return (
    
    <div className="px-6 py-4">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin đã chọn</h3>
        <div className="bg-indigo-50 p-4 rounded-md">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0 h-10 w-10">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={selectedConsultant.image}
                alt={selectedConsultant.name}
              />
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900">
                {selectedConsultant.name}
              </div>
              <div className="text-sm text-gray-500">
                {selectedConsultant.specialty}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-2 rounded border border-gray-200">
              <div className="text-gray-500">Ngày</div>
              <div className="font-medium">
                {format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
              </div>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200">
              <div className="text-gray-500">Giờ</div>
              <div className="font-medium">{selectedTimeSlot.time}</div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Display user information as read-only fields */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Thông tin cá nhân</h4>
            
            {isLoadingUser ? (
  <div className="py-2 text-center text-sm text-gray-500">
    <div className="inline-block animate-spin mr-2">⟳</div>
    Đang tải thông tin cá nhân...
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        Họ và tên
      </label>
      <div className="text-sm font-medium text-gray-800 p-2 bg-white border border-gray-100 rounded">
        {displayFormData.name || "Chưa có thông tin"}
      </div>
    </div>
    
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        Số điện thoại
      </label>
      <div className="text-sm font-medium text-gray-800 p-2 bg-white border border-gray-100 rounded">
        {displayFormData.phone || "Chưa có thông tin"}
      </div>
    </div>
  </div>
)}
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Email
              </label>
              <div className="text-sm font-medium text-gray-800 p-2 bg-white border border-gray-100 rounded">
                {displayFormData.email || "Chưa có thông tin"}
              </div>
            </div>
            
          </div>

          {/* Only reason field is editable */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lý do tư vấn *
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              required
              value={displayFormData.reason || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Mô tả ngắn gọn vấn đề bạn muốn tư vấn"
            ></textarea>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={submitting || !displayFormData.reason}
            className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              submitting || !displayFormData.reason ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Xác Nhận Đặt Lịch"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Update PropTypes
BookingForm.propTypes = {
  selectedConsultant: PropTypes.object.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  selectedTimeSlot: PropTypes.object.isRequired,
  formData: PropTypes.object,
  onInputChange: PropTypes.func,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  setFormData: PropTypes.func,
  onBookingSuccess: PropTypes.func
};

BookingForm.defaultProps = {
  formData: {},
  isSubmitting: false
};

export default BookingForm;