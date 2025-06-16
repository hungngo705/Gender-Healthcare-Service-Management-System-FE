import React from "react";

const ConsultantCard = ({ consultant, isSelected, onSelect }) => {
  // Default avatar URL
  const defaultAvatar =
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  return (
    <li
      className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${
        isSelected ? "bg-indigo-50" : ""
      }`}
      onClick={() => onSelect(consultant)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 h-12 w-12">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={consultant.image || defaultAvatar}
            alt={consultant.name || "Consultant"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
          />
        </div>
        <div className="ml-4">
          <div className="font-medium text-gray-900">
            {consultant.name || "Unnamed Consultant"}
          </div>
          <div className="text-sm text-gray-500">
            {consultant.specialty || "General Consultation"}
          </div>
          <div className="flex items-center mt-1">
            <svg
              className="h-4 w-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span className="text-sm text-gray-500 ml-1">
              {consultant.rating || "N/A"} ({consultant.reviewCount || 0} đánh giá)
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ConsultantCard;