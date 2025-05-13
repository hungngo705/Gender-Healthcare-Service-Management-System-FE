import React from "react";
import { useServices } from "../hooks/useServices";

function Services() {
  const { services, loading, error } = useServices();

  if (loading) {
    return (
      <div className="services-page">
        <div className="container">
          <h2>Our Healthcare Services</h2>
          <div className="loading">Loading services...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-page">
        <div className="container">
          <h2>Our Healthcare Services</h2>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <div className="container">
        <h2>Our Healthcare Services</h2>
        <p className="section-description">
          We provide specialized gender-sensitive healthcare services to ensure
          the best care for all patients.
        </p>

        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <button className="btn-secondary">Learn More</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;
