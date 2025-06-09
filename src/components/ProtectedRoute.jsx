import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";
import userUtils from "../utils/userUtils";
import { useState, useEffect } from "react";
import serverHealth from "../utils/serverHealth";

// Helper function to extract role name from role object
const extractRoleName = (roleObj) => {
  if (typeof roleObj === "string") {
    return roleObj.toLowerCase();
  }
  if (roleObj && typeof roleObj === "object") {
    return (roleObj.name || roleObj.role || roleObj.type || "").toLowerCase();
  }
  return "";
};

// Helper function to convert user role data to array
const normalizeUserRoles = (userRoleData) => {
  if (Array.isArray(userRoleData)) {
    return userRoleData.map(extractRoleName).filter(Boolean);
  }
  if (typeof userRoleData === "string") {
    return [userRoleData.toLowerCase()];
  }
  if (userRoleData && typeof userRoleData === "object") {
    const roleName = extractRoleName(userRoleData);
    return roleName ? [roleName] : ["guest"];
  }
  return ["guest"];
};

// Helper function to check dashboard role access
const checkDashboardAccess = (userRoles, requiredRoles, userRoleData) => {
  const dashboardRoles = ["admin", "manager", "staff", "consultant"];
  const isRequiringDashboardAccess = requiredRoles.some((role) =>
    dashboardRoles.includes(role)
  );

  if (!isRequiringDashboardAccess) return null;

  const hasDashboardRole = userRoles.some((role) =>
    dashboardRoles.includes(role)
  );

  console.log("Dashboard access check:", { hasDashboardRole, userRoles });

  if (!hasDashboardRole) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          requiredRole: requiredRoles.join(","),
          userRole: userUtils.formatRole(userRoleData),
        }}
      />
    );
  }
  return "granted";
};

// Helper function to check customer role access
const checkCustomerAccess = (userRoles, requiredRoles, userRoleData) => {
  if (!requiredRoles.includes("customer")) return null;

  const customerRoles = ["customer", "guest"];
  const hasCustomerRole = userRoles.some((role) =>
    customerRoles.includes(role)
  );

  if (!hasCustomerRole) {
    console.log(
      "User does not have customer role, redirecting to unauthorized"
    );
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          requiredRole: requiredRoles.join(","),
          userRole: userUtils.formatRole(userRoleData),
        }}
      />
    );
  }
  return "granted";
};

// Helper function to check specific role access
const checkSpecificRoleAccess = (userRoles, requiredRoles, userRoleData) => {
  const hasRequiredRole = userRoles.some((role) =>
    requiredRoles.includes(role)
  );

  if (!hasRequiredRole) {
    console.log(
      "User does not have required role, redirecting to unauthorized"
    );
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          requiredRole: requiredRoles.join(","),
          userRole: userUtils.formatRole(userRoleData),
        }}
      />
    );
  }
  return "granted";
};

function ProtectedRoute({ isLoggedIn, children, roleRequired }) {
  const { currentUser, isAuthenticated, validateTokenSync } = useAuth();
  const [isValidating, setIsValidating] = useState(false);

  // Use provided isLoggedIn prop or fall back to context's isAuthenticated
  const isUserLoggedIn =
    isLoggedIn !== undefined ? isLoggedIn : isAuthenticated;

  // For basic sync validation (backwards compatibility)
  const isTokenValidSync = validateTokenSync();

  // Enhanced validation with server check for critical routes
  useEffect(() => {
    const performEnhancedValidation = async () => {
      if (roleRequired && currentUser && isTokenValidSync) {
        setIsValidating(true);

        // Check server connectivity for critical protected routes
        const isServerUp = await serverHealth.checkServerConnectivity();
        if (!isServerUp) {
          console.log(
            "Server appears to be down, using local token validation"
          );
        }

        setIsValidating(false);
      }
    };

    performEnhancedValidation();
  }, [currentUser, roleRequired, isTokenValidSync]);

  // Check if user is logged in and token is valid
  if (!isUserLoggedIn || !isTokenValidSync) {
    console.log(
      "User not authenticated or token invalid, redirecting to login"
    );
    return <Navigate to="/login" replace />;
  }

  // Show loading while validating for critical routes
  if (isValidating) {
    return <div>Validating access...</div>;
  }

  // Check if role requirement is specified and user has the required role
  if (roleRequired) {
    const userRoleData = userUtils.getUserRole(currentUser);
    const userRoles = normalizeUserRoles(userRoleData);
    const requiredRoles = roleRequired
      .split(",")
      .map((role) => role.trim().toLowerCase());

    // Log for debugging
    console.log("ProtectedRoute check:", {
      userRoles,
      requiredRoles,
      currentUser: currentUser?.email || "no user",
    });

    // Check dashboard access
    const dashboardResult = checkDashboardAccess(
      userRoles,
      requiredRoles,
      userRoleData
    );
    if (dashboardResult && dashboardResult !== "granted") {
      return dashboardResult;
    }

    // Check customer access
    const customerResult = checkCustomerAccess(
      userRoles,
      requiredRoles,
      userRoleData
    );
    if (customerResult && customerResult !== "granted") {
      return customerResult;
    }

    // Check specific role access if not dashboard or customer
    if (!dashboardResult && !customerResult) {
      const specificResult = checkSpecificRoleAccess(
        userRoles,
        requiredRoles,
        userRoleData
      );
      if (specificResult && specificResult !== "granted") {
        return specificResult;
      }
    }
  }

  console.log("ProtectedRoute: Access granted");
  return children || <Outlet />;
}

ProtectedRoute.propTypes = {
  isLoggedIn: PropTypes.bool,
  children: PropTypes.node,
  roleRequired: PropTypes.string,
};

export default ProtectedRoute;
