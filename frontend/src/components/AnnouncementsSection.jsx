import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

gsap.registerPlugin(ScrollTrigger);

// Tarih formatlama fonksiyonu
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Istanbul",
  };
  return date.toLocaleDateString("tr-TR", options);
};

function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsContainerRef = useRef(null);

  // API'den duyuru verilerini çekme
  useEffect(() => {
    let isCancelled = false;

    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await API.get("/announcements", {
          params: { page: 1 },
        });
        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        if (!isCancelled) {
          setAnnouncements(list.slice(0, 3));
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Duyurular çekilemedi:", error);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchAnnouncements();

    return () => {
      isCancelled = true;
    };
  }, []);

  // GSAP animasyonları
  useEffect(() => {
    if (!loading && announcements.length > 0) {
      const ctx = gsap.context(() => {
        // Başlık animasyonu
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );

        // Kartlar animasyonu
        gsap.fromTo(
          cardsContainerRef.current.children,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [loading, announcements]);

  if (loading) {
    return (
      <div className="w-full py-12 xl:py-[90px] px-4 2xl:px-[120px]">
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-96 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse rounded-lg h-40"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      className="w-full py-12 xl:py-[90px] px-4 2xl:px-[120px] bg-gray-50"
    >
      <div
        ref={headerRef}
        className="flex flex-col items-center gap-4 mb-12 opacity-0"
      >
        <h2 className="text-3xl xl:text-4xl font-bold text-primary">
          Duyurular
        </h2>
        <p className="text-base text-center text-gray-500 max-w-3xl">
          İSTÜNetwork'ten önemli duyurular, etkinlik bilgilendirmeleri ve
          topluluk haberlerini takip edin.
        </p>
      </div>

      <div
        ref={cardsContainerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col h-full"
            onClick={() => navigate(`/duyurular/${announcement.id}`)}
          >
            <div className="p-6 flex-1">
              {announcement.category && (
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  {announcement.category}
                </span>
              )}

              <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {announcement.title}
              </h3>

              {announcement.created_at && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <i className="bi bi-calendar3"></i>
                  <span>{formatDate(announcement.created_at)}</span>
                </div>
              )}
            </div>

            {/* Hover efekti için alt çizgi - her zaman kartın en altında */}
            <div className="h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        ))}
      </div>

      {/* Daha fazla duyuru görmek için buton */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate("/duyurular")}
          className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer"
        >
          <span>Tüm Duyuruları Görüntüle</span>
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default AnnouncementsSection;
