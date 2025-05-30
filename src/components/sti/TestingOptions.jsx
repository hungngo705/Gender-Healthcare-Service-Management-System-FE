import React from "react";

function TestingOptions() {
  return (
    <div className="mb-16">
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
            <div className="mb-4 text-2xl font-bold text-indigo-600">$79</div>
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
            <div className="mb-4 text-2xl font-bold text-indigo-600">$149</div>
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
            <div className="mb-4 text-2xl font-bold text-indigo-600">$99</div>
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
    </div>
  );
}

export default TestingOptions;
