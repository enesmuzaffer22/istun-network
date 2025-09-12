import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import heroVideo from "../assets/video/hero_video.mp4";

// ScrollToPlugin'i kaydet
gsap.registerPlugin(ScrollToPlugin);

const heroPrimaryButtonStyles =
  "bg-white text-black px-8 py-3 rounded-full hover:bg-white/90 transition-colors cursor-pointer lg:w-auto w-full font-medium flex items-center justify-center gap-2";
const heroSecondaryButtonStyles =
  "bg-transparent text-white px-8 py-3 rounded-full border border-white hover:bg-white/10 transition-colors cursor-pointer lg:w-auto w-full font-medium";

function Hero() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const scrollToContent = () => {
    const viewportHeight = window.innerHeight;
    gsap.to(window, {
      duration: 1,
      scrollTo: viewportHeight,
      ease: "power2.inOut",
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline oluştur
      const tl = gsap.timeline();

      // Hero content animasyonu
      tl.fromTo(
        contentRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden h-dvh bg-gradient-to-br from-red-600 via-red-700 to-red-900"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content Container */}
      <div
        ref={contentRef}
        className="relative z-10 h-full px-4 2xl:px-[120px] flex flex-col justify-between py-8 lg:py-12"
      >
        {/* Top Left - Paragraph */}
        <div className="w-full lg:w-1/2 xl:w-2/5 pt-20">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <p
              className={`text-white text-lg lg:text-xl leading-relaxed transition-all duration-500 ease-in-out transform ${
                isHovered
                  ? "opacity-0 -translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
            >
              Burada birlikte büyüyor, birlikte öğreniyor ve mezuniyet sonrası
              da bağlarımızı koparmadan kariyer yolculuğumuza devam ediyoruz.
            </p>
            <p
              className={`text-white text-lg lg:text-xl leading-relaxed absolute top-0 left-0 w-full transition-all duration-500 ease-in-out transform ${
                isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              İş ve staj fırsatlarından mentorluk desteğine, sosyal sorumluluk
              projelerinden kişisel gelişim etkinliklerine kadar birçok
              ayrıcalık bizi bir araya getiriyor.
            </p>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
          {/* Bottom Left - Title */}
          <div className="w-full lg:w-1/2 xl:w-3/5">
            <h1 className="text-white font-bold text-left leading-tight text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[72px]">
              <span className="font-extralight italic">
                Aynı yoldan geçenlerin,
              </span>{" "}
              <br className="lg:block hidden" />
              aynı çatı altında buluşmaya <br className="lg:block hidden" />
              devam ettiği adres…
            </h1>
          </div>

          {/* Bottom Right - Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button
              className={heroPrimaryButtonStyles}
              onClick={scrollToContent}
            >
              Keşfetmeye Başla!
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            <button
              className={heroSecondaryButtonStyles}
              onClick={() => navigate("/hakkimizda")}
            >
              Hakkımızda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
