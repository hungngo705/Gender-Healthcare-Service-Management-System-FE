import React from "react";
import PropTypes from "prop-types";
import { UserPlus, Users } from "lucide-react";

const UserManagementHeader = ({
  filteredUsers,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  itemsPerPage,
  searchTerm,
  filter,
  onAddUser,
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
            <p className="text-indigo-100 mt-1">
              {filteredUsers.length > 0 ? (
                <>
                  Quản lý thông tin và quyền hạn của{" "}
                  <span className="font-semibold">{filteredUsers.length}</span>{" "}
                  người dùng
                  {filteredUsers.length > itemsPerPage && (
                    <span className="ml-2 opacity-90">
                      (Hiển thị {startIndex + 1}-
                      {Math.min(endIndex, filteredUsers.length)} trên trang{" "}
                      {currentPage}/{totalPages})
                    </span>
                  )}
                </>
              ) : searchTerm || filter !== "all" ? (
                `Không tìm thấy người dùng phù hợp với bộ lọc hiện tại`
              ) : (
                "Chưa có người dùng nào trong hệ thống"
              )}
            </p>
          </div>
        </div>
        <button
          onClick={onAddUser}
          className="flex items-center space-x-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <UserPlus className="h-5 w-5" />
          <span>Thêm người dùng</span>
        </button>
      </div>
    </div>
  );
};

UserManagementHeader.propTypes = {
  filteredUsers: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  startIndex: PropTypes.number.isRequired,
  endIndex: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  filter: PropTypes.string.isRequired,
  onAddUser: PropTypes.func.isRequired,
};

export default UserManagementHeader;
