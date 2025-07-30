// frontend/src/pages/NewsDetailPage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import API from '../utils/axios';

const markdownComponents = { /* ... (stilleriniz aynı kalabilir) ... */ };

function NewsDetailPage() {
  const { id } = useParams(); // Artık :id kullanıyoruz
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await API.get(`/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error("Haber detayı çekilirken hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [id]);

  if (loading) return <div>Yükleniyor...</div>;
  if (!news) return <div>Haber bulunamadı.</div>;

  return (
    <div className="flex flex-col gap-8 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      {news.banner_img_url && (
        <img src={news.banner_img_url} alt={news.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-4" />
      )}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
        {news.title}
      </h1>
      <div className="prose lg:prose-xl max-w-none text-gray-800">
        <ReactMarkdown components={markdownComponents}>{news.content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default NewsDetailPage;