import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import userService from "../../services/userService"; // Changed from userUtils

function WelcomeBanner({ greeting }) {
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    formattedRole: "",
  });

  // Fetch user profile data using userService
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await userService.getCurrentUserProfile();

        // Extract display name from user data
        const displayName =
          userData.name || userData.email?.split("@")[0] || "User";

        // Format role information
        let formattedRole = "Người dùng";
        if (userData.role && userData.role.name) {
          const roleName = userData.role.name.toString();
          if (roleName === "0") formattedRole = "Người dùng";
          else if (roleName === "1") formattedRole = "Tư vấn viên";
          else if (roleName === "2") formattedRole = "Nhân viên";
          else if (roleName === "3") formattedRole = "Quản lý";
          else if (roleName === "4") formattedRole = "Quản trị viên";
        }

        setUserProfile({ displayName, formattedRole });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setUserProfile({
          displayName: "Người dùng",
          formattedRole: "Khách",
        });
      }
    };

    fetchUserProfile();
  }, []);

  const { displayName, formattedRole } = userProfile;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 mb-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {greeting}, {displayName}!
          </h2>
          <p className="opacity-90 mt-1">
            Chào mừng bạn quay trở lại hệ thống quản lý EverWell
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-300 bg-opacity-25">
              {formattedRole}
            </span>
          </p>
        </div>
        <div className="hidden md:block">
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium transition-colors hover:bg-opacity-90">
            Xem thông báo
          </button>
        </div>
      </div>
    </div>
  );
}

WelcomeBanner.propTypes = {
  greeting: PropTypes.string.isRequired,
};

export default WelcomeBanner;
