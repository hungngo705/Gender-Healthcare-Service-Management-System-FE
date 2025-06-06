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
        {
          id: "consultantAppointments",
          label: "Lịch hẹn tư vấn",
          icon: "calendar",
        },
        { id: "testProcessing", label: "Xử lý xét nghiệm", icon: "clipboard" },
        { id: "customers", label: "Bệnh nhân", icon: "users" },
        { id: "messages", label: "Tin nhắn", icon: "chat" },
      ],
      description: "Quản lý lịch tư vấn và xử lý xét nghiệm",
    },
    staff: {
      title: "Bảng điều khiển dành cho nhân viên",
      menuItems: [
        { id: "overview", label: "Tổng quan", icon: "chart-pie" },
        {
          id: "blogManagement",
          label: "Quản lý bài viết",
          icon: "document-text",
        },
        { id: "appointments", label: "Lịch hẹn", icon: "calendar" },
        { id: "customers", label: "Khách hàng", icon: "users" },
      ],
      description: "Tạo các bài đăng và quản lý thông tin khách hàng",
    },
    manager: {
      title: "Bảng điều khiển dành cho quản lý",
      menuItems: [
        { id: "overview", label: "Tổng quan", icon: "chart-pie" },
        {
          id: "servicesManagement",
          label: "Quản lý dịch vụ",
          icon: "clipboard",
        },
        { id: "appointments", label: "Theo dõi lịch hẹn", icon: "calendar" },
        { id: "reports", label: "Báo cáo & Thống kê", icon: "chart-bar" },
        { id: "finance", label: "Tài chính", icon: "cash" },
      ],
      description: "Thêm và quản lý các dịch vụ",
    },
    admin: {
      title: "Bảng điều khiển quản trị viên",
      menuItems: [
        { id: "overview", label: "Tổng quan", icon: "chart-pie" },
        { id: "userManagement", label: "Quản lý người dùng", icon: "users" },
        {
          id: "servicesManagement",
          label: "Quản lý dịch vụ",
          icon: "clipboard",
        },
        { id: "reports", label: "Báo cáo & Thống kê", icon: "chart-bar" },
        { id: "system", label: "Cài đặt hệ thống", icon: "cog" },
        { id: "logs", label: "Nhật ký hệ thống", icon: "document-text" },
      ],
      description: "Thêm và quản lý người dùng và cài đặt hệ thống",
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
