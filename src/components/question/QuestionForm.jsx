import React, { useState } from "react";
import PropTypes from "prop-types";
import questionService from "../../services/questionService";
import toastService from "../../utils/toastService";

function QuestionForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !questionText.trim()) {
      toastService.warning("Vui lòng nhập tiêu đề và nội dung câu hỏi.");
      return;
    }
    setLoading(true);
    try {
      await questionService.createQuestion({ title, questionText });
      toastService.success("Gửi câu hỏi thành công!");
      setTitle("");
      setQuestionText("");
      if (onSuccess) onSuccess();
    } catch (error) {
      toastService.error("Gửi câu hỏi thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-1 font-medium">Tiêu đề</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={255}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Nội dung câu hỏi</label>
        <textarea
          className="w-full border rounded px-3 py-2 h-32 resize-none"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          maxLength={2000}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Đang gửi..." : "Gửi câu hỏi"}
      </button>
    </form>
  );
}

QuestionForm.propTypes = {
  onSuccess: PropTypes.func,
};

export default QuestionForm; 