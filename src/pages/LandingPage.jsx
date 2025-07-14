import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutUsSection from "../components/AboutUsSection";
import Footer from "../components/Footer";
import JobSection from "../components/JobSection";

function LandingPage() {
  return (
    <div>
      <Hero />
      <AboutUsSection />
      <JobSection />
    </div>
  );
}

export default LandingPage;
