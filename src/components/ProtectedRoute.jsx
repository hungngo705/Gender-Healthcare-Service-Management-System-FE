import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";

function ProtectedRoute({ isLoggedIn, children }) {
  const { isAuthenticated } = useAuth();

  // Use provided isLoggedIn prop or fall back to context's isAuthenticated
  const isUserLoggedIn =
    isLoggedIn !== undefined ? isLoggedIn : isAuthenticated;

  if (!isUserLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
}

ProtectedRoute.propTypes = {
  isLoggedIn: PropTypes.bool,
  children: PropTypes.node,
};

export default ProtectedRoute;
