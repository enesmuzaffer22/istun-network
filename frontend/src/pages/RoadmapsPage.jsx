import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RoadmapCard from "../components/RoadmapCard";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios'u import et

gsap.registerPlugin(ScrollTrigger);

function RoadmapsPage() {
  const titleRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const navigate = useNavigate();

  // State'leri tanımla: roadmaps, loading, error
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Veri çekme useEffect'i
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/roadmaps");
        setRoadmaps(response.data); // Gelen veriyi state'e ata
        setError(null);
      } catch (err) {
        console.error("Yol haritaları çekilirken hata:", err);
        setError("Veriler yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []); // Sadece component yüklendiğinde bir kez çalışır

  // Animasyon useEffect'i
  useEffect(() => {
    // Veriler yüklendikten ve hata olmadıktan sonra animasyonları çalıştır
    if (loading || error || roadmaps.length === 0) return;

    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    gsap.fromTo(
      cardsContainerRef.current.children,
      { opacity: 0, y: 100, scale: 0.8 },
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
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loading, error, roadmaps]); // Bu effect, yükleme durumu veya veri değiştiğinde yeniden değerlendirilir

  return (
    <div className="flex flex-col gap-12 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
        Yol Haritaları
      </h1>
      <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && <p className="col-span-full text-center">Yükleniyor...</p>}
        {error && <p className="col-span-full text-center text-red-500">{error}</p>}
        {!loading && !error && roadmaps.map((roadmap) => (
          // slug yerine backend'den gelen 'id' ile yönlendirme yapıyoruz
          <div key={roadmap.id} onClick={() => navigate(`/yol-haritalari/${roadmap.id}`)}>
            <RoadmapCard
              // Propları backend'den gelen verilere göre eşleştiriyoruz
              title={roadmap.title}
              description={roadmap.content} // Backend 'content' gönderiyor
              date={new Date(roadmap.created_at).toLocaleDateString("tr-TR")} // Tarihi formatlıyoruz
              image={roadmap.image_url} // Backend 'image_url' gönderiyor
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoadmapsPage;