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

function NewsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sliderRef = useRef(null);
  const headerRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState(null);

  // API'den veri çekme
  useEffect(() => {
    let isCancelled = false;

    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await API.get("/news");

        if (!isCancelled) {
          // İlk 5 haberi al
          setNewsData(response.data.slice(0, 5));
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Slider için haberler çekilemedi:", error);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchNews();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Slider fonksiyonları
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newsData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newsData.length) % newsData.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play
  useEffect(() => {
    if (newsData.length > 1 && !isDragging) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % newsData.length);
      }, 5000);
      setAutoPlayInterval(interval);
      return () => clearInterval(interval);
    }
  }, [newsData.length, isDragging]);

  // Touch/drag handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setIsDragging(false);
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    setIsDragging(true);
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd || !isDragging) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    // Sadece drag state'ini temizle, slide değiştirme
    if (isDragging) {
      setIsDragging(false);
      setTouchStart(null);
      setTouchEnd(null);
    }
  };

  // GSAP animasyonları
  useEffect(() => {
    if (!loading && newsData.length > 0) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(
        sliderRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sliderRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, [loading, newsData]);

  if (loading) {
    return (
      <div className="w-full pt-12 xl:pt-[90px] relative">
        <div className="flex flex-col items-center gap-4 mb-12 px-4">
          <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-96 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="relative w-full h-[60vh] max-h-[700px] bg-gray-200 animate-pulse rounded-lg mx-4"></div>
      </div>
    );
  }

  if (newsData.length === 0) {
    return null;
  }

  return (
    <div className="w-full pt-12 xl:pt-[90px] relative">
      <div
        ref={headerRef}
        className="flex flex-col items-center gap-4 mb-12 px-4 opacity-0"
      >
        <h2 className="text-3xl xl:text-4xl font-bold text-primary">
          Haberler
        </h2>
        <p className="text-base text-center text-gray-500 max-w-3xl">
          İSTÜNetwork'ten en güncel haberler, etkinlikler ve başarı hikayelerini
          takip edin.
        </p>
      </div>

      <div
        className="relative w-full h-[60vh] max-h-[700px] overflow-hidden bg-gray-900 cursor-grab active:cursor-grabbing"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {newsData.map((newsItem) => (
            <div
              key={newsItem.id}
              className="w-full h-full flex-shrink-0 relative cursor-pointer"
              onClick={() => navigate(`/haberler/${newsItem.id}`)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    newsItem.banner_img_url || newsItem.thumbnail_img_url
                  })`,
                }}
              >
                <div className="absolute inset-0 bg-black/60"></div>
              </div>
              <div className="relative z-10 h-full flex items-center justify-center text-center text-white p-8">
                <div className="max-w-4xl">
                  {newsItem.category && (
                    <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6 inline-block">
                      {newsItem.category}
                    </span>
                  )}
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    {newsItem.title}
                  </h3>
                  <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto line-clamp-3 leading-relaxed mb-4">
                    {newsItem.content}
                  </p>
                  {newsItem.created_at && (
                    <div className="flex items-center justify-center gap-2 text-gray-300 text-sm md:text-base mb-6">
                      <i className="bi bi-calendar3"></i>
                      <span>{formatDate(newsItem.created_at)}</span>
                    </div>
                  )}
                  <button className="mt-6 bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                    Devamını Oku
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Sadece desktop'ta göster */}
        {newsData.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-20"
            >
              <i className="bi bi-chevron-left text-xl"></i>
            </button>
            <button
              onClick={nextSlide}
              className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-20"
            >
              <i className="bi bi-chevron-right text-xl"></i>
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {newsData.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {newsData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsSlider;
