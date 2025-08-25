import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HeroCards from "../components/HeroCards";
import AboutUsSection from "../components/AboutUsSection";
import Footer from "../components/Footer";
import JobSection from "../components/JobSection";
import NewsSlider from "../components/NewsSlider";
import AnnouncementsSection from "../components/AnnouncementsSection";
import EventsSection from "../components/EventsSection";

function LandingPage() {
  return (
    <div>
      <Hero />
      <HeroCards />
      <NewsSlider />
      <EventsSection />
      <AnnouncementsSection />
      <JobSection />
      <AboutUsSection />
    </div>
  );
}

export default LandingPage;
