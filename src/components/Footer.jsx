import { NavLink } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Về Chúng Tôi</h3>
            <p className="mb-4">
              Hệ thống Quản lý Dịch vụ Chăm sóc Sức khỏe Giới tính cung cấp các 
              giải pháp chăm sóc sức khỏe toàn diện được thiết kế phù hợp với 
              nhu cầu riêng biệt của từng giới tính.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="hover:text-white transition-colors duration-300"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                className="hover:text-white transition-colors duration-300"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                className="hover:text-white transition-colors duration-300"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/"
                  className="hover:text-white transition-colors duration-300"
                >
                  Trang Chủ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services"
                  className="hover:text-white transition-colors duration-300"
                >
                  Dịch Vụ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="hover:text-white transition-colors duration-300"
                >
                  Giới Thiệu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="hover:text-white transition-colors duration-300"
                >
                  Liên Hệ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blog"
                  className="hover:text-white transition-colors duration-300"
                >
                  Bài Viết
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Dịch Vụ Của Chúng Tôi</h3>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/services/maternal-health"
                  className="hover:text-white transition-colors duration-300"
                >
                  Sức Khỏe Bà Mẹ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services/reproductive-health"
                  className="hover:text-white transition-colors duration-300"
                >
                  Sức Khỏe Sinh Sản
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services/pediatric-care"
                  className="hover:text-white transition-colors duration-300"
                >
                  Chăm Sóc Nhi Khoa
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services/womens-wellness"
                  className="hover:text-white transition-colors duration-300"
                >
                  Sức Khỏe Phụ Nữ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services/mens-wellness"
                  className="hover:text-white transition-colors duration-300"
                >
                  Sức Khỏe Nam Giới
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Liên Hệ Chúng Tôi</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>số 7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="flex-shrink-0" />
                <span>contact@ghsms.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} Hệ thống Quản lý Dịch vụ Chăm sóc Sức khỏe Giới tính.
            Đã đăng ký bản quyền.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <NavLink
                  to="/terms"
                  className="text-sm hover:text-white transition-colors duration-300"
                >
                  Điều Khoản Dịch Vụ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/privacy"
                  className="text-sm hover:text-white transition-colors duration-300"
                >
                  Chính Sách Bảo Mật
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;