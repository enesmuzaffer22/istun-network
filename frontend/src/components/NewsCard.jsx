import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

function NewsCard(props) {
  const cardRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const arrow = arrowRef.current;

    // Hover animasyonları - kariyer sayfası tarzında
    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(arrow, {
        x: 5,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(arrow, {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Event listeners
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="border-b border-primary pb-6 flex items-center justify-between gap-6 hover:bg-primary/3 cursor-pointer transition-colors duration-200"
    >
      <div className="news-card-container flex gap-6 items-center min-w-0 flex-1">
        <img
          src=""
          alt=""
          className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[150px] lg:h-[150px] hidden lg:flex flex-shrink-0 object-cover"
        />
        <div className="news-card-content-container flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl text-primary font-bold mb-2 line-clamp-2">
            {props.news_title}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base line-clamp-3">
            {props.news_description}
          </p>
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
