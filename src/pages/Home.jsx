import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

// Import data từ các file riêng biệt
import {
  services,
  consultants,
  testimonials,
  blogData,
  bannerSlides,
} from "../data";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  // Auto slide change
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) =>
      prev === bannerSlides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) =>
      prev === 0 ? bannerSlides.length - 1 : prev - 1
    );
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Animated Banner */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Slide navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-10 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-all"
          aria-label="Slide trước"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-10 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-all"
          aria-label="Slide tiếp theo"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50"
              } transition-all duration-300`}
              aria-label={`Chuyển đến slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slides */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('${bannerSlides[currentSlide].image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-lg">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-medium text-indigo-300 leading-tight"
                  >
                    {bannerSlides[currentSlide].subtitle}
                  </motion.h2>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl mt-2 mb-4 font-bold text-white leading-tight"
                  >
                    {bannerSlides[currentSlide].title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg mb-8 text-white/90"
                  >
                    {bannerSlides[currentSlide].description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      to={bannerSlides[currentSlide].buttonLink}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 text-lg rounded-md cursor-pointer transition-all duration-300 hover:shadow-lg flex items-center inline-flex"
                    >
                      {bannerSlides[currentSlide].buttonText}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-3">
                Dịch Vụ Y Tế
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Dịch Vụ Chuyên Biệt Của Chúng Tôi
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Chăm sóc sức khỏe toàn diện được điều chỉnh phù hợp với nhu cầu 
                sức khỏe sinh sản và tình dục của bạn
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -12,
                  boxShadow:
                    "0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.1)",
                }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-50 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-5 min-h-[80px]">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <Link
                    to={service.link}
                    className="group inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                  >
                    Tìm Hiểu Thêm
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                  <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {service.category || "Sức Khỏe"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-xl"
            >
              Xem Tất Cả Dịch Vụ
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
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
          </motion.div>
        </div>
      </section>

      {/* Featured Consultants Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Gặp Gỡ Đội Ngũ Tư Vấn
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các chuyên gia y tế giàu kinh nghiệm cam kết cung cấp dịch vụ 
              chăm sóc chất lượng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {consultants.map((consultant) => (
              <motion.div
                key={consultant.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={consultant.image}
                  alt={consultant.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {consultant.name}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-2">
                    {consultant.specialty}
                  </p>
                  <div className="flex items-center mb-3">
                    <div className="text-yellow-400 mr-1">
                      {"★".repeat(Math.floor(consultant.rating))}
                      {"☆".repeat(5 - Math.floor(consultant.rating))}
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({consultant.reviewCount} đánh giá)
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{consultant.bio}</p>
                  <Link
                    to={`/consultants/${consultant.id}`}
                    className="inline-block w-full text-center py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition duration-300"
                  >
                    Xem Hồ Sơ
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/consultants"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Xem Tất Cả Tư Vấn Viên
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tính Năng Nổi Bật
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các công cụ sáng tạo hỗ trợ hành trình sức khỏe sinh sản và tình dục của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-100 shadow-sm"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-purple-200 text-purple-700 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Theo Dõi Chu Kỳ
              </h3>
              <p className="text-gray-600 mb-6">
                Theo dõi chu kỳ kinh nguyệt, nhận dự đoán về thời kỳ rụng trứng,
                cửa sổ sinh sản và thiết lập nhắc nhở về biện pháp tránh thai.
                Thuật toán thông minh của chúng tôi thích ứng với chu kỳ độc đáo của bạn.
              </p>
              <Link
                to="/services/tracking"
                className="inline-flex items-center text-purple-700 font-medium hover:text-purple-900"
              >
                Thử công cụ theo dõi
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100 shadow-sm"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-blue-200 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Tư Vấn Trực Tuyến
              </h3>
              <p className="text-gray-600 mb-6">
                Lên lịch tư vấn video riêng tư với các chuyên gia y tế của chúng tôi
                để được tư vấn cá nhân hóa về sức khỏe sinh sản, giáo dục giới tính,
                và bất kỳ mối quan tâm nào bạn có thể có.
              </p>
              <Link
                to="/consultations"
                className="inline-flex items-center text-blue-700 font-medium hover:text-blue-900"
              >
                Đặt lịch tư vấn
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-8 border border-pink-100 shadow-sm"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-pink-200 text-pink-700 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Dịch Vụ Xét Nghiệm STI
              </h3>
              <p className="text-gray-600 mb-6">
                Đặt các xét nghiệm STI bảo mật, đặt lịch hẹn tại các phòng khám gần đó,
                và nhận kết quả của bạn một cách an toàn thông qua nền tảng của chúng tôi,
                với các tùy chọn chăm sóc tiếp theo nếu cần.
              </p>
              <Link
                to="/services/sti-testing"
                className="inline-flex items-center text-pink-700 font-medium hover:text-pink-900"
              >
                Tìm hiểu về xét nghiệm
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Khách Hàng Nói Gì Về Chúng Tôi</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Đọc về trải nghiệm của những người đã sử dụng dịch vụ của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-xl"
                whileHover={{ y: -5 }}
              >
                <div className="mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(testimonial.rating)}
                    {"☆".repeat(5 - testimonial.rating)}
                  </div>
                </div>
                <p className="mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-medium">{testimonial.name}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Posts Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bài Viết Mới Nhất
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các bài viết giáo dục về sức khỏe sinh sản và tình dục
              với các chủ đề quan trọng đối với bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogData.sort((a, b) => new Date(b.date) - new Date(a.date)) //sort for newsest
            .slice(0,3)
            .map((post) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
                whileHover={{ y: -8 }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span>Bởi {post.author}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span
                      className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md"
                    >
                      {post.categoryName}
                    </span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
                  >
                    Đọc Thêm
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Ghé Thăm Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Kiểm Soát Sức Khỏe Sinh Sản Của Bạn Ngay Hôm Nay
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Bắt đầu theo dõi chu kỳ của bạn, đặt lịch tư vấn với các chuyên gia y tế,
            hoặc lên lịch xét nghiệm STI để chăm sóc sức khỏe sinh sản toàn diện.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/appointment"
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition duration-300"
            >
              Đặt Lịch Hẹn
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              to="/services/tracking"
              className="inline-flex items-center bg-white border-2 border-indigo-600 text-indigo-600 font-medium px-6 py-3 rounded-lg hover:bg-indigo-50 transition duration-300"
            >
              Thử Công Cụ Theo Dõi
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;