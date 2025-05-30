import React from "react";
import { Link } from "react-router-dom";

function Breadcrumbs() {
  return (
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
        <span className="text-indigo-600 font-medium">Cycle Tracker</span>
      </div>
    </nav>
  );
}

export default Breadcrumbs;
