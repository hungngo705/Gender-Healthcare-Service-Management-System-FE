// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
              About Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl max-w-3xl mx-auto"
            >
              We are dedicated to providing gender-sensitive healthcare services
              that meet the unique needs of all individuals.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600">
              Our mission is to deliver high-quality, gender-sensitive
              healthcare services that respect and address the unique needs of
              all individuals, regardless of gender identity or expression. We
              strive to create a safe, inclusive, and supportive environment
              where everyone can access the care they deserve.
            </p>
            <div className="mt-8">
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
              >
                Book an Appointment
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative h-96 rounded-xl overflow-hidden shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=1887&h=1200"
              alt="Healthcare professionals"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Our Vision
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">
            We envision a healthcare system where gender-specific needs are
            recognized, respected, and addressed with the highest standards of
            care. We are committed to advancing healthcare practices and
            policies that eliminate disparities and promote equity for all
            genders.
          </p>
        </motion.div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                value: "Respect",
                description:
                  "We respect the dignity, autonomy, and unique identities of all individuals.",
                icon: "🤝",
              },
              {
                value: "Inclusivity",
                description:
                  "We create a welcoming environment for people of all genders and backgrounds.",
                icon: "🌈",
              },
              {
                value: "Excellence",
                description:
                  "We provide the highest quality of care using evidence-based practices.",
                icon: "🌟",
              },
              {
                value: "Compassion",
                description:
                  "We approach each person with empathy and understanding.",
                icon: "❤️",
              },
              {
                value: "Education",
                description:
                  "We are committed to continuous learning and professional development.",
                icon: "📚",
              },
              {
                value: "Privacy",
                description:
                  "We protect the privacy and confidentiality of each client's information.",
                icon: "🔒",
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
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.value}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Medical Director",
                image: "https://randomuser.me/api/portraits/women/32.jpg",
                bio: "OB/GYN specialist with over 15 years of experience in reproductive health.",
              },
              {
                name: "Dr. Michael Chen",
                role: "Psychological Counselor",
                image: "https://randomuser.me/api/portraits/men/45.jpg",
                bio: "Psychologist specializing in sexual and gender identity with a focus on youth issues.",
              },
              {
                name: "Dr. Emily Rodriguez",
                role: "OB/GYN Specialist",
                image: "https://randomuser.me/api/portraits/women/68.jpg",
                bio: "Expert in family planning and sexually transmitted infection treatment.",
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
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
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
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "The counseling service has truly changed my life. The staff was so respectful and understanding of my needs.",
                author: "Jessica M., 28",
              },
              {
                quote:
                  "I felt heard and respected. There was no pressure or judgment, just professional support.",
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
            Ready to Experience Our Services?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't hesitate to reach out for high-quality, gender-sensitive
            healthcare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/appointment"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Book an Appointment
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default About;
