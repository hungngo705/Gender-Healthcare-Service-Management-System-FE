import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Unauthorized() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isStaffOrHigher } = useAuth();
  const { requiredRole, userRole } = location.state || {
    requiredRole: "staff",
    userRole: "guest",
  };

  // Customize message based on roles
  const getMessage = () => {
    if (requiredRole === "staff" && userRole === "customer") {
      return "Bạn đang sử dụng tài khoản khách hàng. Bạn cần có quyền nhân viên hoặc cao hơn để truy cập vào trang này.";
    } else if (requiredRole === "customer" && isStaffOrHigher()) {
      return "Với vai trò nhân viên, bạn chỉ có quyền truy cập vào Dashboard.";
    } else {
      return `Bạn không có quyền truy cập vào trang này. Bạn cần có quyền ${
        requiredRole === "staff" ? "nhân viên hoặc cao hơn" : requiredRole
      } để truy cập.`;
    }
  };

  // Get the redirection link based on role
  const getRedirectLink = () => {
    if (isStaffOrHigher()) {
      return "/dashboard";
    } else {
      return "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Không có quyền truy cập
        </h1>
        <p className="text-gray-600 mb-6">
          {getMessage()}
          {userRole !== "guest" && (
            <span>
              {" "}
              Quyền hiện tại của bạn là{" "}
              <span className="font-semibold">{userRole}</span>.
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại
          </button>
          <Link
            to={getRedirectLink()}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {isStaffOrHigher() ? "Đến Dashboard" : "Trang chủ"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
