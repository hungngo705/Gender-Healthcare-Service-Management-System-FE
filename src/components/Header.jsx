import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";

function Header() {
  return (
    <header className="app-header">
      <div className="container">
        <NavLink to="/">
          <img
            src={logo}
            alt="Logo"
            style={{ height: "62px", cursor: "pointer" }}
          />
        </NavLink>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Blog"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Blogs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Login
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
