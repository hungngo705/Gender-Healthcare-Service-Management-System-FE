import React from "react";
import PropTypes from "prop-types";
import { LogOut } from "lucide-react";

function Sidebar({ menuItems, activeTab, setActiveTab, onLogout }) {
  return (
    <div className="w-full h-full lg:w-64 bg-white rounded-lg shadow flex flex-col">
      <nav className="p-4 flex-grow">
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
                <span className="mr-3 text-gray-500">
                  {item.iconComponent || (
                    <i className={`fas fa-${item.icon}`}></i>
                  )}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      {onLogout && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
}

Sidebar.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      iconComponent: PropTypes.node,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  onLogout: PropTypes.func,
};

export default Sidebar;
