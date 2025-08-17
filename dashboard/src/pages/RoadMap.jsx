import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import RoadmapFormModal from "../components/RoadmapFormModal";

function RoadMap() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  // Yol haritalarını getir
  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await API.get("/roadmaps");
      setRoadmaps(response.data);
      setError("");
    } catch (err) {
      setError("Yol haritaları yüklenirken hata oluştu.");
      console.error("Roadmaps fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde yol haritalarını getir
  useEffect(() => {
    fetchRoadmaps();
  }, []);

  // Yeni yol haritası oluştur
  const handleCreateRoadmap = () => {
    setSelectedRoadmap(null);
    setIsModalOpen(true);
  };

  // Yol haritasını düzenle
  const handleEditRoadmap = (roadmap) => {
    setSelectedRoadmap(roadmap);
    setIsModalOpen(true);
  };

  // Yol haritasını sil
  const handleDeleteRoadmap = async (roadmapId) => {
    if (
      !window.confirm("Bu yol haritasını silmek istediğinize emin misiniz?")
    ) {
      return;
    }

    try {
      await API.delete(`/roadmaps/${roadmapId}`);
      await fetchRoadmaps(); // Listeyi yenile
    } catch (err) {
      setError("Yol haritası silinirken hata oluştu.");
      console.error("Roadmap delete error:", err);
    }
  };

  // Modal'dan gelen kaydetme işlemi
  const handleSaveRoadmap = async (formData, roadmapId) => {
    try {
      if (roadmapId) {
        // Düzenleme - PUT request
        const roadmapData = {
          ...formData,
          created_at: new Date().toISOString(),
        };
        await API.put(`/roadmaps/${roadmapId}`, roadmapData);
      } else {
        // Yeni oluşturma - POST request (FormData)
        // FormData oluşturulması RoadmapFormModal içinde yapılacak
        await API.post("/roadmaps", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setIsModalOpen(false);
      await fetchRoadmaps(); // Listeyi yenile
    } catch (err) {
      setError("Yol haritası kaydedilirken hata oluştu.");
      console.error("Roadmap save error:", err);
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
        <h1 className="text-3xl font-bold text-gray-800">Yol Haritaları</h1>
        <button
          onClick={handleCreateRoadmap}
          className="bg-primary hover:bg-primary/70 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <i className="bi bi-plus-lg"></i>
          Yeni Yol Haritası Oluştur
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
            {roadmaps.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Henüz yol haritası bulunmuyor.
                </td>
              </tr>
            ) : (
              roadmaps.map((roadmap) => (
                <tr key={roadmap.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-16 w-28">
                      {roadmap.image_url ? (
                        <img
                          className="h-16 w-28 rounded-lg object-cover"
                          src={roadmap.image_url}
                          alt={roadmap.title}
                        />
                      ) : (
                        <div className="h-16 w-28 rounded-lg bg-gray-200 flex items-center justify-center">
                          <i className="bi bi-image text-gray-400"></i>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs">
                      {roadmap.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {truncateContent(roadmap.content)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(roadmap.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditRoadmap(roadmap)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Düzenle"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteRoadmap(roadmap.id)}
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

      <RoadmapFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRoadmap}
        roadmapItem={selectedRoadmap}
      />
    </div>
  );
}

export default RoadMap;
