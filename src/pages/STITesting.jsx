import React, { useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function STITesting() {
  // State for appointment form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    testType: "comprehensive",
    notes: "",
  });
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [submitError, setSubmitError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Here you would typically make an API call to submit the form data
      // For now, we'll just simulate a successful submission
      setSubmitSuccess(true);
      setIsSubmitting(false);
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-100 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center text-sm">
          <Link to="/" className="text-gray-600 hover:text-indigo-600">
            Home
          </Link>
          <svg
            className="h-4 w-4 mx-2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <Link to="/services" className="text-gray-600 hover:text-indigo-600">
            Services
          </Link>
          <svg
            className="h-4 w-4 mx-2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-indigo-600 font-medium">STI Testing</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4 sm:text-5xl">
              Confidential STI Testing Services
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Take control of your sexual health with our private,
              non-judgmental STI testing and treatment services.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <a
              href="#appointment"
              className="px-6 py-3 bg-white text-indigo-900 rounded-full font-medium hover:bg-opacity-90 transition-all flex items-center"
            >
              Book an Appointment
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#faq"
              className="px-6 py-3 bg-transparent border border-white text-white rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition-all flex items-center"
            >
              Learn More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Service Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Our STI Testing Services
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Why Choose Our STI Testing Services?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-3 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <span className="font-medium text-gray-900">
                        Complete Confidentiality
                      </span>
                      <p className="text-gray-600 mt-1">
                        Your privacy is our top priority. All testing and
                        results are handled with the utmost confidentiality.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-3 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <span className="font-medium text-gray-900">
                        Secure Results Delivery
                      </span>
                      <p className="text-gray-600 mt-1">
                        Access your results online through our secure patient
                        portal, ensuring privacy and quick access.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-3 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <span className="font-medium text-gray-900">
                        Comprehensive Care
                      </span>
                      <p className="text-gray-600 mt-1">
                        If testing reveals an infection, our healthcare
                        providers can prescribe treatment and provide follow-up
                        care.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-purple-50 p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Our Testing Process
                </h3>
                <ol className="space-y-3">
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Book an appointment
                      </p>
                      <p className="text-gray-600 mt-1">
                        Schedule online or by phone at your convenience
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Visit our clinic
                      </p>
                      <p className="text-gray-600 mt-1">
                        Meet with our healthcare professionals in a comfortable,
                        private setting
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Sample collection
                      </p>
                      <p className="text-gray-600 mt-1">
                        Quick and easy sample collection by trained
                        professionals
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Receive results
                      </p>
                      <p className="text-gray-600 mt-1">
                        Get results securely online within 2-3 days
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                      5
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Treatment (if needed)
                      </p>
                      <p className="text-gray-600 mt-1">
                        Receive treatment options and follow-up care
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testing Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Testing Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic STI Test */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Basic STI Test
                </h3>
                <p className="text-gray-600 mb-4">
                  Testing for the most common infections including chlamydia and
                  gonorrhea.
                </p>
                <div className="mb-4 text-2xl font-bold text-indigo-600">
                  $79
                </div>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Chlamydia testing
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Gonorrhea testing
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Results in 2-3 days
                  </li>
                </ul>
                <a
                  href="#appointment"
                  className="inline-block w-full px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md text-center font-medium hover:bg-indigo-50 transition-colors"
                >
                  Book Now
                </a>
              </div>
            </div>

            {/* Comprehensive STI Test */}
            <div className="bg-indigo-50 rounded-xl shadow-lg overflow-hidden border-2 border-indigo-500 hover:shadow-xl transition-shadow transform scale-105">
              <div className="absolute inset-x-0 -top-4 flex justify-center">
                <span className="inline-block px-4 py-3 rounded-full bg-indigo-600 text-white text-xs font-semibold uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
              <div className="p-6 pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Comprehensive STI Test
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete testing package for all common sexually transmitted
                  infections.
                </p>
                <div className="mb-4 text-2xl font-bold text-indigo-600">
                  $149
                </div>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Tests for all common STIs
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    HIV & Hepatitis testing
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Doctor consultation included
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Expedited results (1-2 days)
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Treatment options if needed
                  </li>
                </ul>
                <a
                  href="#appointment"
                  className="inline-block w-full px-4 py-2 bg-indigo-600 text-white rounded-md text-center font-medium hover:bg-indigo-700 transition-colors"
                >
                  Book Now
                </a>
              </div>
            </div>

            {/* Targeted Test */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Targeted Test
                </h3>
                <p className="text-gray-600 mb-4">
                  Specific testing based on your concerns or exposure.
                </p>
                <div className="mb-4 text-2xl font-bold text-indigo-600">
                  $99
                </div>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Customized testing plan
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Initial consultation included
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Results within 2-3 days
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Follow-up recommendations
                  </li>
                </ul>
                <a
                  href="#appointment"
                  className="inline-block w-full px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md text-center font-medium hover:bg-indigo-50 transition-colors"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appointment Booking Form */}
        <motion.div
          id="appointment"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 scroll-mt-24"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Book Your STI Testing Appointment
          </h2>

          {submitSuccess ? (
            <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <svg
                className="h-12 w-12 text-green-500 mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Appointment Scheduled!
              </h3>
              <p className="text-gray-600 mb-4">
                Your STI testing appointment has been successfully scheduled.
                You will receive a confirmation email shortly.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="testType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Test Type *
                    </label>
                    <select
                      id="testType"
                      name="testType"
                      required
                      value={formData.testType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="basic">Basic STI Test ($79)</option>
                      <option value="comprehensive">
                        Comprehensive STI Test ($149)
                      </option>
                      <option value="targeted">Targeted Test ($99)</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Preferred Time *
                    </label>
                    <select
                      id="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select a time</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Any specific concerns or questions you'd like to discuss?"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Your information will be kept strictly confidential. By
                    submitting this form, you agree to our{" "}
                    <Link
                      to="/privacy-policy"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      privacy policy
                    </Link>
                    .
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Schedule Appointment"
                    )}
                  </button>
                </div>

                {submitError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {submitError}
                  </div>
                )}
              </form>
            </div>
          )}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          id="faq"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 scroll-mt-24"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {/* FAQ Item 1 */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    How long does STI testing take?
                  </h3>
                  <p className="text-gray-600">
                    The actual testing process usually takes about 15-20
                    minutes. Most of this time is spent on paperwork and
                    consultation. The sample collection itself is quick and
                    minimally invasive.
                  </p>
                </div>

                {/* FAQ Item 2 */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    How soon will I receive my results?
                  </h3>
                  <p className="text-gray-600">
                    Results are typically available within 2-3 days for standard
                    tests and 1-2 days for expedited services. You'll receive a
                    secure notification when your results are ready to view in
                    our patient portal.
                  </p>
                </div>

                {/* FAQ Item 3 */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Is STI testing confidential?
                  </h3>
                  <p className="text-gray-600">
                    Absolutely. We take your privacy very seriously. All testing
                    is completely confidential, and your results are only
                    accessible to you and your healthcare provider. Our online
                    portal uses encryption to keep your information secure.
                  </p>
                </div>

                {/* FAQ Item 4 */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    What should I do if my test is positive?
                  </h3>
                  <p className="text-gray-600">
                    If your test comes back positive, don't panic. Many STIs are
                    easily treatable. Our healthcare providers will guide you
                    through treatment options and can prescribe medication if
                    necessary. We also offer counseling services and partner
                    notification assistance if desired.
                  </p>
                </div>

                {/* FAQ Item 5 */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    How often should I get tested?
                  </h3>
                  <p className="text-gray-600">
                    The frequency of testing depends on your individual risk
                    factors. Generally, we recommend annual testing for sexually
                    active individuals. However, more frequent testing (every
                    3-6 months) may be appropriate for those with multiple
                    partners or other risk factors. Our healthcare providers can
                    help determine the best testing schedule for you.
                  </p>
                </div>

                {/* FAQ Item 6 */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Do I need to prepare for STI testing?
                  </h3>
                  <p className="text-gray-600">
                    For most STI tests, no special preparation is required.
                    However, for certain tests, you may be advised to avoid
                    urinating for 1-2 hours before your appointment. If you're
                    scheduled for a blood test, you can eat and drink normally
                    beforehand. Our staff will provide specific instructions if
                    needed when you book your appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-10 px-6 rounded-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Take control of your sexual health today
            </h2>
            <p className="max-w-2xl mx-auto text-lg mb-6">
              Regular STI testing is an important part of maintaining your
              overall health. Book your confidential appointment now.
            </p>{" "}
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#appointment"
                className="px-6 py-3 bg-white text-indigo-900 rounded-md font-medium hover:bg-opacity-90 transition-all"
              >
                Book an Appointment
              </a>
              <Link
                to="/contact"
                className="px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Contact Us
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-all"
              >
                View All Services
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default STITesting;
