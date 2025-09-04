import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroCard from "./HeroCard";
import career from "../assets/img/career.jpg";
import graduate from "../assets/img/graduate.jpg";
import speaking from "../assets/img/speaking.jpg";

gsap.registerPlugin(ScrollTrigger);

function HeroCards() {
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Kartlar animasyonu
      gsap.fromTo(
        cardsRef.current.children,
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, cardsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="px-4 2xl:px-[120px] pt-12 md:pt-[90px]">
      <div
        ref={cardsRef}
        className="hero-cards-container flex w-full gap-4 flex-col md:flex-row"
      >
        <HeroCard
          image={graduate}
          title="Küresel Network"
          description="ISTUNetwork, mezunlarımızı bir araya getirerek küresel ölçekte güçlü bağlantılar kurmayı hedefler."
        />
        <HeroCard
          image={career}
          title="Kariyer Fırsatları"
          description="ISTUNetwork, mezunlarımızı ve öğrencilerimizi iş dünyasına hazırlayan güçlü bir köprü görevi görür."
        />
        <HeroCard
          image={speaking}
          title="Kişisel Gelişim"
          description="ISTUNetwork, yalnızca mezunlarımızın kariyer yolculuğunu değil, kişisel gelişimlerini de destekler."
        />
      </div>
    </div>
  );
}

export default HeroCards;
