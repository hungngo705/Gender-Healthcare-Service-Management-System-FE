import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
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
} from "lucide-react";
import users from "../../../data/users";

function UserManagementTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "cards" or "table"
  const actionMenuRef = useRef(null);

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
  }, []);

  // Filter only staff/admin/consultant/manager users (not customers)
  const systemUsers = users.filter((user) =>
    ["admin", "manager", "consultant", "staff"].includes(user.role)
  ); // Filter logic
  const filteredUsers = systemUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (["admin", "manager", "consultant", "staff"].includes(filter)) {
      return matchesSearch && user.role === filter;
    }
    return matchesSearch && user.status === filter;
  });
  const getRoleBadgeClass = (userRole) => {
    switch (userRole) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "manager":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white";
      case "consultant":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      case "staff":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "manager":
        return "Quản lý";
      case "consultant":
        return "Tư vấn viên";
      case "staff":
        return "Nhân viên";
      default:
        return role;
    }
  };

  const getStatusClass = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getStatusText = (status) => {
    return status === "active" ? "Hoạt động" : "Ngừng hoạt động";
  };
  return (
    <div className="space-y-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
              <p className="text-indigo-100 mt-1">
                Quản lý thông tin và quyền hạn của {filteredUsers.length} người
                dùng
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
          </div>
        </div>{" "}
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { key: "all", label: "Tất cả", icon: Users },
            { key: "admin", label: "Quản trị viên", icon: Shield },
            { key: "manager", label: "Quản lý", icon: Users },
            { key: "consultant", label: "Tư vấn viên", icon: Users },
            { key: "staff", label: "Nhân viên", icon: Users },
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
              </tr>
            </thead>{" "}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  {" "}
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
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        user.status
                      )}`}
                    >
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      Hoạt động gần nhất:{" "}
                      {new Date(user.lastActive).toLocaleDateString("vi-VN")}
                    </div>
                    <div>
                      Ngày tạo:{" "}
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div
                      className="relative"
                      ref={showActionMenu === user.id ? actionMenuRef : null}
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
                          <div className="py-1" role="menu">
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                setShowActionMenu(null);
                                // Handle view action
                              }}
                            >
                              <Eye className="h-4 w-4 mr-3" />
                              Xem chi tiết
                            </button>

                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                setShowActionMenu(null);
                                // Handle edit action
                              }}
                            >
                              <Edit className="h-4 w-4 mr-3" />
                              Chỉnh sửa
                            </button>

                            {user.status === "active" ? (
                              <button
                                className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                                onClick={() => {
                                  setShowActionMenu(null);
                                  // Handle deactivate action
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-3" />
                                Vô hiệu hóa
                              </button>
                            ) : (
                              <button
                                className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                                onClick={() => {
                                  setShowActionMenu(null);
                                  // Handle activate action
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-3" />
                                Kích hoạt
                              </button>
                            )}

                            <hr className="my-1" />

                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                              onClick={() => {
                                setShowActionMenu(null);
                                // Handle delete action
                              }}
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
            </tbody>
          </table>{" "}
        </div>
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
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Nhập địa chỉ email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vai trò *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Chọn vai trò</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="manager">Quản lý</option>
                    <option value="consultant">Tư vấn viên</option>
                    <option value="staff">Nhân viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chuyên môn (dành cho tư vấn viên)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Nhập chuyên môn"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all"
                  >
                    Thêm người dùng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Empty State */}
        {filteredUsers.length === 0 && (
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
      </div>
    </div>
  );
}

UserManagementTab.propTypes = {
  role: PropTypes.string.isRequired,
};

export default UserManagementTab;
