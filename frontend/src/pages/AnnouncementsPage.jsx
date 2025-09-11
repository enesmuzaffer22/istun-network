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
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col h-full"
      onClick={onClick}
    >
      <div className="p-6 flex-1">
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

      {/* Hover efekti için alt çizgi - her zaman kartın en altında */}
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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

    const fetchAnnouncements = async (targetPage) => {
      try {
        setLoading(true);
        const response = await API.get("/announcements", {
          params: { page: targetPage },
        });
        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        const nextHasMore =
          typeof response.data?.hasMore === "boolean"
            ? response.data.hasMore
            : list.length === 9;

        if (!isCancelled) {
          setAnnouncements(list);
          setHasMore(nextHasMore);
          setPage(targetPage);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Duyurular yüklenirken hata oluştu:", error);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchAnnouncements(1);

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

  const goToPrev = async () => {
    if (page > 1 && !loading) {
      try {
        setLoading(true);
        const target = page - 1;
        const response = await API.get("/announcements", {
          params: { page: target },
        });
        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        const nextHasMore =
          typeof response.data?.hasMore === "boolean"
            ? response.data.hasMore
            : list.length === 9;
        setAnnouncements(list);
        setHasMore(nextHasMore);
        setPage(target);
      } catch (error) {
        console.error("Duyurular yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const goToNext = async () => {
    if (hasMore && !loading) {
      try {
        setLoading(true);
        const target = page + 1;
        const response = await API.get("/announcements", {
          params: { page: target },
        });
        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        const nextHasMore =
          typeof response.data?.hasMore === "boolean"
            ? response.data.hasMore
            : list.length === 9;
        setAnnouncements(list);
        setHasMore(nextHasMore);
        setPage(target);
      } catch (error) {
        console.error("Duyurular yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    }
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={goToPrev}
          disabled={page === 1 || loading}
          className={`mt-2 px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
            page === 1 || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-red-700"
          }`}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="flex items-center gap-2 mt-2">
          {Array.from({ length: page }, (_, i) => i + 1)
            .concat(hasMore ? [page + 1] : [])
            .map((p) => (
              <button
                key={p}
                onClick={async () => {
                  if (p !== page && !loading) {
                    try {
                      setLoading(true);
                      const response = await API.get("/announcements", {
                        params: { page: p },
                      });
                      const list = Array.isArray(response.data)
                        ? response.data
                        : Array.isArray(response.data?.data)
                        ? response.data.data
                        : [];
                      const nextHasMore =
                        typeof response.data?.hasMore === "boolean"
                          ? response.data.hasMore
                          : list.length === 9;
                      setAnnouncements(list);
                      setHasMore(nextHasMore);
                      setPage(p);
                    } catch (error) {
                      console.error(
                        "Duyurular yüklenirken hata oluştu:",
                        error
                      );
                    } finally {
                      setLoading(false);
                    }
                  }
                }}
                className={`min-w-9 h-9 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  p === page
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
        </div>
        <button
          onClick={goToNext}
          disabled={!hasMore || loading}
          className={`mt-2 px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
            !hasMore || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-red-700"
          }`}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

export default AnnouncementsPage;
