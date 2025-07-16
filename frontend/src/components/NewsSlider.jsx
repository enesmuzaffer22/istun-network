import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function NewsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const headerRef = useRef(null);

  // Touch/Swipe states
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Örnek haber verileri - API'den gelecek
  const newsData = [
    {
      id: 1,
      title: "İSTÜN Network'ten Yeni Teknoloji Buluşması",
      description:
        "Üniversitemizde düzenlenen teknoloji zirvesi büyük ilgi gördü. Sektörün önde gelen isimleri öğrencilerle buluştu.",
      image: "/src/assets/img/graduate.jpg",
      date: "15.01.2025",
      category: "Etkinlik",
    },
    {
      id: 2,
      title: "Mezunlarımızın Başarı Hikayesi",
      description:
        "2023 mezunumuz Ali Veli, kurduğu teknoloji startup'ı ile uluslararası yatırım aldı.",
      image: "/src/assets/img/career.jpg",
      date: "12.01.2025",
      category: "Mezun Haberi",
    },
    {
      id: 3,
      title: "Yeni Dönem Staj Programları",
      description:
        "2025 yaz dönemi için staj başvuruları başladı. Türkiye'nin önde gelen şirketleri ile iş birliği fırsatları.",
      image: "/src/assets/img/speaking.jpg",
      date: "10.01.2025",
      category: "Staj",
    },
    {
      id: 4,
      title: "Araştırma Projesi Ödül Aldı",
      description:
        "Öğrencilerimizin geliştirdiği yapay zeka projesi TÜBİTAK yarışmasında birinci oldu.",
      image: "/src/assets/img/graduate.jpg",
      date: "08.01.2025",
      category: "Başarı",
    },
    {
      id: 5,
      title: "Sektör Temsilcileri ile Panel",
      description:
        "Gelecek hafta düzenlenecek panelde kariyer fırsatları ve sektör trendleri konuşulacak.",
      image: "/src/assets/img/career.jpg",
      date: "05.01.2025",
      category: "Etkinlik",
    },
    {
      id: 6,
      title: "Yeni Laboratuvar Açılışı",
      description:
        "Üniversitemizde modern teknoloji laboratuvarı öğrencilerin hizmetine açıldı.",
      image: "/src/assets/img/speaking.jpg",
      date: "02.01.2025",
      category: "Haber",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newsData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newsData.length) % newsData.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Touch handling functions
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
    // Dikey scroll'u engellemek için preventDefault kullanmayalım
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Mouse events for desktop drag
  const onMouseDown = (e) => {
    setIsDragging(true);
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % newsData.length);
    }, 5000); // 5 saniyede bir otomatik geçiş

    return () => clearInterval(interval);
  }, [newsData.length]);

  // GSAP Animations
  useEffect(() => {
    const header = headerRef.current;

    if (!header) return;

    // Header animasyonu
    const tl = gsap.fromTo(
      header.children,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Cleanup function
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, []);

  return (
    <div className="w-full pt-12 xl:pt-[90px] relative">
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 px-4 sm:px-6"
      >
        <h2 className="text-3xl xl:text-4xl font-bold text-primary">
          Haberler
        </h2>
        <p className="text-base text-center text-gray-500 w-full sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3">
          İSTÜNetwork'ten en güncel haberler, etkinlikler ve başarı hikayelerini
          takip edin. Üniversitemizden ve mezunlarımızdan gelen son gelişmeleri
          kaçırmayın!
        </p>
      </div>

      {/* Slider Container */}
      <div
        className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[640px] xl:h-[700px] overflow-hidden bg-gray-900 touch-pan-y select-none cursor-grab active:cursor-grabbing"
        ref={sliderRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{
            transform: `translateX(-${
              currentSlide * (100 / newsData.length)
            }%)`,
            width: `${newsData.length * 100}%`,
          }}
        >
          {newsData.map((news) => (
            <div
              key={news.id}
              className="relative h-full flex-shrink-0"
              style={{ width: `${100 / newsData.length}%` }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${news.image})`,
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="text-center text-white max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
                  <span className="inline-block bg-primary text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                    {news.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                    {news.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 text-gray-200 leading-relaxed">
                    {news.description}
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base">
                    {news.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Hidden on mobile */}
        <button
          onClick={prevSlide}
          className="hidden sm:flex absolute left-4 md:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full items-center justify-center transition-all duration-300 z-20 group"
          aria-label="Previous slide"
        >
          <i className="bi bi-chevron-left text-xl group-hover:scale-110 transition-transform"></i>
        </button>

        <button
          onClick={nextSlide}
          className="hidden sm:flex absolute right-4 md:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full items-center justify-center transition-all duration-300 z-20 group"
          aria-label="Next slide"
        >
          <i className="bi bi-chevron-right text-xl group-hover:scale-110 transition-transform"></i>
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
          {newsData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsSlider;
