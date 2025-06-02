import React from "react";

function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 sm:text-5xl">
            Dịch Vụ Xét Nghiệm STI Bảo Mật
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Kiểm soát sức khỏe tình dục của bạn với dịch vụ xét nghiệm và điều
            trị STI riêng tư, không phán xét của chúng tôi.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <a
            href="#appointment"
            className="px-6 py-3 bg-white text-indigo-900 rounded-full font-medium hover:bg-opacity-90 transition-all flex items-center"
          >
            Đặt Lịch Hẹn Ngay
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="#faq"
            className="px-6 py-3 bg-transparent border border-white text-white rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition-all flex items-center"
          >
            Tìm Hiểu Thêm
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
