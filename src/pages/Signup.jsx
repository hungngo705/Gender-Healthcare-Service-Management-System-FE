import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import authService from "../services/authService";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.address ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      // Error will be shown via toast
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      // Error will be shown via toast
      return;
    }

    setIsRegistering(true);
    try {
      await authService.register(formData);
      // Registration successful, navigate to login
      navigate("/login");
    } catch {
      // Error toast is handled by the axios interceptor
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-4">
      <motion.div
        className="flex w-full max-w-4xl h-[650px] bg-white rounded-2xl overflow-hidden shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left side - Signup form */}
        <motion.div
          className="w-1/2 p-12 flex flex-col justify-center"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.7,
          }}
        >
          <motion.h2
            className="text-2xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Tạo Tài Khoản
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <input
                type="text"
                name="name"
                placeholder="Họ và Tên"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </motion.div>{" "}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <input
                type="email"
                name="email"
                placeholder="Địa Chỉ Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Số Điện Thoại"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full p-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.57 }}
            >
              <input
                type="text"
                name="address"
                placeholder="Địa Chỉ"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <input
                type="password"
                name="password"
                placeholder="Mật Khẩu"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </motion.div>{" "}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác Nhận Mật Khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </motion.div>
            <motion.button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: isRegistering ? 1 : 1.03 }}
              whileTap={{ scale: isRegistering ? 1 : 0.98 }}
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  ĐANG ĐĂNG KÝ...
                </>
              ) : (
                <>
                  ĐĂNG KÝ
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </motion.button>
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="text-gray-600">Đã có tài khoản?</span>{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Đăng Nhập
              </Link>
            </motion.div>
          </form>
        </motion.div>

        {/* Right side - Gradient background */}
        <motion.div
          className="w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 p-12 flex flex-col text-white relative"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.7,
          }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center mb-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex space-x-[-8px]">
              <div className="w-10 h-10 border-2 border-white rounded-full"></div>
              <div className="w-10 h-10 border-2 border-white rounded-full"></div>
            </div>
            <span className="ml-4 text-xl font-bold">GenderCare</span>
          </motion.div>

          {/* Content */}
          <motion.div
            className="mb-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold mb-4">Tham Gia Ngay Hôm Nay</h1>
            <p className="mb-8">
              Tạo tài khoản và bắt đầu hành trình chăm sóc sức khỏe của bạn
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Kế hoạch chăm sóc sức khỏe cá nhân hóa
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Truy cập hồ sơ y tế của bạn bất kỳ lúc nào
              </li>
            </ul>
          </motion.div>

          {/* Decorative circles */}
          <motion.div
            className="absolute right-12 bottom-32 w-24 h-24 rounded-full bg-blue-400 opacity-50"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          ></motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Signup;
