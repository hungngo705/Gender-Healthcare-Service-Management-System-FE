// User management utility functions

export const getRoleBadgeClass = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "manager":
      return "bg-purple-100 text-purple-800";
    case "consultant":
      return "bg-blue-100 text-blue-800";
    case "staff":
      return "bg-green-100 text-green-800";
    case "customer":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getRoleText = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "Quản trị viên";
    case "manager":
      return "Quản lý";
    case "consultant":
      return "Tư vấn viên";
    case "staff":
      return "Nhân viên";
    case "customer":
      return "Khách hàng";
    default:
      return "Không xác định";
  }
};

// Hàm debug để kiểm tra giá trị thực tế của isActive
export const debugUserStatus = (user) => {
  console.log(`User ID: ${user.id}, Name: ${user.name}`);
  console.log(`isActive (raw):`, user.isActive);
  console.log(`isActive (type):`, typeof user.isActive);
  console.log(`status:`, user.status);
  console.log(`---------------------------`);
};

export const getStatusClass = (user) => {
  // Debug để kiểm tra giá trị thực tế
  debugUserStatus(user);

  // Xác định isActive dựa trên kiểu dữ liệu boolean
  const isActive =
    typeof user.isActive === "boolean"
      ? user.isActive
      : user.isActive === "TRUE" ||
        user.isActive === true ||
        user.status === "active";

  // Hiển thị đúng theo dữ liệu API:
  // isActive=true => Hoạt động (màu xanh)
  // isActive=false => Ngưng hoạt động (màu đỏ)
  return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
};

export const getStatusText = (user) => {
  // Xác định isActive dựa trên kiểu dữ liệu
  const isActive =
    typeof user.isActive === "boolean"
      ? user.isActive
      : user.isActive === "TRUE" ||
        user.isActive === true ||
        user.status === "active";

  return isActive ? "Hoạt động" : "Ngưng hoạt động";
};

export const formatDate = (dateString) => {
  if (!dateString) return "Chưa cập nhật";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Ngày không hợp lệ";
  }
};

export const getUserDisplayInfo = (user) => {
  return {
    avatar: user.avatar || null,
    initials: user.name ? user.name.charAt(0).toUpperCase() : "?",
    phone: user.phoneNumber || user.phone || "Chưa cập nhật",
  };
};

export const validateUserForm = (userForm, isEdit = false) => {
  const errors = {};

  if (!userForm.name.trim()) {
    errors.name = "Họ và tên là bắt buộc";
  }

  if (!userForm.email.trim()) {
    errors.email = "Email là bắt buộc";
  } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
    errors.email = "Email không hợp lệ";
  }

  if (!userForm.role) {
    errors.role = "Vai trò là bắt buộc";
  }

  if (!isEdit && !userForm.password.trim()) {
    errors.password = "Mật khẩu là bắt buộc";
  } else if (!isEdit && userForm.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }

  if (userForm.phoneNumber && !/^[0-9+\-\s()]+$/.test(userForm.phoneNumber)) {
    errors.phoneNumber = "Số điện thoại không hợp lệ";
  }

  return errors;
};

export const filterUsers = (users, searchTerm, filter) => {
  return users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm) ||
      user.phone?.includes(searchTerm);

    if (filter === "all") return matchesSearch;

    if (
      ["admin", "manager", "consultant", "staff", "customer"].includes(filter)
    ) {
      return matchesSearch && user.role?.toLowerCase() === filter;
    }

    // For status filters (active/inactive)
    if (filter === "active") {
      const isActive =
        typeof user.isActive === "boolean"
          ? user.isActive
          : user.isActive === "TRUE" ||
            user.isActive === true ||
            user.status === "active";
      return matchesSearch && isActive;
    }

    if (filter === "inactive") {
      const isActive =
        typeof user.isActive === "boolean"
          ? user.isActive
          : user.isActive === "TRUE" ||
            user.isActive === true ||
            user.status === "active";
      return matchesSearch && !isActive;
    }

    return matchesSearch;
  });
};

export const paginateUsers = (users, currentPage, itemsPerPage) => {
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return {
    paginatedUsers,
    totalPages,
    startIndex,
    endIndex,
  };
};
