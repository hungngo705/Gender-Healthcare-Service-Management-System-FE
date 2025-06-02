import React from "react";

function Faq() {
  return (
    <div id="faq" className="mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Câu Hỏi Thường Gặp
      </h2>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {/* FAQ Item 1 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Xét nghiệm STI mất bao lâu?
              </h3>
              <p className="text-gray-600">
                Quá trình xét nghiệm thực tế thường kéo dài khoảng 15-20 phút.
                Phần lớn thời gian này dành cho giấy tờ và tư vấn. Việc thu thập mẫu 
                diễn ra nhanh chóng và xâm lấn tối thiểu.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tôi sẽ nhận kết quả sau bao lâu?
              </h3>
              <p className="text-gray-600">
                Kết quả thường có trong vòng 2-3 ngày đối với các xét nghiệm tiêu chuẩn 
                và 1-2 ngày đối với dịch vụ nhanh. Bạn sẽ nhận được thông báo an toàn 
                khi kết quả của bạn sẵn sàng để xem trong cổng thông tin khách hàng của chúng tôi.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Xét nghiệm STI có bảo mật không?
              </h3>
              <p className="text-gray-600">
                Hoàn toàn bảo mật. Chúng tôi rất coi trọng quyền riêng tư của bạn. Tất cả các xét nghiệm 
                đều hoàn toàn bảo mật, và kết quả của bạn chỉ có thể truy cập bởi bạn và nhà cung cấp 
                dịch vụ chăm sóc sức khỏe của bạn. Cổng thông tin trực tuyến của chúng tôi sử dụng 
                mã hóa để giữ thông tin của bạn an toàn.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tôi nên làm gì nếu xét nghiệm của tôi dương tính?
              </h3>
              <p className="text-gray-600">
                Nếu xét nghiệm của bạn cho kết quả dương tính, đừng hoảng sợ. Nhiều STI 
                đều có thể điều trị dễ dàng. Các nhà cung cấp dịch vụ chăm sóc sức khỏe của chúng tôi 
                sẽ hướng dẫn bạn các phương pháp điều trị và có thể kê đơn thuốc nếu cần thiết. 
                Chúng tôi cũng cung cấp dịch vụ tư vấn và hỗ trợ thông báo cho đối tác nếu bạn mong muốn.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tôi nên xét nghiệm thường xuyên như thế nào?
              </h3>
              <p className="text-gray-600">
                Tần suất xét nghiệm phụ thuộc vào các yếu tố rủi ro cá nhân của bạn. Thông thường, 
                chúng tôi khuyến nghị xét nghiệm hàng năm cho những người có hoạt động tình dục. 
                Tuy nhiên, xét nghiệm thường xuyên hơn (mỗi 3-6 tháng) có thể phù hợp cho những người 
                có nhiều đối tác hoặc các yếu tố rủi ro khác. Các nhà cung cấp dịch vụ chăm sóc sức khỏe 
                của chúng tôi có thể giúp xác định lịch xét nghiệm phù hợp nhất cho bạn.
              </p>
            </div>

            {/* FAQ Item 6 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tôi có cần chuẩn bị gì cho xét nghiệm STI không?
              </h3>
              <p className="text-gray-600">
                Đối với hầu hết các xét nghiệm STI, không cần chuẩn bị đặc biệt. Tuy nhiên, 
                đối với một số xét nghiệm nhất định, bạn có thể được khuyên nên tránh đi tiểu 
                trong 1-2 giờ trước cuộc hẹn. Nếu bạn có lịch xét nghiệm máu, bạn có thể ăn uống 
                bình thường trước đó. Nhân viên của chúng tôi sẽ cung cấp hướng dẫn cụ thể nếu cần 
                khi bạn đặt lịch hẹn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faq;