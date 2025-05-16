import React from "react";
import { useParams } from "react-router-dom";

const blogs = [
  {
    id: "1",
    title: "Understanding Gender Diversity in Healthcare",
    date: "2024-05-01",
    content: "Explore how gender diversity impacts patient care and the importance of inclusive medical practices. (Full article content here...)",
  },
  {
    id: "2",
    title: "Challenges Faced by Transgender Patients",
    date: "2024-04-15",
    content: "A look at the unique healthcare challenges and solutions for transgender individuals. (Full article content here...)",
  },
  {
    id: "3",
    title: "Gender Bias in Medical Research",
    date: "2024-03-28",
    content: "Discussing the effects of gender bias in clinical studies and how to address them. (Full article content here...)",
  },
];

function BlogDetail() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return <div className="blog-page"><h2>Blog not found</h2></div>;
  }

  return (
    <div className="blog-page">
      <h1 className="blog-detail-title">{blog.title}</h1>
      <span className="blog-detail-date">{blog.date}</span>
      <div className="blog-detail-content">{blog.content}</div>
    </div>
  );
}

export default BlogDetail;