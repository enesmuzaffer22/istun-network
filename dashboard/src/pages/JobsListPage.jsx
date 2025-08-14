import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import JobFormModal from "../components/JobFormModal";

function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // İş ilanlarını getir
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await API.get("/jobs");
      setJobs(response.data);
      setError("");
    } catch (err) {
      setError("İş ilanları yüklenirken hata oluştu.");
      console.error("Jobs fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde iş ilanlarını getir
  useEffect(() => {
    fetchJobs();
  }, []);

  // Yeni iş ilanı oluştur
  const handleCreateJob = () => {
    setSelectedJob(null);
    setIsModalOpen(true);
  };

  // İş ilanını düzenle
  const handleEditJob = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // İş ilanını sil
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Bu iş ilanını silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await API.delete(`/jobs/${jobId}`);
      await fetchJobs(); // Listeyi yenile
    } catch (err) {
      setError("İş ilanı silinirken hata oluştu.");
      console.error("Job delete error:", err);
    }
  };

  // Modal'dan gelen kaydetme işlemi
  const handleSaveJob = async (formData, jobId) => {
    try {
      const jobData = {
        ...formData,
        created_at: new Date().toISOString(),
      };

      if (jobId) {
        // Düzenleme
        await API.put(`/jobs/${jobId}`, jobData);
      } else {
        // Yeni oluşturma
        await API.post("/jobs", jobData);
      }

      setIsModalOpen(false);
      await fetchJobs(); // Listeyi yenile
    } catch (err) {
      setError("İş ilanı kaydedilirken hata oluştu.");
      console.error("Job save error:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <h1 className="text-3xl font-bold text-gray-800">İş İlanları</h1>
        <button
          onClick={handleCreateJob}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <i className="bi bi-plus-lg"></i>
          Yeni İlan Oluştur
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
                İş İlanı Başlığı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşveren
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oluşturma Tarihi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başvuru Sayısı
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Henüz iş ilanı bulunmuyor.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {job.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.employer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(job.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {job.submit_count || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditJob(job)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Düzenle"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
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

      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
        job={selectedJob}
      />
    </div>
  );
}

export default JobsListPage;
