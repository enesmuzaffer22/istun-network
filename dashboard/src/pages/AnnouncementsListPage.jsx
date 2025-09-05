import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import AnnouncementFormModal from "../components/AnnouncementFormModal";

function AnnouncementsListPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Duyuruları getir
  const fetchAnnouncements = async (page = 1) => {
    try {
      setLoading(true);
      const response = await API.get(`/announcements?page=${page}`);
      const {
        data,
        page: responsePage,
        limit,
        hasMore: responseHasMore,
      } = response.data;

      setAnnouncements(data);
      setCurrentPage(responsePage);
      setHasMore(responseHasMore);
      setTotalPages(Math.ceil(data.length / limit) + (responseHasMore ? 1 : 0));
      setError("");
    } catch (err) {
      setError("Duyurular yüklenirken hata oluştu.");
      console.error("Announcements fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde duyuruları getir
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Sayfa değiştirme fonksiyonları
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchAnnouncements(page);
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

  // Yeni duyuru oluştur
  const handleCreateAnnouncement = () => {
    setSelectedAnnouncement(null);
    setIsModalOpen(true);
  };

  // Duyuruyu düzenle
  const handleEditAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  // Duyuruyu sil
  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await API.delete(`/announcements/${announcementId}`);
      await fetchAnnouncements(currentPage); // Listeyi yenile
    } catch (err) {
      setError("Duyuru silinirken hata oluştu.");
      console.error("Announcement delete error:", err);
    }
  };

  // Modal'dan gelen kaydetme işlemi
  const handleSaveAnnouncement = async (formData, announcementId) => {
    try {
      if (announcementId) {
        // Düzenleme - PUT request
        await API.put(`/announcements/${announcementId}`, formData);
      } else {
        // Yeni oluşturma - POST request
        await API.post("/announcements", formData);
      }

      setIsModalOpen(false);
      await fetchAnnouncements(currentPage); // Listeyi yenile
    } catch (err) {
      setError("Duyuru kaydedilirken hata oluştu.");
      console.error("Announcement save error:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <h1 className="text-3xl font-bold text-gray-800">Duyurularımız</h1>
        <button
          onClick={handleCreateAnnouncement}
          className="bg-primary hover:bg-primary/70 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <i className="bi bi-plus-lg"></i>
          Yeni Duyuru Ekle
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
                Başlık
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İçerik Özeti
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
            {announcements.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Henüz duyuru bulunmuyor.
                </td>
              </tr>
            ) : (
              announcements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs">
                      {announcement.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {announcement.category || "Kategori Yok"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {truncateContent(announcement.content)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(announcement.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditAnnouncement(announcement)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Düzenle"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
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
      {announcements.length > 0 && (
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
                Sayfa <span className="font-medium">{currentPage}</span> -
                <span className="font-medium">
                  {" "}
                  {announcements.length} duyuru
                </span>
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

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === currentPage
                          ? "z-10 bg-primary border-primary text-white"
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

      <AnnouncementFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAnnouncement}
        announcement={selectedAnnouncement}
      />
    </div>
  );
}

export default AnnouncementsListPage;
