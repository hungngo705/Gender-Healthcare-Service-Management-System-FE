import { Calendar, Star, MessageCircle } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function ConsultantTabs({
  selectedTab,
  setSelectedTab,
  consultant,
  reviews,
  articles,
}) {
  const tabs = [
    { id: "about", label: "Giới thiệu" },
    { id: "experience", label: "Kinh nghiệm" },
    { id: "services", label: "Dịch vụ" },
    { id: "reviews", label: "Đánh giá" },
    { id: "articles", label: "Bài viết" },
  ];

  // Kiểm tra xem có dữ liệu consultant không trước khi render
  if (!consultant) {
    return <div>Không tìm thấy thông tin tư vấn viên</div>;
  }

  return (
    <div className="w-full lg:w-2/3">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-4 px-6 font-medium text-sm flex-shrink-0 ${
                selectedTab === tab.id
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-lg p-6 shadow-sm min-h-[400px]">
        {/* About Tab */}
        {selectedTab === "about" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
            <div className="prose max-w-none">
              {consultant.bio &&
                consultant.bio.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-4">
                    {paragraph}
                  </p>
                ))}
            </div>
          </motion.div>
        )}

        {/* Experience Tab */}
        {selectedTab === "experience" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Kinh nghiệm chuyên môn</h2>
            <div className="space-y-6">
              {consultant.experience &&
                consultant.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 border-indigo-200 pl-4 py-2"
                  >
                    <h3 className="text-lg font-semibold">{exp.role}</h3>
                    <div className="text-gray-600">{exp.workplace}</div>
                    <div className="text-sm text-gray-500">{exp.period}</div>
                    <p className="mt-2">{exp.description}</p>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Services Tab */}
        {selectedTab === "services" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Dịch vụ tư vấn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultant.services &&
                consultant.services.map((service, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">{service.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar size={16} className="mr-1" />
                      <span>{service.duration}</span>
                    </div>
                    <p>{service.description}</p>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Reviews Tab */}
        {selectedTab === "reviews" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Đánh giá từ người dùng</h2>
              <div className="flex items-center">
                <div className="text-yellow-400 mr-2">
                  <Star fill="currentColor" size={20} />
                </div>
                <span className="font-medium">{consultant.rating}/5</span>
                <span className="text-gray-500 ml-1">
                  ({consultant.reviewCount} đánh giá)
                </span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Chưa có đánh giá nào cho tư vấn viên này.
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <span className="font-medium text-indigo-800">
                            {review.userName && review.userName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{review.userName}</div>
                          <div className="text-sm text-gray-500">
                            {review.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex text-yellow-400">
                        {Array(5)
                          .fill()
                          .map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < review.rating ? "currentColor" : "none"}
                            />
                          ))}
                      </div>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Articles Tab */}
        {selectedTab === "articles" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Bài viết chuyên môn</h2>

            {articles.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Tư vấn viên này chưa có bài viết nào.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {articles.map((article) => (
                  <div key={article.id} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-gray-500 mb-3">
                      <Calendar size={16} className="mr-1" />
                      <span className="mr-3">{article.date}</span>
                      <MessageCircle size={16} className="mr-1" />
                      <span>{article.commentCount} bình luận</span>
                    </div>
                    <p className="mb-3">{article.excerpt}</p>
                    <a
                      href={`/blog/${article.id}`}
                      className="text-indigo-600 font-medium hover:text-indigo-800"
                    >
                      Đọc thêm →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ConsultantTabs;
