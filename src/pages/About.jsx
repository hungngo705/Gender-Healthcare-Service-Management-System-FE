// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Handshake, Heart, Users, Award, BookOpen, Lock } from "lucide-react";

function About() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            >
              Về Chúng Tôi
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl max-w-3xl mx-auto"
            >
              Chúng tôi chuyên cung cấp các dịch vụ chăm sóc sức khỏe có tính
              nhạy cảm về giới tính, đáp ứng nhu cầu đặc biệt của mỗi cá nhân.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <p className="text-lg text-gray-600">
              Sứ mệnh của chúng tôi là cung cấp các dịch vụ chăm sóc sức khỏe
              chất lượng cao, nhạy cảm về giới tính, tôn trọng và đáp ứng những
              nhu cầu đặc biệt của tất cả mọi người, bất kể bản dạng giới hay
              biểu hiện giới tính. Chúng tôi nỗ lực tạo ra một môi trường an
              toàn, hòa nhập và hỗ trợ, nơi mọi người có thể tiếp cận sự chăm
              sóc mà họ xứng đáng.
            </p>
            <div className="mt-8">
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
              >
                Đặt Lịch Hẹn
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.1 }}
            className="relative h-96 rounded-xl overflow-hidden shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=1887&h=1200"
              alt="Chuyên gia y tế"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Tầm Nhìn Của Chúng Tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">
            Chúng tôi hướng tới một hệ thống y tế nơi các nhu cầu đặc biệt về
            giới tính được công nhận, tôn trọng và giải quyết với các tiêu chuẩn
            chăm sóc cao nhất. Chúng tôi cam kết thúc đẩy các phương pháp và
            chính sách chăm sóc sức khỏe nhằm xóa bỏ sự chênh lệch và thúc đẩy
            bình đẳng cho mọi giới tính.
          </p>
        </motion.div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Giá Trị Cốt Lõi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                value: "Tôn Trọng",
                description:
                  "Chúng tôi tôn trọng phẩm giá, quyền tự quyết, và bản sắc độc đáo của mỗi cá nhân.",
                icon: <Handshake className="w-10 h-10 text-indigo-600" />,
              },
              {
                value: "Hòa Nhập",
                description:
                  "Chúng tôi tạo ra môi trường thân thiện cho mọi người thuộc mọi giới tính và nguồn gốc.",
                icon: <Users className="w-10 h-10 text-indigo-600" />,
              },
              {
                value: "Xuất Sắc",
                description:
                  "Chúng tôi cung cấp dịch vụ chăm sóc chất lượng cao nhất dựa trên các phương pháp khoa học.",
                icon: <Award className="w-10 h-10 text-indigo-600" />,
              },
              {
                value: "Lòng Trắc Ẩn",
                description:
                  "Chúng tôi tiếp cận mỗi người với sự cảm thông và thấu hiểu.",
                icon: <Heart className="w-10 h-10 text-indigo-600" />,
              },
              {
                value: "Giáo Dục",
                description:
                  "Chúng tôi cam kết học hỏi liên tục và phát triển chuyên môn.",
                icon: <BookOpen className="w-10 h-10 text-indigo-600" />,
              },
              {
                value: "Bảo Mật",
                description:
                  "Chúng tôi bảo vệ quyền riêng tư và bảo mật thông tin của mỗi khách hàng.",
                icon: <Lock className="w-10 h-10 text-indigo-600" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                  {item.value}
                </h3>
                <p className="text-gray-600 text-center">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Đội Ngũ Của Chúng Tôi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Bác sĩ Sarah Johnson",
                role: "Giám đốc Y tế",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
                bio: "Chuyên gia OB/GYN với hơn 15 năm kinh nghiệm trong lĩnh vực sức khỏe sinh sản.",
              },
              {
                name: "Bác sĩ Michael Chen",
                role: "Cố vấn Tâm lý",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe1SPfhh7ROKuvrK_pAshT1WhejRvxeRTfpg&s",
                bio: "Nhà tâm lý học chuyên về giới tính và bản dạng giới, tập trung vào các vấn đề thanh thiếu niên.",
              },
              {
                name: "Bác sĩ John Wick",
                role: "Chuyên gia OB/GYN",
                image:
                  "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww",
                bio: "Chuyên gia về kế hoạch hóa gia đình và điều trị nhiễm trùng lây truyền qua đường tình dục.",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600 mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-indigo-700 text-white rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "Dịch vụ tư vấn đã thực sự thay đổi cuộc sống của tôi. Đội ngũ nhân viên rất tôn trọng và thấu hiểu nhu cầu của tôi.",
                author: "Jessica M., 28",
              },
              {
                quote:
                  "Tôi cảm thấy được lắng nghe và tôn trọng. Không có áp lực hay phán xét, chỉ có sự hỗ trợ chuyên nghiệp.",
                author: "Thomas W., 35",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
              >
                <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                <p className="font-medium">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sẵn Sàng Trải Nghiệm Dịch Vụ Của Chúng Tôi?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Đừng ngần ngại liên hệ để được chăm sóc sức khỏe chất lượng cao, có
            tính nhạy cảm về giới tính.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/appointment"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Đặt Lịch Hẹn
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
            >
              Liên Hệ Với Chúng Tôi
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default About;
