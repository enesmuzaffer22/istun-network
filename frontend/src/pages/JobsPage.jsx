// frontend/src/pages/JobsPage.jsx

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import JobsPageCard from "../components/JobsPageCard";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

function JobsPage() {
  const titleRef = useRef(null);
  const navigate = useNavigate();
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false; // Cleanup için flag

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await API.get("/jobs");

        // Component unmount olmamışsa state'i güncelle
        if (!isCancelled) {
          setJobsData(response.data);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("JobsPage Hata:", error);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loading && jobsData.length > 0) {
      const tl = gsap.timeline();
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
      tl.fromTo(
        ".job-card-wrapper",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.3"
      );
    }
  }, [loading, jobsData]);

  if (loading) {
    return <div className="text-center p-20">İş İlanları Yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col gap-12 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      <h1
        ref={titleRef}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary opacity-0"
      >
        Kariyer Fırsatları
      </h1>
      <div className="jobs-page-cards-container flex flex-col gap-y-12">
        {jobsData.map((job) => (
          <div
            key={job.id}
            className="job-card-wrapper opacity-0"
            onClick={() => navigate(`/kariyer/${job.id}`)}
          >
            {/* DEĞİŞİKLİK: Prop adları artık doğrudan veritabanındaki alan adlarıyla aynı. */}
            <JobsPageCard
              title={job.title}
              employer={job.employer}
              date={job.created_at}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobsPage;
