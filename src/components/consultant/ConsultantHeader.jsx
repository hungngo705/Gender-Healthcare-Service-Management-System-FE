import React from "react";
import { Star } from "lucide-react";

function ConsultantHeader({ consultant }) {
  if (!consultant) return null;

  return (
    <div className="bg-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            <img
              src={consultant.image}
              alt={consultant.name}
              className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{consultant.name}</h1>
            <p className="text-indigo-200 text-xl mb-4">
              {consultant.specialty}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center">
                <div className="flex text-yellow-300 mr-1">
                  {Array(5)
                    .fill()
                    .map((_, index) => (
                      <Star
                        key={index}
                        size={20}
                        fill={
                          index < Math.floor(consultant.rating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                </div>
                <span>({consultant.reviewCount} đánh giá)</span>
              </div>

              <div className="flex items-center">
                <span className="bg-indigo-600 px-3 py-1 rounded-full text-sm">
                  {consultant.yearsExperience} năm kinh nghiệm
                </span>
              </div>
            </div>

            <p className="text-lg max-w-3xl">{consultant.shortBio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultantHeader;
