import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";

function ProtectedRoute({ isLoggedIn, children, roleRequired }) {
  const { currentUser, isAuthenticated } = useAuth();

  // Use provided isLoggedIn prop or fall back to context's isAuthenticated
  const isUserLoggedIn =
    isLoggedIn !== undefined ? isLoggedIn : isAuthenticated;

  // Check if user is logged in
  if (!isUserLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if role requirement is specified and user has the required role
  if (roleRequired) {
    const userRole = currentUser?.role || "guest";

    // Staff role check (staff, consultant, manager, admin)
    if (roleRequired === "staff") {
      const staffRoles = ["admin", "manager", "consultant", "staff"];
      if (!staffRoles.includes(userRole)) {
        return (
          <Navigate
            to="/unauthorized"
            replace
            state={{
              requiredRole: roleRequired,
              userRole: userRole,
            }}
          />
        );
      }
    }

    // Customer role check
    else if (roleRequired === "customer") {
      const customerRoles = ["customer", "guest"];
      if (!customerRoles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
      }
    }

    // For specific role requirements
    else if (userRole !== roleRequired) {
      return (
        <Navigate
          to="/unauthorized"
          replace
          state={{
            requiredRole: roleRequired,
            userRole: userRole,
          }}
        />
      );
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
