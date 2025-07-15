import React, { useEffect, useState } from "react";
import questionService from "../../../services/questionService";
import QuestionForm from "../../question/QuestionForm";
import toastService from "../../../utils/toastService";
import { useAuth } from "../../../contexts/AuthContext";
import tokenHelper from "../../../utils/tokenHelper";
import {
  MessageCircleQuestion,
  Clock,
  CheckCircle2,
  Hourglass,
} from "lucide-react";
import { parseISO, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

function QuestionsTab() {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    const userId = tokenHelper.getUserIdFromToken();
    if (!userId) {
      toastService.error("Không tìm thấy ID người dùng");
      return;
    }
    setLoading(true);
    try {
      const data = await questionService.getQuestionsByCustomer(userId);
      setQuestions(data);
    } catch (error) {
      toastService.error("Không thể tải danh sách câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Tách thành 2 nhóm để sắp xếp, sau đó gộp lại (Answered lên trước)
  const answeredQs = questions.filter(
    (q) => q.status === 2 || q.status === "Answered"
  );
  const pendingQs = questions.filter(
    (q) =>
      q.status === 0 ||
      q.status === 1 ||
      q.status === "Pending" ||
      q.status === "Assigned"
  );

  const sortedQs = [...answeredQs, ...pendingQs];

  const renderQuestionItem = (q) => {
    const createdAtText = q.createdAt
      ? formatDistanceToNow(parseISO(q.createdAt), { addSuffix: true, locale: vi })
      : "";
    const isAnswered = !!(q.answerText && q.answerText.trim());
    const statusLabel = isAnswered ? "Đã trả lời" : q.status === "Assigned" ? "Đang xử lý" : "Đang chờ";

    const badgeClassMap = {
      "Đã trả lời": "bg-green-100 text-green-700",
      "Đang xử lý": "bg-indigo-100 text-indigo-700",
      "Đang chờ": "bg-yellow-100 text-yellow-700",
    };

    const badgeClass = badgeClassMap[statusLabel];

    return (
      <details key={q.questionId} className="group border rounded-lg bg-white shadow-sm hover:shadow transition">
        <summary className="flex items-start justify-between gap-2 cursor-pointer p-4 list-none">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1 flex items-center">
              <MessageCircleQuestion size={16} className="mr-2 text-indigo-600 shrink-0" />
              {q.title}
            </h4>
            <p
              className="text-gray-600 text-sm"
              style={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {q.questionText}
            </p>
            <div className="flex items-center text-xs text-gray-500 space-x-3 mt-2">
              <span className="flex items-center">
                <Clock size={12} className="mr-1" /> {createdAtText}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>{statusLabel}</span>
            </div>
          </div>
        </summary>
        <div className="border-t px-4 pb-4 pt-2 text-sm text-gray-700 space-y-4">
          <div>
            <h5 className="font-medium mb-1">Câu hỏi chi tiết</h5>
            <p className="whitespace-pre-line">{q.questionText}</p>
          </div>
          {isAnswered && (
            <div>
              <h5 className="font-medium mb-1 text-green-700">Trả lời</h5>
              <p className="whitespace-pre-line">{q.answerText}</p>
            </div>
          )}
        </div>
      </details>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gửi câu hỏi tới tư vấn viên</h2>
      <QuestionForm onSuccess={fetchQuestions} />

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="max-h-[30rem] overflow-y-auto pr-1 space-y-2">
          {sortedQs.length === 0 ? (
            <p className="text-sm text-gray-500 px-2">Bạn chưa gửi câu hỏi nào.</p>
          ) : (
            <ul className="space-y-2">{sortedQs.map(renderQuestionItem)}</ul>
          )}
        </div>
      )}
    </div>
  );
}

export default QuestionsTab; 