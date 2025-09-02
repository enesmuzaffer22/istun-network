import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

gsap.registerPlugin(ScrollTrigger);

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
            "https://picsum.photos/400/500"
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

        {/* Tarih badge */}
        {event.event_date && (
          <div className="absolute top-4 right-4">
            <div className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
              <i className="bi bi-calendar3 text-xs"></i>
              <span>{formatDate(event.event_date)}</span>
            </div>
          </div>
        )}

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
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
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

function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsContainerRef = useRef(null);

  // API'den etkinlik verilerini çekme
  useEffect(() => {
    let isCancelled = false;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await API.get("/events", { params: { page: 1 } });
        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        if (!isCancelled) {
          setEvents(list.slice(0, 3));
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Etkinlikler çekilemedi:", error);
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

  // GSAP animasyonları
  useEffect(() => {
    if (!loading && events.length > 0) {
      const ctx = gsap.context(() => {
        // Başlık animasyonu
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Kartlar animasyonu
        gsap.fromTo(
          cardsContainerRef.current.children,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [loading, events]);

  if (loading) {
    return (
      <div className="w-full py-12 xl:py-[90px] px-4 2xl:px-[120px]">
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-96 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
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

  if (events.length === 0) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      className="w-full py-12 xl:py-[90px] px-4 2xl:px-[120px]"
    >
      <div
        ref={headerRef}
        className="flex flex-col items-center gap-4 mb-12 opacity-0"
      >
        <h2 className="text-3xl xl:text-4xl font-bold text-primary">
          Etkinlikler
        </h2>
        <p className="text-base text-center text-gray-500 max-w-3xl">
          İSTÜNetwork topluluğu olarak düzenlediğimiz etkinlikler, seminerler ve
          buluşmalara katılarak network'ünüzü genişletin.
        </p>
      </div>

      <div
        ref={cardsContainerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {events.map((event) => (
          <div key={event.id} className="opacity-0">
            <EventCard
              event={event}
              onClick={() => navigate(`/etkinlikler/${event.id}`)}
            />
          </div>
        ))}
      </div>

      {/* Daha fazla etkinlik görmek için buton */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate("/etkinlikler")}
          className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <span>Tüm Etkinlikleri Görüntüle</span>
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default EventsSection;
