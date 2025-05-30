import React from "react";
import { Link } from "react-router-dom";

function CallToAction() {
  return (
    <div className="text-center">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-10 px-6 rounded-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Kiểm soát sức khỏe tình dục của bạn ngay hôm nay
        </h2>
        <p className="max-w-2xl mx-auto text-lg mb-6">
          Xét nghiệm STI thường xuyên là một phần quan trọng để duy trì sức khỏe tổng thể của bạn. 
          Đặt lịch hẹn bảo mật ngay bây giờ.
        </p>{" "}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#appointment"
            className="px-6 py-3 bg-white text-indigo-900 rounded-md font-medium hover:bg-opacity-90 transition-all"
          >
            Đặt Lịch Hẹn
          </a>
          <Link
            to="/contact"
            className="px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-all"
          >
            Liên Hệ Với Chúng Tôi
          </Link>
          <Link
            to="/services"
            className="px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-all"
          >
            Xem Tất Cả Dịch Vụ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CallToAction;