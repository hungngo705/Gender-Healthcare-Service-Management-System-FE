import React, { useState } from "react";
import PropTypes from "prop-types";

function BlogManagementTab({ role }) {
  // Use role for role-specific functionality if needed
  console.log(`BlogManagementTab rendered with role: ${role}`);
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Hiểu về sức khỏe sinh sản của bạn: Những điều cần biết",
      category: "Sức khỏe sinh sản",
      status: "published",
      author: "TS. Nguyễn Thị Minh",
      publishDate: "2023-07-15",
      views: 1245,
      comments: 32,
    },
    {
      id: 2,
      title: "5 cách phòng tránh STIs hiệu quả nhất",
      category: "STIs/STDs",
      status: "published",
      author: "BS. Trần Văn Nam",
      publishDate: "2023-07-22",
      views: 2156,
      comments: 48,
    },
    {
      id: 3,
      title: "Hiểu về bản dạng giới và xu hướng tính dục",
      category: "Giới tính & Tâm lý",
      status: "draft",
      author: "ThS. Lê Thị Hương",
      publishDate: null,
      views: 0,
      comments: 0,
    },
    {
      id: 4,
      title: "Trò chuyện với con về tình dục an toàn",
      category: "Giáo dục giới tính",
      status: "published",
      author: "BS. Phạm Thị Lan Anh",
      publishDate: "2023-08-05",
      views: 876,
      comments: 15,
    },
    {
      id: 5,
      title: "Sức khỏe tình dục là gì và tại sao nó quan trọng?",
      category: "Sức khỏe tình dục",
      status: "review",
      author: "BS. Trần Văn Nam",
      publishDate: null,
      views: 0,
      comments: 0,
    },
  ]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePost = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "published":
        return "Đã xuất bản";
      case "draft":
        return "Bản nháp";
      case "review":
        return "Đang xét duyệt";
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quản lý bài viết
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <button className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Tạo bài viết mới
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tiêu đề bài viết
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Danh mục
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng thái
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thống kê
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        Tác giả: {post.author}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {post.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                      post.status
                    )}`}
                  >
                    {getStatusText(post.status)}
                  </span>
                  {post.publishDate && (
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(post.publishDate).toLocaleDateString("vi-VN")}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.status === "published" ? (
                    <>
                      <div>{post.views} lượt xem</div>
                      <div>{post.comments} bình luận</div>
                    </>
                  ) : (
                    "Chưa có dữ liệu"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    Xem
                  </button>
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Sửa
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

BlogManagementTab.propTypes = {
  role: PropTypes.string.isRequired,
};

export default BlogManagementTab;
