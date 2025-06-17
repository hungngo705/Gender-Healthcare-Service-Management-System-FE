import React from "react";

function ServiceOverview() {
  return (
    <div id="service-overview" className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Dịch Vụ Xét Nghiệm STI Của Chúng Tôi
      </h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Tại Sao Chọn Dịch Vụ Xét Nghiệm STI Của Chúng Tôi?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-green-500 mr-3 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <div>
                  <span className="font-medium text-gray-900">
                    Bảo Mật Hoàn Toàn
                  </span>
                  <p className="text-gray-600 mt-1">
                    Quyền riêng tư của bạn là ưu tiên hàng đầu của chúng tôi.
                    Tất cả các xét nghiệm và kết quả được xử lý với sự bảo mật
                    tối đa.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-green-500 mr-3 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <div>
                  <span className="font-medium text-gray-900">
                    Gửi Kết Quả An Toàn
                  </span>
                  <p className="text-gray-600 mt-1">
                    Truy cập kết quả của bạn trực tuyến thông qua cổng thông tin
                    khách hàng an toàn, đảm bảo quyền riêng tư và truy cập nhanh
                    chóng.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-green-500 mr-3 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <div>
                  <span className="font-medium text-gray-900">
                    Chăm Sóc Toàn Diện
                  </span>
                  <p className="text-gray-600 mt-1">
                    Nếu xét nghiệm phát hiện nhiễm trùng, các nhà cung cấp dịch
                    vụ y tế của chúng tôi có thể kê đơn điều trị và cung cấp
                    dịch vụ chăm sóc theo dõi.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-purple-50 p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Quy Trình Xét Nghiệm Của Chúng Tôi
            </h3>
            <ol className="space-y-3">
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Đặt lịch hẹn</p>
                  <p className="text-gray-600 mt-1">
                    Đặt lịch trực tuyến hoặc qua điện thoại theo sự thuận tiện
                    của bạn
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Đến phòng khám của chúng tôi
                  </p>
                  <p className="text-gray-600 mt-1">
                    Gặp gỡ các chuyên gia y tế của chúng tôi trong môi trường
                    thoải mái, riêng tư
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Thu thập mẫu xét nghiệm
                  </p>
                  <p className="text-gray-600 mt-1">
                    Thu thập mẫu nhanh chóng và dễ dàng bởi các chuyên gia được
                    đào tạo
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nhận kết quả</p>
                  <p className="text-gray-600 mt-1">
                    Nhận kết quả an toàn trực tuyến trong vòng 2-3 ngày
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">
                  5
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Điều trị (nếu cần thiết)
                  </p>
                  <p className="text-gray-600 mt-1">
                    Nhận các phương án điều trị và chăm sóc theo dõi
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceOverview;
