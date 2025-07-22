import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import JobsPageCard from "../components/JobsPageCard";
import { useNavigate } from "react-router-dom";
import jobsDataJson from "./jobsData.json";

function JobsPage() {
  const titleRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const navigate = useNavigate();

  // JSON dosyasından iş ilanı verisi
  const jobsData = jobsDataJson;

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate title
    tl.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }
    );

    // Animate job cards with stagger effect
    tl.fromTo(
      ".job-card",
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.3"
    );
  }, []);

  return (
    <div className="flex flex-col gap-12 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      <h1
        ref={titleRef}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary"
      >
        Kariyer Fırsatları
      </h1>
      <div
        ref={cardsContainerRef}
        className="jobs-page-cards-container flex flex-col gap-y-12"
      >
        {jobsData.map((job) => (
          <div key={job.id} onClick={() => navigate(`/kariyer/${job.slug}`)}>
            <JobsPageCard
              job_title={job.job_title}
              job_employer={job.job_employer}
              job_date={job.job_date}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobsPage;
