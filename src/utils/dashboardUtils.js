/**
 * Returns dashboard configuration based on user role
 * @param {string} userRole - The user's role
 * @returns {Object} Dashboard configuration for the specified role
 */
export function getDashboardConfig(userRole) {
  const roleConfig = {
    consultant: {
      title: "Bảng điều khiển dành cho tư vấn viên",
      menuItems: [
        {
          id: "consultantAppointments",
          label: "Lịch hẹn tư vấn",
          icon: "calendar",
        },
        {
          id: "consultantSchedule",
          label: "Lịch làm việc",
          icon: "calendar-clock", // You'll need to add this icon to your iconMap
        },
        {
          id: "consultantQuestions",
          label: "Câu hỏi khách hàng",
          icon: "help-circle",
        },
        { id: "messages", label: "Tin nhắn", icon: "chat" },
      ],
      description: "Quản lý lịch tư vấn và xử lý xét nghiệm",
    },
    staff: {
      title: "Bảng điều khiển dành cho nhân viên",
      menuItems: [
        {
          id: "blogManagement",
          label: "Quản lý bài viết",
          icon: "document-text",
        },
        {
          id: "stiTestingManagement",
          label: "Quản lý xét nghiệm STI",
          icon: "labs",
        },
        { id: "messages", label: "Tin nhắn", icon: "chat" },
      ],
      description: "Tạo các bài đăng và quản lý thông tin khách hàng",
    },
    manager: {
      title: "Bảng điều khiển dành cho quản lý",
      menuItems: [
        {
          id: "servicesManagement",
          label: "Quản lý dịch vụ",
          icon: "clipboard",
        },
        {
          id: "blogManagement",
          label: "Phê duyệt bài viết",
          icon: "document-check",
        },
        { id: "messages", label: "Tin nhắn", icon: "chat" },
      ],
      description: "Thêm và quản lý các dịch vụ, phê duyệt nội dung",
    },
    admin: {
      title: "Bảng điều khiển quản trị viên",
      menuItems: [
        { id: "overview", label: "Tổng quan", icon: "chart-pie" },
        { id: "userManagement", label: "Quản lý người dùng", icon: "users" },
        {
          id: "blogManagement",
          label: "Quản lý nội dung",
          icon: "document-text",
        },
        { id: "reports", label: "Báo cáo & Thống kê", icon: "chart-bar" },
        { id: "messages", label: "Tin nhắn", icon: "chat" },
      ],
      description: "Thêm và quản lý người dùng, nội dung và cài đặt hệ thống",
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
