import React from "react";
import { Link } from "react-router-dom";

function CallToAction() {
  return (
    <div className="text-center py-8">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-10 px-6 rounded-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Kiểm soát sức khỏe sinh sản của bạn
        </h2>
        <p className="max-w-2xl mx-auto text-lg mb-6">
          Hiểu rõ chu kỳ của bạn là chìa khóa để quản lý sức khỏe sinh sản.
          Dịch vụ chuyên nghiệp của chúng tôi có thể giúp bạn tối ưu hóa sức khỏe của mình.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          
          <Link
            to="/services/consultation"
            className="px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-all"
          >
            Đặt Lịch Tư Vấn
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