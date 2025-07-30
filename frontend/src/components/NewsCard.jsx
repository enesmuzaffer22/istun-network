// frontend/src/components/NewsCard.jsx

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

function NewsCard({ title, content, imageUrl }) { // Prop'ları doğru isimlerle alıyoruz
  const cardRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    // Animasyon kodunuz aynı kalabilir
    // ...
  }, []);

  return (
    <div ref={cardRef} className="border-b border-primary pb-6 flex items-center justify-between gap-6 hover:bg-primary/5 cursor-pointer transition-colors duration-200">
      <div className="news-card-container flex gap-6 items-center min-w-0 flex-1">
        {imageUrl && ( // Eğer resim URL'si varsa göster
          <img
            src={imageUrl}
            alt={title}
            className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[150px] lg:h-[150px] hidden lg:flex flex-shrink-0 object-cover rounded-md"
          />
        )}
        <div className="news-card-content-container flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl text-primary font-bold mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base line-clamp-3">
            {content}
          </p>
        </div>
      </div>
      <i ref={arrowRef} className="bi bi-chevron-right text-primary text-[24px] flex-shrink-0"></i>
    </div>
  );
}

export default NewsCard;