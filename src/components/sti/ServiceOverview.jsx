import React from "react";

function ServiceOverview() {
  return (
    <div className="mb-16">
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
                    Your privacy is our top priority. All testing and results
                    are handled with the utmost confidentiality.
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
                    Access your results online through our secure customer
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
                    If testing reveals an infection, our healthcare providers
                    can prescribe treatment and provide follow-up care.
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
                  <p className="font-medium text-gray-900">Visit our clinic</p>
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
                  <p className="font-medium text-gray-900">Sample collection</p>
                  <p className="text-gray-600 mt-1">
                    Quick and easy sample collection by trained professionals
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900">Receive results</p>
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
    </div>
  );
}

export default ServiceOverview;
