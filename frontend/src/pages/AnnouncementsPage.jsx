import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

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

// Duyuru kartı bileşeni
const AnnouncementCard = ({ announcement, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <div className="p-6">
        {announcement.category && (
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
            {announcement.category}
          </span>
        )}

        <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {announcement.title}
        </h3>

        {announcement.created_at && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <i className="bi bi-calendar3"></i>
            <span>{formatDate(announcement.created_at)}</span>
          </div>
        )}
      </div>

      {/* Hover efekti için alt çizgi */}
      <div className="h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};

function AnnouncementsPage() {
  const titleRef = useRef(null);
  const announcementsContainerRef = useRef(null);
  const filtersRef = useRef(null);
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Duyuru kategorileri
  const categories = [
    { key: "all", label: "Tümü" },
    { key: "Eğitim", label: "Eğitim" },
    { key: "Etkinlik", label: "Etkinlik" },
    { key: "Burs", label: "Burs" },
    { key: "Kayıt", label: "Kayıt" },
    { key: "Sınav", label: "Sınav" },
    { key: "Akademik", label: "Akademik" },
    { key: "İdari", label: "İdari" },
    { key: "Sosyal", label: "Sosyal" },
  ];

  useEffect(() => {
    let isCancelled = false;

    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        // Test verilerini kullan
        const response = await fetch("/test/announcements.json");
        const data = await response.json();

        if (!isCancelled) {
          setAnnouncements(data);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Duyurular yüklenirken hata oluştu:", error);
          // Hata durumunda örnek veriler
          setAnnouncements([
            {
              id: 1,
              title: "Yeni Dönem Kayıtları Başladı",
              content:
                "2024 Bahar dönemi kayıtları için son tarih 15 Şubat 2024. Geç kalınmaması önemle duyurulur. Kayıt işlemleri için öğrenci işleri birimine başvurabilirsiniz.",
              created_at: new Date().toISOString(),
              category: "Kayıt",
            },
            {
              id: 2,
              title: "Kariyer Günleri Etkinliği",
              content:
                "20-22 Mart tarihleri arasında düzenlenecek Kariyer Günleri etkinliğine tüm öğrencilerimiz davetlidir. Sektörün önde gelen firmaları katılacak.",
              created_at: new Date(Date.now() - 86400000).toISOString(),
              category: "Etkinlik",
            },
            {
              id: 3,
              title: "Burs Başvuruları",
              content:
                "2024 yılı burs başvuruları için gerekli belgeler ve son başvuru tarihi hakkında bilgiler. Başvuru formu üniversite web sitesinde mevcuttur.",
              created_at: new Date(Date.now() - 172800000).toISOString(),
              category: "Burs",
            },
            {
              id: 4,
              title: "Final Sınavları Programı",
              content:
                "2024 Güz dönemi final sınavları programı açıklanmıştır. Sınav tarihleri ve salon bilgileri için ders programınızı kontrol ediniz.",
              created_at: new Date(Date.now() - 259200000).toISOString(),
              category: "Sınav",
            },
            {
              id: 5,
              title: "Kütüphane Çalışma Saatleri",
              content:
                "Sınav dönemine özel kütüphane 24 saat açık olacaktır. Gece vardiyası için öğrenci kartınızı yanınızda bulundurunuz.",
              created_at: new Date(Date.now() - 345600000).toISOString(),
              category: "İdari",
            },
            {
              id: 6,
              title: "Proje Yarışması Duyurusu",
              content:
                "Bilgisayar Mühendisliği bölümü tarafından düzenlenen proje yarışmasına katılım açıktır. Son başvuru tarihi 30 Nisan 2024.",
              created_at: new Date(Date.now() - 432000000).toISOString(),
              category: "Akademik",
            },
          ]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchAnnouncements();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Filtrelenmiş duyurular
  const filteredAnnouncements =
    selectedCategory === "all"
      ? announcements
      : announcements.filter(
          (announcement) => announcement.category === selectedCategory
        );

  // Kategori değiştirme fonksiyonu
  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey);
  };

  useEffect(() => {
    if (!loading && announcements.length > 0) {
      const tl = gsap.timeline();
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Filtre animasyonu
      if (filtersRef.current) {
        gsap.fromTo(
          filtersRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.1,
          }
        );
      }
    }
  }, [loading, announcements]);

  // Filtrelenmiş duyuruların animasyonu
  useEffect(() => {
    if (
      !loading &&
      announcementsContainerRef.current &&
      filteredAnnouncements.length > 0
    ) {
      gsap.fromTo(
        announcementsContainerRef.current.children,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [filteredAnnouncements, loading]);

  if (loading) {
    return (
      <div className="flex flex-col gap-12 2xl:px-[120px] px-4 py-12 md:py-[90px]">
        <div className="h-12 w-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="flex flex-wrap gap-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-10 w-20 bg-gray-200 animate-pulse rounded-full"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse rounded-lg h-48"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      <h1
        ref={titleRef}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary opacity-0"
      >
        Duyurular
      </h1>

      {/* Kategori Filtreleri */}
      <div className="flex flex-col gap-6">
        <div ref={filtersRef} className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleCategoryChange(category.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 opacity-0 ${
                selectedCategory === category.key
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Sonuç sayısı */}
        <div className="text-gray-600 text-sm">
          {selectedCategory === "all"
            ? `Toplam ${filteredAnnouncements.length} duyuru`
            : `${
                categories.find((c) => c.key === selectedCategory)?.label
              } kategorisinde ${filteredAnnouncements.length} duyuru`}
        </div>
      </div>

      {/* Duyurular Listesi */}
      <div
        ref={announcementsContainerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="opacity-0">
              <AnnouncementCard
                announcement={announcement}
                onClick={() => navigate(`/duyurular/${announcement.id}`)}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <i className="bi bi-megaphone text-4xl mb-4 block"></i>
            <p className="text-lg">Bu kategoride henüz duyuru bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnnouncementsPage;
