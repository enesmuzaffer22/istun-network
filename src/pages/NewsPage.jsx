import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NewsCard from "../components/NewsCard";

// ScrollTrigger plugin'ini kaydet
gsap.registerPlugin(ScrollTrigger);

function NewsPage() {
  const titleRef = useRef(null);
  const newsContainerRef = useRef(null);

  // Simulated API data - placeholder news items
  const newsData = [
    {
      id: 1,
      news_title: "İstanbul Teknik Üniversitesi Yeni Araştırma Merkezi Açıyor",
      news_description:
        "Üniversitemiz bünyesinde yapay zeka ve makine öğrenmesi alanında yeni bir araştırma merkezi kurulacak. Merkez, öğrencilere ve akademisyenlere modern laboratuvar imkanları sunacak.",
    },
    {
      id: 2,
      news_title:
        "Mezun Öğrencilerimiz Teknoloji Şirketlerinde Başarıya İmza Atıyor",
      news_description:
        "2024 yılında mezun olan öğrencilerimizin %85'i ilk 6 ay içerisinde iş buldu. Özellikle yazılım geliştirme ve veri analizi alanlarında yüksek talep görülüyor.",
    },
    {
      id: 3,
      news_title: "Uluslararası Öğrenci Değişim Programı Başvuruları Açıldı",
      news_description:
        "Erasmus+ ve Mevlana değişim programları kapsamında 2024-2025 akademik yılı için başvurular başladı. Avrupa ve Amerika'daki partner üniversitelerde eğitim fırsatı.",
    },
    {
      id: 4,
      news_title: "Kampüste Yeni Sosyal Tesis ve Kafe Alanları",
      news_description:
        "Öğrenci yaşamını desteklemek amacıyla kampüs içerisinde yeni sosyal alanlar ve modern kafe tesisleri hizmete açıldı. 24 saat açık çalışma alanları da mevcut.",
    },
    {
      id: 5,
      news_title: "Bilgisayar Mühendisliği Bölümü Akreditasyon Aldı",
      news_description:
        "Bölümümüz MÜDEK (Mühendislik Eğitim Programları Değerlendirme ve Akreditasyon Derneği) tarafından 6 yıl süreyle akredite edildi.",
    },
    {
      id: 6,
      news_title: "Startup Yarışması 2024 Sonuçları Açıklandı",
      news_description:
        "Yıllık girişimcilik yarışmasında öğrencilerimizin geliştirdiği projeler değerlendirildi. Kazanan takımlar 50.000 TL ödül ve mentorluk desteği kazandı.",
    },
    {
      id: 7,
      news_title: "Yaz Stajı Programı İçin Şirket Ortaklıkları Genişliyor",
      news_description:
        "2024 yaz dönemi için 150'den fazla şirket ile staj anlaşması imzalandı. Öğrenciler gerçek projelerde deneyim kazanma fırsatı bulacak.",
    },
    {
      id: 8,
      news_title: "Akademik Kadro Güçlendiriliyor: Yeni Öğretim Üyeleri",
      news_description:
        "Bölümümüze yapay zeka, siber güvenlik ve veri bilimi alanlarında uzman 8 yeni öğretim üyesi katıldı. Ders çeşitliliği ve kalitesi artırılıyor.",
    },
    {
      id: 9,
      news_title: "Mezun Ağı Etkinliği: Sektör Deneyimleri Paylaşımı",
      news_description:
        "Mezun öğrencilerimiz sektördeki deneyimlerini paylaşmak için kampüse geliyor. Networking ve kariyer gelişimi fırsatları sunulacak.",
    },
    {
      id: 10,
      news_title: "Yeni Laboratuvar Ekipmanları ve Teknoloji Yatırımı",
      news_description:
        "Öğrencilerimizin pratik becerilerini geliştirmek için son teknoloji donanımlar ve yazılım lisansları temin edildi. Bulut bilişim ve IoT laboratuvarları kuruldu.",
    },
  ];

  useEffect(() => {
    // Sayfa yüklendiğinde animasyonları başlat
    const tl = gsap.timeline();

    // Başlık animasyonu - kariyer sayfası tarzında
    tl.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }
    );

    // Haber kartları için staggered animasyon - kariyer sayfası tarzında
    gsap.fromTo(
      newsContainerRef.current.children,
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: newsContainerRef.current,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="flex flex-col gap-12 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      <h1
        ref={titleRef}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary"
      >
        Haberler
      </h1>
      <div ref={newsContainerRef} className="flex flex-col gap-12">
        {newsData.map((news) => (
          <NewsCard
            key={news.id}
            news_title={news.news_title}
            news_description={news.news_description}
          />
        ))}
      </div>
    </div>
  );
}

export default NewsPage;
