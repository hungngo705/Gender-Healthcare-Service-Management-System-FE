import React, { useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useServices } from "../hooks/useServices";
import mockServices from "../data/mockServices";
import serviceFaqs from "../data/serviceFaqs";
import serviceCategories from "../data/serviceCategories";

function Services() {
  const { services, loading, error } = useServices();
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredServices =
    activeCategory === "all"
      ? services
      : services?.filter((service) => service.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Our Healthcare Services
            </h1>
            <div className="flex items-center justify-center space-x-2 mt-8">
              <div
                className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <p className="mt-4 text-lg text-gray-600">
              Loading our services...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Our Healthcare Services
            </h1>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md max-w-2xl mx-auto">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use mock services if API data is not available
  const displayServices =
    services && services.length > 0
      ? filteredServices
      : activeCategory === "all"
      ? mockServices
      : mockServices.filter((service) => service.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
          >
            Our Healthcare Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto mt-5 text-xl text-gray-600"
          >
            Comprehensive gender-sensitive healthcare services designed with
            privacy, respect, and your unique reproductive health needs in mind.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center mb-12 space-x-2">
          {Object.entries(serviceCategories).map(([key, value]) => (
            <motion.button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 m-2
                ${
                  activeCategory === key
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {value}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayServices?.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                y: -10,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {service.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              )}
              <div className="p-6">
                {service.category && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full mb-3">
                    {serviceCategories[service.category] || service.category}
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                {service.features && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Key Features:
                    </h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <svg
                            className="h-4 w-4 text-green-500 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  {service.price && (
                    <span className="text-gray-700 font-semibold">
                      {typeof service.price === "number"
                        ? `$${service.price}`
                        : service.price}
                    </span>
                  )}
                  <Link
                    to={`/services/${service.id}`}
                    className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Learn More
                    <svg
                      className="ml-1 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Service: Cycle Tracking */}
        <div className="mt-16 bg-indigo-900 text-white rounded-2xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2">
            <div className="p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">
                Cycle Tracking Service
              </h2>
              <p className="mb-6">
                Our advanced cycle tracking service helps you monitor your
                menstrual cycle, predict ovulation periods, and set reminders
                for birth control and health checks.
              </p>
              <ul className="mb-8 space-y-2">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-indigo-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Personalized predictions based on your unique cycle
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-indigo-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Reminders for medications and appointments</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-indigo-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Health insights based on your tracking history</span>
                </li>
              </ul>
              <Link
                to="/cycle-tracker"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-white hover:bg-indigo-50 transition-colors self-start"
              >
                Try Cycle Tracker
                <svg
                  className="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&q=80"
                alt="Cycle Tracking"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* STI Testing Featured Service */}
        <div className="mt-16 bg-gradient-to-r from-purple-800 to-indigo-900 text-white rounded-2xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2">
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&q=80"
                alt="STI Testing"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">
                Confidential STI Testing
              </h2>
              <p className="mb-6">
                Our STI testing services provide confidential testing, secure
                results delivery, and comprehensive treatment options if needed.
              </p>
              <ul className="mb-8 space-y-2">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-purple-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Complete privacy throughout the testing process</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-purple-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Secure online results delivery</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-purple-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Optional follow-up treatment and care</span>
                </li>
              </ul>
              <Link
                to="/services/sti-testing"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-white hover:bg-indigo-50 transition-colors self-start"
              >
                Book STI Testing
                <svg
                  className="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            {serviceFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-4"
              >
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Take Control of Your Reproductive Health?
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-8">
            Start tracking your cycle, book a consultation with our healthcare
            professionals, or schedule an STI test today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/appointment"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Book Appointment
            </Link>
            <Link
              to="/cycle-tracker"
              className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
            >
              Try Cycle Tracker
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
