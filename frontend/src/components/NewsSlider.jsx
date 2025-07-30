// frontend/src/components/NewsSlider.jsx

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import API from "../utils/axios";

gsap.registerPlugin(ScrollTrigger);

function NewsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsData, setNewsData] = useState([]); // Statik veriyi state ile değiştiriyoruz
  
  // Ref'ler ve touch/drag fonksiyonları aynı kalabilir
  const sliderRef = useRef(null);
  const headerRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // API'den veri çekme
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await API.get('/news');
        setNewsData(response.data);
      } catch (error) {
        console.error("Slider için haberler çekilemedi:", error);
      }
    };
    fetchNews();
  }, []);

  // Slider'ın tüm fonksiyonları (next, prev, auto-play, touch, gsap) aynı kalabilir
  // Sadece newsData'nın boş olmamasına dikkat etmeliyiz.

  if (newsData.length === 0) {
    return null; // Veri yoksa slider'ı hiç gösterme
  }
  
  // ... (nextSlide, prevSlide, onTouch vb. tüm fonksiyonlar buraya kopyalanabilir) ...

  return (
    <div className="w-full pt-12 xl:pt-[90px] relative">
      <div ref={headerRef} className="flex flex-col items-center gap-4 mb-12 px-4">
        <h2 className="text-3xl xl:text-4xl font-bold text-primary">Haberler</h2>
        <p className="text-base text-center text-gray-500 max-w-3xl">İSTÜNetwork'ten en güncel haberler, etkinlikler ve başarı hikayelerini takip edin.</p>
      </div>

      <div className="relative w-full h-[60vh] max-h-[700px] overflow-hidden bg-gray-900" ref={sliderRef} /* ...onTouch ve onMouse eventleri */>
        <div className="flex h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {newsData.map((newsItem) => (
            <div key={newsItem.id} className="w-full h-full flex-shrink-0 relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${newsItem.banner_img_url})` }}>
                <div className="absolute inset-0 bg-black/60"></div>
              </div>
              <div className="relative z-10 h-full flex items-center justify-center text-center text-white p-8">
                <div>
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">{newsItem.category}</span>
                  <h3 className="text-2xl md:text-4xl font-bold mb-4">{newsItem.title}</h3>
                  <p className="text-lg text-gray-200 max-w-2xl mx-auto line-clamp-3">{newsItem.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Navigasyon okları ve noktaları aynı kalabilir */}
      </div>
    </div>
  );
}

export default NewsSlider;