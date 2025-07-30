// frontend/src/pages/NewsPage.jsx

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import NewsCard from "../components/NewsCard";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

function NewsPage() {
  const titleRef = useRef(null);
  const newsContainerRef = useRef(null);
  const navigate = useNavigate();

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await API.get("/news");
        setNewsData(response.data);
      } catch (error) {
        console.error("Haberler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if (!loading && newsData.length > 0) {
      const tl = gsap.timeline();
      tl.fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
      gsap.fromTo(newsContainerRef.current.children, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" });
    }
  }, [loading, newsData]);

  if (loading) return <div className="text-center p-20">Haberler Yükleniyor...</div>;

  return (
    <div className="flex flex-col gap-12 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary opacity-0">
        Haberler
      </h1>
      <div ref={newsContainerRef} className="flex flex-col gap-12">
        {newsData.map((newsItem) => (
          <div key={newsItem.id} onClick={() => navigate(`/haberler/${newsItem.id}`)} className="opacity-0">
            <NewsCard
              title={newsItem.title}
              content={newsItem.content}
              imageUrl={newsItem.thumbnail_img_url}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsPage;