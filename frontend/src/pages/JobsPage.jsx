import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import JobsPageCard from "../components/JobsPageCard";

function JobsPage() {
  const titleRef = useRef(null);
  const cardsContainerRef = useRef(null);

  // Simulating API data with placeholder job postings
  const jobsData = [
    {
      id: 1,
      job_title: "Frontend Developer",
      job_employer: "Tech Solutions Ltd.",
      job_date: "15 Aralık 2024",
    },
    {
      id: 2,
      job_title: "Backend Developer",
      job_employer: "Digital Innovations Inc.",
      job_date: "12 Aralık 2024",
    },
    {
      id: 3,
      job_title: "UI/UX Designer",
      job_employer: "Creative Studio",
      job_date: "10 Aralık 2024",
    },
    {
      id: 4,
      job_title: "DevOps Engineer",
      job_employer: "Cloud Systems Co.",
      job_date: "8 Aralık 2024",
    },
    {
      id: 5,
      job_title: "Product Manager",
      job_employer: "StartUp Hub",
      job_date: "5 Aralık 2024",
    },
    {
      id: 6,
      job_title: "Data Scientist",
      job_employer: "Analytics Pro",
      job_date: "3 Aralık 2024",
    },
    {
      id: 7,
      job_title: "Mobile Developer",
      job_employer: "App Development Corp.",
      job_date: "1 Aralık 2024",
    },
  ];

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
          <JobsPageCard
            key={job.id}
            job_title={job.job_title}
            job_employer={job.job_employer}
            job_date={job.job_date}
          />
        ))}
      </div>
    </div>
  );
}

export default JobsPage;
