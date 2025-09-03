import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SocialImpactGallery from "../components/SocialImpactGallery";
import API from "../utils/axios";
import img1 from "../assets/img/social_impact/1.PNG";
import img2 from "../assets/img/social_impact/2.PNG";
import img3 from "../assets/img/social_impact/3.jpg";
import img4 from "../assets/img/social_impact/4.jpg";
import img5 from "../assets/img/social_impact/5.jpg";
import img6 from "../assets/img/social_impact/6.jpg";
import img7 from "../assets/img/social_impact/7.jpg";
import img8 from "../assets/img/social_impact/8.jpg";
import img9 from "../assets/img/social_impact/9.jpg";

function SocialImpactPage() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const scoreRef = useRef(null);
  const projectsRef = useRef(null);
  const impactRef = useRef(null);

  const [socialImpactData, setSocialImpactData] = useState(null);
  const [loading, setLoading] = useState(true);

  // API'den sosyal etki verilerini çekme
  useEffect(() => {
    const fetchSocialImpactData = async () => {
      try {
        setLoading(true);
        const response = await API.get("/socialimpactscores");
        const data = response?.data?.data ?? response?.data;
        if (data) {
          setSocialImpactData(data);
        }
      } catch (error) {
        console.error("Sosyal etki verileri çekilemedi:", error);
        // Hata durumunda varsayılan değerler kullan
        setSocialImpactData({
          social_impact_score: "85",
          number_of_people_reached: "2500",
          social_projects: "25",
          awards: "15",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSocialImpactData();
  }, []);

  // Sosyal etki projesi resimleri
  const galleryItems = [
    {
      id: 1,
      img: img1,
      height: 800,
      url: "#",
    },
    {
      id: 2,
      img: img2,
      height: 750,
      url: "#",
    },
    {
      id: 3,
      img: img3,
      height: 600,
      url: "#",
    },
    {
      id: 4,
      img: img4,
      height: 650,
      url: "#",
    },
    {
      id: 5,
      img: img5,
      height: 500,
      url: "#",
    },
    {
      id: 6,
      img: img6,
      height: 700,
      url: "#",
    },
    {
      id: 7,
      img: img7,
      height: 500,
      url: "#",
    },
    {
      id: 8,
      img: img8,
      height: 700,
      url: "#",
    },
    {
      id: 9,
      img: img9,
      height: 400,
      url: "#",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ana sayfa animasyonu
      const tl = gsap.timeline();

      // Hero section animasyonu
      tl.fromTo(
        heroRef.current,
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

      // Score section animasyonu (varsa)
      if (scoreRef.current) {
        tl.fromTo(
          scoreRef.current,
          {
            opacity: 0,
            scale: 0.8,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        );
      }

      // Projects section animasyonu (varsa çocukları)
      const projectChildren = projectsRef.current?.children;
      if (projectChildren && projectChildren.length) {
        tl.fromTo(
          projectChildren,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.2"
        );
      }

      // Impact section animasyonu (bölüm mevcutsa)
      const impactChildren = impactRef.current?.children;
      if (impactChildren && impactChildren.length) {
        tl.fromTo(
          impactChildren,
          {
            opacity: 0,
            x: -30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [loading]); // loading değiştiğinde animasyonları tekrar çalıştır

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="bg-gradient-to-br from-primary via-red-600 to-red-800 text-white py-20 relative overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/20"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-white/10"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white/15"></div>
        </div>

        <div className="container mx-auto px-4 2xl:px-[120px] relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-6 py-3 mb-8">
              <i className="bi bi-heart-fill text-2xl"></i>
              <span className="font-semibold text-lg">Sosyal Etki</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Topluma Dokunmak,
              <br />
              <span className="text-white/90 font-light italic">
                Fark Yaratmak
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              ISTUNetwork olarak bizler, mühendislik bilgisini yalnızca
              teknoloji üretmek için değil; topluma dokunmak, farkındalık
              yaratmak ve değer katmak için de kullanıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Social Impact Score Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div ref={scoreRef} className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Sosyal Etki Skorumuz
            </h2>

            {/* Main Score Display */}
            <div className="relative inline-block mb-12">
              <div className="w-64 h-64 mx-auto relative">
                {/* Circular Progress Background */}
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgb(243 244 246)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="283"
                    strokeDashoffset={
                      loading
                        ? "70.75"
                        : `${
                            283 -
                            283 *
                              (parseInt(
                                socialImpactData?.social_impact_score || "85"
                              ) /
                                100)
                          }`
                    }
                    strokeLinecap="round"
                    className="transition-all duration-2000 ease-out"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#e33025" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
                      {loading ? (
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      ) : (
                        socialImpactData?.social_impact_score || "85"
                      )}
                    </div>
                    <div className="text-gray-600 font-medium">
                      Sosyal Etki Puanı
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="bi bi-people text-white text-xl"></i>
                </div>
                <div className="text-2xl font-bold text-green-700 mb-2">
                  {loading ? (
                    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    `${socialImpactData?.number_of_people_reached || "2500"}+`
                  )}
                </div>
                <div className="text-green-600 font-medium">Etkilenen Kişi</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="bi bi-calendar-event text-white text-xl"></i>
                </div>
                <div className="text-2xl font-bold text-blue-700 mb-2">
                  {loading ? (
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    `${socialImpactData?.social_projects || "25"}+`
                  )}
                </div>
                <div className="text-blue-600 font-medium">Sosyal Proje</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="bi bi-award text-white text-xl"></i>
                </div>
                <div className="text-2xl font-bold text-purple-700 mb-2">
                  {loading ? (
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    `${socialImpactData?.awards || "15"}+`
                  )}
                </div>
                <div className="text-purple-600 font-medium">
                  Ödül & Tanıtım
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Sosyal Sorumluluk Anlayışımız
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-12">
              Her yıl düzenlediğimiz sosyal sorumluluk çalışmaları ile hem
              öğrencilerimiz hem de mezunlarımız; toplumsal dayanışmayı
              güçlendiren, farkındalık oluşturan ve sürdürülebilir fayda
              sağlayan projelere imza atıyor.
            </p>

            {/* Key Principles */}
            <div
              ref={projectsRef}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="bi bi-heart text-3xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Toplumsal Dayanışma
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Toplumun farklı kesimlerini bir araya getiren, dayanışmayı
                  güçlendiren projeler geliştiriyoruz.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="bi bi-lightbulb text-3xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Farkındalık Yaratma
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Toplumsal sorunlara dikkat çeken, bilinç oluşturan kampanyalar
                  ve etkinlikler düzenliyoruz.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="bi bi-arrow-repeat text-3xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Sürdürülebilir Fayda
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Uzun vadeli etkiler yaratan, sürdürülebilir çözümler üreten
                  projeler hayata geçiriyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-red-600 text-white">
        <div className="container mx-auto px-4 2xl:px-[120px] text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sen de Sosyal Etkimize Katıl
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Birlikte daha güçlüyüz. Sosyal sorumluluk projelerimize katılarak
            topluma değer katmaya sen de başla.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors">
              Projelere Katıl
            </button>
            <button className="bg-transparent text-white px-8 py-4 rounded-full border border-white font-semibold hover:bg-white/10 transition-colors">
              Daha Fazla Bilgi
            </button>
          </div>
        </div>
      </section>

      {/* Project Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sosyal Etki Projelerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gerçekleştirdiğimiz sosyal sorumluluk projelerinden kareler
            </p>
          </div>

          {/* Gallery Container */}
          <div className="w-full">
            <SocialImpactGallery
              items={galleryItems}
              ease="power3.out"
              duration={0.6}
              stagger={0.05}
              animateFrom="bottom"
              scaleOnHover={true}
              hoverScale={0.95}
              blurToFocus={true}
              colorShiftOnHover={false}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default SocialImpactPage;
