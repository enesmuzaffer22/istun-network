import React, { useEffect, useState } from "react";
import API from "../utils/axios";

function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const fetchAchievements = async (targetPage) => {
      try {
        setLoading(true);
        const response = await API.get("/achievements", {
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
            : list.length === 9;
        if (!isCancelled) {
          setAchievements(list);
          setHasMore(nextHasMore);
          setPage(targetPage);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Başarılar yüklenirken hata:", err);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchAchievements(1);

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Başarılarımız
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Sektörde tanınırlığımızı ve başarımızı gösteren prestijli
            ödüllerimiz.
          </p>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading && (
              <p className="col-span-full text-center">Yükleniyor...</p>
            )}
            {!loading &&
              achievements.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  <div className="text-5xl text-primary mb-4">
                    <i className="bi bi-trophy"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 flex-grow">
                    {item.given_from}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-block bg-primary/20 text-primary text-xs font-semibold px-2 py-1 rounded mb-3">
                      {item.year}
                    </span>
                    {item.has_link && item.news_link && (
                      <div>
                        <a
                          href={item.news_link}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-300 w-full inline-block"
                        >
                          İlgili habere git
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={async () => {
                if (page > 1 && !loading) {
                  try {
                    setLoading(true);
                    const target = page - 1;
                    const response = await API.get("/achievements", {
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
                        : list.length === 9;
                    setAchievements(list);
                    setHasMore(nextHasMore);
                    setPage(target);
                  } catch (err) {
                    console.error("Başarılar yüklenirken hata:", err);
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
                          const response = await API.get("/achievements", {
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
                              : list.length === 9;
                          setAchievements(list);
                          setHasMore(nextHasMore);
                          setPage(p);
                        } catch (err) {
                          console.error("Başarılar yüklenirken hata:", err);
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
                    const response = await API.get("/achievements", {
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
                        : list.length === 9;
                    setAchievements(list);
                    setHasMore(nextHasMore);
                    setPage(target);
                  } catch (err) {
                    console.error("Başarılar yüklenirken hata:", err);
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

export default AchievementsPage;
