import React from 'react';

const OverviewTab = ({ role }) => {
  // Thống kê khác nhau dựa trên role
  const roleStats = {
    consultant: [
      { label: "Lịch hẹn hôm nay", value: "8", change: "+2", icon: "calendar" },
      { label: "Bệnh nhân đang chờ", value: "3", change: "0", icon: "clock" },
      { label: "Bệnh nhân mới tuần này", value: "12", change: "+5", icon: "user-plus" },
      { label: "Hoàn thành hôm nay", value: "5", change: "+1", icon: "check-circle" },
    ],
    staff: [
      { label: "Bệnh nhân hôm nay", value: "15", change: "+3", icon: "users" },
      { label: "Hồ sơ cần xác minh", value: "7", change: "-2", icon: "clipboard-check" },
      { label: "Yêu cầu vật tư", value: "4", change: "+2", icon: "archive" },
      { label: "Tin nhắn chưa đọc", value: "9", change: "+5", icon: "envelope" },
    ],
    // ... các role khác
  };

  const stats = roleStats[role] || roleStats.staff;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Tổng quan</h2>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <i className={`fas fa-${stat.icon}`}></i>
              </div>
            </div>
            <div className={`text-xs mt-2 ${stat.change.startsWith('+') ? 'text-green-600' : stat.change === '0' ? 'text-gray-500' : 'text-red-600'}`}>
              {stat.change} so với hôm qua
            </div>
          </div>
        ))}
      </div>
      
      {/* Các phần khác của tab */}
      {/* ... */}
    </div>
  );
};

export default OverviewTab;
