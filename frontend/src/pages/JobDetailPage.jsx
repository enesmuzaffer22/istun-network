// frontend/src/pages/JobDetailPage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import API from "../utils/axios"; // Merkezi Axios'u import ediyoruz
import {
  markdownComponents,
  MarkdownWrapper,
  remarkPlugins,
} from "../components/MarkdownComponents";

function JobDetailPage() {
  // DEĞİŞİKLİK: URL'den 'slug' yerine 'id'yi alıyoruz.
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Statik dosyadan veri çekmek yerine API isteği atıyoruz.
    const fetchJobDetail = async () => {
      // Eğer bir sebepten id yoksa, isteği hiç yapma.
      if (!id) {
        setLoading(false);
        setError("İş ilanı kimliği bulunamadı.");
        return;
      }

      try {
        setLoading(true);
        // Backend'deki /api/jobs/:id rotasına istek atıyoruz.
        const response = await API.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        console.error("İş detayı çekilirken hata:", err);
        setError("İş ilanı yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]); // Bu useEffect, URL'deki 'id' değiştiğinde tekrar çalışır.

  // Başvuru fonksiyonu - Önce linke git, API'yi arka planda çalıştır
  const handleApply = () => {
    if (!job.link) return;

    // Öncelik linke gitmek - hemen aç
    window.open(job.link, "_blank");

    // API'yi arka planda sessizce çalıştır
    if (id) {
      API.post(`/jobs/${id}/submit`).catch((err) => {
        console.error("Başvuru kaydı oluşturulurken hata (arka plan):", err);
      });
    }
  };

  if (loading) {
    return <div className="text-center p-20">Yükleniyor...</div>;
  }

  if (error || !job) {
    return (
      <div className="text-center p-20 text-red-500">
        {error || "İş ilanı bulunamadı."}
      </div>
    );
  }

  // Tarihi daha okunabilir bir formata çevirelim
  const formattedDate = new Date(job.created_at).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      {/* DEĞİŞİKLİK: Alan adlarını veritabanına uygun hale getirdik. */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
        {job.title}
      </h1>
      <div className="text-gray-700 text-lg font-semibold">{job.employer}</div>
      <div className="text-gray-400 text-base mb-4">{formattedDate}</div>

      {/* 
        Veritabanında 'job_description' ve 'job_content' diye iki ayrı alan yok.
        Sadece 'content' var. Bu yüzden onu kullanıyoruz.
      */}
      <MarkdownWrapper>
        <ReactMarkdown
          components={markdownComponents}
          remarkPlugins={remarkPlugins}
        >
          {job.content}
        </ReactMarkdown>
      </MarkdownWrapper>

      {/* Başvuru bölümü */}
      {job.link && (
        <div className="mt-8">
          <button
            onClick={handleApply}
            className="inline-flex items-center px-8 py-3 rounded-full font-medium bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <i className="bi bi-send-fill mr-2"></i>
            Hemen Başvur
          </button>
        </div>
      )}
    </div>
  );
}

export default JobDetailPage;
