import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import authService from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Clear any existing auth state when login component mounts
  React.useEffect(() => {
    const clearExistingAuth = () => {
      // Check if there's existing auth data that might be stale
      const existingToken = localStorage.getItem("access_token");
      const existingUser = localStorage.getItem("user");

      if (existingToken || existingUser) {
        console.log("Clearing existing auth state on login page");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("token_expiration");
      }
    };

    clearExistingAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      // Error will be shown via toast
      return;
    }

    setIsLoggingIn(true);

    try {
      // Clear any stale auth data before attempting login
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("token_expiration");

      // First login to get user data without redirect
      const userData = await authService.login(email, password);

      // Update auth context with user data
      const loginSuccess = login(userData);
      if (loginSuccess) {
        // Get user role for redirect decision
        const role = authService.getUserRole();
        console.log("Login - Role extracted:", role);
        console.log("Login - User data:", userData);

        const redirectPath = authService.getRedirectPath(role);
        console.log("Login - Redirect path:", redirectPath);

        // For admin users, force redirect to dashboard
        if (role && role.toLowerCase() === "admin") {
          console.log("Admin detected, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
        } else {
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      // Ensure auth state is clean on login failure
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("token_expiration");
      // Error toast is handled by the axios interceptor
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-4">
      <motion.div
        className="flex w-full max-w-4xl h-[500px] bg-white rounded-2xl overflow-hidden shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Bên trái - Nền gradient */}
        <motion.div
          className="relative flex flex-col flex-1 bg-gradient-to-br from-blue-600 to-purple-600 p-10 text-white"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.7,
          }}
        >
          {/* Logo */}
          <div className="mb-auto">
            <motion.div
              className="flex items-center mb-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 border-2 border-white rounded-full mr-[-8px]"></div>
              <div className="w-10 h-10 border-2 border-white rounded-full"></div>
              <span className="ml-4 text-lg font-bold">GenderCare</span>
            </motion.div>
          </div>

          {/* Văn bản chào mừng */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-4">Chào Mừng Trở Lại</h1>
            <p className="opacity-90">
              Đăng nhập vào tài khoản chăm sóc sức khỏe của bạn
            </p>
          </motion.div>

          <motion.div
            className="mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-lg font-bold mb-2">Tính năng chính</p>
            <ul className="space-y-2">
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
                Chăm sóc sức khỏe giới tính chuyên biệt
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
                Riêng tư và bảo mật
              </li>
            </ul>
          </motion.div>

          {/* Hình trang trí */}
          <motion.div
            className="absolute w-24 h-24 rounded-full bg-cyan-400/50 top-1/3 left-2/3"
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
          <motion.div
            className="absolute w-16 h-16 rounded-full bg-pink-500/70 bottom-1/4 left-1/3"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          ></motion.div>
        </motion.div>

        {/* Bên phải - Biểu mẫu đăng nhập */}
        <motion.div
          className="flex-1 p-10 flex flex-col justify-center"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.7,
          }}
        >
          {" "}
          <motion.h2
            className="text-2xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Đăng Nhập
          </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="email"
                placeholder="Địa Chỉ Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <input
                type="password"
                placeholder="Mật Khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </motion.div>{" "}
            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
              >
                Quên Mật Khẩu?
              </button>
            </motion.div>{" "}
            <motion.button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: isLoggingIn ? 1 : 1.03 }}
              whileTap={{ scale: isLoggingIn ? 1 : 0.98 }}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
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
                  ĐANG ĐĂNG NHẬP...
                </>
              ) : (
                <>
                  TIẾP TỤC
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
          </form>
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="text-gray-600">Chưa có tài khoản?</span>{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Tạo Tài Khoản
            </Link>
          </motion.div>
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/" className="text-blue-600 hover:underline">
              Tiếp tục mà không cần đăng nhập
            </Link>
          </motion.div>{" "}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
