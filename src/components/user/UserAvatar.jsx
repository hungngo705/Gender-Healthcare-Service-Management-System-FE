import React from "react";
import PropTypes from "prop-types";
import { User } from "lucide-react";

/**
 * Component to display user avatar with optional badge
 */
const UserAvatar = ({
  size = "md",
  className = "",
  imageUrl = "",
  initial = "",
}) => {
  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  // State to handle image loading errors
  const [imgError, setImgError] = React.useState(false);

  // For monitoring/debugging purposes
  React.useEffect(() => {
    if (imageUrl) {
      console.log("Avatar component using URL:", imageUrl);
    }
  }, [imageUrl]);

  // Determine what to render inside the avatar circle
  const renderAvatarContent = () => {
    if (imageUrl && !imgError) {
      return (
        <img
          src={imageUrl}
          alt="User avatar"
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
          onError={(e) => {
            console.error("Avatar image failed to load:", e);
            setImgError(true);
          }}
        />
      );
    } else if (initial) {
      return <span className="font-semibold text-lg">{initial}</span>;
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
  className: PropTypes.string,
  imageUrl: PropTypes.string,
  initial: PropTypes.string,
};

export default UserAvatar;
