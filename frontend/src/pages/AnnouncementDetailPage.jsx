import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { gsap } from "gsap";
import API from "../utils/axios";
import {
  markdownComponents,
  MarkdownWrapper,
  remarkPlugins,
} from "../components/MarkdownComponents";

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

function AnnouncementDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for animations
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const backButtonRef = useRef(null);

  useEffect(() => {
    const fetchAnnouncementDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Test verilerinden duyuru detayını al
        const response = await fetch("/test/announcements.json");
        const announcements = await response.json();
        const announcementDetail = announcements.find(
          (a) => a.id === parseInt(id)
        );

        if (announcementDetail) {
          setAnnouncement(announcementDetail);
        } else {
          setError("Duyuru bulunamadı.");
        }
      } catch (error) {
        console.error("Duyuru detayı çekilirken hata:", error);

        // Hata durumunda örnek veri (gerçek uygulamada kaldırılabilir)
        if (error.response?.status === 404) {
          setError("Duyuru bulunamadı.");
        } else {
          // Örnek duyuru verisi
          setAnnouncement({
            id: parseInt(id),
            title: "Yeni Dönem Kayıtları Başladı",
            content: `# Yeni Dönem Kayıtları

2024 Bahar dönemi kayıtları için son tarih **15 Şubat 2024**. Geç kalınmaması önemle duyurulur.

## Kayıt İşlemleri

Kayıt işlemleri için aşağıdaki adımları takip ediniz:

### Gerekli Belgeler

- Kimlik fotokopisi
- Diploma veya geçici mezuniyet belgesi
- Transkript
- 2 adet fotoğraf

### Kayıt Yerleri

1. **Öğrenci İşleri Birimi** - Ana kampüs
2. **Uzaktan Kayıt Sistemi** - Online platform üzerinden
3. **Bölüm Sekreterliği** - İlgili bölüm binası

## Önemli Tarihler

| Tarih | Etkinlik |
|-------|----------|
| 1-15 Şubat 2024 | Kayıt dönemi |
| 20 Şubat 2024 | Ders başlangıcı |
| 25 Şubat 2024 | Ders ekleme/çıkarma son günü |

## İletişim

Sorularınız için:
- **E-posta:** ogrenci@istu.edu.tr
- **Telefon:** (0212) 444 17 17
- **Adres:** İSTÜ Öğrenci İşleri Müdürlüğü

> **Not:** Kayıt işlemlerini zamanında tamamlamayan öğrenciler için ek kayıt dönemi açılmayacaktır.

Başarılar dileriz!`,
            created_at: new Date().toISOString(),
            category: "Kayıt",
            author: "Öğrenci İşleri Müdürlüğü",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncementDetail();
  }, [id]);

  // GSAP animasyonları
  useEffect(() => {
    if (!loading && announcement) {
      const tl = gsap.timeline();

      // Geri butonu animasyonu
      tl.fromTo(
        backButtonRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
      )
        // Header animasyonu
        .fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.4"
        )
        // İçerik animasyonu
        .fromTo(
          contentRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.6"
        );
    }
  }, [loading, announcement]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 2xl:px-[120px] px-4 py-12 md:py-[90px]">
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        <div className="space-y-4">
          <div className="h-12 w-3/4 bg-gray-200 animate-pulse rounded"></div>
          <div className="flex gap-4">
            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className={`h-4 bg-gray-200 animate-pulse rounded ${
                index % 3 === 0 ? "w-full" : index % 3 === 1 ? "w-5/6" : "w-4/5"
              }`}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 2xl:px-[120px] px-4 py-12 md:py-[90px] text-center">
        <i className="bi bi-exclamation-triangle text-6xl text-gray-400"></i>
        <h1 className="text-2xl font-bold text-gray-600">{error}</h1>
        <p className="text-gray-500">
          Aradığınız duyuru mevcut değil veya kaldırılmış olabilir.
        </p>
        <button
          onClick={() => navigate("/duyurular")}
          className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          Duyurular Sayfasına Dön
        </button>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 2xl:px-[120px] px-4 py-12 md:py-[90px] text-center">
        <i className="bi bi-megaphone text-6xl text-gray-400"></i>
        <h1 className="text-2xl font-bold text-gray-600">Duyuru Bulunamadı</h1>
        <p className="text-gray-500">Aradığınız duyuru mevcut değil.</p>
        <button
          onClick={() => navigate("/duyurular")}
          className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          Duyurular Sayfasına Dön
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      {/* Geri Butonu */}
      <button
        ref={backButtonRef}
        onClick={() => navigate("/duyurular")}
        className="flex items-center gap-2 text-primary hover:text-red-700 font-medium transition-colors duration-200 w-fit opacity-0"
      >
        <i className="bi bi-arrow-left"></i>
        <span>Duyurulara Geri Dön</span>
      </button>

      {/* Header */}
      <div ref={headerRef} className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          {announcement.category && (
            <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium opacity-0">
              {announcement.category}
            </span>
          )}
          {announcement.created_at && (
            <div className="flex items-center gap-2 text-gray-500 text-sm opacity-0">
              <i className="bi bi-calendar3"></i>
              <span>{formatDate(announcement.created_at)}</span>
            </div>
          )}
          {announcement.author && (
            <div className="flex items-center gap-2 text-gray-500 text-sm opacity-0">
              <i className="bi bi-person"></i>
              <span>{announcement.author}</span>
            </div>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary leading-tight opacity-0">
          {announcement.title}
        </h1>
      </div>

      {/* İçerik */}
      <div ref={contentRef} className="opacity-0">
        <MarkdownWrapper>
          <ReactMarkdown
            components={markdownComponents}
            remarkPlugins={remarkPlugins}
          >
            {announcement.content}
          </ReactMarkdown>
        </MarkdownWrapper>
      </div>

      {/* Alt Navigasyon */}
      <div className="border-t border-gray-200 pt-8 mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={() => navigate("/duyurular")}
            className="flex items-center gap-2 text-gray-600 hover:text-primary font-medium transition-colors duration-200"
          >
            <i className="bi bi-arrow-left"></i>
            <span>Tüm Duyuruları Görüntüle</span>
          </button>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Bu duyuru yararlı oldu mu?</span>
            <div className="flex gap-2">
              <button className="hover:text-green-600 transition-colors">
                <i className="bi bi-hand-thumbs-up"></i>
              </button>
              <button className="hover:text-red-600 transition-colors">
                <i className="bi bi-hand-thumbs-down"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementDetailPage;
