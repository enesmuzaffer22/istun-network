import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

function BridgeProjectsPage() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [impact, setImpact] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchImpact = async () => {
      try {
        const response = await API.get("/bridgeprojectsimpact");
        const data = response?.data?.data ?? response?.data;
        if (!isCancelled) setImpact(data);
      } catch (error) {
        console.error("Etki skorları yüklenirken hata:", error);
      }
    };

    const fetchActivities = async (targetPage) => {
      try {
        setLoading(true);
        const response = await API.get("/bridgeprojects", {
          params: { page: targetPage },
        });
        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        const nextHasMore =
          typeof response.data?.hasMore === "boolean"
            ? response.data.hasMore
            : list.length === 6;
        if (!isCancelled) {
          setActivities(list);
          setHasMore(nextHasMore);
          setPage(targetPage);
        }
      } catch (error) {
        console.error("Bridge Projects yüklenirken hata:", error);
        if (!isCancelled) setActivities([]);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchImpact();
    fetchActivities(1);

    return () => {
      isCancelled = true;
    };
  }, []);

  const objectives = [
    {
      icon: "bi-people-fill",
      title: "Kuşaklar Arası Dayanışma",
      description:
        "Öğrenciler arasında kuşaklar arası dayanışma kültürünü güçlendirmek",
    },
    {
      icon: "bi-diagram-3-fill",
      title: "Takım Çalışması",
      description: "Takım çalışması ve proje yönetimi becerilerini geliştirmek",
    },
    {
      icon: "bi-heart-fill",
      title: "Toplumsal Fayda",
      description: "Toplumsal fayda odaklı projeler üretmek",
    },
    {
      icon: "bi-gear-fill",
      title: "Sosyal Sorumluluk",
      description: "Mühendislik bilgisini sosyal sorumlulukla bütünleştirmek",
    },
  ];

  const processSteps = [
    {
      icon: "bi-people",
      title: "Takımların Oluşturulması",
      description:
        "Her yıl, farklı sınıf düzeylerindeki öğrencilerin katılımıyla 10 kişilik takımlar kurulur.",
    },
    {
      icon: "bi-gear",
      title: "Projelerin Yürütülmesi",
      description:
        "Takımlar, yıl boyunca mühendislik bilgisini sosyal sorumluluk bilinciyle birleştiren çalışmalar yürütür.",
    },
    {
      icon: "bi-easel",
      title: "Sunum ve Değerlendirme",
      description:
        "Yıl sonunda her takım projelerini sunum ve değerlendirme günü ile toplulukla paylaşır.",
    },
    {
      icon: "bi-trophy",
      title: "Ödüllendirme",
      description:
        "En etkili ve fayda sağlayan projeler, ödüllerle taçlandırılır.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Birlikte İz Bırak
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Farklı sınıf düzeylerinden öğrencilerimiz bir araya gelerek,
              dayanışma ve toplumsal katkı kültürünü yaşatıyor
            </p>
          </div>
        </div>
      </section>

      {/* Ana Açıklama */}
      <section className="py-20">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="max-w-4xl mx-auto">
            <div className="text-lg leading-relaxed text-gray-700 space-y-6">
              <p>
                Her yeni dönemde, bilgisayar mühendisliği öğrencilerimiz farklı
                sınıf düzeylerinden bir araya gelerek takımlar oluşturur. Bu
                takımlar, yalnızca ders dışı bir faaliyet değil; aynı zamanda
                dayanışma, üretim ve toplumsal katkı kültürünün bir
                yansımasıdır.
              </p>
              <p>
                Üst sınıflar deneyimleriyle yol gösterirken, alt sınıflar
                enerjisiyle takımlara güç katar. Böylece kuşaklar arası bir
                köprü kurulur ve her takım hem mühendislik odaklı projeler
                geliştirir hem de topluma dokunan çalışmalar yürütür.
              </p>
              <p>
                Tüm bu sürecin merkezinde ise sosyal fayda vardır.
                Öğrencilerimiz, mühendislik bilgisini toplumsal sorumluluk
                bilinciyle harmanlayarak, bireysel kazanımların ötesine geçen
                ortak bir değer üretir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Etki Skoru */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Etki Skorumuz</h2>
            <p className="text-xl text-white/90">
              Birlikte yarattığımız değişimin rakamları
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {impact?.volunteer_student != null
                  ? `${impact.volunteer_student}+`
                  : "-"}
              </div>
              <div className="text-white/80 text-lg">Gönüllü Öğrenci</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {impact?.donated_institution != null
                  ? `${impact.donated_institution}+`
                  : "-"}
              </div>
              <div className="text-white/80 text-lg">Bağış Yapılan Kurum</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {impact?.active_project != null
                  ? `${impact.active_project}+`
                  : "-"}
              </div>
              <div className="text-white/80 text-lg">Aktif Proje</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {impact?.volunteer_hour != null
                  ? `${impact.volunteer_hour}+`
                  : "-"}
              </div>
              <div className="text-white/80 text-lg">Gönüllü Saati</div>
            </div>
          </div>
        </div>
      </section>

      {/* Amaçlarımız */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Amacımız</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Birlikte İz Bırak projesi ile hedeflediğimiz temel amaçlar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i
                      className={`${objective.icon} text-2xl text-primary`}
                    ></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {objective.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {objective.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nasıl İşliyor */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nasıl İşliyor?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Birlikte İz Bırak projesinin adım adım süreci
            </p>
          </div>

          <div className="relative">
            {/* Süreç Çizgisi - Desktop */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary/20 h-full"></div>

            {processSteps.map((step, index) => (
              <div key={index} className="relative mb-12 last:mb-0">
                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center">
                  {/* Sol taraf (çift sayılar için) */}
                  {index % 2 === 0 ? (
                    <>
                      <div className="w-1/2 pr-8 text-right">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                          <div className="flex items-center justify-end gap-4 mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                              {step.title}
                            </h3>
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                              <i
                                className={`${step.icon} text-2xl text-primary`}
                              ></i>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Merkez numara */}
                      <div className="relative z-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-4 flex-shrink-0">
                        <span className="text-white font-bold text-xl">
                          {index + 1}
                        </span>
                      </div>

                      {/* Sağ taraf boş */}
                      <div className="w-1/2"></div>
                    </>
                  ) : (
                    <>
                      {/* Sol taraf boş */}
                      <div className="w-1/2"></div>

                      {/* Merkez numara */}
                      <div className="relative z-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-4 flex-shrink-0">
                        <span className="text-white font-bold text-xl">
                          {index + 1}
                        </span>
                      </div>

                      {/* Sağ taraf (tek sayılar için) */}
                      <div className="w-1/2 pl-8">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                              <i
                                className={`${step.icon} text-2xl text-primary`}
                              ></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden">
                  <div className="flex items-start gap-4">
                    {/* Numara ve çizgi */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {index + 1}
                        </span>
                      </div>
                      {index !== processSteps.length - 1 && (
                        <div className="w-0.5 h-16 bg-primary/20 mt-4"></div>
                      )}
                    </div>

                    {/* İçerik */}
                    <div className="flex-1">
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <i
                              className={`${step.icon} text-lg text-primary`}
                            ></i>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Etkinlikler */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Takım Etkinlikleri
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Takımlarımızın gerçekleştirdiği sosyal sorumluluk projeleri
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading && (
              <div className="col-span-full text-center text-gray-500">
                Yükleniyor...
              </div>
            )}
            {!loading &&
              activities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() =>
                    navigate(`/birlikte-iz-birak/etkinlik/${activity.id}`)
                  }
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden">
                    <img
                      src={activity.image_url}
                      alt={activity.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {activity.description}
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <i className="bi bi-people"></i>
                        <span>{activity.number_of_participants} katılımcı</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <i className="bi bi-calendar text-primary"></i>
                        <span>
                          {activity.event_date || activity.created_at}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={async () => {
                if (page > 1 && !loading) {
                  try {
                    setLoading(true);
                    const target = page - 1;
                    const response = await API.get("/bridgeprojects", {
                      params: { page: target },
                    });
                    const list = Array.isArray(response.data)
                      ? response.data
                      : Array.isArray(response.data?.data)
                      ? response.data.data
                      : [];
                    const nextHasMore =
                      typeof response.data?.hasMore === "boolean"
                        ? response.data.hasMore
                        : list.length === 6;
                    setActivities(list);
                    setHasMore(nextHasMore);
                    setPage(target);
                  } catch (error) {
                    console.error("Önceki sayfa yüklenemedi:", error);
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              disabled={page === 1 || loading}
              className={`px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
                page === 1 || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-red-700"
              }`}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: page }, (_, i) => i + 1)
                .concat(hasMore ? [page + 1] : [])
                .map((p) => (
                  <button
                    key={p}
                    onClick={async () => {
                      if (p !== page && !loading) {
                        try {
                          setLoading(true);
                          const response = await API.get("/bridgeprojects", {
                            params: { page: p },
                          });
                          const list = Array.isArray(response.data)
                            ? response.data
                            : Array.isArray(response.data?.data)
                            ? response.data.data
                            : [];
                          const nextHasMore =
                            typeof response.data?.hasMore === "boolean"
                              ? response.data.hasMore
                              : list.length === 6;
                          setActivities(list);
                          setHasMore(nextHasMore);
                          setPage(p);
                        } catch (error) {
                          console.error("Sayfa yüklenemedi:", error);
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                    className={`min-w-9 h-9 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                      p === page
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
            </div>
            <button
              onClick={async () => {
                if (hasMore && !loading) {
                  try {
                    setLoading(true);
                    const target = page + 1;
                    const response = await API.get("/bridgeprojects", {
                      params: { page: target },
                    });
                    const list = Array.isArray(response.data)
                      ? response.data
                      : Array.isArray(response.data?.data)
                      ? response.data.data
                      : [];
                    const nextHasMore =
                      typeof response.data?.hasMore === "boolean"
                        ? response.data.hasMore
                        : list.length === 6;
                    setActivities(list);
                    setHasMore(nextHasMore);
                    setPage(target);
                  } catch (error) {
                    console.error("Sonraki sayfa yüklenemedi:", error);
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              disabled={!hasMore || loading}
              className={`px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
                !hasMore || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-red-700"
              }`}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BridgeProjectsPage;
