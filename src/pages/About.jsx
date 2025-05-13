import React from "react";

function About() {
  return (
    <div className="about-page">
      <div className="container">
        <h2>About Us</h2>
        <p className="section-description">
          We are dedicated to providing gender-sensitive healthcare services
          that meet the unique needs of all individuals.
        </p>

        <div className="about-content">
          <div className="about-mission">
            <h3>Our Mission</h3>
            <p>
              Our mission is to deliver high-quality, gender-sensitive
              healthcare services that respect and address the unique needs of
              all individuals, regardless of gender identity or expression. We
              strive to create a safe, inclusive, and supportive environment
              where everyone can access the care they deserve.
            </p>
          </div>

          <div className="about-vision">
            <h3>Our Vision</h3>
            <p>
              We envision a healthcare system where gender-specific needs are
              recognized, respected, and addressed with the highest standards of
              care. We are committed to advancing healthcare practices and
              policies that eliminate disparities and promote equity for all
              genders.
            </p>
          </div>

          <div className="about-values">
            <h3>Our Values</h3>
            <ul>
              <li>
                <strong>Respect:</strong> We respect the dignity, autonomy, and
                unique identities of all individuals.
              </li>
              <li>
                <strong>Inclusivity:</strong> We create a welcoming environment
                for people of all genders and backgrounds.
              </li>
              <li>
                <strong>Excellence:</strong> We provide the highest quality of
                care using evidence-based practices.
              </li>
              <li>
                <strong>Compassion:</strong> We approach each person with
                empathy and understanding.
              </li>
              <li>
                <strong>Education:</strong> We are committed to continuous
                learning and professional development.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
