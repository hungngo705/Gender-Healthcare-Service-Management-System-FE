import { useState, useRef, useEffect, useCallback } from "react";
import {
  UserPlus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  Users,
  Mail,
  Shield,
  X,
  Eye,
  Grid3X3,
  List,
  XCircle,
  Phone,
  Loader,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { userService } from "../../../services/userService";
import toastService from "../../../utils/toastService";

function UserManagementTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    role: "",
    specialty: "",
    status: "active",
  });
  const [formErrors, setFormErrors] = useState({});
  const actionMenuRef = useRef(null); // Load users from API
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Loading users from API...");
      const response = await userService.getAllUsers();
      console.log("API response:", response);

      // Show all users (including customers)
      setUsers(response || []);
      console.log("Users set in state:", response || []);
    } catch (error) {
      console.error("Error loading users:", error);
      console.error("Error details:", error.response?.data || error.message);
      toastService.error(
        `Không thể tải danh sách người dùng: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Click outside handler for action menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target)
      ) {
        setShowActionMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // Filter users based on search and filter criteria
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm) ||
      user.phone?.includes(searchTerm);
    if (filter === "all") return matchesSearch;
    if (
      ["admin", "manager", "consultant", "staff", "customer"].includes(filter)
    ) {
      // Case insensitive role comparison
      return matchesSearch && user.role?.toLowerCase() === filter;
    }
    // For status filters (active/inactive) - handle both 'status' and 'isActive'
    if (filter === "active") {
      const isActive =
        user.isActive !== undefined ? user.isActive : user.status === "active";
      return matchesSearch && isActive;
    }
    if (filter === "inactive") {
      const isActive =
        user.isActive !== undefined ? user.isActive : user.status === "active";
      return matchesSearch && !isActive;
    }
    return matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset pagination when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  // Form validation
  const validateForm = (isEdit = false) => {
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleFormChange = (field, value) => {
    setUserForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  // Reset form
  const resetForm = () => {
    setUserForm({
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
      role: "",
      specialty: "",
      status: "active",
    });
    setFormErrors({});
  }; // Handle add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    console.log("handleAddUser called with form data:", userForm);

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    try {
      setSubmitting(true);

      // Create API payload with only the required fields
      const createUserData = {
        name: userForm.name,
        email: userForm.email,
        phoneNumber: userForm.phoneNumber,
        address: userForm.address,
        password: userForm.password,
        role: userForm.role,
      };
      const result = await userService.createUser(createUserData);
      console.log("User created successfully:", result);
      setShowAddUserModal(false);
      resetForm();
      await loadUsers(); // Reload users list
      toastService.success("Người dùng đã được tạo thành công!");
    } catch (error) {
      console.error("Error creating user:", error);
      console.error("Error details:", error.response?.data || error.message);
      toastService.error(
        `Không thể tạo người dùng mới: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };
  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || user.phone || "",
      address: user.address || "",
      password: "", // Don't populate password for editing
      role: user.role || "",
      specialty: user.specialty || "",
      status: user.status || "active",
    });
    setShowEditUserModal(true);
    setShowActionMenu(null);
  }; // Handle update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    console.log("handleUpdateUser called with form data:", userForm);
    console.log("Selected user:", selectedUser);

    if (!validateForm(true)) {
      console.log("Form validation failed for update");
      return;
    }

    try {
      setSubmitting(true); // Exclude password from update data
      // eslint-disable-next-line no-unused-vars
      const { password, ...updateData } = userForm;
      console.log(
        "Calling userService.updateUser with:",
        selectedUser.id,
        updateData
      );

      const result = await userService.updateUser(selectedUser.id, updateData);
      console.log("User updated successfully:", result);

      setShowEditUserModal(false);
      resetForm();
      setSelectedUser(null);
      await loadUsers(); // Reload users list
      toastService.success("Thông tin người dùng đã được cập nhật!");
    } catch (error) {
      console.error("Error updating user:", error);
      console.error("Error details:", error.response?.data || error.message);
      toastService.error(
        `Không thể cập nhật thông tin người dùng: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setShowActionMenu(null);
  };
  // Confirm delete user
  const confirmDeleteUser = async () => {
    console.log("confirmDeleteUser called for user:", selectedUser);

    try {
      setSubmitting(true);
      console.log("Calling userService.deleteUser with ID:", selectedUser.id);

      const result = await userService.deleteUser(selectedUser.id);
      console.log("User deleted successfully:", result);

      setShowDeleteModal(false);
      setSelectedUser(null);
      await loadUsers(); // Reload users list
      toastService.success("Người dùng đã được xóa thành công!");
    } catch (error) {
      console.error("Error deleting user:", error);
      console.error("Error details:", error.response?.data || error.message);
      toastService.error(
        `Không thể xóa người dùng: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
    setShowActionMenu(null);
  };
  // Handle toggle user status
  const handleToggleUserStatus = async (user) => {
    try {
      // Handle both 'status' and 'isActive' properties
      const currentActive =
        user.isActive !== undefined ? user.isActive : user.status === "active";
      const newActive = !currentActive;

      // Try to update using isActive first, fallback to status
      const updateData =
        user.isActive !== undefined
          ? { isActive: newActive }
          : { status: newActive ? "active" : "inactive" };

      await userService.updateUser(user.id, updateData);
      setShowActionMenu(null);
      await loadUsers(); // Reload users list
      toastService.success(
        `Đã ${newActive ? "kích hoạt" : "vô hiệu hóa"} người dùng ${user.name}`
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      toastService.error("Không thể cập nhật trạng thái người dùng");
    }
  };
  const getRoleBadgeClass = (userRole) => {
    const role = userRole?.toLowerCase(); // Handle case insensitive
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "manager":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white";
      case "consultant":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      case "staff":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "customer":
        return "bg-gradient-to-r from-orange-500 to-yellow-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getRoleText = (role) => {
    const lowerRole = role?.toLowerCase(); // Handle case insensitive
    switch (lowerRole) {
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
        return role || "Không xác định";
    }
  };
  const getStatusClass = (user) => {
    // Handle both 'status' and 'isActive' properties
    const isActive =
      user.isActive !== undefined ? user.isActive : user.status === "active";
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatusText = (user) => {
    // Handle both 'status' and 'isActive' properties
    const isActive =
      user.isActive !== undefined ? user.isActive : user.status === "active";
    return isActive ? "Hoạt động" : "Ngừng hoạt động";
  };
  // Helper function to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return "Ngày không hợp lệ";
    }
  };

  // Helper function to get user avatar or initials
  const getUserDisplayInfo = (user) => {
    return {
      avatar: user.avatar || null,
      initials: user.name ? user.name.charAt(0).toUpperCase() : "?",
      phone: user.phoneNumber || user.phone || "Chưa cập nhật",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Users className="h-6 w-6" />
            </div>{" "}
            <div>
              <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
              <p className="text-indigo-100 mt-1">
                Quản lý thông tin và quyền hạn của {filteredUsers.length} người
                dùng
                {filteredUsers.length > 0 && (
                  <span className="ml-2">
                    (Hiển thị {startIndex + 1}-
                    {Math.min(endIndex, filteredUsers.length)} của{" "}
                    {filteredUsers.length})
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center space-x-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <UserPlus className="h-5 w-5" />
            <span>Thêm người dùng</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "cards"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>{" "}
        </div>
        {/* Filter Buttons */}{" "}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { key: "all", label: "Tất cả", icon: Users },
            { key: "admin", label: "Quản trị viên", icon: Shield },
            { key: "manager", label: "Quản lý", icon: Users },
            { key: "consultant", label: "Tư vấn viên", icon: Users },
            { key: "staff", label: "Nhân viên", icon: Users },
            { key: "customer", label: "Khách hàng", icon: Users },
            { key: "active", label: "Hoạt động", icon: CheckCircle },
            { key: "inactive", label: "Ngừng hoạt động", icon: XCircle },
          ].map(({ key, label, icon }) => {
            const IconComponent = icon;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === key
                    ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-200"
                    : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Loader className="h-12 w-12 text-gray-400 animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Đang tải dữ liệu...
            </h3>
            <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Người dùng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Vai trò
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Hoạt động
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Thao tác
                    </th>
                  </tr>{" "}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {" "}
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-full object-cover"
                              src={user.avatar}
                              alt={user.name}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div
                              className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg"
                              style={{ display: "none" }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}{" "}
                            </div>{" "}
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {getUserDisplayInfo(user).phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                            user.role
                          )}`}
                        >
                          {getRoleText(user.role)}
                        </span>
                        {user.specialty && (
                          <div className="text-xs text-gray-500 mt-1">
                            Chuyên môn: {user.specialty}
                          </div>
                        )}
                      </td>{" "}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                            user
                          )}`}
                        >
                          {getStatusText(user)}
                        </span>
                      </td>{" "}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          Hoạt động gần nhất: {formatDate(user.lastActive)}
                        </div>
                        <div>Ngày tạo: {formatDate(user.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div
                          className="relative"
                          ref={
                            showActionMenu === user.id ? actionMenuRef : null
                          }
                        >
                          <button
                            onClick={() =>
                              setShowActionMenu(
                                showActionMenu === user.id ? null : user.id
                              )
                            }
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>

                          {showActionMenu === user.id && (
                            <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                              {" "}
                              <div className="py-1" role="menu">
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                  onClick={() => handleViewUser(user)}
                                >
                                  <Eye className="h-4 w-4 mr-3" />
                                  Xem chi tiết
                                </button>
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <Edit className="h-4 w-4 mr-3" />
                                  Chỉnh sửa
                                </button>{" "}
                                {/* Toggle status button - handle both status and isActive */}
                                {(() => {
                                  const isActive =
                                    user.isActive !== undefined
                                      ? user.isActive
                                      : user.status === "active";
                                  return isActive ? (
                                    <button
                                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                                      onClick={() =>
                                        handleToggleUserStatus(user)
                                      }
                                    >
                                      <XCircle className="h-4 w-4 mr-3" />
                                      Vô hiệu hóa
                                    </button>
                                  ) : (
                                    <button
                                      className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                                      onClick={() =>
                                        handleToggleUserStatus(user)
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 mr-3" />
                                      Kích hoạt
                                    </button>
                                  );
                                })()}
                                <hr className="my-1" />
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  <Trash2 className="h-4 w-4 mr-3" />
                                  Xóa người dùng
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>{" "}
              </table>
            </div>
            {/* Pagination Controls */}
            {filteredUsers.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Items per page selector */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Hiển thị:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) =>
                        handleItemsPerPageChange(parseInt(e.target.value))
                      }
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-700">
                      kết quả mỗi trang
                    </span>
                  </div>

                  {/* Pagination info and controls */}
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">
                      Trang {currentPage} của {totalPages}({startIndex + 1}-
                      {Math.min(endIndex, filteredUsers.length)} của{" "}
                      {filteredUsers.length})
                    </span>

                    <div className="flex items-center space-x-1">
                      {/* Previous button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
                        title="Trang trước"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Page numbers */}
                      <div className="flex space-x-1">
                        {Array.from(
                          { length: Math.min(totalPages, 5) },
                          (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                  currentPage === pageNumber
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          }
                        )}
                      </div>

                      {/* Next button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
                        title="Trang sau"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Add User Modal */}
            {showAddUserModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <UserPlus className="h-6 w-6" />
                        <h3 className="text-lg font-semibold">
                          Thêm người dùng mới
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowAddUserModal(false)}
                        className="text-white hover:text-gray-200 transition-colors"
                      >
                        <X className="h-6 w-6" />{" "}
                      </button>
                    </div>
                  </div>
                  <form onSubmit={handleAddUser} className="p-6 space-y-4">
                    <div>
                      <label
                        htmlFor="add-user-name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Họ và tên *
                      </label>
                      <input
                        id="add-user-name"
                        type="text"
                        required
                        value={userForm.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          formErrors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Nhập họ và tên"
                        disabled={submitting}
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="add-user-email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email *
                      </label>
                      <input
                        id="add-user-email"
                        type="email"
                        required
                        value={userForm.email}
                        onChange={(e) =>
                          handleFormChange("email", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          formErrors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Nhập địa chỉ email"
                        disabled={submitting}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="add-user-phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Số điện thoại
                      </label>
                      <input
                        id="add-user-phone"
                        type="tel"
                        value={userForm.phoneNumber}
                        onChange={(e) =>
                          handleFormChange("phoneNumber", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          formErrors.phoneNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Nhập số điện thoại"
                        disabled={submitting}
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.phoneNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="add-user-address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Địa chỉ
                      </label>
                      <textarea
                        id="add-user-address"
                        value={userForm.address}
                        onChange={(e) =>
                          handleFormChange("address", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Nhập địa chỉ"
                        rows={3}
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="add-user-password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Mật khẩu *
                      </label>
                      <input
                        id="add-user-password"
                        type="password"
                        required
                        value={userForm.password}
                        onChange={(e) =>
                          handleFormChange("password", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          formErrors.password
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Nhập mật khẩu"
                        disabled={submitting}
                      />
                      {formErrors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="add-user-role"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Vai trò *
                      </label>
                      <select
                        id="add-user-role"
                        required
                        value={userForm.role}
                        onChange={(e) =>
                          handleFormChange("role", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          formErrors.role ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={submitting}
                      >
                        {" "}
                        <option value="">Chọn vai trò</option>
                        <option value="admin">Quản trị viên</option>
                        <option value="manager">Quản lý</option>
                        <option value="consultant">Tư vấn viên</option>
                        <option value="staff">Nhân viên</option>
                        <option value="customer">Khách hàng</option>
                      </select>
                      {formErrors.role && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.role}{" "}
                        </p>
                      )}{" "}
                    </div>
                    <div>
                      <label
                        htmlFor="add-user-specialty"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Chuyên môn (dành cho tư vấn viên)
                      </label>
                      <input
                        id="add-user-specialty"
                        type="text"
                        value={userForm.specialty}
                        onChange={(e) =>
                          handleFormChange("specialty", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Nhập chuyên môn"
                        disabled={submitting}
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddUserModal(false);
                          resetForm();
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={submitting}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {submitting && (
                          <Loader className="h-4 w-4 animate-spin" />
                        )}
                        <span>
                          {submitting ? "Đang tạo..." : "Thêm người dùng"}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* Edit User Modal */}
            {showEditUserModal && selectedUser && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Edit className="h-6 w-6" />
                        <h3 className="text-lg font-semibold">
                          Chỉnh sửa người dùng
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setShowEditUserModal(false);
                          resetForm();
                          setSelectedUser(null);
                        }}
                        className="text-white hover:text-gray-200 transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                    <div>
                      <label
                        htmlFor="edit-user-name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Họ và tên *
                      </label>
                      <input
                        id="edit-user-name"
                        type="text"
                        required
                        value={userForm.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          formErrors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Nhập họ và tên"
                        disabled={submitting}
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="edit-user-email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email *
                      </label>
                      <input
                        id="edit-user-email"
                        type="email"
                        required
                        value={userForm.email}
                        onChange={(e) =>
                          handleFormChange("email", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          formErrors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Nhập địa chỉ email"
                        disabled={submitting}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="edit-user-phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Số điện thoại
                      </label>
                      <input
                        id="edit-user-phone"
                        type="tel"
                        value={userForm.phoneNumber}
                        onChange={(e) =>
                          handleFormChange("phoneNumber", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          formErrors.phoneNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Nhập số điện thoại"
                        disabled={submitting}
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="edit-user-address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Địa chỉ
                      </label>
                      <textarea
                        id="edit-user-address"
                        value={userForm.address}
                        onChange={(e) =>
                          handleFormChange("address", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Nhập địa chỉ"
                        rows={3}
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="edit-user-role"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Vai trò *
                      </label>
                      <select
                        id="edit-user-role"
                        required
                        value={userForm.role}
                        onChange={(e) =>
                          handleFormChange("role", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          formErrors.role ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={submitting}
                      >
                        {" "}
                        <option value="">Chọn vai trò</option>
                        <option value="admin">Quản trị viên</option>
                        <option value="manager">Quản lý</option>
                        <option value="consultant">Tư vấn viên</option>
                        <option value="staff">Nhân viên</option>
                        <option value="customer">Khách hàng</option>
                      </select>
                      {formErrors.role && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.role}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="edit-user-status"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Trạng thái
                      </label>
                      <select
                        id="edit-user-status"
                        value={userForm.status}
                        onChange={(e) =>
                          handleFormChange("status", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        disabled={submitting}
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Ngừng hoạt động</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditUserModal(false);
                          resetForm();
                          setSelectedUser(null);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={submitting}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {submitting && (
                          <Loader className="h-4 w-4 animate-spin" />
                        )}
                        <span>
                          {submitting ? "Đang cập nhật..." : "Cập nhật"}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                  <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-t-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-6 w-6" />
                        <h3 className="text-lg font-semibold">
                          Xác nhận xóa người dùng
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setShowDeleteModal(false);
                          setSelectedUser(null);
                        }}
                        className="text-white hover:text-gray-200 transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 rounded-full object-cover"
                          src={selectedUser.avatar}
                          alt={selectedUser.name}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div
                          className="h-16 w-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl"
                          style={{ display: "none" }}
                        >
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {selectedUser.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {selectedUser.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getRoleText(selectedUser.role)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-red-800">
                        <strong>Cảnh báo:</strong> Hành động này sẽ xóa vĩnh
                        viễn người dùng và tất cả dữ liệu liên quan. Bạn có chắc
                        chắn muốn tiếp tục?
                      </p>
                    </div>

                    <div className="flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteModal(false);
                          setSelectedUser(null);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={submitting}
                      >
                        Hủy
                      </button>
                      <button
                        onClick={confirmDeleteUser}
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {submitting && (
                          <Loader className="h-4 w-4 animate-spin" />
                        )}
                        <span>
                          {submitting ? "Đang xóa..." : "Xóa người dùng"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* User Details Modal */}
            {showDetailsModal && selectedUser && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4">
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-t-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Eye className="h-6 w-6" />
                        <h3 className="text-lg font-semibold">
                          Chi tiết người dùng
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          setSelectedUser(null);
                        }}
                        className="text-white hover:text-gray-200 transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column - Basic Info */}
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            <div className="relative">
                              <img
                                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                                src={selectedUser.avatar}
                                alt={selectedUser.name}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                              <div
                                className="h-24 w-24 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg"
                                style={{ display: "none" }}
                              >
                                {selectedUser.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900">
                            {selectedUser.name}
                          </h4>
                          <span
                            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${getRoleBadgeClass(
                              selectedUser.role
                            )}`}
                          >
                            {getRoleText(selectedUser.role)}
                          </span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Email
                              </p>
                              <p className="text-sm text-gray-600">
                                {selectedUser.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Số điện thoại
                              </p>{" "}
                              <p className="text-sm text-gray-600">
                                {getUserDisplayInfo(selectedUser).phone}
                              </p>
                            </div>
                          </div>

                          {selectedUser.address && (
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Địa chỉ
                                </p>
                                <p className="text-sm text-gray-600">
                                  {selectedUser.address}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column - Additional Info */}
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <h5 className="text-sm font-semibold text-gray-900 mb-3">
                              Trạng thái tài khoản
                            </h5>{" "}
                            <span
                              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(
                                selectedUser
                              )}`}
                            >
                              {getStatusText(selectedUser)}
                            </span>
                          </div>

                          {selectedUser.specialty && (
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                                Chuyên môn
                              </h5>
                              <p className="text-sm text-gray-600">
                                {selectedUser.specialty}
                              </p>
                            </div>
                          )}

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <h5 className="text-sm font-semibold text-gray-900 mb-3">
                              Thông tin hoạt động
                            </h5>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  Ngày tạo:
                                </span>{" "}
                                <span className="text-sm font-medium text-gray-900">
                                  {formatDate(selectedUser.createdAt)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  Hoạt động gần nhất:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatDate(selectedUser.lastActive)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setShowDetailsModal(false);
                              handleEditUser(selectedUser);
                            }}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Chỉnh sửa</span>
                          </button>{" "}
                          <button
                            onClick={() => handleToggleUserStatus(selectedUser)}
                            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${(() => {
                              const isActive =
                                selectedUser.isActive !== undefined
                                  ? selectedUser.isActive
                                  : selectedUser.status === "active";
                              return isActive
                                ? "text-red-700 bg-red-100 hover:bg-red-200"
                                : "text-green-700 bg-green-100 hover:bg-green-200";
                            })()}`}
                          >
                            {(() => {
                              const isActive =
                                selectedUser.isActive !== undefined
                                  ? selectedUser.isActive
                                  : selectedUser.status === "active";
                              return isActive ? (
                                <>
                                  <XCircle className="h-4 w-4" />
                                  <span>Vô hiệu hóa</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Kích hoạt</span>
                                </>
                              );
                            })()}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}{" "}
            {/* Empty State */}
            {paginatedUsers.length === 0 && filteredUsers.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy người dùng
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filter !== "all"
                    ? "Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
                    : "Chưa có người dùng nào trong hệ thống"}
                </p>
                {!searchTerm && filter === "all" && (
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Thêm người dùng đầu tiên</span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserManagementTab;
