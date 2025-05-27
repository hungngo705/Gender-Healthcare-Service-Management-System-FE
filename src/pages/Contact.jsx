import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation of form submission
    setSubmitStatus({
      submitted: true,
      success: true,
      message:
        "Thank you! We've received your message and will get back to you as soon as possible.",
    });

    // In production, you'd send the form data to your backend here
    console.log(formData);

    // Reset form after successful submission
    setTimeout(() => {
      if (submitStatus.success) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    }, 500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            >
              Contact Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl max-w-3xl mx-auto"
            >
              We're here to listen and support you. Reach out to us through any
              of the methods below or fill out our contact form.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: <MapPin className="h-8 w-8 text-indigo-600" />,
              title: "Address",
              info: ["123 Healthcare Avenue", "New York, NY 10001"],
            },
            {
              icon: <Phone className="h-8 w-8 text-indigo-600" />,
              title: "Phone",
              info: ["(123) 456-7890", "(987) 654-3210"],
            },
            {
              icon: <Mail className="h-8 w-8 text-indigo-600" />,
              title: "Email",
              info: [
                "info@genderhealthcare.com",
                "support@genderhealthcare.com",
              ],
            },
            {
              icon: <Clock className="h-8 w-8 text-indigo-600" />,
              title: "Hours",
              info: [
                "Monday - Friday: 8:00 AM - 8:00 PM",
                "Saturday - Sunday: 8:00 AM -5:00 PM",
              ],
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              {item.info.map((line, i) => (
                <p key={i} className="text-gray-600 text-sm">
                  {line}
                </p>
              ))}
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>

            {submitStatus.submitted && (
              <div
                className={`mb-6 p-4 rounded-md ${
                  submitStatus.success
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Subject of your message"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Type your message here"
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors w-full"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {[
                  {
                    question: "How do I schedule an appointment?",
                    answer:
                      "You can schedule an appointment online through our website, by calling us, or sending an email. We will confirm your appointment within 24 hours.",
                  },
                  {
                    question: "Are your services confidential?",
                    answer:
                      "We value your privacy. All services and personal information are kept strictly confidential in accordance with legal regulations.",
                  },
                  {
                    question: "Can I cancel or reschedule my appointment?",
                    answer:
                      "Yes, you can change or cancel your appointment at least 24 hours before the scheduled time without any fees.",
                  },
                  {
                    question: "Do you offer virtual consultations?",
                    answer:
                      "Yes, we provide virtual consultation services via video calls. You can schedule a virtual appointment through our website.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Need Urgent Support?
                </h3>
                <p className="text-gray-600 mb-4">
                  Our 24/7 helpline is always available.
                </p>
                <a
                  href="tel:+18005551234"
                  className="inline-flex items-center text-indigo-600 font-medium"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  (800) 555-1234
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Our Location
          </h2>
          <div className="bg-white p-2 rounded-xl shadow-lg overflow-hidden h-96">
            <iframe
              title="Google Maps Location"
              className="w-full h-full rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215150859785!2d-73.98784332418535!3d40.7488443793285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b30eac9f%3A0xaca8d880c5d9d1!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1621332458179!5m2!1sen!2sus"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-6 rounded-xl"
        >
          <h2 className="text-3xl font-bold mb-4">Need Immediate Advice?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our team of experts is ready to assist you with any questions about
            sexual and reproductive health.
          </p>
          <a
            href="tel:+18005551234"
            className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 transition-colors"
          >
            <Phone className="h-5 w-5 mr-2" />
            Call Now: (800) 555-1234
          </a>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;
