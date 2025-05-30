/**
 * Returns dashboard configuration based on user role
 * @param {string} userRole - The user's role
 * @returns {Object} Dashboard configuration for the specified role
 */
export function getDashboardConfig(userRole) {
  const roleConfig = {
    consultant: {
      title: "Bảng điều khiển dành cho bác sĩ tư vấn",
      menuItems: [
        { id: "overview", label: "Tổng quan", icon: "chart-pie" },
        { id: "appointments", label: "Lịch hẹn", icon: "calendar" },
        { id: "customers", label: "Khách hàng", icon: "users" },
        { id: "messages", label: "Tin nhắn", icon: "chat" },
      ],
    },
    staff: {
      title: "Bảng điều khiển dành cho nhân viên",
      menuItems: [
        { id: "overview", label: "Tổng quan", icon: "chart-pie" },
        { id: "customers", label: "Khách hàng", icon: "users" },
        { id: "records", label: "Hồ sơ y tế", icon: "document" },
        { id: "inventory", label: "Kho vật tư", icon: "archive" },
      ],
    },
    manager: {
      title: "Bảng điều khiển dành cho quản lý",
      menuItems: [
        { id: "overview", label: "Tổng quan", icon: "chart-pie" },
        { id: "staff", label: "Quản lý nhân viên", icon: "user-group" },
        { id: "reports", label: "Báo cáo & Thống kê", icon: "chart-bar" },
        { id: "services", label: "Quản lý dịch vụ", icon: "clipboard" },
        { id: "finance", label: "Tài chính", icon: "cash" },
      ],
    },
    admin: {
      title: "Bảng điều khiển quản trị viên",
      menuItems: [
        { id: "overview", label: "Tổng quan", icon: "chart-pie" },
        { id: "users", label: "Quản lý người dùng", icon: "users" },
        { id: "services", label: "Quản lý dịch vụ", icon: "clipboard" },
        { id: "system", label: "Cài đặt hệ thống", icon: "cog" },
        { id: "logs", label: "Nhật ký hệ thống", icon: "document-text" },
      ],
    },
  };

  return roleConfig[userRole] || roleConfig.staff;
}

/**
 * Returns greeting based on time of day
 * @returns {string} Appropriate greeting for the current time
 */
export function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  else if (hour < 18) return "Chào buổi chiều";
  else return "Chào buổi tối";
}
