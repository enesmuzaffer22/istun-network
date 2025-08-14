import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import NewsFormModal from "../components/NewsFormModal";

function NewsListPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  // Haberleri getir
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await API.get("/news");
      setNews(response.data);
      setError("");
    } catch (err) {
      setError("Haberler yüklenirken hata oluştu.");
      console.error("News fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde haberleri getir
  useEffect(() => {
    fetchNews();
  }, []);

  // Yeni haber oluştur
  const handleCreateNews = () => {
    setSelectedNews(null);
    setIsModalOpen(true);
  };

  // Haberi düzenle
  const handleEditNews = (newsItem) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  // Haberi sil
  const handleDeleteNews = async (newsId) => {
    if (!window.confirm("Bu haberi silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await API.delete(`/news/${newsId}`);
      await fetchNews(); // Listeyi yenile
    } catch (err) {
      setError("Haber silinirken hata oluştu.");
      console.error("News delete error:", err);
    }
  };

  // Modal'dan gelen kaydetme işlemi
  const handleSaveNews = async (formData, newsId) => {
    try {
      if (newsId) {
        // Düzenleme - PUT request
        const newsData = {
          ...formData,
          created_at: new Date().toISOString(),
        };
        await API.put(`/news/${newsId}`, newsData);
      } else {
        // Yeni oluşturma - POST request (FormData)
        // FormData oluşturulması NewsFormModal içinde yapılacak
        await API.post("/news", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setIsModalOpen(false);
      await fetchNews(); // Listeyi yenile
    } catch (err) {
      setError("Haber kaydedilirken hata oluştu.");
      console.error("News save error:", err);
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
        <h1 className="text-3xl font-bold text-gray-800">Haberler</h1>
        <button
          onClick={handleCreateNews}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <i className="bi bi-plus-lg"></i>
          Yeni Haber Oluştur
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
                Thumbnail
              </th>
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
            {news.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Henüz haber bulunmuyor.
                </td>
              </tr>
            ) : (
              news.map((newsItem) => (
                <tr key={newsItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-10 w-10">
                      {newsItem.thumbnail_img_url ? (
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={newsItem.thumbnail_img_url}
                          alt={newsItem.title}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <i className="bi bi-image text-gray-400"></i>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs">
                      {newsItem.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {newsItem.category || "Kategori Yok"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {truncateContent(newsItem.content)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(newsItem.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditNews(newsItem)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Düzenle"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteNews(newsItem.id)}
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

      <NewsFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNews}
        newsItem={selectedNews}
      />
    </div>
  );
}

export default NewsListPage;
