import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link as LinkIcon,
} from "lucide-react";
import { blogData } from "../data/blogData";

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSharePopup, setShowSharePopup] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Find the blog with the matching ids
    const foundBlog = blogData.find((post) => post.id === id);

    if (foundBlog) {
      setBlog(foundBlog);

      // Find related posts (same category)
      const related = blogData
        .filter(
          (post) => post.id !== id && post.category === foundBlog.category
        )
        .slice(0, 3);
      setRelatedPosts(related);
    }

    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Không tìm thấy bài viết
        </h1>
        <p className="text-gray-600 mb-8">
          Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          to="/blog"
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Quay lại trang tin tức</span>
        </Link>
      </div>
    );
  }

  // Function to handle sharing
  const handleShare = (platform) => {
    const shareUrl = window.location.href;
    const shareTitle = blog.title;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(shareTitle)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(
            shareTitle
          )}&body=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        alert("Đã sao chép liên kết!");
        break;
      default:
        break;
    }

    setShowSharePopup(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-6">
      {" "}
      {/* Added pt-16 for top padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {" "}
        {/* Removed -mt-10 */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Author info and metadata */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <img
                  src={blog.authorImg}
                  alt={blog.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {blog.author}
                  </h3>
                  <p className="text-sm text-gray-600">Bác sĩ Chuyên khoa</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center">
                <div className="flex items-center mr-6 text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {new Date(blog.date).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{blog.readingTime} phút đọc</span>
                </div>
              </div>
            </div>
          </div>

          {/* Blog content */}
          <div className="p-6 md:p-8 lg:p-10">
            <div className="prose prose-lg max-w-none">
              {/* Blog image */}
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Title moved below the image */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>

              <p className="font-medium text-xl text-gray-800 mb-6">
                {blog.excerpt}
              </p>

              {/* Display blog content */}
              <div className="mt-6">
                {blog.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
            <Link
              to="/blog"
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Quay lại danh sách</span>
            </Link>
            <div className="flex space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowSharePopup(!showSharePopup)}
                  className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Share2 className="w-5 h-5 mr-1" />
                  <span>Chia sẻ</span>
                </button>

                {showSharePopup && (
                  <div className="absolute right-0 bottom-12 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-100 z-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-800">
                        Chia sẻ bài viết
                      </h4>
                      <button
                        onClick={() => setShowSharePopup(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex flex-col items-center p-2 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Facebook className="w-6 h-6 text-blue-600 mb-1" />
                        <span className="text-xs text-gray-600">Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex flex-col items-center p-2 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Twitter className="w-6 h-6 text-blue-400 mb-1" />
                        <span className="text-xs text-gray-600">Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex flex-col items-center p-2 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Linkedin className="w-6 h-6 text-blue-700 mb-1" />
                        <span className="text-xs text-gray-600">LinkedIn</span>
                      </button>
                      <button
                        onClick={() => handleShare("email")}
                        className="flex flex-col items-center p-2 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Mail className="w-6 h-6 text-gray-600 mb-1" />
                        <span className="text-xs text-gray-600">Email</span>
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="flex flex-col items-center p-2 rounded hover:bg-blue-50 transition-colors"
                      >
                        <LinkIcon className="w-6 h-6 text-gray-600 mb-1" />
                        <span className="text-xs text-gray-600">Sao chép</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                <Bookmark className="w-5 h-5 mr-1" />
                <span>Lưu</span>
              </button>
            </div>
          </div>
        </div>
        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Bài viết liên quan
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="block">
                  <div className="bg-white rounded-lg overflow-hidden shadow transition-shadow hover:shadow-md">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full mb-2">
                        {post.categoryName}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center">
                        <img
                          src={post.authorImg}
                          alt={post.author}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        <span className="text-sm text-gray-700">
                          {post.author}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* Newsletter subscription */}
        <div className="mt-16 max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 md:p-10 text-white">
            <h3 className="text-2xl font-bold mb-4">Đăng ký nhận bản tin</h3>
            <p className="mb-6 opacity-90">
              Nhận thông tin sức khỏe giới tính mới nhất qua email. Chúng tôi sẽ
              không gửi thư rác hoặc chia sẻ thông tin của bạn.
            </p>
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Email của bạn"
                className="px-4 py-3 w-full sm:w-auto rounded-l text-white focus:outline-none border border-white focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-colors"
              />
              <button className="mt-2 sm:mt-0 bg-white text-indigo-700 font-medium px-6 py-3 rounded-r hover:bg-gray-200 transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
