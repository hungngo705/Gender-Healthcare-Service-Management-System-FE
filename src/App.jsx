import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // Đây là trạng thái đơn giản để kiểm tra xem người dùng đã đăng nhập hay chưa
  // Trong thực tế, bạn sẽ sử dụng Context API hoặc Redux để quản lý trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/signup" element={<Signup />} />

      {/* Các trang công khai có thể xem mà không cần đăng nhập */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="blog" element={<Blog />} />
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
  );
}

export default App;
