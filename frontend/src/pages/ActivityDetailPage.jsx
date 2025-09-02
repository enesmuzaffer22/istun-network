import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";

function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/bridgeprojects/${id}`);
        const detail = response?.data?.data ?? response?.data;
        if (detail?.id) {
          setActivity(detail);
        } else {
          setError("Proje bulunamadı.");
        }
      } catch (err) {
        console.error("Proje detayı yüklenirken hata:", err);
        if (err.response?.status === 404) {
          setError("Proje bulunamadı.");
        } else {
          setError("Proje yüklenirken bir hata oluştu.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <button
            onClick={() => navigate("/birlikte-iz-birak")}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Etkinlik Bulunamadı
          </h1>
          <button
            onClick={() => navigate("/birlikte-iz-birak")}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <div className="flex items-center gap-2 text-white/80">
                <button
                  onClick={() => navigate("/birlikte-iz-birak")}
                  className="hover:text-white transition-colors"
                >
                  Birlikte İz Bırak
                </button>
                <i className="bi bi-chevron-right text-sm"></i>
                <span className="text-white">{activity.title}</span>
              </div>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {activity.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              {activity.description}
            </p>

            {/* Temel Bilgiler */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <i className="bi bi-people text-2xl mb-2 block"></i>
                <div className="text-2xl font-bold mb-1">
                  {activity.number_of_participants}
                </div>
                <div className="text-white/80 text-sm">Katılımcı</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <i className="bi bi-calendar text-2xl mb-2 block"></i>
                <div className="text-lg font-bold mb-1">
                  {activity.event_date || activity.created_at}
                </div>
                <div className="text-white/80 text-sm">Tarih</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <i className="bi bi-geo-alt text-2xl mb-2 block"></i>
                <div className="text-lg font-bold mb-1">
                  {activity.location}
                </div>
                <div className="text-white/80 text-sm">Konum</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ana İçerik */}
      <section className="py-20">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Sol Kolon - İçerik */}
              <div className="lg:col-span-2 space-y-8">
                {/* Ana Görsel */}
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={activity.image_url}
                    alt={activity.title}
                    className="w-full h-96 object-cover"
                  />
                </div>

                {/* Proje Detayları */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Proje Hakkında
                  </h2>
                  <div className="prose prose-lg max-w-none text-gray-700">
                    <p className="mb-4 leading-relaxed whitespace-pre-line">
                      {activity.content || activity.description}
                    </p>
                  </div>
                </div>

                {/* Başarılar */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Elde Edilen Başarılar
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Array.isArray(activity.achievements) &&
                      activity.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="bi bi-check text-green-600"></i>
                          </div>
                          <span className="text-gray-700">{achievement}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Sağ Kolon - Sidebar */}
              <div className="space-y-8">
                {/* Etki */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    Proje Etkisi
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {activity.impact}
                    </div>
                  </div>
                </div>

                {/* Takım Üyeleri */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Takım Üyeleri
                  </h3>
                  <div className="space-y-3">
                    {Array.isArray(activity.crew) &&
                      activity.crew.map((member, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <i className="bi bi-person text-gray-600"></i>
                          </div>
                          <span className="text-gray-700">{member}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Geri Dön Butonu */}
                <button
                  onClick={() => navigate("/birlikte-iz-birak")}
                  className="w-full bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="bi bi-arrow-left"></i>
                  Geri Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ActivityDetailPage;
