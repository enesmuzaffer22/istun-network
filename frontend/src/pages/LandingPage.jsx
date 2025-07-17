import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutUsSection from "../components/AboutUsSection";
import Footer from "../components/Footer";
import JobSection from "../components/JobSection";
import NewsSlider from "../components/NewsSlider";

function LandingPage() {
  return (
    <div>
      <Hero />
      <NewsSlider />
      <JobSection />
      <AboutUsSection />
    </div>
  );
}

export default LandingPage;
