import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState({});

  // Tạo các ngày để hiển thị (14 ngày kể từ hôm nay)
  const dateOptions = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  // Danh sách các ca làm việc
  const timeSlots = [
    { id: 0, label: "Ca 1", time: "8:00 - 10:00" },
    { id: 1, label: "Ca 2", time: "10:00 - 12:00" },
    { id: 2, label: "Ca 3", time: "13:00 - 15:00" },
    { id: 3, label: "Ca 4", time: "15:00 - 17:00" },
  ];

  // Khởi tạo dữ liệu ca đã đặt kết hợp với lịch làm việc cố định của tư vấn viên
  useEffect(() => {
    const generateBookedSlots = () => {
      const slots = {};
      
      // Khởi tạo cấu trúc dữ liệu cho các lịch đã đặt
      consultants.forEach(consultant => {
        slots[consultant.id] = {};
        
        // Xử lý cho 14 ngày tới
        for (let i = 0; i < 14; i++) {
          const currentDate = addDays(new Date(), i);
          const dateKey = format(currentDate, "yyyy-MM-dd");
          const dayOfWeek = format(currentDate, "EEEE", { locale: vi }).toLowerCase();
          
          // Tạo mảng rỗng cho ngày này
          slots[consultant.id][dateKey] = [];
          
          // Các ca không làm việc (không có trong availableShifts của ngày) sẽ được đánh dấu là đã đặt
          const availableShifts = consultant.availableShifts[mapDayToEnglish(dayOfWeek)] || [];
          
          // Đánh dấu các ca không có trong lịch làm việc là đã đặt
          for (let shiftId = 0; shiftId < 4; shiftId++) {
            if (!availableShifts.includes(shiftId)) {
              slots[consultant.id][dateKey].push(shiftId);
            }
          }
        }
        
      });
      
      setBookedSlots(slots);
    };
    
    generateBookedSlots();
  }, []);

  // Hàm ánh xạ tên ngày từ tiếng Việt sang tiếng Anh
  const mapDayToEnglish = (vietnameseDay) => {
    const dayMapping = {
      'thứ hai': 'monday',
      'thứ ba': 'tuesday',
      'thứ tư': 'wednesday',
      'thứ năm': 'thursday',
      'thứ sáu': 'friday',
      'thứ bảy': 'saturday',
      'chủ nhật': 'sunday'
    };
    
    return dayMapping[vietnameseDay] || 'monday';
  };

  // Kiểm tra xem ca nào đã được đặt
  const isTimeSlotBooked = (slotId) => {
    if (!selectedConsultant) return false;
    
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    
    if (!bookedSlots[selectedConsultant.id] || !bookedSlots[selectedConsultant.id][dateKey]) {
      return false;
    }
    
    return bookedSlots[selectedConsultant.id][dateKey].includes(slotId);
  };

  const handleConsultantSelect = (consultant) => {
    setSelectedConsultant(consultant);
    setSelectedTimeSlot(null);
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
    
    // Giả lập API call
    setTimeout(() => {
      // Cập nhật trạng thái đã đặt
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      
      setBookedSlots(prev => {
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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Đặt Lịch Tư Vấn</h1>
        <p className="mt-4 text-lg text-gray-600">
          Chọn tư vấn viên và thời gian phù hợp để đặt lịch hẹn tư vấn sức khỏe
        </p>
      </div>

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
                    dateOptions={dateOptions}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                  />

                  {/* Lựa chọn ca làm việc */}
                  <TimeSlotSelector
                    timeSlots={timeSlots}
                    selectedTimeSlot={selectedTimeSlot}
                    onTimeSlotSelect={handleTimeSlotSelect}
                    checkIfBooked={isTimeSlotBooked}
                  />
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
  );
};

export default Booking;