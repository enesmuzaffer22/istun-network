import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import HeroCard from "./HeroCard";
import career from "../assets/img/career.jpg";
import graduate from "../assets/img/graduate.jpg";
import speaking from "../assets/img/speaking.jpg";

const heroPrimaryButtonStyles =
  "bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors cursor-pointer md:w-auto w-full";
const heroSecondaryButtonStyles =
  "bg-white text-primary px-8 py-3 rounded-full border border-primary hover:bg-primary hover:text-white transition-colors cursor-pointer md:w-auto w-full";

function Hero() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline oluştur
      const tl = gsap.timeline();

      // Hero content container animasyonu
      tl.fromTo(
        contentRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        }
      );

      // Kartlar animasyonu
      tl.fromTo(
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
        },
        "-=0.3"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={heroRef}
      className="px-4 2xl:px-[120px] pt-8 md:pt-[120px] w-full flex justify-center flex-col gap-12 md:gap-[90px]"
    >
      <div
        ref={contentRef}
        className="hero-content-container flex flex-col gap-6 justify-center items-center w-full"
      >
        <div className="hero-content-text-container justify-center items-center flex flex-col gap-4 md:gap-6">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center xl:w-3/4">
            İş fırsatları, staj imkanları ve kariyer rehberliği tek platformda.
            Geleceğine bugünden başla.
          </h2>
          <p className="text-center text-sm sm:text-base md:text-xl text-gray-500 md:w-4/5">
            Öğrenci topluluğumuzda güncel iş ilanları, staj fırsatları ve
            kariyer rotaları keşfet. Deneyimli profesyonellerden rehberlik al,
            forumlarımızda sorularını sor ve kariyerinde bir adım öne geç.
          </p>
        </div>
        <div className="hero-buttons-container flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button className={heroPrimaryButtonStyles}>Keşfetmeye Başla!</button>
          <button className={heroSecondaryButtonStyles}>Hakkımızda</button>
        </div>
      </div>
      <div
        ref={cardsRef}
        className="hero-cards-container flex w-full gap-4 flex-col md:flex-row"
      >
        <HeroCard
          image={graduate}
          title="Küresel Network"
          description="Mezunlarımızı bir araya getirerek küresel çapta bağlantılar kurmayı hedefliyoruz."
        />
        <HeroCard
          image={career}
          title="Kariyer Fırsatları"
          description="Topluluğumuz, iş ve staj fırsatlarına erişim sağlayarak kariyerinizde size rehberlik eder."
        />
        <HeroCard
          image={speaking}
          title="Kişisel Gelişim"
          description="Seminerler, atölyeler ve mentorluk programlarıyla sürekli gelişim fırsatları sunuyoruz."
        />
      </div>
    </div>
  );
}

export default Hero;
