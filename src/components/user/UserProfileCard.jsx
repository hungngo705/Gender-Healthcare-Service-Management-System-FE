import React from "react";
import PropTypes from "prop-types";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User as UserIcon,
  Edit,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import userUtils from "../../utils/userUtils";

/**
 * Enhanced User Profile Card Component
 * Displays user information with a modern design and optional details
 */
const UserProfileCard = ({
  showDetails = true,
  showEdit = false,
  className = "",
}) => {
  const { currentUser, displayName, formattedRole } = userUtils.useUserInfo();

  if (!currentUser) {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm p-6 text-center ${className}`}
      >
        <div className="py-8">
          <UserIcon size={48} className="mx-auto text-gray-300" />
          <p className="mt-2 text-gray-500">Chưa đăng nhập</p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Thông tin cá nhân
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-shrink-0">
            <UserAvatar
              size="lg"
              showBadge={false}
              imageUrl={currentUser.avatarUrl || currentUser.avatar}
              initial={displayName?.charAt(0)?.toUpperCase()}
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">
              {displayName}
            </h3>

            {formattedRole && (
              <span className="inline-block px-3 py-1 mt-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {formattedRole}
              </span>
            )}

            {showEdit && (
              <button className="mt-2 flex items-center text-sm text-indigo-600 hover:text-indigo-800">
                <Edit className="h-4 w-4 mr-1" />
                Chỉnh sửa thông tin
              </button>
            )}
          </div>
        </div>

        {showDetails && (
          <div className="w-full mt-6 space-y-3 border-t border-gray-100 pt-4">
            {currentUser.email && (
              <div className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-3 text-gray-400" />
                <span>{currentUser.email}</span>
              </div>
            )}

            {(currentUser.phoneNumber || currentUser.phone) && (
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-3 text-gray-400" />
                <span>{currentUser.phoneNumber || currentUser.phone}</span>
              </div>
            )}

            {currentUser.address && (
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                <span>{currentUser.address}</span>
              </div>
            )}

            {(currentUser.birthday || currentUser.dateOfBirth) && (
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                <span>{currentUser.birthday || currentUser.dateOfBirth}</span>
              </div>
            )}

            {currentUser.gender && (
              <div className="flex items-center text-gray-600">
                <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span>
                  {currentUser.gender === "male"
                    ? "Nam"
                    : currentUser.gender === "female"
                    ? "Nữ"
                    : currentUser.gender}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

UserProfileCard.propTypes = {
  showDetails: PropTypes.bool,
  showEdit: PropTypes.bool,
  className: PropTypes.string,
};

export default UserProfileCard;
