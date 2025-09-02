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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const fetchJobs = async (targetPage) => {
      try {
        setLoading(true);
        const response = await API.get("/jobs", {
          params: { page: targetPage },
        });
        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        const nextHasMore =
          typeof response.data?.hasMore === "boolean"
            ? response.data.hasMore
            : list.length === 12;

        if (!isCancelled) {
          setJobsData(list);
          setHasMore(nextHasMore);
          setPage(targetPage);
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

    fetchJobs(1);

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

  const goToPrev = () => {
    if (page > 1) {
      // Sayfa değişiminde yeni verileri çek
      (async () => {
        const target = page - 1;
        setLoading(true);
        try {
          const response = await API.get("/jobs", { params: { page: target } });
          const list = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.data)
            ? response.data.data
            : [];
          const nextHasMore =
            typeof response.data?.hasMore === "boolean"
              ? response.data.hasMore
              : list.length === 12;
          setJobsData(list);
          setHasMore(nextHasMore);
          setPage(target);
        } catch (error) {
          console.error("JobsPage Hata:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  const goToNext = () => {
    if (hasMore) {
      (async () => {
        const target = page + 1;
        setLoading(true);
        try {
          const response = await API.get("/jobs", { params: { page: target } });
          const list = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.data)
            ? response.data.data
            : [];
          const nextHasMore =
            typeof response.data?.hasMore === "boolean"
              ? response.data.hasMore
              : list.length === 12;
          setJobsData(list);
          setHasMore(nextHasMore);
          setPage(target);
        } catch (error) {
          console.error("JobsPage Hata:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  const getVisiblePages = () => {
    const pages = Array.from({ length: page }, (_, i) => i + 1);
    if (hasMore) pages.push(page + 1);
    return pages;
  };

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
      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={goToPrev}
          disabled={page === 1 || loading}
          className={`mt-2 px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
            page === 1 || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-red-700"
          }`}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="flex items-center gap-2 mt-2">
          {getVisiblePages().map((p) => (
            <button
              key={p}
              onClick={() =>
                p !== page
                  ? (async () => {
                      setLoading(true);
                      try {
                        const response = await API.get("/jobs", {
                          params: { page: p },
                        });
                        const list = Array.isArray(response.data)
                          ? response.data
                          : Array.isArray(response.data?.data)
                          ? response.data.data
                          : [];
                        const nextHasMore =
                          typeof response.data?.hasMore === "boolean"
                            ? response.data.hasMore
                            : list.length === 12;
                        setJobsData(list);
                        setHasMore(nextHasMore);
                        setPage(p);
                      } catch (error) {
                        console.error("JobsPage Hata:", error);
                      } finally {
                        setLoading(false);
                      }
                    })()
                  : null
              }
              className={`min-w-9 h-9 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                p === page
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          onClick={goToNext}
          disabled={!hasMore || loading}
          className={`mt-2 px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
            !hasMore || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-red-700"
          }`}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

export default JobsPage;
