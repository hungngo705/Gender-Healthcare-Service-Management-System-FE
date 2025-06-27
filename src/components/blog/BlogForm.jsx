import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import tokenHelper from "../../utils/tokenHelper";
import blogService from "../../services/blogService";
import { BLOG_CATEGORIES } from "../../constants/blog";

const POST_STATUS = {
  DRAFT: 0, // Bản nháp
  PENDING: 1, // Đang xét duyệt
  REJECTED: 2, // Đã từ chối
  APPROVED: 3, // Đã xuất bản
};

const BlogForm = ({ initialData, onSubmitSuccess }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [category, setCategory] = useState(initialData?.category || 0);
  // Loại bỏ trường status, sẽ tự động là DRAFT khi tạo mới hoặc giữ nguyên khi sửa
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Danh mục bài viết - Lấy từ file constants
  const categories = BLOG_CATEGORIES;

  // Sửa lại hàm handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Lấy staffId từ token
      const staffId = tokenHelper.getUserIdFromToken();

      if (!staffId) {
        setError("Không thể xác định ID người dùng. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      // Log ID của bài viết nếu đang cập nhật
      if (initialData?.id) {
        console.log("UPDATING POST WITH ID:", initialData.id);
      } else {
        console.log("CREATING NEW POST");
      }

      let result;
      if (initialData?.id) {
        // Dữ liệu cập nhật theo yêu cầu API
        const updateData = {
          title: title.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim() || "string",
          category: Number(category),
        };

        console.log("Update data:", updateData);
        // Gọi API update với ID và dữ liệu chuẩn
        result = await blogService.update(initialData.id, updateData);
        console.log("Update API response:", result);
      } else {
        // Dữ liệu tạo mới theo yêu cầu API
        const createData = {
          title: title.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim() || "string",
          category: Number(category),
          staffId: staffId,
          createdAt: new Date().toISOString(),
        };

        console.log("Create data:", createData);
        // Gọi API create
        result = await blogService.create(createData);
        console.log("Create API response:", result);
      }

      onSubmitSuccess();
    } catch (err) {
      console.error("Error details:", err);

      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", JSON.stringify(err.response.data));

        // Hiển thị lỗi chi tiết
        let errorMessage = "Không thể lưu bài viết";
        if (err.response.data?.errors) {
          const errors = Object.values(err.response.data.errors).flat();
          errorMessage = errors.join(", ");
        } else if (err.response.data?.title) {
          errorMessage = err.response.data.title;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }

        setError(errorMessage);
      } else {
        setError(err.message || "Đã có lỗi xảy ra");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Tiêu đề bài viết <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Nhập tiêu đề bài viết"
          required
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Danh mục <span className="text-red-600">*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700"
        >
          URL Hình ảnh
        </label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="https://example.com/image.jpg"
        />
        {imageUrl && (
          <div className="mt-2">
            <img
              src={imageUrl}
              alt="Preview"
              className="h-24 w-auto object-cover rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/150?text=Invalid+Image";
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Nội dung <span className="text-red-600">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Nhập nội dung bài viết"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => onSubmitSuccess()} // Cancel and go back
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang lưu...
            </>
          ) : initialData ? (
            "Cập nhật"
          ) : (
            "Đăng bài"
          )}
        </button>
      </div>
    </form>
  );
};

BlogForm.propTypes = {
  initialData: PropTypes.object,
  onSubmitSuccess: PropTypes.func.isRequired,
};

export default BlogForm;
