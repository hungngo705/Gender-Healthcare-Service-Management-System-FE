import React from "react";

const ConsultantDetail = ({ consultant }) => {
  return (
    <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
      <div className="px-6 py-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Thông tin tư vấn viên</h2>
        <div className="flex flex-col md:flex-row">
          <div className="mb-4 md:mb-0 md:mr-6">
            <img
              className="h-60 w-150 rounded-lg object-cover"
              src={consultant.image}
              alt={consultant.name}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {consultant.name}
            </h3>
            <div className="text-indigo-600 mb-2">{consultant.specialty}</div>
            <div className="flex items-center mb-4">
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-gray-700 ml-1">
                {consultant.rating} ({consultant.reviewCount} đánh giá)
              </span>
            </div>
            <p className="text-gray-600">{consultant.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDetail;