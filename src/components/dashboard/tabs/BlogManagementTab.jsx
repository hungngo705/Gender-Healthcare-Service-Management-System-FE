import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle2,
  XCircle,
  Undo2,
} from "lucide-react";
import blogService from "../../../services/blogService";
import BlogForm from "../../../components/blog/BlogForm";
import LoadingSpinner from "../../ui/LoadingSpinner";
import tokenHelper from "../../../utils/tokenHelper";
import Pagination from "../../ui/Pagination";
import { getBlogCategoryName } from "../../../constants/blog";

// Cập nhật lại enum cho đúng
const POST_STATUS = {
  DRAFT: 0, // Bản nháp
  PENDING: 1, // Đang xét duyệt
  REJECTED: 2, // Đã từ chối
  APPROVED: 3, // Đã xuất bản
};

function BlogManagementTab({ role: propRole }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [actualRole, setActualRole] = useState(propRole);
  const [viewingPost, setViewingPost] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Số bài viết mỗi trang

  // Fetch blog posts on component mount
  useEffect(() => {
    // Lấy thông tin người dùng hiện tại từ localStorage
    const userJson = localStorage.getItem("user");

    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        // Lấy role từ localStorage, nếu không có thì dùng propRole
        const userRole = userData.role || propRole || "Staff";

        setActualRole(userRole); // Lưu role thực tế vào state

        console.log("Current user role set:", userRole);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setActualRole(propRole || "Staff"); // Fallback về prop nếu có lỗi
      }
    } else {
      setActualRole(propRole || "Staff");
    }

    fetchPosts();
  }, [propRole]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAll();
      const currentUserId = tokenHelper.getUserIdFromToken();

      console.log("Current user ID:", currentUserId);
      console.log("Raw posts data:", data);

      const processedPosts = data.map((post) => {
        // Đảm bảo status là số
        const postStatus = Number(post.status);

        // Kiểm tra xem người dùng hiện tại có phải là tác giả không
        const isOwner =
          post.staffId &&
          currentUserId &&
          post.staffId.toString() === currentUserId.toString();

        console.log(
          `Post ${post.id}: isOwner = ${isOwner}, staffId = ${post.staffId}, currentUserId = ${currentUserId}`
        );

        return {
          ...post,
          status: postStatus,
          isOwner: isOwner,
        };
      });

      setPosts(processedPosts);
      console.log("Processed posts:", processedPosts);
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForReview = async (postId) => {
    if (window.confirm("Bạn có muốn gửi bài viết này để xét duyệt không?")) {
      try {
        // Dùng API approve để đổi status thành PENDING
        await blogService.approve(postId, POST_STATUS.PENDING);
        alert("Bài viết đã được gửi để xét duyệt thành công!");
        fetchPosts();
      } catch (err) {
        console.error("Failed to submit post for review:", err);
        alert("Không thể gửi bài đăng để xét duyệt. Vui lòng thử lại.");
      }
    }
  };

  const handleApprovePost = async (postId) => {
    try {
      // Kiểm tra quyền trước khi thực hiện
      if (actualRole !== "Manager" && actualRole !== "Admin") {
        alert("Bạn không có quyền duyệt bài viết.");
        return;
      }

      // Sử dụng API mới để duyệt bài viết
      await blogService.approve(postId, POST_STATUS.APPROVED);
      fetchPosts();
    } catch (err) {
      console.error("Failed to approve post:", err);
      alert("Không thể duyệt bài đăng. Vui lòng thử lại.");
    }
  };

  const handleRejectPost = async (postId) => {
    try {
      // Kiểm tra quyền trước khi thực hiện
      if (actualRole !== "Manager" && actualRole !== "Admin") {
        alert("Bạn không có quyền từ chối bài viết.");
        return;
      }

      // Sử dụng API mới để từ chối bài viết
      await blogService.approve(postId, POST_STATUS.REJECTED);
      fetchPosts();
    } catch (err) {
      console.error("Failed to reject post:", err);
      alert("Không thể từ chối bài đăng. Vui lòng thử lại.");
    }
  };

  const handleRevertToDraft = async (postId) => {
    if (
      window.confirm("Bạn có chắc muốn trả bài viết này về lại bản nháp không?")
    ) {
      try {
        // Chỉ Manager và Admin có quyền
        if (actualRole !== "Manager" && actualRole !== "Admin") {
          alert("Bạn không có quyền thực hiện thao tác này.");
          return;
        }
        // Dùng API approve để đổi status thành DRAFT
        await blogService.approve(postId, POST_STATUS.DRAFT);
        alert("Bài viết đã được trả về bản nháp.");
        fetchPosts();
      } catch (err) {
        console.error("Failed to revert post to draft:", err);
        alert("Không thể trả bài viết về bản nháp. Vui lòng thử lại.");
      }
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      try {
        await blogService.delete(id);
        setPosts(posts.filter((post) => post.id !== id));
      } catch (err) {
        console.error("Failed to delete post:", err);
        alert("Không thể xóa bài viết. Vui lòng thử lại.");
      }
    }
  };

  const handleCreateSuccess = () => {
    setIsCreatingPost(false);
    setTimeout(() => fetchPosts(), 500);
  };

  const handleEditSuccess = () => {
    setEditingPost(null);
    setTimeout(() => fetchPosts(), 500);
  };

  // Lọc bài viết
  const getFilteredPosts = () => {
    let filtered = [...posts];

    if (filter !== "all") {
      switch (filter) {
        case "drafts":
          filtered = filtered.filter(
            (post) => post.status === POST_STATUS.DRAFT
          );
          break;
        case "review":
          filtered = filtered.filter(
            (post) => post.status === POST_STATUS.PENDING
          );
          break;
        case "published":
          filtered = filtered.filter(
            (post) => post.status === POST_STATUS.APPROVED
          );
          break;
        case "rejected":
          filtered = filtered.filter(
            (post) => post.status === POST_STATUS.REJECTED
          );
          break;
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getBlogCategoryName(post.category)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();

  // Logic phân trang
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Hàm thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusClass = (status) => {
    switch (Number(status)) {
      case POST_STATUS.DRAFT:
        return "bg-yellow-100 text-yellow-800";
      case POST_STATUS.APPROVED:
        return "bg-green-100 text-green-800";
      case POST_STATUS.PENDING:
        return "bg-blue-100 text-blue-800";
      case POST_STATUS.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (Number(status)) {
      case POST_STATUS.DRAFT:
        return "Bản nháp";
      case POST_STATUS.APPROVED:
        return "Đã xuất bản";
      case POST_STATUS.PENDING:
        return "Đang xét duyệt";
      case POST_STATUS.REJECTED:
        return "Đã từ chối";
      default:
        return "Không xác định";
    }
  };

  // Component Modal để hiển thị nội dung bài viết
  const PostViewModal = ({ post, onClose }) => {
    if (!post) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                {getBlogCategoryName(post.category)}
              </span>
              <span
                className={`inline-block text-xs px-2 py-1 rounded-full ${getStatusClass(
                  post.status
                )}`}
              >
                {getStatusText(post.status)}
              </span>
            </div>

            {/* Hiển thị hình ảnh chính của bài viết (nếu có) */}
            {post.imageUrl && (
              <div className="mb-6">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Thêm CSS để đảm bảo hình ảnh bên trong nội dung hiển thị đúng */}
            <style jsx>{`
              .blog-content img {
                max-width: 100%;
                height: auto;
                margin: 1rem 0;
                border-radius: 0.375rem;
              }
            `}</style>

            {/* Nội dung bài viết với CSS được áp dụng */}
            <div
              className="prose max-w-none blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-6 text-sm text-gray-500">
              <p>Tác giả: {post.staff?.name || "Không xác định"}</p>
              <p>
                Ngày tạo:{" "}
                {post.createdAt &&
                  new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // UI phần form
  if (isCreatingPost) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Tạo bài viết mới
          </h2>
          <button
            onClick={() => setIsCreatingPost(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
        </div>
        <BlogForm onSubmitSuccess={handleCreateSuccess} />
      </div>
    );
  }

  // Khi hiển thị form sửa
  if (editingPost) {
    console.log("Rendering edit form with data:", editingPost);
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Chỉnh sửa bài viết
          </h2>
          <button
            onClick={() => setEditingPost(null)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
        </div>
        <BlogForm
          initialData={editingPost}
          onSubmitSuccess={handleEditSuccess}
          role={actualRole}
        />
      </div>
    );
  }

  // UI phần chính
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {actualRole === "Manager" || actualRole === "Admin"
            ? "Quản lý & kiểm duyệt bài đăng"
            : "Quản lý bài viết của tôi"}
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          {/* Tìm kiếm */}
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

          {/* Bộ lọc */}
          <div className="flex space-x-2 mb-4 md:mb-0 overflow-x-auto">
            <button
              className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
                filter === "all"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("all")}
            >
              Tất cả bài viết
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
                filter === "drafts"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("drafts")}
            >
              Bản nháp
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
                filter === "review"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("review")}
            >
              Đang xét duyệt
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
                filter === "published"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("published")}
            >
              Đã xuất bản
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
                filter === "rejected"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("rejected")}
            >
              Đã từ chối
            </button>
          </div>

          {/* Nút tạo bài viết mới - Chỉ hiển thị cho Staff */}
          {actualRole === "Staff" && (
            <button
              className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              onClick={() => setIsCreatingPost(true)}
            >
              Tạo bài viết mới
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
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
                  Tác giả
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
              {currentPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không có bài viết nào
                  </td>
                </tr>
              ) : (
                currentPosts.map((post) => (
                  <tr key={post.id}>
                    {/* Tiêu đề */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {post.title}
                            {post.isOwner && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                Bài của tôi
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {post.createdAt &&
                              new Date(post.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Danh mục */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getBlogCategoryName(post.category)}
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                          post.status
                        )}`}
                      >
                        {getStatusText(post.status)}
                      </span>
                    </td>

                    {/* Tác giả */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.staff?.name || post.staffId || "Không xác định"}
                    </td>

                    {/* THAO TÁC - Phần quan trọng */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-3">
                        {/* Nút Xem */}
                        <button
                          onClick={() => {
                            setViewingPost(post);
                            setIsViewModalOpen(true);
                          }}
                          className="text-gray-500 hover:text-indigo-600"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>

                        {/* Nút Gửi duyệt - Staff, chủ sở hữu, bài nháp */}
                        {actualRole === "Staff" &&
                          post.isOwner &&
                          post.status === POST_STATUS.DRAFT && (
                            <button
                              onClick={() => handleSubmitForReview(post.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Gửi duyệt"
                            >
                              <Send size={18} />
                            </button>
                          )}

                        {/* Nút Sửa - Staff là tác giả, bài ở trạng thái Nháp hoặc Bị từ chối */}
                        {actualRole === "Staff" &&
                          post.isOwner &&
                          (post.status === POST_STATUS.DRAFT ||
                            post.status === POST_STATUS.REJECTED) && (
                            <button
                              onClick={() => {
                                setEditingPost({
                                  id: post.id,
                                  title: post.title,
                                  content: post.content,
                                  imageUrl: post.imageUrl,
                                  category: post.category,
                                  status: post.status,
                                  staffId: post.staffId,
                                  createdAt: post.createdAt,
                                });
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Sửa"
                            >
                              <Edit size={18} />
                            </button>
                          )}

                        {/* Các nút cho Manager/Admin khi bài đang xét duyệt */}
                        {(actualRole === "Manager" || actualRole === "Admin") &&
                          post.status === POST_STATUS.PENDING && (
                            <>
                              <button
                                onClick={() => handleApprovePost(post.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Duyệt & xuất bản"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button
                                onClick={() => handleRejectPost(post.id)}
                                className="text-orange-600 hover:text-orange-900"
                                title="Từ chối"
                              >
                                <XCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleRevertToDraft(post.id)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Trả về bản nháp"
                              >
                                <Undo2 size={18} />
                              </button>
                            </>
                          )}

                        {/* Nút Xóa - Manager/Admin có thể xóa mọi bài, Staff chỉ xóa bài của mình */}
                        {(actualRole === "Manager" ||
                          actualRole === "Admin" ||
                          (actualRole === "Staff" && post.isOwner)) && (
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Component phân trang */}
          {filteredPosts.length > postsPerPage && (
            <div className="flex justify-between items-center p-4 border-t border-gray-200">
              <p className="text-sm text-gray-700">
                Hiển thị từ{" "}
                <span className="font-medium">{indexOfFirstPost + 1}</span> đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastPost, filteredPosts.length)}
                </span>{" "}
                trên <span className="font-medium">{filteredPosts.length}</span>{" "}
                kết quả
              </p>
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={filteredPosts.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal xem bài viết */}
      {isViewModalOpen && viewingPost && (
        <PostViewModal
          post={viewingPost}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingPost(null);
          }}
        />
      )}
    </div>
  );
}

BlogManagementTab.propTypes = {
  role: PropTypes.string,
};

export default BlogManagementTab;
