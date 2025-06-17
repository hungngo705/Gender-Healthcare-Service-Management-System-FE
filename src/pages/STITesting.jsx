import { ToastContainer } from "react-toastify";
import HeroSection from "../components/sti/HeroSection";
import ServiceOverview from "../components/sti/ServiceOverview";
import PricingTable from "../components/sti/PricingTable";
import BookingForm from "../components/sti/BookingForm";
import Faq from "../components/sti/Faq";
import CallToAction from "../components/sti/CallToAction";

function STITesting() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Pricing Table */}
        <PricingTable />

        {/* Thông tin về quy trình đặt lịch */}
        <div className="mb-16 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Hướng dẫn đặt lịch xét nghiệm STI
          </h3>
          <p className="text-gray-600 mb-3">
            Để đặt lịch xét nghiệm STI, bạn có thể làm theo một trong hai cách:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-600">
            <li>
              <strong>Chọn từ lịch hẹn hiện có:</strong> Nếu bạn đã đặt lịch hẹn
              với bác sĩ tư vấn, hãy chọn lịch hẹn đó từ danh sách.
            </li>
            <li>
              <strong>Đặt xét nghiệm trực tiếp:</strong> Bạn có thể đặt xét
              nghiệm STI mà không cần lịch hẹn trước với bác sĩ tư vấn.
            </li>
          </ol>
          <p className="text-gray-600 mt-3">
            Sau khi gửi yêu cầu, đội ngũ y tế của chúng tôi sẽ liên hệ để xác
            nhận lịch hẹn xét nghiệm trong thời gian sớm nhất.
          </p>
        </div>

        {/* Appointment Booking Form */}
        <BookingForm />

        {/* Service Overview */}
        <ServiceOverview />

        {/* FAQ Section */}
        <Faq />

        {/* Call to Action */}
        <CallToAction />
      </div>
    </div>
  );
}

export default STITesting;
