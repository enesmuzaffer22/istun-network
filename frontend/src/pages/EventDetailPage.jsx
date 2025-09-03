import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
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

// Saat formatlama fonksiyonu
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Istanbul",
  };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  };

  const formattedDate = date.toLocaleDateString("tr-TR", dateOptions);
  const formattedTime = date.toLocaleTimeString("tr-TR", timeOptions);

  return `${formattedDate} - ${formattedTime}`;
};

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for animations
  const headerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const backButtonRef = useRef(null);
  const actionButtonRef = useRef(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/events/${id}`);
        const detail = response?.data?.data ?? response?.data;
        if (detail?.id) {
          setEvent(detail);
        } else {
          setError("Etkinlik bulunamadı.");
        }
      } catch (error) {
        console.error("Etkinlik detayı çekilirken hata:", error);
        if (error.response?.status === 404) {
          setError("Etkinlik bulunamadı.");
        } else {
          setError("Etkinlik yüklenirken bir hata oluştu.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  // GSAP animasyonları
  useEffect(() => {
    if (!loading && event) {
      const tl = gsap.timeline();

      // Geri butonu animasyonu
      tl.fromTo(
        backButtonRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
      )
        // Resim animasyonu
        .fromTo(
          imageRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
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
          "-=0.6"
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
        )
        // Aksiyon butonu animasyonu
        .fromTo(
          actionButtonRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        );
    }
  }, [loading, event]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 2xl:px-[120px] px-4 py-12 md:py-[90px]">
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-[4/5] bg-gray-200 animate-pulse rounded-2xl"></div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-12 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              <div className="flex gap-4">
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className={`h-4 bg-gray-200 animate-pulse rounded ${
                    index % 3 === 0
                      ? "w-full"
                      : index % 3 === 1
                      ? "w-5/6"
                      : "w-4/5"
                  }`}
                ></div>
              ))}
            </div>
            <div className="h-12 w-40 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
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
          Aradığınız etkinlik mevcut değil veya kaldırılmış olabilir.
        </p>
        <button
          onClick={() => navigate("/etkinlikler")}
          className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          Etkinlikler Sayfasına Dön
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 2xl:px-[120px] px-4 py-12 md:py-[90px] text-center">
        <i className="bi bi-calendar-event text-6xl text-gray-400"></i>
        <h1 className="text-2xl font-bold text-gray-600">
          Etkinlik Bulunamadı
        </h1>
        <p className="text-gray-500">Aradığınız etkinlik mevcut değil.</p>
        <button
          onClick={() => navigate("/etkinlikler")}
          className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          Etkinlikler Sayfasına Dön
        </button>
      </div>
    );
  }

  // Kayıt durumu kontrolü
  const now = new Date();
  const registrationDeadline = event.registration_deadline
    ? new Date(event.registration_deadline)
    : null;
  const eventDate = new Date(event.event_date);

  const isRegistrationClosed =
    registrationDeadline && now > registrationDeadline;
  const isEventPassed = now > eventDate;
  const hasRegistrationLink =
    event.has_registration_link && event.registration_link;

  const getButtonState = () => {
    if (isEventPassed) {
      return {
        disabled: true,
        text: "Etkinlik Tamamlandı",
        tooltip: "Bu etkinlik sona ermiştir.",
        className: "bg-gray-400 cursor-not-allowed",
        showButton: false,
      };
    }

    if (isRegistrationClosed) {
      return {
        disabled: true,
        text: "Kayıt Süresi Doldu",
        tooltip: `Kayıt son tarihi: ${formatDate(event.registration_deadline)}`,
        className: "bg-red-400 cursor-not-allowed",
        showButton: false,
      };
    }

    if (!hasRegistrationLink) {
      return {
        disabled: true,
        text: "Kayıt Linki Yok",
        tooltip: "Bu etkinlik için kayıt linki bulunmuyor.",
        className: "bg-gray-400 cursor-not-allowed",
        showButton: false,
      };
    }

    return {
      disabled: false,
      text: "Etkinliğe Katıl",
      tooltip: "Etkinliğe katılmak için tıklayın.",
      className: "bg-primary hover:bg-red-700",
      showButton: true,
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="flex flex-col gap-8 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      {/* Geri Butonu */}
      <button
        ref={backButtonRef}
        onClick={() => navigate("/etkinlikler")}
        className="flex items-center gap-2 text-primary hover:text-red-700 font-medium transition-colors duration-200 w-fit opacity-0"
      >
        <i className="bi bi-arrow-left"></i>
        <span>Etkinliklere Geri Dön</span>
      </button>

      {/* Ana İçerik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Etkinlik Resmi */}
        <div ref={imageRef} className="opacity-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-200 shadow-lg">
            <img
              src={
                event.image_url ||
                `https://picsum.photos/400/500?random=${event.id}`
              }
              alt={event.title}
              className="w-full h-full object-cover"
            />

            {/* Kategori badge */}
            {event.category && (
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  {event.category}
                </span>
              </div>
            )}

            {/* Kayıt durumu badge */}
            <div className="absolute top-4 right-4">
              {isRegistrationClosed || isEventPassed ? (
                <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                  <i className="bi bi-x-circle"></i>
                  <span>{isEventPassed ? "Tamamlandı" : "Kayıt Kapandı"}</span>
                </div>
              ) : (
                <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                  <i className="bi bi-check-circle"></i>
                  <span>Kayıt Açık</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Etkinlik Detayları */}
        <div className="space-y-6">
          {/* Header */}
          <div ref={headerRef} className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary leading-tight opacity-0">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 opacity-0">
              {event.event_date && (
                <div className="flex items-center gap-2">
                  <i className="bi bi-calendar3 text-primary"></i>
                  <span className="font-medium">
                    {formatDate(event.event_date)}
                  </span>
                </div>
              )}
              {event.time && (
                <div className="flex items-center gap-2">
                  <i className="bi bi-clock text-primary"></i>
                  <span className="font-medium">{event.time}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <i className="bi bi-geo-alt text-primary"></i>
                  <span className="font-medium">{event.location}</span>
                </div>
              )}
            </div>

            {/* Kayıt son tarihi */}
            {event.registration_deadline && !isEventPassed && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg opacity-0">
                <div className="flex items-center gap-2 text-blue-800">
                  <i className="bi bi-info-circle"></i>
                  <span className="text-sm font-medium">
                    Kayıt Son Tarihi:{" "}
                    {formatDateTime(event.registration_deadline)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* İçerik */}
          <div ref={contentRef} className="opacity-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Etkinlik Hakkında
            </h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {event.content || event.description}
              </p>
            </div>

            {/* Ek bilgiler */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {event.organizer && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Düzenleyen</div>
                  <div className="font-medium text-gray-800">
                    {event.organizer}
                  </div>
                </div>
              )}
              {event.duration && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Süre</div>
                  <div className="font-medium text-gray-800">
                    {event.duration}
                  </div>
                </div>
              )}
              {event.prize_pool && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Ödül Havuzu</div>
                  <div className="font-medium text-gray-800">
                    {event.prize_pool}
                  </div>
                </div>
              )}
              {event.tags && event.tags.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">Etiketler</div>
                  <div className="flex flex-wrap gap-1">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Aksiyon Butonu */}
          <div ref={actionButtonRef} className="opacity-0">
            {buttonState.showButton && (
              <div className="relative group">
                <button
                  disabled={buttonState.disabled}
                  className={`w-full ${
                    buttonState.className
                  } text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    !buttonState.disabled ? "transform hover:scale-105" : ""
                  }`}
                  onClick={() => {
                    if (!buttonState.disabled && event.registration_link) {
                      let url = event.registration_link;
                      const hasHttp =
                        url.startsWith("http://") || url.startsWith("https://");
                      const hasProtocolRelative = url.startsWith("//");
                      if (!hasHttp && !hasProtocolRelative) {
                        url = "//" + url;
                      }
                      window.open(url, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  <i
                    className={`bi ${
                      buttonState.disabled
                        ? isEventPassed
                          ? "bi-check-circle"
                          : "bi-x-circle"
                        : "bi-calendar-plus"
                    }`}
                  ></i>
                  <span>{buttonState.text}</span>
                </button>

                {/* Tooltip */}
                {buttonState.disabled && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {buttonState.tooltip}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
