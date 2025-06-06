import { useAuth } from "../contexts/AuthContext";

/**
 * Tiện ích để hiển thị và định dạng thông tin người dùng
 */
const userUtils = {
  /**
   * Lấy tên hiển thị của người dùng
   * @param {Object} user - Đối tượng người dùng
   * @returns {String} - Tên hiển thị
   */
  getDisplayName: (user) => {
    if (!user) return "";

    if (user.name) return user.name;

    // Fallback nếu không có tên đầy đủ
    return user.email ? user.email.split("@")[0] : "Người dùng";
  },

  /**
   * Lấy avatar URL hoặc chữ cái đầu tiên của tên để sử dụng trong avatar
   * @param {Object} user - Đối tượng người dùng
   * @returns {Object} - Avatar URL hoặc chữ cái đầu tiên
   */
  getAvatarInfo: (user) => {
    if (!user) return { initial: "?", imageUrl: null };

    // Nếu có avatar URL trong đối tượng user
    if (user.avatar || user.avatarUrl || user.profileImage) {
      const imageUrl = user.avatar || user.avatarUrl || user.profileImage;
      return { initial: null, imageUrl };
    }

    // Fallback vào chữ cái đầu tiên của tên
    if (user.name) {
      return {
        initial: user.name.charAt(0).toUpperCase(),
        imageUrl: null,
      };
    }

    // Fallback cuối cùng
    if (user.email) {
      return {
        initial: user.email.charAt(0).toUpperCase(),
        imageUrl: null,
      };
    }

    return { initial: "?", imageUrl: null };
  },
  /**
   * Format vai trò người dùng để hiển thị
   * @param {String|Array|Object} role - Vai trò người dùng có thể là string, array hoặc object
   * @returns {String} - Vai trò đã định dạng
   */ formatRole: (role) => {
    // Nếu không có vai trò
    if (!role) return "Chưa có vai trò";

    const roleMap = {
      admin: "Quản trị viên",
      customer: "Khách hàng",
      staff: "Nhân viên",
      consultant: "Chuyên gia tư vấn",
      manager: "Quản lý",
      // Thêm các role tiếng Anh khác nếu API trả về
    };

    // Trường hợp 1: role là string
    if (typeof role === "string") {
      return roleMap[role.toLowerCase()] || role;
    }

    // Trường hợp 2: role là array (ví dụ: ["admin", "manager"])
    if (Array.isArray(role)) {
      if (role.length === 0) return "Chưa có vai trò";

      // Nếu chỉ có 1 role, hiển thị role đó
      if (role.length === 1) {
        return roleMap[role[0].toLowerCase()] || role[0];
      }

      // Nếu có nhiều role, hiển thị role cao nhất
      const priorityOrder = [
        "admin",
        "manager",
        "consultant",
        "staff",
        "customer",
      ];
      const highestRole = role
        .map((r) => r.toLowerCase())
        .sort((a, b) => {
          const indexA = priorityOrder.indexOf(a);
          const indexB = priorityOrder.indexOf(b);
          return (
            (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
          );
        })[0];

      return roleMap[highestRole] || highestRole;
    }

    // Trường hợp 3: role là object (ví dụ: {name: "admin", id: 1})
    if (typeof role === "object" && role !== null) {
      if (role.name) return roleMap[role.name.toLowerCase()] || role.name;
      if (role.role) return roleMap[role.role.toLowerCase()] || role.role;
      if (role.type) return roleMap[role.type.toLowerCase()] || role.type;
    }

    return "Chưa có vai trò";
  },
  /**
   * Lấy vai trò từ đối tượng người dùng, xử lý nhiều định dạng API khác nhau
   * @param {Object} user - Đối tượng người dùng
   * @returns {String|Array|Object} - Vai trò người dùng
   */
  getUserRole: (user) => {
    if (!user) return null;

    // Trường hợp có thuộc tính role trực tiếp
    if (user.role !== undefined) return user.role;

    // Trường hợp có thuộc tính roles (dạng mảng)
    if (user.roles && Array.isArray(user.roles)) return user.roles;

    // Trường hợp có thuộc tính roleNames (dạng mảng)
    if (user.roleNames && Array.isArray(user.roleNames)) return user.roleNames;

    // Trường hợp có thuộc tính userRole
    if (user.userRole) return user.userRole;

    // Trường hợp có thuộc tính userType
    if (user.userType) return user.userType;

    return null;
  },

  /**
   * Hook để sử dụng thông tin người dùng hiện tại
   * @returns {Object} - Các utility function và thông tin người dùng
   */ /**
   * Kiểm tra xem người dùng có vai trò cụ thể hay không
   * @param {Object} user - Đối tượng người dùng
   * @param {String|Array} role - Vai trò cần kiểm tra (chuỗi hoặc mảng các vai trò)
   * @returns {Boolean} - Trả về true nếu người dùng có vai trò đó
   */
  hasRole: (user, rolesToCheck) => {
    if (!user) return false;

    const userRoleData = userUtils.getUserRole(user);
    let userRoles = [];

    // Chuyển đổi userRoleData thành mảng để dễ kiểm tra
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

    // Nếu không có vai trò, coi như guest
    if (userRoles.length === 0) {
      userRoles = ["guest"];
    }

    // Chuyển đổi rolesToCheck thành mảng
    const rolesToCheckArray =
      typeof rolesToCheck === "string"
        ? [rolesToCheck.toLowerCase()]
        : rolesToCheck.map((r) => r.toLowerCase());

    // Kiểm tra xem người dùng có bất kỳ vai trò nào trong rolesToCheck không
    return userRoles.some((role) => rolesToCheckArray.includes(role));
  },

  /**
   * Kiểm tra xem người dùng có phải là nhân viên (staff hoặc cao hơn) không
   * @param {Object} user - Đối tượng người dùng
   * @returns {Boolean} - Trả về true nếu người dùng là nhân viên hoặc cao hơn
   */
  isStaffOrHigher: (user) => {
    const staffRoles = ["staff", "consultant", "manager", "admin", "customer"];
    return userUtils.hasRole(user, staffRoles);
  },

  /**
   * Hook để sử dụng thông tin người dùng hiện tại
   * @returns {Object} - Các utility function và thông tin người dùng
   */
  useUserInfo: () => {
    const { currentUser } = useAuth();

    const userRole = userUtils.getUserRole(currentUser);
    const formattedRole = currentUser ? userUtils.formatRole(userRole) : "";

    // Tạo một danh sách các vai trò nếu có nhiều vai trò
    let rolesList = [];
    if (Array.isArray(userRole)) {
      rolesList = userRole;
    } else if (typeof userRole === "string") {
      rolesList = [userRole];
    } else if (userRole && typeof userRole === "object") {
      const roleName = userRole.name || userRole.role || userRole.type;
      if (roleName) rolesList = [roleName];
    }

    return {
      currentUser,
      displayName: userUtils.getDisplayName(currentUser),
      avatarInfo: userUtils.getAvatarInfo(currentUser),
      formattedRole,
      userRole,
      rolesList,
      hasRole: (roles) => userUtils.hasRole(currentUser, roles),
      isStaffOrHigher: () => userUtils.isStaffOrHigher(currentUser),
      isLoggedIn: !!currentUser,
    };
  },
};

export default userUtils;
