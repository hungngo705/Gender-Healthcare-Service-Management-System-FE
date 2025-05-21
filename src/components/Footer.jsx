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
            <h3 className="text-white text-lg font-bold mb-4">About Us</h3>
            <p className="mb-4">
              Gender Healthcare Service Management System provides comprehensive
              healthcare solutions tailored for gender-specific needs.
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
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/"
                  className="hover:text-white transition-colors duration-300"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services"
                  className="hover:text-white transition-colors duration-300"
                >
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="hover:text-white transition-colors duration-300"
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="hover:text-white transition-colors duration-300"
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blog"
                  className="hover:text-white transition-colors duration-300"
                >
                  Blog
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/services/maternal-health"
                  className="hover:text-white transition-colors duration-300"
                >
                  Maternal Health
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services/reproductive-health"
                  className="hover:text-white transition-colors duration-300"
                >
                  Reproductive Health
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services/pediatric-care"
                  className="hover:text-white transition-colors duration-300"
                >
                  Pediatric Care
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services/womens-wellness"
                  className="hover:text-white transition-colors duration-300"
                >
                  Women's Wellness
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services/mens-wellness"
                  className="hover:text-white transition-colors duration-300"
                >
                  Men's Wellness
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>123 Healthcare Avenue, Medical District, City</span>
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
            &copy; {new Date().getFullYear()} Gender Healthcare Service
            Management System. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <NavLink
                  to="/terms"
                  className="text-sm hover:text-white transition-colors duration-300"
                >
                  Terms of Service
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/privacy"
                  className="text-sm hover:text-white transition-colors duration-300"
                >
                  Privacy Policy
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
