import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import ConsultantHeader from "../components/consultant/ConsultantHeader";
import ConsultantTabs from "../components/consultant/ConsultantTabs";
import RelatedConsultants from "../components/consultant/RelatedConsultants";
import LoadingSpinner from "../components/LoadingSpinner";

// Data sources
import { consultants } from "../data/consultants";
import { reviews } from "../data/reviews";
import { articles } from "../data/articles";

function ConsultantDetail() {
  const { id } = useParams();

  // State variables
  const [consultant, setConsultant] = useState(null);
  const [consultantReviews, setConsultantReviews] = useState([]);
  const [consultantArticles, setConsultantArticles] = useState([]);
  const [relatedConsultants, setRelatedConsultants] = useState([]);
  const [selectedTab, setSelectedTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from local data source
  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Find consultant by ID
      const consultantId = parseInt(id);
      const foundConsultant = consultants.find((c) => c.id === consultantId);

      if (!foundConsultant) {
        throw new Error("Không tìm thấy tư vấn viên với ID này.");
      }

      setConsultant(foundConsultant);

      // Filter reviews by consultant ID
      const filteredReviews = reviews.filter(
        (review) => review.consultantId === consultantId
      );
      setConsultantReviews(filteredReviews);

      // Filter articles by consultant ID
      const filteredArticles = articles.filter(
        (article) => article.consultantId === consultantId
      );
      setConsultantArticles(filteredArticles);

      // Get related consultants (same specialty)
      const related = consultants
        .filter(
          (c) =>
            c.id !== consultantId && c.specialty === foundConsultant.specialty
        )
        .slice(0, 4);
      setRelatedConsultants(related);
    } catch (err) {
      console.error("Error loading consultant data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      <ConsultantHeader consultant={consultant} />

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          <ConsultantTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            consultant={consultant}
            reviews={consultantReviews}
            articles={consultantArticles}
          />

          {/* Thông tin liên hệ */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Thông tin liên hệ</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span>
                    Phòng khám Sức khỏe Giới tính, Số 123 Đường ABC, Quận XYZ,
                    TP. Hồ Chí Minh
                  </span>
                </div>
                <div className="flex items-center">
                  <span>support@genderhealthcare.vn</span>
                </div>
                <div className="flex items-center">
                  <span>028 1234 5678</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related consultants section */}
      <RelatedConsultants consultants={relatedConsultants} />
    </>
  );
}

export default ConsultantDetail;
