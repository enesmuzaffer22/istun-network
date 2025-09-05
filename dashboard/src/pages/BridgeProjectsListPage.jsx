import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import BridgeProjectFormModal from "../components/BridgeProjectFormModal";

function BridgeProjectsListPage() {
  const [bridgeProjects, setBridgeProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Köprü Projelerini getir
  const fetchBridgeProjects = async (page = 1) => {
    try {
      setLoading(true);
      const response = await API.get(`/bridgeprojects?page=${page}`);
      const {
        data,
        page: responsePage,
        limit,
        hasMore: responseHasMore,
      } = response.data;

      setBridgeProjects(data);
      setCurrentPage(responsePage);
      setHasMore(responseHasMore);

      // Toplam sayfa sayısını doğru hesapla
      setTotalPages(responseHasMore ? responsePage + 1 : responsePage);

      setError("");
    } catch (err) {
      setError("Köprü projeleri yüklenirken hata oluştu.");
      console.error("Bridge projects fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde köprü projelerini getir
  useEffect(() => {
    fetchBridgeProjects();
  }, []);

  // Sayfa değiştirme fonksiyonları
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchBridgeProjects(page);
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

  // Yeni köprü projesi oluştur
  const handleCreateProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  // Köprü projesini düzenle
  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Köprü projesini sil
  const handleDeleteProject = async (projectId) => {
    if (
      !window.confirm("Bu köprü projesini silmek istediğinize emin misiniz?")
    ) {
      return;
    }

    try {
      await API.delete(`/bridgeprojects/${projectId}`);
      await fetchBridgeProjects(currentPage); // Listeyi yenile
    } catch (err) {
      setError("Köprü projesi silinirken hata oluştu.");
      console.error("Bridge project delete error:", err);
    }
  };

  // Modal'dan gelen kaydetme işlemi
  const handleSaveProject = async (formData, projectId) => {
    try {
      if (projectId) {
        // Düzenleme - PUT request
        const projectData = {
          ...formData,
          created_at: new Date().toISOString(),
        };
        await API.put(`/bridgeprojects/${projectId}`, projectData);
      } else {
        // Yeni oluşturma - POST request (FormData)
        await API.post("/bridgeprojects", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setIsModalOpen(false);
      await fetchBridgeProjects(currentPage); // Listeyi yenile
    } catch (err) {
      setError("Köprü projesi kaydedilirken hata oluştu.");
      console.error("Bridge project save error:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
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
        <h1 className="text-3xl font-bold text-gray-800">Köprü Projeleri</h1>
        <button
          onClick={handleCreateProject}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <i className="bi bi-plus-lg"></i>
          Yeni Köprü Projesi Oluştur
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
                Açıklama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Etkinlik Tarihi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Konum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Katılımcı Sayısı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proje Değeri
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
            {bridgeProjects.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                  Henüz köprü projesi bulunmuyor.
                </td>
              </tr>
            ) : (
              bridgeProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-16 w-20">
                      {project.image_url ? (
                        <img
                          className="h-16 w-20 rounded-lg object-cover"
                          src={project.image_url}
                          alt={project.title}
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
                      {project.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 max-w-xs">
                      {truncateContent(project.description)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateTime(project.event_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {project.location || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {project.number_of_participants || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {truncateContent(project.project_impact, 30)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(project.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Düzenle"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
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
      {bridgeProjects.length > 0 && (
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
                <span className="font-medium">
                  {" "}
                  {bridgeProjects.length} proje
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

      <BridgeProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        projectItem={selectedProject}
      />
    </div>
  );
}

export default BridgeProjectsListPage;
