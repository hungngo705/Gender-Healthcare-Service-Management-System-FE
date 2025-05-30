import React from "react";
import PropTypes from "prop-types";

function DashboardHeader({ title }) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>
    </header>
  );
}

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default DashboardHeader;
