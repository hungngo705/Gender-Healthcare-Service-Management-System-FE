import React from "react";
import { Link } from "react-router-dom";

function CallToAction() {
  return (
    <div className="text-center py-8">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-10 px-6 rounded-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Take control of your reproductive health
        </h2>
        <p className="max-w-2xl mx-auto text-lg mb-6">
          Understanding your cycle is key to managing your reproductive health.
          Our professional services can help you optimize your health.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#calendar"
            className="px-6 py-3 bg-white text-indigo-900 rounded-md font-medium hover:bg-opacity-90 transition-all"
          >
            Track Your Cycle
          </a>
          <Link
            to="/services/consultation"
            className="px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-all"
          >
            Book a Consultation
          </Link>
          <Link
            to="/services"
            className="px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-all"
          >
            View All Services
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CallToAction;
