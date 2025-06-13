import React, { useEffect } from "react";

// Import our new components
import UserManagementHeader from "../user-management/UserManagementHeader";
import SearchAndFilters from "../user-management/SearchAndFilters";
import UserStatsCards from "../user-management/UserStatsCards";
import EmptyStates from "../user-management/EmptyStates";
import UserTable from "../user-management/UserTable";
import PaginationControls from "../user-management/PaginationControls";

// Import modals
import AddUserModal from "../user-management/modals/AddUserModal";
import EditUserModal from "../user-management/modals/EditUserModal";
import DeleteUserModal from "../user-management/modals/DeleteUserModal";
import UserDetailsModal from "../user-management/modals/UserDetailsModal";

// Import utilities and hook
import {
  getRoleBadgeClass,
  getRoleText,
  getStatusClass,
  getStatusText,
  formatDate,
  getUserDisplayInfo,
} from "../user-management/utils/userManagementUtils";
import { useUserManagement } from "../user-management/hooks/useUserManagement";

function UserManagementTab() {
  const {
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

    // Handlers
    handleFormChange,
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
  } = useUserManagement();

  // Click outside handler for action menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (showActionMenu && !event.target.closest("[data-action-menu]")) {
        setShowActionMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showActionMenu, setShowActionMenu]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <UserManagementHeader
        filteredUsers={filteredUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        itemsPerPage={itemsPerPage}
        searchTerm={searchTerm}
        filter={filter}
        onAddUser={() => setShowAddUserModal(true)}
      />
      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filter={filter}
        onFilterChange={handleFilterChange}
      />
      {/* Stats Cards */}
      {!loading && filteredUsers.length > 0 && (
        <UserStatsCards
          filteredUsers={filteredUsers}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 z-10">
        {/* Empty States (Loading, No Data, etc.) */}
        <EmptyStates
          loading={loading}
          paginatedUsers={paginatedUsers}
          filteredUsers={filteredUsers}
          searchTerm={searchTerm}
          filter={filter}
          onAddUser={() => setShowAddUserModal(true)}
          onReturnToFirstPage={handleReturnToFirstPage}
        />

        {/* User Table */}
        {!loading && paginatedUsers.length > 0 && (
          <UserTable
            paginatedUsers={paginatedUsers}
            showActionMenu={showActionMenu}
            setShowActionMenu={setShowActionMenu}
            onViewUser={(user) => {
              // Always use the handle functions from the hook
              handleViewUser(user);
            }}
            onEditUser={(user) => {
              // Always use the handle functions from the hook
              handleEditUser(user);
            }}
            onToggleUserStatus={handleToggleUserStatus}
            onDeleteUser={handleDeleteUser}
            getRoleBadgeClass={getRoleBadgeClass}
            getRoleText={getRoleText}
            getStatusClass={getStatusClass}
            getStatusText={getStatusText}
            getUserDisplayInfo={getUserDisplayInfo}
            formatDate={formatDate}
          />
        )}
      </div>
      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        filteredUsers={filteredUsers}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      {/* Modals */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={closeAddUserModal}
        onSubmit={handleAddUser}
        userForm={userForm}
        formErrors={formErrors}
        submitting={submitting}
        onFormChange={handleFormChange}
      />
      <EditUserModal
        isOpen={showEditUserModal}
        onClose={closeEditUserModal}
        onSubmit={handleUpdateUser}
        userForm={userForm}
        formErrors={formErrors}
        submitting={submitting}
        onFormChange={handleFormChange}
      />
      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteUser}
        user={selectedUser}
        submitting={submitting}
      />
      {/* User Details Modal */}
      {/* Adding key={selectedUser?.id} forces re-render when user changes */}
      <UserDetailsModal
        key={selectedUser?.id || "details-modal"}
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        user={selectedUser}
        onEdit={handleEditUser}
        onToggleStatus={handleToggleUserStatus}
        getRoleBadgeClass={getRoleBadgeClass}
        getRoleText={getRoleText}
        formatDate={formatDate}
      />
    </div>
  );
}

export default UserManagementTab;
