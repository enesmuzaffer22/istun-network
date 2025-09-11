import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aboutUsImg from "../assets/img/about_us_section.jpg";

gsap.registerPlugin(ScrollTrigger);

function AboutUsSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline oluştur
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Başlık animasyonu
      tl.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }
      )
        // Ana başlık animasyonu
        .fromTo(
          headingRef.current,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        // Paragraf animasyonu
        .fromTo(
          paragraphRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        // Görsel animasyonu
        .fromTo(
          imageRef.current,
          {
            opacity: 0,
            scale: 0.9,
            x: 50,
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="bg-white flex gap-8 xl:gap-24 py-12 md:py-[90px] justify-between px-4 2xl:px-[120px] xl:flex-row flex-col"
    >
      <div className="about-us-content-container flex-2/5 flex flex-col gap-8">
        <h3
          ref={titleRef}
          className="text-primary text-xl md:text-2xl font-bold"
        >
          Hakkımızda
        </h3>
        <h1 ref={headingRef} className="text-3xl md:text-4xl font-extralight">
          En güçlü bağlantıları kurmak ve geleceği birlikte inşa etmek için
          buradayız.
        </h1>
        <p ref={paragraphRef} className="text-base">
          İstanbul Sağlık ve Teknoloji Üniversitesi Bilgisayar mühendisliği
          bölüm başkanlığı desteği ile Bilgisayar ve Yazılım mühendisleri
          mezunları olarak, kariyer fırsatları yaratmak, bilgi ve
          deneyimlerimizi paylaşmak ve topluluğumuzun her bir üyesini daha
          ileriye taşımak için bir araya geldik. İnovasyonu ve dayanışmayı
          merkeze alan yapımızla, bireysel başarılardan kolektif büyümeye uzanan
          bir yolculuğu birlikte sürdürüyoruz.
        </p>
        <div>
          <button
            className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors cursor-pointer w-fit"
            onClick={() => navigate("/hakkimizda")}
          >
            Hakkımızda
          </button>
        </div>
      </div>
      <img
        ref={imageRef}
        src={aboutUsImg}
        alt=""
        className="flex-auto xl:flex-3/5 h-[320px] xl:h-[480px] rounded-2xl object-cover"
      />
    </div>
  );
}

export default AboutUsSection;
