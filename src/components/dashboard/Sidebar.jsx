import React from "react";
import PropTypes from "prop-types";

function Sidebar({ menuItems, activeTab, setActiveTab }) {
  return (
    <div className="w-full lg:w-64 bg-white rounded-lg shadow">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${
                  activeTab === item.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="mr-3">
                  {/* You can replace this with your icon component */}
                  <i className={`fas fa-${item.icon}`}></i>
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

Sidebar.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default Sidebar;
