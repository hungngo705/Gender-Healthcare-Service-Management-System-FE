import React from "react";
import PropTypes from "prop-types";
import { User } from "lucide-react";
import userUtils from "../../utils/userUtils";

/**
 * Component to display user avatar with optional badge
 */
const UserAvatar = ({ size = "md", className = "" }) => {
  const { avatarInfo } = userUtils.useUserInfo();

  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  // Determine what to render inside the avatar circle
  const renderAvatarContent = () => {
    if (avatarInfo.imageUrl) {
      return (
        <img
          src={avatarInfo.imageUrl}
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      );
    } else if (avatarInfo.initial) {
      return (
        <span className="font-semibold text-lg">{avatarInfo.initial}</span>
      );
    } else {
      return <User />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${sizeClass} rounded-full overflow-hidden flex items-center justify-center bg-indigo-600 text-white`}
      >
        {renderAvatarContent()}
      </div>
    </div>
  );
};

UserAvatar.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  showBadge: PropTypes.bool,
  className: PropTypes.string,
};

export default UserAvatar;
