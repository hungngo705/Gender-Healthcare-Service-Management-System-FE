import React from "react";
import PropTypes from "prop-types";
import { LogOut } from "lucide-react";

function Sidebar({ menuItems, activeTab, setActiveTab, onLogout }) {
  // Lấy thông tin userRole trực tiếp từ Dashboard.jsx thông qua props.menuItems
  // Không áp dụng bộ lọc menu items ở đây vì menuItems đã được lọc từ dashboardConfig

  // Giữ lại toàn bộ menu items được truyền từ Dashboard.jsx
  const filteredMenuItems = menuItems;

  return (
    <div className="w-full h-full lg:w-64 bg-white rounded-lg shadow flex flex-col">
      <nav className="p-4 flex-grow">
        <ul className="space-y-2">
          {" "}
          {filteredMenuItems.map((item) => (
            <li key={item.id}>
              {" "}
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
