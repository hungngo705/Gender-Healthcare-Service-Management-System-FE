import React from "react";
import PropTypes from "prop-types";
import UserAvatar from "../user/UserAvatar";
import userUtils from "../../utils/userUtils";

/**
 * Header component for profile pages
 * Displays user avatar, name and role
 */
function ProfileHeader({ showAvatar = true, showRole = true }) {
  const { displayName, formattedRole } = userUtils.useUserInfo();

  return (
    <div className="flex items-center mb-6">
      {showAvatar && (
        <div className="mr-4">
          <UserAvatar size="lg"/>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
        {showRole && formattedRole && (
          <p className="text-sm text-indigo-600 font-medium">{formattedRole}</p>
        )}
      </div>
    </div>
  );
}

ProfileHeader.propTypes = {
  showAvatar: PropTypes.bool,
  showRole: PropTypes.bool,
};

export default ProfileHeader;
