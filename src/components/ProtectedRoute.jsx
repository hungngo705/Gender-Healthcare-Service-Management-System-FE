import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";
import userUtils from "../utils/userUtils";

function ProtectedRoute({ isLoggedIn, children, roleRequired }) {
  const { currentUser, isAuthenticated } = useAuth();

  // Use provided isLoggedIn prop or fall back to context's isAuthenticated
  const isUserLoggedIn =
    isLoggedIn !== undefined ? isLoggedIn : isAuthenticated;

  // Check if user is logged in
  if (!isUserLoggedIn) {
    return <Navigate to="/login" replace />;
  } // Check if role requirement is specified and user has the required role
  if (roleRequired) {
    const userRoleData = userUtils.getUserRole(currentUser);
    let userRoles = [];

    // Chuyển đổi userRoleData thành mảng để dễ kiểm tra
    if (Array.isArray(userRoleData)) {
      // Nếu đã là mảng thì giữ nguyên
      userRoles = userRoleData.map((r) =>
        typeof r === "string"
          ? r.toLowerCase()
          : r.name
          ? r.name.toLowerCase()
          : r.role
          ? r.role.toLowerCase()
          : ""
      );
    } else if (typeof userRoleData === "string") {
      // Nếu là chuỗi thì chuyển thành mảng một phần tử
      userRoles = [userRoleData.toLowerCase()];
    } else if (userRoleData && typeof userRoleData === "object") {
      // Nếu là đối tượng, trích xuất tên vai trò
      const roleName =
        userRoleData.name || userRoleData.role || userRoleData.type;
      if (roleName) {
        userRoles = [roleName.toLowerCase()];
      }
    }

    // Thêm 'guest' nếu không có vai trò nào
    if (userRoles.length === 0) {
      userRoles = ["guest"];
    } // Chuyển đổi roleRequired thành mảng (phân tách bằng dấu phẩy)
    const requiredRoles = roleRequired
      .split(",")
      .map((role) => role.trim().toLowerCase()); // Kiểm tra xem đường dẫn yêu cầu vai trò cụ thể không
    // Thêm các vai trò đặc biệt theo yêu cầu (staff, admin, manager, consultant)
    const dashboardRoles = ["admin", "manager", "staff", "consultant"];
    const isRequiringDashboardAccess = requiredRoles.some((role) =>
      dashboardRoles.includes(role)
    );

    if (isRequiringDashboardAccess) {
      // Kiểm tra xem người dùng có bất kỳ vai trò nhân viên nào không
      const hasDashboardRole = userRoles.some((role) =>
        dashboardRoles.includes(role)
      );

      // Xác định vai trò chính xác của người dùng cho Dashboard
      const userDashboardRole =
        userRoles.find((role) => dashboardRoles.includes(role)) || "staff";

      // Ghi nhận vai trò đã xác định để debug
      console.log("Dashboard access with role:", userDashboardRole);

      if (!hasDashboardRole) {
        return (
          <Navigate
            to="/unauthorized"
            replace
            state={{
              requiredRole: roleRequired,
              userRole: userUtils.formatRole(userRoleData),
            }}
          />
        );
      }
    } // Kiểm tra vai trò khách hàng
    else if (requiredRoles.includes("customer")) {
      const customerRoles = ["customer", "guest"];
      // Kiểm tra xem người dùng có vai trò customer hay guest không
      const hasCustomerRole = userRoles.some((role) =>
        customerRoles.includes(role)
      );

      if (!hasCustomerRole) {
        // Nếu không phải customer/guest, chuyển hướng đến unauthorized
        return (
          <Navigate
            to="/unauthorized"
            replace
            state={{
              requiredRole: roleRequired,
              userRole: userUtils.formatRole(userRoleData),
            }}
          />
        );
      }
    }

    // Kiểm tra các vai trò cụ thể (admin, manager, consultant, etc.)
    else {
      // Kiểm tra xem người dùng có ít nhất một trong các vai trò yêu cầu không
      const hasRequiredRole = userRoles.some((role) =>
        requiredRoles.includes(role)
      );

      if (!hasRequiredRole) {
        return (
          <Navigate
            to="/unauthorized"
            replace
            state={{
              requiredRole: roleRequired,
              userRole: userUtils.formatRole(userRoleData),
            }}
          />
        );
      }
    }
  }

  return children || <Outlet />;
}

ProtectedRoute.propTypes = {
  isLoggedIn: PropTypes.bool,
  children: PropTypes.node,
  roleRequired: PropTypes.string,
};

export default ProtectedRoute;
