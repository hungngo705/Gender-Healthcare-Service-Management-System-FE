import React from "react";
import PropTypes from "prop-types";

function OverviewTab({ role }) {
  // Sample stat data - in a real app, you would fetch this from an API
  const stats = getRoleStats(role);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Tổng quan</h2>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Sample chart - placeholder */}
      <div className="bg-gray-50 border rounded-lg p-4 h-64 flex items-center justify-center">
        <p className="text-gray-400">Biểu đồ hoạt động</p>
      </div>

      {/* Recent activity */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Hoạt động gần đây
        </h3>
        <div className="divide-y">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="py-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full"></div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    Hoạt động mẫu #{index + 1}
                  </p>
                  <p className="text-xs text-gray-500">2 giờ trước</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper component for stats
function StatCard({ stat }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
          <i className={`fas fa-${stat.icon}`}></i>
        </div>
      </div>
      <div
        className={`text-xs mt-2 ${
          stat.change.startsWith("+")
            ? "text-green-600"
            : stat.change === "0"
            ? "text-gray-500"
            : "text-red-600"
        }`}
      >
        {stat.change} so với hôm qua
      </div>
    </div>
  );
}

StatCard.propTypes = {
  stat: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    change: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
};

// Helper function to get role-specific stats
function getRoleStats(role) {
  const roleStats = {
    consultant: [
      { label: "Lịch hẹn hôm nay", value: "8", change: "+2", icon: "calendar" },
      { label: "Khách hàng đang chờ", value: "3", change: "0", icon: "clock" },
      {
        label: "Khách hàng mới tuần này",
        value: "12",
        change: "+5",
        icon: "user-plus",
      },
      {
        label: "Hoàn thành hôm nay",
        value: "5",
        change: "+1",
        icon: "check-circle",
      },
    ],
    staff: [
      { label: "Lịch hẹn hôm nay", value: "6", change: "+1", icon: "calendar" },
      { label: "Hồ sơ cần xử lý", value: "4", change: "-2", icon: "file-alt" },
      { label: "Thuốc cần bổ sung", value: "3", change: "0", icon: "pills" },
      { label: "Khách hàng mới", value: "2", change: "+2", icon: "user-plus" },
    ],
    manager: [
      { label: "Nhân viên hiện tại", value: "12", change: "0", icon: "users" },
      {
        label: "Lịch hẹn hôm nay",
        value: "24",
        change: "+5",
        icon: "calendar",
      },
      {
        label: "Doanh thu tháng này",
        value: "$12.5k",
        change: "+8%",
        icon: "chart-line",
      },
      {
        label: "Khách hàng mới",
        value: "38",
        change: "+12",
        icon: "user-plus",
      },
    ],
    admin: [
      {
        label: "Người dùng hoạt động",
        value: "245",
        change: "+22",
        icon: "users",
      },
      {
        label: "Lỗi hệ thống",
        value: "0",
        change: "-3",
        icon: "exclamation-triangle",
      },
      { label: "CPU sử dụng", value: "28%", change: "+2%", icon: "microchip" },
      { label: "Dịch vụ hoạt động", value: "8/8", change: "0", icon: "server" },
    ],
  };

  return roleStats[role] || roleStats.staff;
}

OverviewTab.propTypes = {
  role: PropTypes.string.isRequired,
};

export default OverviewTab;
