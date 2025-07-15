import React, { useEffect, useState } from "react";
import questionService from "../../../services/questionService";
import toastService from "../../../utils/toastService";
import { useAuth } from "../../../contexts/AuthContext";
import tokenHelper from "../../../utils/tokenHelper";

function ConsultantQuestionsTab() {
  const { currentUser } = useAuth();
  const userIdFromToken = tokenHelper.getUserIdFromToken();
  const consultantId = currentUser?.id || currentUser?.userId || userIdFromToken;

  const [assignedQuestions, setAssignedQuestions] = useState([]);
  const [unassignedQuestions, setUnassignedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState("");

  const fetchData = async () => {
    if (!consultantId) throw new Error("Không tìm thấy ID tư vấn viên");
    setLoading(true);
    try {
      const [assigned, unassigned] = await Promise.all([
        questionService.getQuestionsByConsultant(consultantId),
        questionService.getUnassignedQuestions(),
      ]);
      setAssignedQuestions(assigned);
      setUnassignedQuestions(unassigned);
    } catch (error) {
      toastService.error("Không thể tải câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultantId]);

  const handleClaim = async (questionId) => {
    try {
      await questionService.assignQuestion(questionId, consultantId);
      toastService.success("Nhận câu hỏi thành công!");
      fetchData();
    } catch (error) {
      toastService.error("Không thể nhận câu hỏi");
    }
  };

  const handleAnswer = async (questionId) => {
    if (!answerText.trim()) {
      toastService.warning("Vui lòng nhập nội dung trả lời");
      return;
    }
    try {
      await questionService.answerQuestion(questionId, answerText);
      toastService.success("Gửi câu trả lời thành công!");
      setAnsweringId(null);
      setAnswerText("");
      fetchData();
    } catch (error) {
      toastService.error("Không thể gửi câu trả lời");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Câu hỏi được giao</h2>
        {assignedQuestions.length === 0 ? (
          <p>Chưa có câu hỏi nào.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {assignedQuestions.map((q) => (
              <li key={q.questionId} className="py-4">
                <h4 className="font-semibold">{q.title}</h4>
                <p className="text-gray-700 whitespace-pre-line">
                  {q.questionText}
                </p>
                {q.answerText ? (
                  <p className="text-green-600 mt-2">Đã trả lời</p>
                ) : answeringId === q.questionId ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      className="w-full border rounded px-3 py-2 h-24 resize-none"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                    />
                    <button
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                      onClick={() => handleAnswer(q.questionId)}
                    >
                      Gửi trả lời
                    </button>
                    <button
                      className="ml-2 text-gray-500 hover:underline"
                      onClick={() => setAnsweringId(null)}
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    className="mt-2 text-indigo-600 hover:underline"
                    onClick={() => setAnsweringId(q.questionId)}
                  >
                    Trả lời
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Câu hỏi chưa được giao</h2>
        {unassignedQuestions.length === 0 ? (
          <p>Không có câu hỏi chờ nhận.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {unassignedQuestions.map((q) => (
              <li key={q.questionId} className="py-4">
                <h4 className="font-semibold">{q.title}</h4>
                <p className="text-gray-700 whitespace-pre-line">
                  {q.questionText}
                </p>
                <button
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  onClick={() => handleClaim(q.questionId)}
                >
                  Nhận trả lời
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ConsultantQuestionsTab; 