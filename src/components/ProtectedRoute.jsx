import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
