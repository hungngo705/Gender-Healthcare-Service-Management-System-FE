import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load all page components with named chunks for better debugging
const Login = lazy(() =>
  import(/* webpackChunkName: "login" */ "./pages/Login")
);
const Signup = lazy(() =>
  import(/* webpackChunkName: "signup" */ "./pages/Signup")
);
const Home = lazy(() => import(/* webpackChunkName: "home" */ "./pages/Home"));
const Services = lazy(() =>
  import(/* webpackChunkName: "services" */ "./pages/Services")
);
const About = lazy(() =>
  import(/* webpackChunkName: "about" */ "./pages/About")
);
const Contact = lazy(() =>
  import(/* webpackChunkName: "contact" */ "./pages/Contact")
);
const Blog = lazy(() => import(/* webpackChunkName: "blog" */ "./pages/Blog"));
const BlogDetail = lazy(() =>
  import(/* webpackChunkName: "blog-detail" */ "./pages/BlogDetail")
);

function App() {
  // Đây là trạng thái đơn giản để kiểm tra xem người dùng đã đăng nhập hay chưa
  // Trong thực tế, bạn sẽ sử dụng Context API hoặc Redux để quản lý trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Auth routes */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/signup" element={<Signup />} />

        {/* Các trang công khai có thể xem mà không cần đăng nhập */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogDetail />} />
        </Route>

        {/* Các trang yêu cầu đăng nhập */}
        <Route
          path="/protected"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<div>Profile Page</div>} />
          <Route path="appointments" element={<div>Appointments Page</div>} />
          <Route path="medical-records" element={<div>Medical Records</div>} />
        </Route>

        {/* Redirect không hợp lệ URLs về trang chính */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
