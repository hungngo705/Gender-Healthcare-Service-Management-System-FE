import React, { useState, useEffect } from "react";
import { format, parse, isValid, isSameDay, startOfToday, addDays, eachDayOfInterval } from "date-fns";
import { vi } from "date-fns/locale";
import consultants from "../../data/consultants";

// Import các component con
import ConsultantList from "../../components/booking/ConsultantList";
import DateSelector from "../../components/booking/DateSelector";
import TimeSlotSelector from "../../components/booking/TimeSlotSelector";
import BookingForm from "../../components/booking/BookingForm";
import BookingSuccess from "../../components/booking/BookingSuccess";
import ConsultantDetail from "../../components/booking/ConsultantDetail";

const Booking = () => {
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
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
    
    const dateKey = format(date, "d/M/yyyy");
    const allTimeSlots = [0, 1, 2, 3]; // All possible time slots
    const bookedSlotsForDay = consultant.bookedShifts[dateKey] || [];
    
    // If all slots are booked, return false
    return allTimeSlots.some(slotId => !bookedSlotsForDay.includes(slotId));
  };

  // Cập nhật danh sách ngày có thể đặt khi chọn tư vấn viên
  useEffect(() => {
    if (selectedConsultant) {
      // Generate all dates for the next 2 weeks
      const allDates = generateTwoWeekDates();
      
      // Filter to only include dates with at least one available slot
      const datesWithAvailableSlots = allDates.filter(date => 
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
    const dateKey = format(selectedDate, "d/M/yyyy");
    
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
    return bookedShiftsForDay.includes(slotId) || locallyBookedShifts.includes(slotId);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedConsultant || !selectedTimeSlot) {
      alert("Vui lòng chọn tư vấn viên và ca làm việc");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      // Update locally booked slots
      const dateKey = format(selectedDate, "d/M/yyyy");
      
      setLocalBookedSlots(prev => {
        const updatedSlots = { ...prev };
        
        if (!updatedSlots[selectedConsultant.id]) {
          updatedSlots[selectedConsultant.id] = {};
        }
        
        if (!updatedSlots[selectedConsultant.id][dateKey]) {
          updatedSlots[selectedConsultant.id][dateKey] = [];
        }
        
        updatedSlots[selectedConsultant.id][dateKey].push(selectedTimeSlot.id);
        
        return updatedSlots;
      });
      
      setIsSubmitting(false);
      setBookingSuccess(true);
    }, 1500);
  };

  const resetBooking = () => {
    setBookingSuccess(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      reason: "",
    });
    setSelectedConsultant(null);
    setSelectedTimeSlot(null);
    setSelectedDate(null);
  };

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
              Chọn tư vấn viên chuyên nghiệp và thời gian phù hợp để nhận được dịch vụ tư vấn sức khỏe tốt nhất
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {bookingSuccess ? (
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
                  <h2 className="text-lg font-medium text-gray-900">Chọn Ngày & Giờ</h2>
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
                      Vui lòng chọn tư vấn viên từ danh sách bên trái để xem lịch làm việc
                    </p>
                  </div>
                )}
              </div>

              {/* Phần thông tin đặt lịch */}
              <div>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Chi Tiết Đặt Lịch</h2>
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
                      Vui lòng chọn tư vấn viên và ca làm việc phù hợp để tiếp tục
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hiển thị thông tin chi tiết tư vấn viên */}
        {selectedConsultant && !bookingSuccess && (
          <ConsultantDetail consultant={selectedConsultant} />
        )}
      </div>
    </div>
  );
};

export default Booking;
