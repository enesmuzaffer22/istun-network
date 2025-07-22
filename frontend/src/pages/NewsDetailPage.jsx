import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function NewsDetailPage() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/src/pages/newsData.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item) => item.slug === slug);
        setNews(found);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div>Yükleniyor...</div>;
  if (!news) return <div>Haber bulunamadı.</div>;

  return (
    <div className="flex flex-col gap-8 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
        {news.news_title}
      </h1>
      <p className="text-gray-600 text-lg mb-4">{news.news_description}</p>
      <div className="text-base sm:text-lg text-gray-800 whitespace-pre-line">
        {news.news_content}
      </div>
    </div>
  );
}

export default NewsDetailPage; 