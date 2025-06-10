import { useState, useEffect, useCallback } from "react";
import { userService } from "../../../../services/userService";
import toastService from "../../../../utils/toastService";
import {
  validateUserForm,
  filterUsers,
  paginateUsers,
} from "../utils/userManagementUtils";

export const useUserManagement = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
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

  // Load users from API
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Loading users from API...");
      const response = await userService.getAllUsers();
      console.log("API response:", response);
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

  // Load users on hook initialization
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filter and paginate users
  const filteredUsers = filterUsers(users, searchTerm, filter);
  const { paginatedUsers, totalPages, startIndex, endIndex } = paginateUsers(
    filteredUsers,
    currentPage,
    itemsPerPage
  );

  // Reset pagination when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  // Form handlers
  const handleFormChange = (field, value) => {
    setUserForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

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
  };

  // User CRUD operations
  const handleAddUser = async (e) => {
    e.preventDefault();
    console.log("handleAddUser called with form data:", userForm);

    const errors = validateUserForm(userForm);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      console.log("Form validation failed");
      return;
    }

    try {
      setSubmitting(true);
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
      await loadUsers();
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

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || user.phone || "",
      address: user.address || "",
      password: "",
      role: user.role || "",
      specialty: user.specialty || "",
      status: user.status || "active",
    });
    setShowEditUserModal(true);
    setShowActionMenu(null);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    console.log("handleUpdateUser called with form data:", userForm);
    console.log("Selected user:", selectedUser);

    const errors = validateUserForm(userForm, true);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      console.log("Form validation failed for update");
      return;
    }

    try {
      setSubmitting(true);
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
      await loadUsers();
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

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setShowActionMenu(null);
  };

  const confirmDeleteUser = async () => {
    console.log("confirmDeleteUser called for user:", selectedUser);

    try {
      setSubmitting(true);
      console.log("Calling userService.deleteUser with ID:", selectedUser.id);

      const result = await userService.deleteUser(selectedUser.id);
      console.log("User deleted successfully:", result);

      setShowDeleteModal(false);
      setSelectedUser(null);
      await loadUsers();
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

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
    setShowActionMenu(null);
  };

  const handleToggleUserStatus = async (user) => {
    try {
      const currentActive =
        user.isActive !== undefined ? user.isActive : user.status === "active";
      const newActive = !currentActive;

      const updateData = {
        isActive: newActive,
        status: newActive ? "active" : "inactive",
      };

      await userService.updateUser(user.id, updateData);
      await loadUsers();
      toastService.success(
        `Người dùng đã được ${
          newActive ? "kích hoạt" : "vô hiệu hóa"
        } thành công!`
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
      toastService.error(
        `Không thể thay đổi trạng thái người dùng: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleReturnToFirstPage = () => {
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Modal close handlers
  const closeAddUserModal = () => {
    setShowAddUserModal(false);
    resetForm();
  };

  const closeEditUserModal = () => {
    setShowEditUserModal(false);
    resetForm();
    setSelectedUser(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedUser(null);
  };

  return {
    // State
    searchTerm,
    filter,
    showActionMenu,
    showAddUserModal,
    showEditUserModal,
    showDeleteModal,
    showDetailsModal,
    currentPage,
    itemsPerPage,
    selectedUser,
    users,
    loading,
    submitting,
    userForm,
    formErrors,
    filteredUsers,
    paginatedUsers,
    totalPages,
    startIndex,
    endIndex,

    // State setters
    setShowActionMenu,
    setShowAddUserModal,
    setShowEditUserModal,
    setShowDeleteModal,
    setShowDetailsModal,

    // Handlers
    handleFormChange,
    resetForm,
    handleAddUser,
    handleEditUser,
    handleUpdateUser,
    handleDeleteUser,
    confirmDeleteUser,
    handleViewUser,
    handleToggleUserStatus,
    handlePageChange,
    handleItemsPerPageChange,
    handleReturnToFirstPage,
    handleSearchChange,
    handleFilterChange,
    closeAddUserModal,
    closeEditUserModal,
    closeDeleteModal,
    closeDetailsModal,

    // Utils
    loadUsers,
  };
};
