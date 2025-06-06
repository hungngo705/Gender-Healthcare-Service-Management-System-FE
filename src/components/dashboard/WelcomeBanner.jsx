import React from "react";
import PropTypes from "prop-types";
import userUtils from "../../utils/userUtils";

function WelcomeBanner({ greeting }) {
  const { displayName, formattedRole } = userUtils.useUserInfo();

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 mb-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {greeting}, {displayName}!
          </h2>
          <p className="opacity-90 mt-1">
            Chào mừng bạn quay trở lại hệ thống quản lý Gender Healthcare
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
