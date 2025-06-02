import React, { useState } from "react";
import { Link } from "react-router-dom";

function BookingForm() {
  // State for appointment form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    testType: "comprehensive",
    notes: "",
  });
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [submitError, setSubmitError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Here you would typically make an API call to submit the form data
      // For now, we'll just simulate a successful submission
      setSubmitSuccess(true);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div id="appointment" className="mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Đặt Lịch Hẹn Xét Nghiệm STI
      </h2>

      {submitSuccess ? (
        <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <svg
            className="h-12 w-12 text-green-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Lịch Hẹn Đã Được Đặt!
          </h3>
          <p className="text-gray-600 mb-4">
            Lịch hẹn xét nghiệm STI của bạn đã được đặt thành công. Bạn sẽ nhận được email xác nhận trong thời gian ngắn.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Đặt Lịch Hẹn Khác
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ Và Tên *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Địa Chỉ Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số Điện Thoại *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="testType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Loại Xét Nghiệm *
                </label>
                <select
                  id="testType"
                  name="testType"
                  required
                  value={formData.testType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="basic">Xét Nghiệm STI Cơ Bản (79$)</option>
                  <option value="comprehensive">
                    Xét Nghiệm STI Toàn Diện (149$)
                  </option>
                  <option value="targeted">Xét Nghiệm Mục Tiêu (99$)</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ngày Mong Muốn *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thời Gian Mong Muốn *
                </label>
                <select
                  id="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Chọn thời gian</option>
                  <option value="9:00 AM">9:00 Sáng</option>
                  <option value="10:00 AM">10:00 Sáng</option>
                  <option value="11:00 AM">11:00 Sáng</option>
                  <option value="1:00 PM">1:00 Chiều</option>
                  <option value="2:00 PM">2:00 Chiều</option>
                  <option value="3:00 PM">3:00 Chiều</option>
                  <option value="4:00 PM">4:00 Chiều</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ghi Chú Bổ Sung (Không Bắt Buộc)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Bạn có bất kỳ mối quan ngại hoặc câu hỏi cụ thể nào muốn thảo luận không?"
                ></textarea>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-4">
                Thông tin của bạn sẽ được giữ bí mật nghiêm ngặt. Bằng cách gửi mẫu đơn này, bạn đồng ý với{" "}
                <Link
                  to="/privacy-policy"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  chính sách bảo mật
                </Link>
                {" "}của chúng tôi.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
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
                  "Đặt Lịch Hẹn"
                )}
              </button>
            </div>

            {submitError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {submitError}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default BookingForm;