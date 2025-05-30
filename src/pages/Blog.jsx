import React, { useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Search } from "lucide-react";

// Blog data should be moved to a separate file
import { blogPosts } from "../data/blogData";

const categories = [
  { id: "all", name: "Tất cả bài viết" },
  { id: "reproductive", name: "Sức khỏe sinh sản" },
  { id: "sexual", name: "Sức khỏe tình dục" },
  { id: "mental", name: "Sức khỏe tâm thần" },
  { id: "education", name: "Giáo dục giới tính" },
];

function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter blog posts by category and search term
  const filteredBlogs = blogPosts
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by newest date
    .map((blog) => ({
      ...blog,
      categoryName: categories.find((cat) => cat.id === blog.category)?.name,
    }))
    .filter(
      (blog) => activeCategory === "all" || blog.category === activeCategory
    )
    .filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            >
              Tin Tức Sức Khỏe Giới Tính
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-lg"
            >
              Khám phá kiến thức, tin tức, và hướng dẫn về sức khỏe sinh sản, 
              sức khỏe tình dục, và các vấn đề giới tính từ các chuyên gia
            </motion.p>

            {/* Search box */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-5 pr-12 py-3.5 rounded-full text-gray-800 
                bg-white/90 backdrop-filter backdrop-blur-md shadow-lg 
                border border-white/30 hover:border-white/50
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                transition-all duration-300"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Categories filter */}
        <div className="flex overflow-x-auto py-4 scrollbar-hide space-x-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } transition-colors`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Featured blog post */}
        {filteredBlogs.length > 0 && (
          <div className="mb-12">
            <Link to={`/blog/${filteredBlogs[0].id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={filteredBlogs[0].img}
                      alt={filteredBlogs[0].title}
                      className="h-64 w-full object-cover md:h-full"
                    />
                  </div>
                  <div className="p-8 md:w-1/2 flex flex-col justify-center">
                    <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
                      Bài Viết Nổi Bật
                    </div>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                      {filteredBlogs[0].title}
                    </h2>
                    <p className="mt-3 text-gray-500">
                      {filteredBlogs[0].excerpt}
                    </p>
                    <div className="mt-4 flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={
                            filteredBlogs[0].authorImg ||
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          }
                          alt={filteredBlogs[0].author || "Tác giả"}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {filteredBlogs[0].author || "Đội Chăm Sóc Sức Khỏe Giới Tính"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(filteredBlogs[0].date).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        )}

        {/* Filter status */}
        {searchTerm && (
          <p className="text-gray-600 mb-4">
            Hiển thị {filteredBlogs.length} kết quả cho "{searchTerm}"
          </p>
        )}

        {/* Blog grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900">
              Không tìm thấy bài viết nào
            </h3>
            <p className="mt-2 text-gray-500">
              Vui lòng thử từ khóa khác hoặc chọn danh mục khác
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.slice(1).map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/blog/${blog.id}`} className="block h-full">
                  <div className="h-full bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={blog.img}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">
                          {blog.categoryName || "Sức khỏe"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(blog.date).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <div className="mt-4 flex items-center">
                        <img
                          className="h-8 w-8 rounded-full mr-2"
                          src={
                            blog.authorImg ||
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          }
                          alt={blog.author || "Tác giả"}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {blog.author || "Đội Chăm Sóc Sức Khỏe Giới Tính"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Newsletter subscription */}
        <div className="mt-16 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-indigo-700 p-8 text-white flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">Đăng ký nhận bản tin</h3>
              <p className="mb-6">
                Nhận thông tin mới nhất về sức khỏe giới tính qua email.
                Chúng tôi sẽ không gửi thư rác hoặc chia sẻ thông tin của bạn.
              </p>
              <div className="flex flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="px-4 py-2 w-full sm:w-auto rounded-l text-white focus:outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
                <button className="mt-2 sm:mt-0 bg-white text-indigo-700 font-medium px-4 py-2 rounded-r hover:bg-gray-100 transition-colors">
                  Đăng ký
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="Bản tin"
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;