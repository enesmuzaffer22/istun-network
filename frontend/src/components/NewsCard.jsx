// frontend/src/components/NewsCard.jsx

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

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

function NewsCard({ title, content, imageUrl, createdAt, category }) {
  // createdAt ve category prop'ları eklendi
  const cardRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    // Animasyon kodunuz aynı kalabilir
    // ...
  }, []);

  return (
    <div
      ref={cardRef}
      className="border-b border-primary py-6 flex items-center justify-between gap-6 hover:bg-primary/5 cursor-pointer transition-colors duration-200"
    >
      <div className="news-card-container flex gap-6 items-center min-w-0 flex-1">
        {imageUrl && ( // Eğer resim URL'si varsa göster
          <img
            src={imageUrl}
            alt={title}
            className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[150px] lg:h-[150px] hidden lg:flex flex-shrink-0 object-cover rounded-md"
          />
        )}
        <div className="news-card-content-container flex-1 min-w-0">
          {/* Kategori Badge */}
          {category && (
            <span className="inline-block bg-primary text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
              {category}
            </span>
          )}

          <h3 className="text-xl sm:text-2xl text-primary font-bold mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base line-clamp-3 mb-2">
            {content}
          </p>
          {createdAt && (
            <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
              <i className="bi bi-calendar3"></i>
              <span>{formatDate(createdAt)}</span>
            </div>
          )}
        </div>
      </div>
      <i
        ref={arrowRef}
        className="bi bi-chevron-right text-primary text-[24px] flex-shrink-0"
      ></i>
    </div>
  );
}

export default NewsCard;
