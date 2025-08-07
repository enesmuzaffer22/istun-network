import React, { useEffect, useState } from 'react';
import API from '../utils/axios'; // Axios instance'ınızı import edin
import RoadmapFormModal from '../components/RoadmapFormModal'; // Yeni oluşturduğumuz modal

function RoadmapsListPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState(null);

  // Verileri backend'den çeken fonksiyon
  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await API.get('/roadmaps'); // API endpoint'imiz: /api/roadmaps
      setRoadmaps(response.data);
    } catch (error) {
      console.error("Yol haritaları çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  // Silme işlemini yönetir
  const handleDelete = async (roadmapId, roadmapTitle) => {
    if (window.confirm(`"${roadmapTitle}" başlıklı yol haritasını silmek istediğinizden emin misiniz?`)) {
      try {
        await API.delete(`/roadmaps/${roadmapId}`);
        // Silinen öğeyi state'ten filtreleyerek anında UI güncellemesi
        setRoadmaps(currentRoadmaps => currentRoadmaps.filter(item => item.id !== roadmapId));
        alert("Yol haritası başarıyla silindi.");
      } catch (error) {
        console.error("Yol haritası silinirken hata oluştu:", error);
        alert("Silme işlemi sırasında bir hata oluştu.");
      }
    }
  };

  // Modal'ı açar (düzenleme için veriyle, ekleme için boş)
  const handleOpenModal = (roadmapItem = null) => {
    setEditingRoadmap(roadmapItem);
    setIsModalOpen(true);
  };

  // Modal'ı kapatır
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoadmap(null);
  };

  // Form verisini kaydeder (Ekleme/Güncelleme)
  const handleSaveRoadmap = async (formData, roadmapId) => {
    // Resim yüklemesi olduğu için FormData kullanmalıyız.
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    if (formData.imageFile) {
      data.append('image', formData.imageFile); // 'image' adı backend'deki multer ayarıyla eşleşmeli
    }

    try {
      if (roadmapId) {
        // GÜNCELLEME (PUT)
        await API.put(`/roadmaps/${roadmapId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // EKLEME (POST)
        data.append('created_at', new Date().toISOString()); // Yeni kayıt için tarih ekle
        await API.post('/roadmaps', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      alert(roadmapId ? 'Yol haritası başarıyla güncellendi.' : 'Yol haritası başarıyla eklendi.');
      handleCloseModal();
      fetchRoadmaps(); // Tabloyu yenile
    } catch (error) {
      console.error("Yol haritası kaydedilirken hata:", error);
      alert("Kayıt sırasında bir hata oluştu.");
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Yol Haritası Yönetimi</h1>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
          <i className="bi bi-plus-lg mr-2"></i>Yeni Yol Haritası Ekle
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Resim</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Başlık</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Oluşturma Tarihi</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {roadmaps.map(item => (
              <tr key={item.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <img src={item.image_url || 'https://via.placeholder.com/80'} alt={item.title} className="w-20 h-20 object-cover rounded"/>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{item.title}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{new Date(item.created_at).toLocaleDateString('tr-TR')}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">Düzenle</button>
                  <button onClick={() => handleDelete(item.id, item.title)} className="text-red-600 hover:text-red-900">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RoadmapFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRoadmap}
        roadmapItem={editingRoadmap}
      />
    </div>
  );
}

export default RoadmapsListPage;