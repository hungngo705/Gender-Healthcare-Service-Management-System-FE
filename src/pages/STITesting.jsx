import React, { useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function STITesting() {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-100 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center text-sm">
          <Link to="/" className="text-gray-600 hover:text-indigo-600">
            Trang chủ
          </Link>
          <svg
            className="h-4 w-4 mx-2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <Link to="/services" className="text-gray-600 hover:text-indigo-600">
            Dịch vụ
          </Link>
          <svg
            className="h-4 w-4 mx-2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-indigo-600 font-medium">Xét Nghiệm STI</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4 sm:text-5xl">
              Dịch Vụ Xét Nghiệm STI Bảo Mật
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Kiểm soát sức khỏe tình dục của bạn với các dịch vụ xét nghiệm và 
              điều trị STI riêng tư, không phán xét.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <a
              href="#appointment"
              className="px-6 py-3 bg-white text-indigo-900 rounded-full font-medium hover:bg-opacity-90 transition-all flex items-center"
            >
              Đặt Lịch Hẹn
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#faq"
              className="px-6 py-3 bg-transparent border border-white text-white rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition-all flex items-center"
            >
              Tìm Hiểu Thêm
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Service Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Dịch Vụ Xét Nghiệm STI Của Chúng Tôi
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Tại Sao Chọn Dịch Vụ Xét Nghiệm STI Của Chúng Tôi?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-3 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <span className="font-medium text-gray-900">
                        Hoàn Toàn Bảo Mật
                      </span>
                      <p className="text-gray-600 mt-1">
                        Sự riêng tư của bạn là ưu tiên hàng đầu của chúng tôi. 
                        Tất cả các xét nghiệm và kết quả đều được xử lý với sự bảo mật tuyệt đối.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-3 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <span className="font-medium text-gray-900">
                        Gửi Kết Quả An Toàn
                      </span>
                      <p className="text-gray-600 mt-1">
                        Truy cập kết quả của bạn trực tuyến thông qua cổng thông tin bệnh nhân 
                        bảo mật, đảm bảo sự riêng tư và truy cập nhanh chóng.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-3 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <span className="font-medium text-gray-900">
                        Chăm Sóc Toàn Diện
                      </span>
                      <p className="text-gray-600 mt-1">
                        Nếu xét nghiệm phát hiện nhiễm trùng, các bác sĩ của chúng tôi 
                        có thể kê đơn điều trị và cung cấp dịch vụ chăm sóc tiếp theo.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-purple-50 p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Quy Trình Xét Nghiệm Của Chúng Tôi
                </h3>
                <ol className="space-y-3">
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Đặt lịch hẹn
                      </p>
                      <p className="text-gray-600 mt-1">
                        Đặt lịch trực tuyến hoặc qua điện thoại theo thời gian thuận tiện cho bạn
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Đến phòng khám của chúng tôi
                      </p>
                      <p className="text-gray-600 mt-1">
                        Gặp gỡ các chuyên gia y tế của chúng tôi trong môi trường thoải mái, riêng tư
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Thu thập mẫu
                      </p>
                      <p className="text-gray-600 mt-1">
                        Thu thập mẫu nhanh chóng và dễ dàng bởi các chuyên gia được đào tạo
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Nhận kết quả
                      </p>
                      <p className="text-gray-600 mt-1">
                        Nhận kết quả an toàn trực tuyến trong vòng 2-3 ngày
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                      5
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Điều trị (nếu cần)
                      </p>
                      <p className="text-gray-600 mt-1">
                        Nhận các phương án điều trị và chăm sóc tiếp theo
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testing Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Các Gói Xét Nghiệm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic STI Test */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Xét Nghiệm STI Cơ Bản
                </h3>
                <p className="text-gray-600 mb-4">
                  Xét nghiệm các bệnh nhiễm trùng phổ biến nhất bao gồm chlamydia và lậu.
                </p>
                <div className="mb-4 text-2xl font-bold text-indigo-600">
                  1.800.000đ
                </div>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Xét nghiệm Chlamydia
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Xét nghiệm bệnh lậu
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Có kết quả trong 2-3 ngày
                  </li>
                </ul>
                <a
                  href="#appointment"
                  className="inline-block w-full px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md text-center font-medium hover:bg-indigo-50 transition-colors"
                >
                  Đặt Ngay
                </a>
              </div>
            </div>

            {/* Comprehensive STI Test */}
            <div className="bg-indigo-50 rounded-xl shadow-lg overflow-hidden border-2 border-indigo-500 hover:shadow-xl transition-shadow transform scale-105">
              <div className="absolute inset-x-0 -top-4 flex justify-center">
                <span className="inline-block px-4 py-3 rounded-full bg-indigo-600 text-white text-xs font-semibold uppercase tracking-wider">
                  Phổ Biến Nhất
                </span>
              </div>
              <div className="p-6 pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Xét Nghiệm STI Toàn Diện
                </h3>
                <p className="text-gray-600 mb-4">
                  Gói xét nghiệm đầy đủ cho tất cả các bệnh lây truyền qua đường tình dục phổ biến.
                </p>
                <div className="mb-4 text-2xl font-bold text-indigo-600">
                  3.400.000đ
                </div>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Xét nghiệm tất cả STI phổ biến
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Xét nghiệm HIV & Viêm gan
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Bao gồm tư vấn với bác sĩ
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Kết quả nhanh (1-2 ngày)
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Các phương án điều trị nếu cần
                  </li>
                </ul>
                <a
                  href="#appointment"
                  className="inline-block w-full px-4 py-2 bg-indigo-600 text-white rounded-md text-center font-medium hover:bg-indigo-700 transition-colors"
                >
                  Đặt Ngay
                </a>
              </div>
            </div>

            {/* Targeted Test */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Xét Nghiệm Đích
                </h3>
                <p className="text-gray-600 mb-4">
                  Xét nghiệm cụ thể dựa trên mối quan tâm hoặc tiếp xúc của bạn.
                </p>
                <div className="mb-4 text-2xl font-bold text-indigo-600">
                  2.300.000đ
                </div>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Kế hoạch xét nghiệm tùy chỉnh
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Bao gồm tư vấn ban đầu
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Kết quả trong vòng 2-3 ngày
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Khuyến nghị theo dõi
                  </li>
                </ul>
                <a
                  href="#appointment"
                  className="inline-block w-full px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md text-center font-medium hover:bg-indigo-50 transition-colors"
                >
                  Đặt Ngay
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appointment Booking Form */}
        <motion.div
          id="appointment"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 scroll-mt-24"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Đặt Lịch Xét Nghiệm STI
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
                Đặt Lịch Hẹn Thành Công!
              </h3>
              <p className="text-gray-600 mb-4">
                Lịch hẹn xét nghiệm STI của bạn đã được đặt thành công. 
                Bạn sẽ nhận được email xác nhận trong thời gian ngắn.
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
                      Họ Tên *
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
                      Email *
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
                      <option value="basic">Xét Nghiệm STI Cơ Bản (1.800.000đ)</option>
                      <option value="comprehensive">
                        Xét Nghiệm STI Toàn Diện (3.400.000đ)
                      </option>
                      <option value="targeted">Xét Nghiệm Đích (2.300.000đ)</option>
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
                      Giờ Mong Muốn *
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
                      Ghi Chú Bổ Sung (Tùy chọn)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Bất kỳ mối quan tâm hoặc câu hỏi cụ thể nào bạn muốn thảo luận?"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Thông tin của bạn sẽ được giữ bí mật nghiêm ngặt. Khi gửi biểu mẫu này,
                    bạn đồng ý với{" "}
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
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          id="faq"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 scroll-mt-24"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {/* FAQ Item 1 */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Xét nghiệm STI mất bao lâu?
                  </h3>
                  <p className="text-gray-600">
                    Quá trình xét nghiệm thường mất khoảng 15-20 phút. Phần lớn thời gian này 
                    dành cho thủ tục giấy tờ và tư vấn. Việc thu thập mẫu xét nghiệm diễn ra 
                    nhanh chóng và ít xâm lấn.
                  </p>
                </div>

                {/* FAQ Item 2 */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tôi sẽ nhận kết quả trong bao lâu?
                  </h3>
                  <p className="text-gray-600">
                    Kết quả thường có trong vòng 2-3 ngày đối với các xét nghiệm tiêu chuẩn và 
                    1-2 ngày đối với dịch vụ nhanh. Bạn sẽ nhận được thông báo bảo mật khi 
                    kết quả của bạn đã sẵn sàng để xem trên cổng thông tin bệnh nhân của chúng tôi.
                  </p>
                </div>

                {/* FAQ Item 3 */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Xét nghiệm STI có bảo mật không?
                  </h3>
                  <p className="text-gray-600">
                    Hoàn toàn bảo mật. Chúng tôi rất coi trọng quyền riêng tư của bạn. Tất cả các 
                    xét nghiệm đều hoàn toàn bảo mật, và kết quả của bạn chỉ có thể truy cập được 
                    bởi bạn và nhà cung cấp dịch vụ chăm sóc sức khỏe của bạn. Cổng thông tin trực 
                    tuyến của chúng tôi sử dụng mã hóa để giữ thông tin của bạn an toàn.
                  </p>
                </div>

                {/* FAQ Item 4 */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tôi nên làm gì nếu kết quả xét nghiệm dương tính?
                  </h3>
                  <p className="text-gray-600">
                    Nếu kết quả xét nghiệm của bạn dương tính, đừng hoảng sợ. Nhiều STI có thể 
                    dễ dàng điều trị. Các chuyên gia y tế của chúng tôi sẽ hướng dẫn bạn các 
                    phương pháp điều trị và có thể kê đơn thuốc nếu cần thiết. Chúng tôi cũng 
                    cung cấp dịch vụ tư vấn và hỗ trợ thông báo cho bạn tình nếu được yêu cầu.
                  </p>
                </div>

                {/* FAQ Item 5 */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tôi nên xét nghiệm thường xuyên như thế nào?
                  </h3>
                  <p className="text-gray-600">
                    Tần suất xét nghiệm phụ thuộc vào các yếu tố rủi ro cá nhân của bạn. Nhìn chung, 
                    chúng tôi khuyến nghị xét nghiệm hàng năm cho những người có đời sống tình dục 
                    hoạt động. Tuy nhiên, xét nghiệm thường xuyên hơn (mỗi 3-6 tháng) có thể phù hợp 
                    cho những người có nhiều bạn tình hoặc các yếu tố rủi ro khác. Các nhà cung cấp 
                    dịch vụ chăm sóc sức khỏe của chúng tôi có thể giúp xác định lịch xét nghiệm 
                    phù hợp nhất cho bạn.
                  </p>
                </div>

                {/* FAQ Item 6 */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tôi có cần chuẩn bị gì cho xét nghiệm STI không?
                  </h3>
                  <p className="text-gray-600">
                    Đối với hầu hết các xét nghiệm STI, không cần chuẩn bị đặc biệt. Tuy nhiên, với 
                    một số xét nghiệm nhất định, bạn có thể được khuyên không nên đi tiểu trong 
                    1-2 giờ trước cuộc hẹn. Nếu bạn được lên lịch xét nghiệm máu, bạn có thể ăn và 
                    uống bình thường trước đó. Nhân viên của chúng tôi sẽ cung cấp hướng dẫn cụ thể 
                    nếu cần khi bạn đặt lịch hẹn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-10 px-6 rounded-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Kiểm soát sức khỏe tình dục của bạn ngay hôm nay
            </h2>
            <p className="max-w-2xl mx-auto text-lg mb-6">
              Xét nghiệm STI định kỳ là một phần quan trọng trong việc duy trì sức khỏe tổng thể 
              của bạn. Đặt lịch hẹn bảo mật của bạn ngay bây giờ.
            </p>{" "}
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#appointment"
                className="px-6 py-3 bg-white text-indigo-900 rounded-md font-medium hover:bg-opacity-90 transition-all"
              >
                Đặt Lịch Hẹn
              </a>
              <Link
                to="/contact"
                className="px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Liên Hệ Chúng Tôi
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Xem Tất Cả Dịch Vụ
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default STITesting;