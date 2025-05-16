import React from "react";
import { Link } from "react-router-dom";

const blogs = [
  {
    id: "1",
    title: "Điều trị vô sinh nam thế nào? 6 cách chữa vô sinh nam hiệu quả",
    date: "2024-05-01",
    img: "https://cdn.diag.vn/2025/05/61cafd1b-lieu-phap-hormone-giup-cai-thien-kha-nang-san-xuat-tinh-trung-va-ty-le-thu-thai-tu-nhien.jpg"
  },
  {
    id: "2",
    title: "Dương vật nhạy cảm là gì? Dương vật nhạy cảm phải làm sao?",
    date: "2024-04-15",
    img:"https://cdn.diag.vn/2025/05/3222bb5d-duong-vat-nhay-cam-1.jpg"
  },
  {
    id: "3",
    title: "Cách đọc kết quả tinh dịch đồ như thế nào là bình thường và yếu?",
    date: "2024-03-28",
    img:"https://cdn.diag.vn/2025/05/5d00b4dc-cach-doc-ket-qua-tinh-dich-do-5.jpg"
  },
];

function Blog() {
  return (
    <div className="blog-page">
      <h1>Gender & Healthcare Blog</h1>
      <div className="blog-list">
        {blogs.map((blog) => (
          <div className="blog-post" key={blog.id}>
            <div className="blog-post-content">
              <div className="blog-post-info">
                <h2>
                  <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                </h2>
                <p><em>{blog.date}</em></p>
              </div>
              <img className="blog-post-img" src={blog.img} alt={blog.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;