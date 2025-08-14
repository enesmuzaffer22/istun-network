import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import API from "../utils/axios";
import {
  markdownComponents,
  MarkdownWrapper,
  remarkPlugins,
} from "../components/MarkdownComponents";

function RoadmapDetailPage() {
  const { id } = useParams(); // URL'den 'slug' yerine 'id'yi alıyoruz
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // id değiştiğinde ilgili yol haritasını çek
    if (!id) return;

    const fetchRoadmapDetail = async () => {
      try {
        setLoading(true);
        // Backend'e id ile istek atıyoruz
        const response = await API.get(`/roadmaps/${id}`);
        setRoadmap(response.data);
        setError(null);
      } catch (err) {
        console.error("Yol haritası detayı çekilirken hata:", err);
        setError("Bu yol haritası bulunamadı veya bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapDetail();
  }, [id]); // Bu effect, URL'deki id değiştiğinde tekrar çalışır

  if (loading) return <div className="text-center py-20">Yükleniyor...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!roadmap) return null; // roadmap null ise hiçbir şey gösterme

  return (
    <div className="flex flex-col gap-8 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
        {roadmap.title}
      </h1>
      <div className="flex items-center gap-4 text-gray-500 text-base mb-4">
        <span>
          Yayınlanma Tarihi:{" "}
          {new Date(roadmap.created_at).toLocaleDateString("tr-TR")}
        </span>
      </div>

      {/* Backend'den gelen 'image_url' varsa resmi göster */}
      {roadmap.image_url && (
        <img
          src={roadmap.image_url}
          alt={roadmap.title}
          className="w-full rounded-lg object-cover mb-4"
        />
      )}

      {/* Backend'den gelen 'content' alanını ReactMarkdown ile render et */}
      <MarkdownWrapper>
        <ReactMarkdown
          components={markdownComponents}
          remarkPlugins={remarkPlugins}
        >
          {roadmap.content}
        </ReactMarkdown>
      </MarkdownWrapper>
    </div>
  );
}

export default RoadmapDetailPage;
