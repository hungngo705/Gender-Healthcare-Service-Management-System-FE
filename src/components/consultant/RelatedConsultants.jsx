import React from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function RelatedConsultants({ consultants }) {
  if (!consultants || consultants.length === 0) return null;

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Tư vấn viên tương tự</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {consultants.map((consultant) => (
            <motion.div
              key={consultant.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={consultant.image}
                alt={consultant.name || "Consultant image"}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{consultant.name}</h3>
                <p className="text-indigo-600 text-sm mb-2">
                  {consultant.specialty}
                </p>
                <div className="flex items-center mb-3">
                  <div className="text-yellow-400">
                    {consultant.rating &&
                      "★".repeat(Math.floor(consultant.rating))}
                    {consultant.rating &&
                      "☆".repeat(5 - Math.floor(consultant.rating))}
                  </div>
                  <span className="text-gray-500 text-sm ml-1">
                    ({consultant.reviewCount || 0} đánh giá)
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {consultant.shortBio}
                </p>
                <Link
                  to={`/consultants/${consultant.id}`}
                  className="inline-block w-full text-center py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition duration-300"
                >
                  Xem Hồ Sơ
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedConsultants;
