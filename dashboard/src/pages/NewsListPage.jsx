// dashboard/src/pages/NewsListPage.jsx

import React, { useEffect, useState } from 'react';
import API from '../utils/axios';
import NewsFormModal from '../components/NewsFormModal'; // Haberler için form modalını import ediyoruz

function NewsListPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- YENİ EKLENEN STATE'LER ---
  // Modal'ın açık/kapalı durumunu yönetir
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Düzenleme modunda hangi haberin seçildiğini tutar
  const [editingNews, setEditingNews] = useState(null);
  // --- BİTİŞ ---

  // Bu fonksiyon verileri çekmek için, aynı kalıyor.
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await API.get('/news');
      setNews(response.data);
    } catch (error) {
      console.error("Haberler çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // --- YENİ EKLENEN FONKSİYONLAR ---

  // Silme işlemini yönetir
  const handleDelete = async (newsId, newsTitle) => {
    if (window.confirm(`"${newsTitle}" başlıklı haberi silmek istediğinizden emin misiniz?`)) {
      try {
        await API.delete(`/news/${newsId}`);
        setNews(currentNews => currentNews.filter(item => item.id !== newsId));
        alert("Haber başarıyla silindi.");
      } catch (error) {
        console.error("Haber silinirken hata oluştu:", error);
        alert("Silme işlemi sırasında bir hata oluştu.");
      }
    }
  };

  // Form modalını açar
  const handleOpenModal = (newsItem = null) => {
    setEditingNews(newsItem);
    setIsModalOpen(true);
  };

  // Form modalını kapatır
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
  };

// Form verisini backend'e gönderir (Ekleme veya Güncelleme)
const handleSaveNews = async (formData, newsId) => {
  try {
    if (newsId) {
      // ID varsa, bu bir GÜNCELLEME işlemidir (PUT).
      // İstek "http://localhost:5000/api/news/:newsId" adresine gider.
      await API.put(`/news/${newsId}`, formData); 
    } else {
      // ID yoksa, bu bir EKLEME işlemidir (POST).
      // Backend'iniz tarih bekliyorsa, burada ekleyebilirsiniz.
      const dataToPost = { ...formData, created_at: new Date().toISOString() };
      // İstek "http://localhost:5000/api/news" adresine gider.
      await API.post('/news', dataToPost);
    }
    alert(newsId ? 'Haber başarıyla güncellendi.' : 'Haber başarıyla eklendi.');
    handleCloseModal(); // Modal'ı kapat
    fetchNews(); // Tabloyu yenile
  } catch (error) {
    console.error("Haber kaydedilirken hata:", error);
    alert("Kayıt sırasında bir hata oluştu.");
  }
};

  // --- BİTİŞ ---

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Haber Yönetimi</h1>
        {/* DEĞİŞİKLİK: Yeni haber eklemek için modalı açan onClick olayı eklendi. */}
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
          <i className="bi bi-plus-lg mr-2"></i>Yeni Haber Ekle
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            {/* Tablo başlıkları aynı kalıyor */}
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Resim</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Başlık</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {news.map(newsItem => (
              <tr key={newsItem.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <img src={newsItem.thumbnail_img_url || 'https://via.placeholder.com/80'} alt={newsItem.title} className="w-20 h-20 object-cover rounded"/>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{newsItem.title}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                    <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                    <span className="relative">{newsItem.category}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  {/* DEĞİŞİKLİK: Düzenleme ve Silme butonlarına onClick olayları eklendi. */}
                  <button onClick={() => handleOpenModal(newsItem)} className="text-indigo-600 hover:text-indigo-900 mr-4">Düzenle</button>
                  <button onClick={() => handleDelete(newsItem.id, newsItem.title)} className="text-red-600 hover:text-red-900">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DEĞİŞİKLİK: Modal component'i sayfanın sonuna eklendi. */}
      <NewsFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNews}
        newsItem={editingNews}
      />
    </div>
  );
}

export default NewsListPage;