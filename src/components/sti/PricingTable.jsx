import React from "react";

function PricingTable() {
  const pricingPlans = [
    {
      id: 1,
      name: "Xét Nghiệm Cơ Bản",
      price: "79",
      description: "Gói xét nghiệm phù hợp cho việc kiểm tra định kỳ",
      features: [
        "Xét nghiệm Chlamydia",
        "Xét nghiệm Gonorrhea (Lậu)",
        "Xét nghiệm Syphilis (Giang mai)",
        "Kết quả trong vòng 2-3 ngày",
        "Tư vấn sau xét nghiệm",
      ],
      value: "basic",
    },
    {
      id: 2,
      name: "Xét Nghiệm Toàn Diện",
      price: "149",
      description: "Gói xét nghiệm đầy đủ nhất cho sức khỏe tình dục",
      features: [
        "Tất cả xét nghiệm của gói Cơ Bản",
        "Xét nghiệm HIV",
        "Xét nghiệm Herpes",
        "Xét nghiệm Hepatitis B & C",
        "Xét nghiệm Trichomonas",
        "Kết quả trong vòng 3-5 ngày",
        "Tư vấn chi tiết sau xét nghiệm",
      ],
      highlight: true,
      value: "comprehensive",
    },
    {
      id: 3,
      name: "Xét Nghiệm Mục Tiêu",
      price: "99",
      description: "Gói xét nghiệm tập trung cho các nguy cơ cụ thể",
      features: [
        "Chọn 3 loại xét nghiệm bất kỳ",
        "Phân tích chi tiết từng loại",
        "Kết quả trong vòng 2-4 ngày",
        "Tư vấn sau xét nghiệm",
      ],
      value: "targeted",
    },
  ];

  return (
    <div id="pricing" className="py-16 scroll-mt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bảng Giá Dịch Vụ
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Chúng tôi cung cấp nhiều gói xét nghiệm khác nhau phù hợp với nhu
            cầu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1 ${
                plan.highlight
                  ? "ring-2 ring-indigo-500 transform scale-105 md:scale-110 z-10"
                  : "border border-gray-200"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 inset-x-0 bg-indigo-500 text-white text-xs font-semibold py-1 text-center">
                  ĐƯỢC LỰA CHỌN NHIỀU NHẤT
                </div>
              )}
              <div className={`p-6 ${plan.highlight ? "pt-8" : "pt-6"}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 h-12 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}k
                  </span>
                  <span className="text-gray-500 ml-1">/lần xét nghiệm</span>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            * Giá có thể thay đổi tùy thuộc vào yêu cầu cụ thể.
            <br />
            ** Mọi thông tin cá nhân và kết quả xét nghiệm đều được bảo mật
            tuyệt đối.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PricingTable;
