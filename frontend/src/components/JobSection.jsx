// frontend/src/components/JobSection.jsx

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import JobSectionCard from "./JobSectionCard";
import API from "../utils/axios";
import useAuthStore from "../store/authStore";

gsap.registerPlugin(ScrollTrigger);

function JobSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const buttonRef = useRef(null);

  const [jobListings, setJobListings] = useState([]);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handleViewMoreClick = () => {
    navigate("/kariyer");
  };

  useEffect(() => {
    // Sadece giriş yapılmış kullanıcılar için iş ilanlarını yükle
    if (isAuthenticated) {
      const fetchJobs = async () => {
        try {
          const response = await API.get("/jobs");
          setJobListings(response.data.slice(0, 4));
        } catch (error) {
          console.error("İş ilanları yüklenirken hata oluştu:", error);
        }
      };
      fetchJobs();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (jobListings.length > 0) {
      // Animasyon kodunuz aynı kalıyor
      const header = headerRef.current;
      const cardsContainer = cardsContainerRef.current;
      const button = buttonRef.current;

      const headerAnim = gsap.fromTo(
        header.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      const cardsAnim = gsap.fromTo(
        cardsContainer.children,
        { opacity: 0, y: 100, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cardsContainer,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
      const buttonAnim = gsap.fromTo(
        button,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: button,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );

      return () => {
        headerAnim.kill();
        cardsAnim.kill();
        buttonAnim.kill();
      };
    }
  }, [jobListings]);

  // Sadece giriş yapılmış kullanıcılara göster
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      className="flex flex-col gap-12 items-center 2xl:px-[120px] px-4 py-12 md:py-[90px]"
    >
      <div
        ref={headerRef}
        className="job-section-header-container flex flex-col items-center gap-4"
      >
        <h2 className="text-3xl xl:text-4xl font-bold text-primary">
          Kariyer Fırsatları
        </h2>
        <p className="text-base text-center text-gray-500 w-full xl:w-2/3">
          İSTÜNetwork olarak, öğrencilerimizin ve mezunlarımızın kariyer
          yolculuklarını desteklemeyi önemsiyoruz...
        </p>
      </div>
      <div
        ref={cardsContainerRef}
        className="flex xl:flex-row flex-col gap-4 w-full"
      >
        {jobListings.map((job) => (
          /*
            DEĞİŞİKLİK: 
            Prop adları artık doğrudan veritabanındaki alan adlarıyla aynı.
            job_title -> title, job_employer -> employer, job_description -> content.
          */
          <JobSectionCard
            key={job.id}
            id={job.id}
            title={job.title}
            employer={job.employer}
            date={job.created_at}
            description={job.content}
          />
        ))}
      </div>
      <button
        ref={buttonRef}
        onClick={handleViewMoreClick}
        className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors cursor-pointer md:w-auto w-full"
      >
        Daha Fazlasına Göz At!
      </button>
    </div>
  );
}

export default JobSection;
