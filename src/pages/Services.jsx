import React, { useRef } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useServices } from "../hooks/useServices";
import serviceFaqs from "../data/serviceFaqs";

function Services() {
  const { loading, error } = useServices();

  // Refs for scrolling to featured services
  const cycleTrackingRef = useRef(null);
  const onlineConsultationsRef = useRef(null);
  const stiTestingRef = useRef(null);

  // Function to scroll to a specific service
  const scrollToService = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Dịch Vụ Y Tế Của Chúng Tôi
            </h1>
            <div className="flex items-center justify-center space-x-2 mt-8">
              <div
                className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <p className="mt-4 text-lg text-gray-600">
              Đang tải dịch vụ...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Dịch Vụ Y Tế Của Chúng Tôi
            </h1>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md max-w-2xl mx-auto">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Thử Lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use mock services if API data is not available

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl"
          >
            Dịch Vụ Y Tế Của Chúng Tôi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto mt-5 text-xl text-white"
          >
            Dịch vụ chăm sóc sức khỏe nhạy cảm với giới tính được thiết kế với
            sự riêng tư, tôn trọng và phù hợp với nhu cầu sức khỏe sinh sản độc đáo của bạn.
          </motion.p>

          {/* Quick navigation buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              onClick={() => scrollToService(cycleTrackingRef)}
              className="px-5 py-2 bg-white text-indigo-600 rounded-full font-medium hover:bg-opacity-90 transition-all flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Theo Dõi Chu Kỳ
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              onClick={() => scrollToService(onlineConsultationsRef)}
              className="px-5 py-2 bg-white text-indigo-600 rounded-full font-medium hover:bg-opacity-90 transition-all flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Tư Vấn Trực Tuyến
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              onClick={() => scrollToService(stiTestingRef)}
              className="px-5 py-2 bg-white text-indigo-600 rounded-full font-medium hover:bg-opacity-90 transition-all flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Xét Nghiệm STI
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">    
        {/* Featured Service: Cycle Tracking */}
        <div
          ref={cycleTrackingRef}
          className="mt-16 bg-indigo-900 text-white rounded-2xl overflow-hidden shadow-xl scroll-mt-24"
        >
          <div className="grid md:grid-cols-2">
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&q=80"
                alt="Theo Dõi Chu Kỳ"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">
                Dịch Vụ Theo Dõi Chu Kỳ
              </h2>
              <p className="mb-6">
                Dịch vụ theo dõi chu kỳ tiên tiến của chúng tôi giúp bạn theo dõi chu kỳ kinh nguyệt, 
                dự đoán thời kỳ rụng trứng và thiết lập nhắc nhở về biện pháp tránh thai và kiểm tra sức khỏe.
              </p>
              <ul className="mb-8 space-y-2">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-indigo-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>{" "}
                  <span>
                    Dự đoán cá nhân hóa dựa trên chu kỳ độc đáo của bạn
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-indigo-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Nhắc nhở về thuốc và lịch hẹn</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-indigo-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Thông tin sức khỏe dựa trên lịch sử theo dõi của bạn</span>
                </li>
              </ul>{" "}
              <Link
                to="/services/tracking"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-white hover:bg-indigo-50 transition-colors self-start"
              >
                Theo Dõi Chu Kỳ
                <svg
                  className="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* NEW: Online Consultations Featured Service */}
        <div
          ref={onlineConsultationsRef}
          className="mt-16 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl overflow-hidden shadow-xl scroll-mt-24"
        >
          <div className="grid md:grid-cols-2">
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1587614387466-0a72ca909e16?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&q=80"
                alt="Tư Vấn Trực Tuyến"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">Tư Vấn Trực Tuyến</h2>
              <p className="mb-6">
                Kết nối với các chuyên gia y tế từ sự thoải mái của ngôi nhà bạn
                thông qua các buổi tư vấn video bảo mật để nhận lời khuyên và chăm sóc cá nhân hóa.
              </p>
              <ul className="mb-8 space-y-2">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-blue-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Tư vấn video riêng tư với các chuyên gia có giấy phép
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-blue-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Thảo luận các vấn đề sức khỏe nhạy cảm một cách riêng tư</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-blue-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Nhận đơn thuốc và kế hoạch chăm sóc tiếp theo</span>
                </li>
              </ul>
              <Link
                to="/services/booking"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-white hover:bg-indigo-50 transition-colors self-start"
              >
                Đặt Lịch Tư Vấn
                <svg
                  className="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* STI Testing Featured Service - Updated with ref */}
        <div
          ref={stiTestingRef}
          className="mt-16 bg-gradient-to-r from-purple-800 to-indigo-900 text-white rounded-2xl overflow-hidden shadow-xl scroll-mt-24"
        >
          <div className="grid md:grid-cols-2">
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&q=80"
                alt="Xét Nghiệm STI"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">
                Xét Nghiệm STI Bảo Mật
              </h2>
              <p className="mb-6">
                Dịch vụ xét nghiệm STI của chúng tôi cung cấp xét nghiệm bảo mật, 
                gửi kết quả an toàn và các tùy chọn điều trị toàn diện nếu cần.
              </p>
              <ul className="mb-8 space-y-2">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-purple-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Hoàn toàn riêng tư trong suốt quá trình xét nghiệm</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-purple-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Nhận kết quả bảo mật qua hệ thống trực tuyến</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-purple-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Tùy chọn điều trị và chăm sóc tiếp theo</span>
                </li>
              </ul>
              <Link
                to="/services/sti-testing"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-white hover:bg-indigo-50 transition-colors self-start"
              >
                Đặt Lịch Xét Nghiệm STI
                <svg
                  className="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section - remains unchanged */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="max-w-3xl mx-auto">
            {serviceFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-4"
              >
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action - remains unchanged */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sẵn Sàng Kiểm Soát Sức Khỏe Sinh Sản Của Bạn?
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-8">
            Bắt đầu theo dõi chu kỳ, đặt lịch tư vấn với các chuyên gia y tế của chúng tôi,
            hoặc đặt lịch xét nghiệm STI ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/services/booking"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Đặt Lịch Hẹn
            </Link>
            <Link
              to="/services/tracking"
              className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
            >
              Theo Dõi Chu Kỳ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
