export const BLOG_CATEGORIES = [
  { id: 0, name: "Sức khỏe sinh sản" },
  { id: 1, name: "Sức khỏe tình dục" },
  { id: 2, name: "Sức khỏe tâm thần" },
  { id: 3, name: "Giáo dục giới tính" },
  { id: 5, name: "Sức khỏe tinh thần" },
];

/**
 * Lấy tên danh mục từ ID.
 * @param {string | number} categoryId - ID của danh mục.
 * @returns {string} Tên danh mục hoặc "Không xác định" nếu không tìm thấy.
 */
export const getBlogCategoryName = (categoryId) => {
  // Chuyển đổi cả hai về chuỗi để so sánh an toàn, xử lý cả null/undefined
  const idToFind = (categoryId ?? "").toString();
  const category = BLOG_CATEGORIES.find(
    (cat) => cat.id.toString() === idToFind
  );
  return category ? category.name : "Không xác định";
};
