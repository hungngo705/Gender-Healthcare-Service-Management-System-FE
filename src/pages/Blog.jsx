import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import blogService from "../services/blogService";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const categories = [
  { id: "all", name: "Tất cả bài viết" },
  { id: "0", name: "Sức khỏe sinh sản" },
  { id: "1", name: "Sức khỏe tình dục" },
  { id: "2", name: "Sức khỏe tâm thần" },
  { id: "3", name: "Giáo dục giới tính" },
  { id: "5", name: "Sức khỏe tinh thần" },
];

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()} tháng ${
    date.getMonth() + 1
  }, ${date.getFullYear()}`;
};

// Helper function to get category name
const getCategoryName = (categoryId) => {
  const category = categories.find((cat) => cat.id === categoryId.toString());
  return category ? category.name : "Khác";
};

// Helper function to get status class and text
const getStatusInfo = (status) => {
  switch (status) {
    case 0:
      return { class: "bg-yellow-100 text-yellow-800", text: "Bản nháp" };
    case 1:
      return { class: "bg-blue-100 text-blue-800", text: "Đang xét duyệt" };
    case 2:
      return { class: "bg-red-100 text-red-800", text: "Đã từ chối" };
    case 3:
      return { class: "bg-green-100 text-green-800", text: "Đã xuất bản" };
    default:
      return { class: "bg-gray-100 text-gray-800", text: "Không xác định" };
  }
};

function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const data = await blogService.getAll();
        console.log("Blog posts loaded:", data);

        // CHỈ hiển thị bài viết đã được xuất bản (status = 3)
        const publishedPosts = data.filter((post) => post.status === 3);
        setBlogPosts(publishedPosts);
      } catch (err) {
        console.error("Failed to fetch blog posts:", err);

        if (err.response?.status === 401) {
          setError(
            "Bạn cần đăng nhập để xem các bài viết. Vui lòng đăng nhập và thử lại."
          );
        } else {
          setError(
            `Không thể tải bài viết. Lỗi: ${err.message || "không xác định"}`
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Filter blog posts by category and search term
  const filteredBlogs = blogPosts
    .filter(
      (blog) =>
        activeCategory === "all" || blog.category.toString() === activeCategory
    )
    .filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryName(blog.category)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Có lỗi xảy ra</h1>
        <p className="text-gray-600 mb-4">{error}</p>

        {error.includes("đăng nhập") && (
          <Link
            to="/login"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Đăng nhập ngay
          </Link>
        )}

        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Tin Tức Sức Khỏe Giới Tính
            </h1>
            <p className="mt-4 text-lg">
              Khám phá kiến thức, tin tức, và hướng dẫn về sức khỏe sinh sản,
              sức khỏe tình dục, và các vấn đề giới tính từ các chuyên gia
            </p>

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
                  <Search className="h-5 w-5 text-gray-500" />
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

        {/* Featured blog post - only show if we have posts */}
        {filteredBlogs.length > 0 && (
          <div className="mb-12">
            <Link to={`/blog/${filteredBlogs[0].id}`}>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={
                        filteredBlogs[0].imageUrl ||
                        "https://via.placeholder.com/800x400?text=No+Image"
                      }
                      alt={filteredBlogs[0].title}
                      className="h-64 w-full object-cover md:h-full"
                    />
                  </div>
                  <div className="p-8 md:w-1/2 flex flex-col justify-center">
                    <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
                      BÀI VIẾT NỔI BẬT
                    </div>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                      {filteredBlogs[0].title}
                    </h2>
                    <p className="mt-3 text-gray-500">
                      {filteredBlogs[0].content.substring(0, 150)}...
                    </p>
                    <div className="mt-4 flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={
                            filteredBlogs[0].staff?.avatarUrl ||
                            "https://via.placeholder.com/100?text=User"
                          }
                          alt={filteredBlogs[0].staff?.name || "Tác giả"}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {filteredBlogs[0].staff?.name ||
                            "Tác giả không xác định"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(filteredBlogs[0].createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            {filteredBlogs.slice(1).map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.id}`}
                className="block h-full"
              >
                <div className="h-full bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={
                        blog.imageUrl ||
                        "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">
                        {getCategoryName(blog.category)}
                      </span>
                      {/* Status badge */}
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold ${
                          getStatusInfo(blog.status).class
                        } rounded-full`}
                      >
                        {getStatusInfo(blog.status).text}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {blog.content}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-8 w-8 rounded-full mr-2"
                          src={
                            blog.staff?.avatarUrl ||
                            "https://via.placeholder.com/100?text=User"
                          }
                          alt={blog.staff?.name || "Tác giả"}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {blog.staff?.name || "Tác giả không xác định"}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter section */}
        <div className="mt-16 bg-indigo-50 rounded-2xl p-8 md:p-10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Đăng ký nhận bản tin
            </h3>
            <p className="text-gray-600 mb-6">
              Nhận thông tin mới nhất về sức khỏe giới tính, các bài viết và lời
              khuyên từ các chuyên gia của chúng tôi, được gửi trực tiếp đến hộp
              thư của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Địa chỉ email của bạn"
                className="px-4 py-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
                Đăng ký
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Chúng tôi coi trọng quyền riêng tư của bạn. Bạn có thể hủy đăng ký
              bất cứ lúc nào.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
