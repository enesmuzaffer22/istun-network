import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "axios";

// Markdown bileşenleri için stil tanımlamaları (değişiklik yok)
const markdownComponents = {
  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-2 text-primary" {...props} />,
  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-5 mb-2 text-primary" {...props} />,
  ul: ({node, ...props}) => <ul className="list-disc ml-6 my-2" {...props} />,
  a: ({node, ...props}) => <a className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props} />,
  p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
  // ... diğer markdown stilleri
};

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
        const response = await axios.get(`http://localhost:5000/api/roadmaps/${id}`);
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
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!roadmap) return null; // roadmap null ise hiçbir şey gösterme

  return (
    <div className="flex flex-col gap-8 2xl:px-[120px] px-4 py-12 md:py-[90px] max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
        {roadmap.title}
      </h1>
      <div className="flex items-center gap-4 text-gray-500 text-base mb-4">
        <span>Yayınlanma Tarihi: {new Date(roadmap.created_at).toLocaleDateString("tr-TR")}</span>
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
      <div className="text-base sm:text-lg text-gray-800 prose lg:prose-lg max-w-none">
        <ReactMarkdown components={markdownComponents}>{roadmap.content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default RoadmapDetailPage;