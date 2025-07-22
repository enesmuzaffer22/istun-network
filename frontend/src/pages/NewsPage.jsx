import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NewsCard from "../components/NewsCard";
import { useNavigate } from "react-router-dom";
import newsDataJson from "./newsData.json";

// ScrollTrigger plugin'ini kaydet
gsap.registerPlugin(ScrollTrigger);

function NewsPage() {
  const titleRef = useRef(null);
  const newsContainerRef = useRef(null);
  const navigate = useNavigate();

  // JSON dosyasından haber verisi
  const newsData = newsDataJson;

  useEffect(() => {
    // Sayfa yüklendiğinde animasyonları başlat
    const tl = gsap.timeline();

    // Başlık animasyonu - kariyer sayfası tarzında
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

    // Haber kartları için staggered animasyon - kariyer sayfası tarzında
    gsap.fromTo(
      newsContainerRef.current.children,
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: newsContainerRef.current,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="flex flex-col gap-12 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      <h1
        ref={titleRef}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary"
      >
        Haberler
      </h1>
      <div ref={newsContainerRef} className="flex flex-col gap-12">
        {newsData.map((news) => (
          <div key={news.id} onClick={() => navigate(`/haberler/${news.slug}`)}>
            <NewsCard
              news_title={news.news_title}
              news_description={news.news_description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsPage;
