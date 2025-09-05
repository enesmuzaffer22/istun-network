import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import AchievementFormModal from "../components/AchievementFormModal";

function AchievementsListPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Başarıları getir
  const fetchAchievements = async (page = 1) => {
    try {
      setLoading(true);
      const response = await API.get(`/achievements?page=${page}`);
      const {
        data,
        page: responsePage,
        limit,
        hasMore: responseHasMore,
      } = response.data;

      setAchievements(data);
      setCurrentPage(responsePage);
      setHasMore(responseHasMore);
      setTotalPages(Math.ceil(data.length / limit) + (responseHasMore ? 1 : 0));
      setError("");
    } catch (err) {
      setError("Başarılar yüklenirken hata oluştu.");
      console.error("Achievements fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde başarıları getir
  useEffect(() => {
    fetchAchievements();
  }, []);

  // Sayfa değiştirme fonksiyonları
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchAchievements(page);
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

  // Yeni başarı oluştur
  const handleCreateAchievement = () => {
    setSelectedAchievement(null);
    setIsModalOpen(true);
  };

  // Başarıyı düzenle
  const handleEditAchievement = (achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  // Başarıyı sil
  const handleDeleteAchievement = async (achievementId) => {
    if (!window.confirm("Bu başarıyı silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await API.delete(`/achievements/${achievementId}`);
      await fetchAchievements(currentPage); // Listeyi yenile
    } catch (err) {
      setError("Başarı silinirken hata oluştu.");
      console.error("Achievement delete error:", err);
    }
  };

  // Modal'dan gelen kaydetme işlemi
  const handleSaveAchievement = async (formData, achievementId) => {
    try {
      if (achievementId) {
        // Düzenleme - PUT request
        await API.put(`/achievements/${achievementId}`, formData);
      } else {
        // Yeni oluşturma - POST request
        await API.post("/achievements", formData);
      }

      setIsModalOpen(false);
      await fetchAchievements(currentPage); // Listeyi yenile
    } catch (err) {
      setError("Başarı kaydedilirken hata oluştu.");
      console.error("Achievement save error:", err);
    }
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
        <h1 className="text-3xl font-bold text-gray-800">Başarılarımız</h1>
        <button
          onClick={handleCreateAchievement}
          className="bg-primary hover:bg-primary/70 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <i className="bi bi-plus-lg"></i>
          Yeni Başarı Ekle
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
                Veren Kurum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yıl
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Haber Linki
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {achievements.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Henüz başarı bulunmuyor.
                </td>
              </tr>
            ) : (
              achievements.map((achievement) => (
                <tr key={achievement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs">
                      {achievement.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {achievement.given_from}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {achievement.year}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {achievement.has_link && achievement.news_link ? (
                      <a
                        href={achievement.news_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        <i className="bi bi-link-45deg mr-1"></i>
                        Haber Linki
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">Link Yok</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditAchievement(achievement)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Düzenle"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteAchievement(achievement.id)}
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
      {achievements.length > 0 && (
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
                  {achievements.length} başarı
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

      <AchievementFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAchievement}
        achievement={selectedAchievement}
      />
    </div>
  );
}

export default AchievementsListPage;
