import React, { useState, useEffect } from "react";
import {
  format,
  parse,
  isValid,
  isSameDay,
  startOfToday,
  addDays,
  eachDayOfInterval,
} from "date-fns";
import { vi } from "date-fns/locale";
// Import appointment and user services
import appointmentService from "../../services/appointmentService";
import userService from "../../services/userService";
// Import toast service
import toastService from "../../utils/toastService";

// Import các component con
import ConsultantList from "../../components/booking/ConsultantList";
import DateSelector from "../../components/booking/DateSelector";
import TimeSlotSelector from "../../components/booking/TimeSlotSelector";
import BookingForm from "../../components/booking/BookingForm";
import BookingSuccess from "../../components/booking/BookingSuccess";
import ConsultantDetail from "../../components/booking/ConsultantDetail";

const Booking = () => {
  // Add state for appointments data and loading status
  const [appointments, setAppointments] = useState([]);
  const [allConsultants, setAllConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add a refreshKey state

  // Fetch appointments and consultants data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch all consultants by role
        const consultantsResponse = await userService.getAllByRole(
          "consultant"
        );
        setAllConsultants(consultantsResponse || []);

        // Fetch all appointments - handle empty response gracefully
        try {
          const appointmentsResponse = await appointmentService.getAll();
          // Check if response exists and extract data safely
          if (!appointmentsResponse) {
            setAppointments([]);
          } else {
            // Check the structure and extract the actual array
            setAppointments(
              Array.isArray(appointmentsResponse.data)
                ? appointmentsResponse.data
                : appointmentsResponse.data?.data || []
            );
          }
        } catch (error) {
          if (
            appointmentsResponse.response.data?.details !==
            "No appointments found"
          ) {
            console.error("Failed to fetch appointments:", error);
          }
          // If appointments can't be fetched, set to empty array and continue
          setAppointments([]);
        }

        setLoadError(null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoadError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]); // Modify your useEffect to depend on the refreshKey

  // Transform appointments data to consultant data
  const formatConsultants = () => {
    // Start with all consultants from the API
    const consultantsMap = {};

    // First, initialize all consultants with empty booked shifts
    allConsultants.forEach((consultant) => {
      consultantsMap[consultant.id] = {
        id: consultant.id,
        name: consultant.name || "Unknown",
        specialty: consultant.specialty || "Tư vấn sức khỏe",
        image: consultant.avatarUrl || "",
        rating: 5,
        reviewCount: 0,
        bio:
          consultant.bio || "Chuyên gia tư vấn sức khỏe sinh sản và tình dục.",
        bookedShifts: {},
      };
    });

    // Then add booking information from appointments
    appointments.forEach((appointment) => {
      if (appointment.consultantId && appointment.status !== 2) {
        // Make sure this consultant exists in the map
        if (!consultantsMap[appointment.consultantId]) {
          consultantsMap[appointment.consultantId] = {
            id: appointment.consultantId,
            name: appointment.consultant?.name || "Unknown",
            specialty: appointment.consultant?.specialty || "Tư vấn sức khỏe",
            image: appointment.consultant?.avatarUrl || "",
            rating: 5,
            reviewCount: 0,
            bio: "Chuyên gia tư vấn sức khỏe sinh sản và tình dục.",
            bookedShifts: {},
          };
        }

        // Add booked shifts for this consultant
        const dateKey = appointment.appointmentDate;

        if (!consultantsMap[appointment.consultantId].bookedShifts[dateKey]) {
          consultantsMap[appointment.consultantId].bookedShifts[dateKey] = [];
        }

        consultantsMap[appointment.consultantId].bookedShifts[dateKey].push(
          appointment.slot
        );
      }
    });

    return Object.values(consultantsMap);
  };

  const consultants = formatConsultants();

  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    customerId: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [localBookedSlots, setLocalBookedSlots] = useState({}); // To track newly booked slots in this session

  // Danh sách các ca làm việc
  const timeSlots = [
    { id: 0, label: "Ca 1", time: "8:00 - 10:00" },
    { id: 1, label: "Ca 2", time: "10:00 - 12:00" },
    { id: 2, label: "Ca 3", time: "13:00 - 15:00" },
    { id: 3, label: "Ca 4", time: "15:00 - 17:00" },
  ];

  // Generate dates for the next 2 weeks (14 days)
  const generateTwoWeekDates = () => {
    const today = startOfToday();
    const twoWeeksLater = addDays(today, 13); // 14 days including today

    return eachDayOfInterval({ start: today, end: twoWeeksLater });
  };

  // Check if a date has at least one available time slot
  const hasAvailableTimeSlots = (consultant, date) => {
    if (!consultant) return false;

    const dateKey = format(date, "yyyy-MM-dd");
    const allTimeSlots = [0, 1, 2, 3]; // All possible time slots
    const bookedSlotsForDay = consultant.bookedShifts[dateKey] || [];

    // Check if it's today
    const today = new Date();
    const isToday = isSameDay(date, today);
    const currentHour = today.getHours();

    // Return true if at least one slot is available
    return allTimeSlots.some((slotId) => {
      // If booked, not available
      if (bookedSlotsForDay.includes(slotId)) return false;

      // If today and the time has passed, not available
      if (isToday) {
        const slotStartHours = {
          0: 8,
          1: 10,
          2: 13,
          3: 15,
        };

        if (currentHour >= slotStartHours[slotId]) return false;
      }

      // Otherwise, available
      return true;
    });
  };

  // Cập nhật danh sách ngày có thể đặt khi chọn tư vấn viên
  useEffect(() => {
    if (selectedConsultant) {
      // Generate all dates for the next 2 weeks
      const allDates = generateTwoWeekDates();

      // Filter to only include dates with at least one available slot
      const datesWithAvailableSlots = allDates.filter((date) =>
        hasAvailableTimeSlots(selectedConsultant, date)
      );

      setAvailableDates(datesWithAvailableSlots);

      // Select the first date with available slots if any
      if (datesWithAvailableSlots.length > 0) {
        setSelectedDate(datesWithAvailableSlots[0]);
      } else {
        setSelectedDate(null);
      }

      // Reset selected time slot
      setSelectedTimeSlot(null);
    } else {
      setAvailableDates([]);
      setSelectedDate(null);
    }
  }, [selectedConsultant]);

  // Check if a time slot is booked (unavailable)
  const isTimeSlotBooked = (slotId) => {
    if (!selectedConsultant || !selectedDate) return true;

    // Convert selected date to format for lookup
    const dateKey = format(selectedDate, "yyyy-MM-dd");

    // First check if this is today and the slot time has already passed
    const today = new Date();
    const isToday = isSameDay(selectedDate, today);

    if (isToday) {
      const currentHour = today.getHours();

      // Map slot IDs to their starting hours
      const slotStartHours = {
        0: 8, // 8:00 - 10:00
        1: 10, // 10:00 - 12:00
        2: 13, // 13:00 - 15:00
        3: 15, // 15:00 - 17:00
      };

      // If current hour is >= the slot's start hour, the slot is unavailable
      if (currentHour >= slotStartHours[slotId]) {
        return true; // Slot has already passed for today
      }
    }

    // If this date doesn't exist in bookedShifts, all slots are available
    if (!selectedConsultant.bookedShifts[dateKey]) {
      return false; // No slots booked for this date
    }

    // Check if the slot is in the consultant's bookedShifts for this date
    const bookedShiftsForDay = selectedConsultant.bookedShifts[dateKey] || [];

    // Check locally booked slots in this session
    const locallyBookedShifts =
      localBookedSlots[selectedConsultant.id]?.[dateKey] || [];

    // Slot is unavailable if it's in bookedShifts or localBookedSlots
    return (
      bookedShiftsForDay.includes(slotId) ||
      locallyBookedShifts.includes(slotId)
    );
  };

  const handleConsultantSelect = (consultant) => {
    setSelectedConsultant(consultant);
    // Date and time slot will be set in useEffect
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Update handleSubmit to use the toast service
  const handleSubmit = async (e, appointmentData) => {
    e.preventDefault();

    if (!selectedConsultant || !selectedTimeSlot) {
      toastService.warning("Vui lòng chọn tư vấn viên và ca làm việc");
      return;
    }

    setIsSubmitting(true);

    try {
      // If appointmentData is provided by BookingForm, use it directly
      const dataToSubmit = appointmentData || {
        customerId: formData.customerId, // Use customer ID from form data
        consultantId: selectedConsultant.id,
        serviceId: "c8d9e0f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f", // Default service ID
        appointmentDate: format(selectedDate, "yyyy-MM-dd"),
        slot: selectedTimeSlot.id,
        notes: formData.reason,
        isVirtual: true, // Assuming all bookings are virtual
      };

      console.log("Submitting appointment data:", dataToSubmit);

      // Call API to create appointment
      await appointmentService.create(dataToSubmit);

      // Update local state to reflect the booking
      setLocalBookedSlots((prev) => {
        const updatedSlots = { ...prev };
        const dateKey = dataToSubmit.appointmentDate;

        if (!updatedSlots[selectedConsultant.id]) {
          updatedSlots[selectedConsultant.id] = {};
        }

        if (!updatedSlots[selectedConsultant.id][dateKey]) {
          updatedSlots[selectedConsultant.id][dateKey] = [];
        }

        updatedSlots[selectedConsultant.id][dateKey].push(dataToSubmit.slot);

        return updatedSlots;
      });

      // Show success toast
      toastService.success("Đặt lịch hẹn thành công!");
      setBookingSuccess(true);
    } catch (error) {
      console.error("Failed to create appointment:", error);
      toastService.error("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setBookingSuccess(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      reason: "",
      customerId: null,
    });
    setSelectedConsultant(null);
    setSelectedTimeSlot(null);
    setSelectedDate(null);
    setLocalBookedSlots({}); // Clear locally tracked booked slots

    // Increment the refreshKey to trigger a new API call
    setRefreshKey((prevKey) => prevKey + 1);
  };

  // Update the return section to handle loading status
  return (
    <div className="w-full">
      {/* Banner Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 py-16">
        <div className="absolute inset-0 opacity-30 bg-pattern"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Đặt Lịch Tư Vấn
            </h1>
            <p className="mt-6 text-xl text-white text-opacity-80 max-w-3xl mx-auto">
              Chọn tư vấn viên chuyên nghiệp và thời gian phù hợp để nhận được
              dịch vụ tư vấn sức khỏe tốt nhất
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Show loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu lịch hẹn...</p>
          </div>
        )}

        {/* Show error message */}
        {!isLoading && loadError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{loadError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Show booking interface when data is loaded */}
        {!isLoading &&
          !loadError &&
          (bookingSuccess ? (
            <BookingSuccess onReset={resetBooking} />
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-xl">
              <div className="md:grid md:grid-cols-3">
                {/* Phần chọn tư vấn viên */}
                <ConsultantList
                  consultants={consultants}
                  selectedConsultant={selectedConsultant}
                  onSelectConsultant={handleConsultantSelect}
                />

                {/* Phần chọn ngày và ca */}
                <div className="border-r border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Chọn Ngày & Giờ
                    </h2>
                  </div>
                  {selectedConsultant ? (
                    <div>
                      {/* Lựa chọn ngày */}
                      <DateSelector
                        dateOptions={availableDates}
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                      />

                      {/* Lựa chọn ca làm việc */}
                      {selectedDate && (
                        <TimeSlotSelector
                          timeSlots={timeSlots}
                          selectedTimeSlot={selectedTimeSlot}
                          onTimeSlotSelect={handleTimeSlotSelect}
                          checkIfBooked={isTimeSlotBooked}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Chưa chọn tư vấn viên
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Vui lòng chọn tư vấn viên từ danh sách bên trái để xem
                        lịch làm việc
                      </p>
                    </div>
                  )}
                </div>

                {/* Phần thông tin đặt lịch */}
                <div>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Chi Tiết Đặt Lịch
                    </h2>
                  </div>
                  {selectedConsultant && selectedTimeSlot ? (
                    <BookingForm
                      selectedConsultant={selectedConsultant}
                      selectedDate={selectedDate}
                      selectedTimeSlot={selectedTimeSlot}
                      formData={formData}
                      onInputChange={handleInputChange}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      setFormData={setFormData} // Add this line
                      onBookingSuccess={() => setBookingSuccess(true)} // Add this line
                    />
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Chưa chọn đủ thông tin
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Vui lòng chọn tư vấn viên và ca làm việc phù hợp để tiếp
                        tục
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

        {/* Hiển thị thông tin chi tiết tư vấn viên */}
        {selectedConsultant && !bookingSuccess && !isLoading && !loadError && (
          <ConsultantDetail consultant={selectedConsultant} />
        )}
      </div>
    </div>
  );
};

export default Booking;
