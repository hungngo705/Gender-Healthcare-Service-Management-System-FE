import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mô phỏng gửi biểu mẫu
    setSubmitStatus({
      submitted: true,
      success: true,
      message:
        "Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.",
    });

    // Trong môi trường thực tế, bạn sẽ gửi dữ liệu biểu mẫu đến backend tại đây
    console.log(formData);

    // Đặt lại biểu mẫu sau khi gửi thành công
    setTimeout(() => {
      if (submitStatus.success) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    }, 500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Phần Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            >
              Liên Hệ Với Chúng Tôi
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl max-w-3xl mx-auto"
            >
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi
              qua bất kỳ phương thức nào dưới đây hoặc điền vào mẫu liên hệ.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: <MapPin className="h-8 w-8 text-indigo-600" />,
              title: "Địa Chỉ",
              info: ["17 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh 700000, Vietnam"],
            },
            {
              icon: <Phone className="h-8 w-8 text-indigo-600" />,
              title: "Điện Thoại",
              info: ["(123) 456-7890", "(987) 654-3210"],
            },
            {
              icon: <Mail className="h-8 w-8 text-indigo-600" />,
              title: "Email",
              info: [
                "EverwellHealthcare@proton.me",
              ],
            },
            {
              icon: <Clock className="h-8 w-8 text-indigo-600" />,
              title: "Giờ Làm Việc",
              info: [
                "Thứ Hai - Thứ Sáu: 8:00 - 20:00",
                "Thứ Bảy - Chủ Nhật: 8:00 - 17:00",
              ],
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              {item.info.map((line, i) => (
                <p key={i} className="text-gray-600 text-sm">
                  {line}
                </p>
              ))}
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>

            {submitStatus.submitted && (
              <div
                className={`mb-6 p-4 rounded-md ${
                  submitStatus.success
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Họ Và Tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số Điện Thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tiêu Đề
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Tiêu đề tin nhắn của bạn"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nội Dung
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nhập nội dung tin nhắn của bạn"
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors w-full"
              >
                <Send className="h-5 w-5 mr-2" />
                Gửi Tin Nhắn
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Câu Hỏi Thường Gặp
              </h2>

              <div className="space-y-4">
                {[
                  {
                    question: "Làm thế nào để đặt lịch hẹn?",
                    answer:
                      "Bạn có thể đặt lịch hẹn trực tuyến thông qua trang web của chúng tôi, gọi điện thoại, hoặc gửi email. Chúng tôi sẽ xác nhận lịch hẹn của bạn trong vòng 24 giờ.",
                  },
                  {
                    question: "Dịch vụ của bạn có bảo mật không?",
                    answer:
                      "Chúng tôi coi trọng quyền riêng tư của bạn. Tất cả các dịch vụ và thông tin cá nhân được giữ bí mật nghiêm ngặt theo quy định pháp luật.",
                  },
                  {
                    question: "Tôi có thể hủy hoặc đổi lịch hẹn không?",
                    answer:
                      "Có, bạn có thể thay đổi hoặc hủy lịch hẹn ít nhất 24 giờ trước thời gian đã đặt mà không mất phí.",
                  },
                  {
                    question: "Bạn có cung cấp tư vấn trực tuyến không?",
                    answer:
                      "Có, chúng tôi cung cấp dịch vụ tư vấn trực tuyến qua cuộc gọi video. Bạn có thể đặt lịch hẹn trực tuyến thông qua trang web của chúng tôi.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Cần Hỗ Trợ Khẩn Cấp?
                </h3>
                <p className="text-gray-600 mb-4">
                  Đường dây hỗ trợ 24/7 của chúng tôi luôn sẵn sàng.
                </p>
                <a
                  href="tel:+18005551234"
                  className="inline-flex items-center text-indigo-600 font-medium"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  (800) 555-1234
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Vị Trí Của Chúng Tôi
          </h2>
          <div className="bg-white p-2 rounded-xl shadow-lg overflow-hidden h-96">
            <iframe
              title="Vị trí Google Maps"
              className="w-full h-full rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.610010537023!2d106.80730807577771!3d10.841127589311585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1749194132376!5m2!1sen!2s"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-6 rounded-xl"
        >
          <h2 className="text-3xl font-bold mb-4">Cần Tư Vấn Ngay?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn với mọi thắc mắc
            về sức khỏe sinh sản và tình dục.
          </p>
          <a
            href="tel:+18005551234"
            className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 transition-colors"
          >
            <Phone className="h-5 w-5 mr-2" />
            Gọi Ngay: (800) 555-1234
          </a>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;