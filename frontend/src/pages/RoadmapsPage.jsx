import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RoadmapCard from "../components/RoadmapCard";
import { useNavigate } from "react-router-dom";
import roadmapsDataJson from "./roadmapsData.json";

// ScrollTrigger plugin'ini kaydet
gsap.registerPlugin(ScrollTrigger);

function RoadmapsPage() {
  const titleRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const navigate = useNavigate();

  // JSON dosyasından yol haritası verisi
  const roadmapsData = roadmapsDataJson;

  useEffect(() => {
    // Sayfa yüklendiğinde animasyonları başlat
    const tl = gsap.timeline();

    // Başlık animasyonu
    tl.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }
    );

    // Kartlar için staggered animasyon
    gsap.fromTo(
      cardsContainerRef.current.children,
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
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: cardsContainerRef.current,
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
        Yol Haritaları
      </h1>
      <div 
        ref={cardsContainerRef} 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {roadmapsData.map((roadmap) => (
          <div key={roadmap.id} onClick={() => navigate(`/yol-haritalari/${roadmap.slug}`)}>
            <RoadmapCard
              title={roadmap.title}
              description={roadmap.description}
              date={roadmap.date}
              image={roadmap.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoadmapsPage; 