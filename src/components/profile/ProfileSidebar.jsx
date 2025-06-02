import React from "react";
import PropTypes from "prop-types";
import { User, Calendar, FileText, Bell, Lock, CreditCard } from "lucide-react";

function ProfileSidebar({ currentUser, activeTab, setActiveTab }) {
  const tabs = [
    {
      id: "profile",
      label: "Thông tin cá nhân",
      icon: <User size={16} className="mr-3" />,
    },
    {
      id: "appointments",
      label: "Lịch hẹn",
      icon: <Calendar size={16} className="mr-3" />,
    },
    {
      id: "medical-records",
      label: "Hồ sơ y tế",
      icon: <FileText size={16} className="mr-3" />,
    },
    {
      id: "notifications",
      label: "Thông báo",
      icon: <Bell size={16} className="mr-3" />,
    },
    {
      id: "security",
      label: "Bảo mật",
      icon: <Lock size={16} className="mr-3" />,
    },
    {
      id: "payments",
      label: "Thanh toán",
      icon: <CreditCard size={16} className="mr-3" />,
    },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* User Info */}
        <div className="p-6 text-center border-b border-gray-200">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
            {currentUser?.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <User size={40} />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            {currentUser?.name || "Người dùng"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {currentUser?.email || "Email chưa cập nhật"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

ProfileSidebar.propTypes = {
  currentUser: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default ProfileSidebar;
