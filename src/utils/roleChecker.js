import userUtils from "./userUtils";

/**
 * Tiện ích để kiểm tra quyền truy cập dựa trên vai trò người dùng
 */
const roleChecker = {
  /**
   * Kiểm tra xem người dùng có quyền truy cập chức năng dựa trên vai trò
   * @param {Object} user - Đối tượng người dùng
   * @param {Object} requiredPermission - Quyền yêu cầu
   * @returns {Boolean} - True nếu người dùng có quyền
   */
  checkPermission: (user, requiredPermission) => {
    // Định nghĩa quyền truy cập theo vai trò
    const rolePermissions = {
      admin: {
        // Admin có tất cả quyền
        viewDashboard: true,
        manageUsers: true,
        manageServices: true,
        manageAppointments: true,
        viewReports: true,
        editSettings: true,
      },
      manager: {
        viewDashboard: true,
        manageUsers: true,
        manageServices: true,
        manageAppointments: true,
        viewReports: true,
        editSettings: false,
      },
      consultant: {
        viewDashboard: true,
        manageUsers: false,
        manageServices: false,
        manageAppointments: true,
        viewReports: true,
        editSettings: false,
      },
      staff: {
        viewDashboard: true,
        manageUsers: false,
        manageServices: false,
        manageAppointments: true,
        viewReports: false,
        editSettings: false,
      },
      customer: {
        viewDashboard: false,
        manageUsers: false,
        manageServices: false,
        manageAppointments: false,
        viewReports: false,
        editSettings: false,
      },
    };

    // Lấy vai trò của người dùng
    const userRoleData = userUtils.getUserRole(user);

    // Mảng lưu các vai trò của người dùng sau khi chuẩn hóa
    let userRoles = [];

    // Chuẩn hóa vai trò thành mảng
    if (Array.isArray(userRoleData)) {
      userRoles = userRoleData.map((r) =>
        typeof r === "string"
          ? r.toLowerCase()
          : r.name
          ? r.name.toLowerCase()
          : r.role
          ? r.role.toLowerCase()
          : ""
      );
    } else if (typeof userRoleData === "string") {
      userRoles = [userRoleData.toLowerCase()];
    } else if (userRoleData && typeof userRoleData === "object") {
      const roleName =
        userRoleData.name || userRoleData.role || userRoleData.type;
      if (roleName) {
        userRoles = [roleName.toLowerCase()];
      }
    }

    // Nếu không tìm thấy vai trò, mặc định là guest
    if (userRoles.length === 0) {
      userRoles = ["guest"];
    }

    // Kiểm tra xem người dùng có bất kỳ vai trò nào với quyền yêu cầu
    return userRoles.some((role) => {
      // Nếu vai trò không được định nghĩa trong rolePermissions, coi như không có quyền
      if (!rolePermissions[role]) return false;

      // Kiểm tra quyền cụ thể
      return rolePermissions[role][requiredPermission] === true;
    });
  },

  /**
   * Kiểm tra xem người dùng có quyền xem dashboard không
   */
  canViewDashboard: (user) =>
    roleChecker.checkPermission(user, "viewDashboard"),

  /**
   * Kiểm tra xem người dùng có quyền quản lý người dùng không
   */
  canManageUsers: (user) => roleChecker.checkPermission(user, "manageUsers"),

  /**
   * Kiểm tra xem người dùng có quyền quản lý dịch vụ không
   */
  canManageServices: (user) =>
    roleChecker.checkPermission(user, "manageServices"),

  /**
   * Kiểm tra xem người dùng có quyền quản lý lịch hẹn không
   */
  canManageAppointments: (user) =>
    roleChecker.checkPermission(user, "manageAppointments"),

  /**
   * Kiểm tra xem người dùng có quyền xem báo cáo không
   */
  canViewReports: (user) => roleChecker.checkPermission(user, "viewReports"),

  /**
   * Kiểm tra xem người dùng có quyền chỉnh sửa cài đặt không
   */
  canEditSettings: (user) => roleChecker.checkPermission(user, "editSettings"),
};

export default roleChecker;
