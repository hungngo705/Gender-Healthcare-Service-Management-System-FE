import React from "react";
import Breadcrumbs from "../components/sti/Breadcrumbs";
import HeroSection from "../components/sti/HeroSection";
import ServiceOverview from "../components/sti/ServiceOverview";
import TestingOptions from "../components/sti/TestingOptions";
import BookingForm from "../components/sti/BookingForm";
import Faq from "../components/sti/Faq";
import CallToAction from "../components/sti/CallToAction";

function STITesting() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Service Overview */}
        <ServiceOverview />

        {/* Testing Options */}
        <TestingOptions />

        {/* Appointment Booking Form */}
        <BookingForm />

        {/* FAQ Section */}
        <Faq />

        {/* Call to Action */}
        <CallToAction />
      </div>
    </div>
  );
}

export default STITesting;
