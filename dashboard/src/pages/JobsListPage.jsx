// dashboard/src/pages/JobsListPage.jsx

import React, { useEffect, useState } from 'react';
import API from '../utils/axios';
import JobFormModal from '../components/JobFormModal'; // Form modalını import ediyoruz

function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- YENİ EKLENEN STATE'LER ---
  // Modal'ın açık/kapalı durumunu kontrol eder
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Düzenleme modunda hangi iş ilanının seçildiğini tutar
  const [editingJob, setEditingJob] = useState(null);
  // --- BİTİŞ ---

  // Bu fonksiyon verileri çekmek için, aynı kalıyor.
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await API.get('/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error("İş ilanları çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // --- YENİ EKLENEN FONKSİYONLAR ---

  // Silme işlemini yönetir
  const handleDelete = async (jobId, jobTitle) => {
    if (window.confirm(`"${jobTitle}" başlıklı ilanı silmek istediğinizden emin misiniz?`)) {
      try {
        await API.delete(`/jobs/${jobId}`);
        // Listeyi tekrar API'den çekmek yerine state'ten kaldırarak performansı artırıyoruz.
        setJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
        alert("İlan başarıyla silindi.");
      } catch (error) {
        console.error("İlan silinirken hata oluştu:", error);
        alert("Silme işlemi sırasında bir hata oluştu.");
      }
    }
  };

  // Form modalını açar. Parametre olarak 'job' gelirse düzenleme, gelmezse ekleme modudur.
  const handleOpenModal = (job = null) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  // Form modalını kapatır.
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  // Form verisini backend'e gönderir (Ekleme veya Güncelleme).
  const handleSaveJob = async (formData, jobId) => {
    try {
      if (jobId) {
        // ID varsa, bu bir GÜNCELLEME işlemidir (PUT).
        // 'created_at' alanını korumak için orijinal veriyi de kullanabiliriz.
        await API.put(`/jobs/${jobId}`, formData);
      } else {
        // ID yoksa, bu bir EKLEME işlemidir (POST).
        // Backend zaten tarihi oluşturuyor, ama biz yine de gönderelim.
        await API.post('/jobs', { ...formData, created_at: new Date().toISOString() });
      }
      alert(jobId ? 'İlan başarıyla güncellendi.' : 'İlan başarıyla eklendi.');
      handleCloseModal();
      fetchJobs(); // Başarılı işlem sonrası tabloyu yenile
    } catch (error) {
      console.error("İlan kaydedilirken hata:", error);
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
        <h1 className="text-3xl font-bold">İş İlanları Yönetimi</h1>
        {/* DEĞİŞİKLİK: Yeni ilan eklemek için modalı açan onClick olayı eklendi. */}
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
          <i className="bi bi-plus-lg mr-2"></i>Yeni İlan Ekle
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            {/* Tablo başlıkları aynı kalıyor */}
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Başlık</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">İşveren</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Yayın Tarihi</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{job.title}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{job.employer}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {new Date(job.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  {/* DEĞİŞİKLİK: Düzenleme ve Silme butonlarına onClick olayları eklendi. */}
                  <button onClick={() => handleOpenModal(job)} className="text-indigo-600 hover:text-indigo-900 mr-4">Düzenle</button>
                  <button onClick={() => handleDelete(job.id, job.title)} className="text-red-600 hover:text-red-900">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* DEĞİŞİKLİK: Modal component'i sayfanın sonuna eklendi. */}
      <JobFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveJob}
        job={editingJob}
      />
    </div>
  );
}

export default JobsListPage;