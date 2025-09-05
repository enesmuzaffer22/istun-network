import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import EventFormModal from "../components/EventFormModal";

function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Etkinlikleri getir
  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await API.get(`/events?page=${page}`);
      const {
        data,
        page: responsePage,
        limit,
        hasMore: responseHasMore,
      } = response.data;

      setEvents(data);
      setCurrentPage(responsePage);
      setHasMore(responseHasMore);

      // Toplam sayfa sayısını doğru hesapla
      // Eğer hasMore true ise, bir sonraki sayfa var demektir
      // Eğer hasMore false ise, bu son sayfa demektir
      setTotalPages(responseHasMore ? responsePage + 1 : responsePage);

      setError("");
    } catch (err) {
      setError("Etkinlikler yüklenirken hata oluştu.");
      console.error("Events fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde etkinlikleri getir
  useEffect(() => {
    fetchEvents();
  }, []);

  // Sayfa değiştirme fonksiyonları
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchEvents(page);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      handlePageChange(currentPage + 1);
    }
  };

  // Yeni etkinlik oluştur
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  // Etkinliği düzenle
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Etkinliği sil
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Bu etkinliği silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await API.delete(`/events/${eventId}`);
      await fetchEvents(currentPage); // Listeyi yenile
    } catch (err) {
      setError("Etkinlik silinirken hata oluştu.");
      console.error("Event delete error:", err);
    }
  };

  // Modal'dan gelen kaydetme işlemi
  const handleSaveEvent = async (formData, eventId) => {
    try {
      if (eventId) {
        // Düzenleme - PUT request
        const eventData = {
          ...formData,
          created_at: new Date().toISOString(),
        };
        await API.put(`/events/${eventId}`, eventData);
      } else {
        // Yeni oluşturma - POST request (FormData)
        // FormData oluşturulması EventFormModal içinde yapılacak
        await API.post("/events", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setIsModalOpen(false);
      await fetchEvents(currentPage); // Listeyi yenile
    } catch (err) {
      setError("Etkinlik kaydedilirken hata oluştu.");
      console.error("Event save error:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const time = timeString ? ` ${timeString}` : "";
    return (
      date.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) + time
    );
  };

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return "";
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Etkinliklerimiz</h1>
        <button
          onClick={handleCreateEvent}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <i className="bi bi-plus-lg"></i>
          Yeni Etkinlik Oluştur
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başlık
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih & Saat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Konum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kayıt Gerekli
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oluşturma Tarihi
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  Henüz etkinlik bulunmuyor.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-16 w-20">
                      {event.image_url ? (
                        <img
                          className="h-16 w-20 rounded-lg object-cover"
                          src={event.image_url}
                          alt={event.title}
                        />
                      ) : (
                        <div className="h-16 w-20 rounded-lg bg-gray-200 flex items-center justify-center">
                          <i className="bi bi-image text-gray-400"></i>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs">
                      {event.title}
                    </div>
                    <div className="text-xs text-gray-500 max-w-xs">
                      {truncateContent(event.description)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {event.category || "Kategori Yok"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateTime(event.event_date, event.time)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.location || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        event.registration_required
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {event.registration_required ? "Evet" : "Hayır"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(event.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Düzenle"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Sil"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sayfalama Kontrolleri */}
      {events.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sonraki
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Sayfa <span className="font-medium">{currentPage}</span> /{" "}
                <span className="font-medium">{totalPages}</span> -
                <span className="font-medium"> {events.length} etkinlik</span>
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Önceki</span>
                  <i className="bi bi-chevron-left"></i>
                </button>

                {/* Sayfa numaraları */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  // Sayfa numarası totalPages'den büyük olamaz
                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === currentPage
                          ? "z-10 bg-red-600 border-red-600 text-white"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={handleNextPage}
                  disabled={!hasMore}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Sonraki</span>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        eventItem={selectedEvent}
      />
    </div>
  );
}

export default EventsListPage;
