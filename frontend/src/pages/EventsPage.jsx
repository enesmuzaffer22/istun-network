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

// Etkinlik kartı bileşeni
const EventCard = ({ event, onClick }) => {
  const isRegistrationClosed =
    event.registration_deadline &&
    new Date() > new Date(event.registration_deadline);

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      {/* Resim - 4:5 aspect ratio */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
        <img
          src={
            event.image_url ||
            event.thumbnail_img_url ||
            `https://picsum.photos/400/500?random=${event.id}`
          }
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Kategori badge */}
        {event.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              {event.category}
            </span>
          </div>
        )}

        {/* Kayıt durumu badge */}
        <div className="absolute top-4 right-4">
          {isRegistrationClosed ? (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
              <i className="bi bi-x-circle text-xs"></i>
              <span>Kayıt Kapandı</span>
            </div>
          ) : (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
              <i className="bi bi-check-circle text-xs"></i>
              <span>Kayıt Açık</span>
            </div>
          )}
        </div>

        {/* Hover overlay content */}
        <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-white">
            <div className="flex items-center gap-2 text-sm mb-2">
              <i className="bi bi-geo-alt"></i>
              <span>{event.location || "İSTÜ Kampüsü"}</span>
            </div>
            <p className="text-sm text-white/90 line-clamp-2 leading-relaxed">
              {event.description || event.content}
            </p>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1 text-sm text-gray-500">
          {event.event_date && (
            <div className="flex items-center gap-1">
              <i className="bi bi-calendar3"></i>
              <span>{formatDate(event.event_date)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <i className="bi bi-clock"></i>
            <span>{event.time || "19:00"}</span>
          </div>
        </div>
      </div>

      {/* Hover efekti için alt çizgi */}
      <div className="h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};

function EventsPage() {
  const titleRef = useRef(null);
  const eventsContainerRef = useRef(null);
  const filtersRef = useRef(null);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Etkinlik kategorileri
  const categories = [
    { key: "all", label: "Tümü" },
    { key: "Kariyer", label: "Kariyer" },
    { key: "Teknoloji", label: "Teknoloji" },
    { key: "Girişimcilik", label: "Girişimcilik" },
    { key: "Network", label: "Network" },
    { key: "Kodlama", label: "Kodlama" },
    { key: "Gelişim", label: "Gelişim" },
    { key: "Fintech", label: "Fintech" },
  ];

  useEffect(() => {
    let isCancelled = false;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Test verilerini kullan
        const response = await fetch("/test/events.json");
        const data = await response.json();

        if (!isCancelled) {
          setEvents(data);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Etkinlikler yüklenirken hata oluştu:", error);
          // Fallback olarak boş array
          setEvents([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Filtrelenmiş etkinlikler
  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter((event) => event.category === selectedCategory);

  // Kategori değiştirme fonksiyonu
  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey);
  };

  useEffect(() => {
    if (!loading && events.length > 0) {
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
  }, [loading, events]);

  // Filtrelenmiş etkinliklerin animasyonu
  useEffect(() => {
    if (!loading && eventsContainerRef.current && filteredEvents.length > 0) {
      gsap.fromTo(
        eventsContainerRef.current.children,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, [filteredEvents, loading]);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse rounded-2xl">
              <div className="aspect-[4/5] bg-gray-300 rounded-t-2xl"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
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
        Etkinlikler
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
            ? `Toplam ${filteredEvents.length} etkinlik`
            : `${
                categories.find((c) => c.key === selectedCategory)?.label
              } kategorisinde ${filteredEvents.length} etkinlik`}
        </div>
      </div>

      {/* Etkinlikler Listesi */}
      <div
        ref={eventsContainerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="opacity-0">
              <EventCard
                event={event}
                onClick={() => navigate(`/etkinlikler/${event.id}`)}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <i className="bi bi-calendar-event text-4xl mb-4 block"></i>
            <p className="text-lg">Bu kategoride henüz etkinlik bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsPage;
