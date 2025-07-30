import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

function JobsPageCard({ title, employer, date }) {
  const cardRef = useRef(null);
  const chevronRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const chevron = chevronRef.current;

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(chevron, {
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
      gsap.to(chevron, {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="job-card w-full border-b border-primary pb-4 flex items-center justify-between hover:bg-primary/3 cursor-pointer transition-colors duration-200"
    >
      <div className="jobs-page-card-content-container">
        <h3 className="text-xl sm:text-2xl text-primary font-bold">
          {title}
        </h3>
        <h5 className="text-base text-primary">{employer}</h5>
        <p className="text-sm text-gray-400">
          {new Date(date).toLocaleDateString("tr-TR")}
        </p>
      </div>
      <i
        ref={chevronRef}
        className="bi bi-chevron-right text-primary text-[24px]"
      ></i>
    </div>
  );
}

export default JobsPageCard;
