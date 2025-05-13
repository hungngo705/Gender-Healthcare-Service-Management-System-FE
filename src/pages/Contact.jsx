import React, { useState } from "react";
import { submitContactForm } from "../services/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    submitting: false,
    success: null,
    error: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitStatus({ submitting: true, success: null, error: null });

      // Call the API service
      const response = await submitContactForm(formData);

      setSubmitStatus({
        submitting: false,
        success: response.message,
        error: null,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        submitting: false,
        success: null,
        error: "Failed to submit the form. Please try again.",
      });
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h2>Contact Us</h2>
        <p className="section-description">
          We're here to help. Reach out to us with any questions or concerns.
        </p>

        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-detail">
              <h3>Address</h3>
              <p>123 Healthcare Avenue</p>
              <p>Medical District</p>
              <p>City, State 12345</p>
            </div>

            <div className="contact-detail">
              <h3>Phone</h3>
              <p>Main: (123) 456-7890</p>
              <p>Support: (123) 456-7891</p>
            </div>

            <div className="contact-detail">
              <h3>Email</h3>
              <p>info@genderhealthcare.com</p>
              <p>support@genderhealthcare.com</p>
            </div>

            <div className="contact-detail">
              <h3>Hours</h3>
              <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
              <p>Saturday: 9:00 AM - 5:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          <div className="contact-form">
            <h3>Send Us a Message</h3>

            {submitStatus.success && (
              <div className="success-message">{submitStatus.success}</div>
            )}

            {submitStatus.error && (
              <div className="error-message">{submitStatus.error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={submitStatus.submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={submitStatus.submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={submitStatus.submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  disabled={submitStatus.submitting}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={submitStatus.submitting}
              >
                {submitStatus.submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
