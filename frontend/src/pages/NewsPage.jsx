// frontend/src/pages/NewsPage.jsx

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import NewsCard from "../components/NewsCard";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

function NewsPage() {
  const titleRef = useRef(null);
  const newsContainerRef = useRef(null);
  const filtersRef = useRef(null);
  const navigate = useNavigate();

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Kategori listesi
  const categories = [
    { key: "all", label: "Tümü" },
    { key: "Duyurular", label: "Duyurular" },
    { key: "Etkinlikler", label: "Etkinlikler" },
    { key: "Projeler ve Girişimler", label: "Projeler ve Girişimler" },
    { key: "Kariyer Başarıları", label: "Kariyer Başarıları" },
    { key: "Akademik Başarılar", label: "Akademik Başarılar" },
    { key: "Üniversite", label: "Üniversite" },
    { key: "Sektör Haberleri", label: "Sektör Haberleri" },
    { key: "İş Birlikleri", label: "İş Birlikleri" },
  ];

  useEffect(() => {
    let isCancelled = false;

    const fetchInitial = async () => {
      try {
        setLoading(true);
        const response = await API.get("/news", {
          params: { page: 1 },
        });
        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        const nextHasMore =
          typeof response.data?.hasMore === "boolean"
            ? response.data.hasMore
            : list.length === 12;

        if (!isCancelled) {
          setNewsData(list);
          setHasMore(nextHasMore);
          setPage(1);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Haberler yüklenirken hata oluştu:", error);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchInitial();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Filtrelenmiş haberler
  const filteredNews =
    selectedCategory === "all"
      ? newsData
      : newsData.filter((news) => news.category === selectedCategory);

  // Kategori değiştirme fonksiyonu
  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey);
  };

  const fetchPage = useCallback(async (targetPage) => {
    try {
      setLoading(true);
      const response = await API.get("/news", {
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
          : list.length === 12;
      setNewsData(list);
      setHasMore(nextHasMore);
      setPage(targetPage);
    } catch (error) {
      console.error("Sayfa yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const goToPrev = () => {
    if (page > 1) {
      fetchPage(page - 1);
    }
  };

  const goToNext = () => {
    if (hasMore) {
      fetchPage(page + 1);
    }
  };

  const getVisiblePages = () => {
    const pages = Array.from({ length: page }, (_, i) => i + 1);
    if (hasMore) pages.push(page + 1);
    return pages;
  };

  useEffect(() => {
    if (!loading && newsData.length > 0) {
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
  }, [loading, newsData]);

  // Filtrelenmiş haberlerin animasyonu
  useEffect(() => {
    if (!loading && newsContainerRef.current && filteredNews.length > 0) {
      gsap.fromTo(
        newsContainerRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [filteredNews, loading]);

  if (loading)
    return <div className="text-center p-20">Haberler Yükleniyor...</div>;

  return (
    <div className="flex flex-col gap-12 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      <h1
        ref={titleRef}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary opacity-0"
      >
        Haberler
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
            ? `Toplam ${filteredNews.length} haber`
            : `${
                categories.find((c) => c.key === selectedCategory)?.label
              } kategorisinde ${filteredNews.length} haber`}
        </div>
      </div>

      {/* Haberler Listesi */}
      <div ref={newsContainerRef} className="flex flex-col gap-12">
        {filteredNews.length > 0 ? (
          filteredNews.map((newsItem) => (
            <div
              key={newsItem.id}
              onClick={() => navigate(`/haberler/${newsItem.id}`)}
              className="opacity-0"
            >
              <NewsCard
                title={newsItem.title}
                content={newsItem.content}
                imageUrl={newsItem.thumbnail_img_url}
                createdAt={newsItem.created_at}
                category={newsItem.category}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <i className="bi bi-newspaper text-4xl mb-4 block"></i>
            <p className="text-lg">Bu kategoride henüz haber bulunmuyor.</p>
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
          {getVisiblePages().map((p) => (
            <button
              key={p}
              onClick={() => (p !== page ? fetchPage(p) : null)}
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

export default NewsPage;
