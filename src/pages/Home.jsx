import React from "react";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h2>Welcome to Gender Healthcare Service Management System </h2>
        <p>Your comprehensive solution for healthcare service management</p>
        <button className="btn-primary">Get Started</button>
      </div>

      <div className="features-section">
        <h3>Our Features</h3>
        <div className="features-grid" style={{ cursor: "pointer" }}>
          <div className="feature-card">
            <h4>Patient Management</h4>
            <p>Efficiently manage patient records and appointments</p>
          </div>
          <NavLink to="/services" className="feature-card">
            <div className="feature-card">
              <h4>Healthcare Services</h4>
              <p>
                Comprehensive catalog of gender-specific healthcare services
              </p>
            </div>
          </NavLink>
          <div className="feature-card">
            <h4>Resource Management</h4>
            <p>Optimize healthcare resources and staff scheduling</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
