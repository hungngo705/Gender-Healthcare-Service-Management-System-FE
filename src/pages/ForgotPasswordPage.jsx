import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, Loader } from "lucide-react";
import authService from "../services/authService";
import toastService from "../utils/toastService";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toastService.error("Vui lòng nhập địa chỉ email của bạn");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the forgot password API
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      toastService.error(
        error.response?.data?.message ||
          "Không thể gửi email khôi phục mật khẩu. Vui lòng thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="/src/assets/logo.svg"
              alt="Logo"
              className="h-12 mx-auto mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Quên mật khẩu</h1>
          <p className="mt-2 text-gray-600">
            Nhập email của bạn để nhận mã đặt lại mật khẩu
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-8">
          {isSubmitted ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 bg-blue-50 text-blue-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  Kiểm tra email của bạn
                </h3>
                <p>
                  Chúng tôi đã gửi mã đặt lại mật khẩu đến email{" "}
                  <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến của
                  bạn và làm theo hướng dẫn.
                </p>
              </div>

              <Link
                to="/reset-password"
                className="w-full inline-flex justify-center items-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <span>Tiếp tục đặt lại mật khẩu</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <div className="mt-4">
                <Link
                  to="/login"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Quay lại trang đăng nhập
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="name@example.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Gửi mã đặt lại"
                  )}
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Quay lại trang đăng nhập
                </Link>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
