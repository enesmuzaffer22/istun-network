import React from "react";

function AchievementsPage() {
  const awards = [
    {
      title: "En İyi Eğitim Platformu",
      organization: "Teknoloji Derneği",
      year: "2024",
      icon: "bi-trophy",
      hasNews: true,
      newsUrl: "/news/en-iyi-egitim-platformu-odulu",
    },
    {
      title: "İnovasyon Ödülü",
      organization: "Girişimcilik Vakfı",
      year: "2023",
      icon: "bi-trophy",
      hasNews: true,
      newsUrl: "/news/inovasyon-odulu-2023",
    },
    {
      title: "Sosyal Etki Ödülü",
      organization: "Sosyal Girişimcilik Derneği",
      year: "2023",
      icon: "bi-trophy",
      hasNews: false,
    },
    {
      title: "En İyi İş Yerleştirme",
      organization: "Kariyer Platformları Birliği",
      year: "2022",
      icon: "bi-trophy",
      hasNews: true,
      newsUrl: "/news/en-iyi-is-yerlestirme-odulu",
    },
    {
      title: "Dijital Dönüşüm Ödülü",
      organization: "Bilişim Sanayicileri Derneği",
      year: "2024",
      icon: "bi-trophy",
      hasNews: true,
      newsUrl: "/news/dijital-donusum-odulu-2024",
    },
    {
      title: "Genç Yetenekler Ödülü",
      organization: "İnsan Kaynakları Derneği",
      year: "2024",
      icon: "bi-trophy",
      hasNews: false,
    },
    {
      title: "Sürdürülebilir Eğitim Ödülü",
      organization: "Eğitim Vakfı",
      year: "2023",
      icon: "bi-trophy",
      hasNews: true,
      newsUrl: "/news/surdurulebilir-egitim-odulu",
    },
    {
      title: "Teknoloji Lideri Ödülü",
      organization: "Startup Ekosistemi",
      year: "2023",
      icon: "bi-trophy",
      hasNews: false,
    },
    {
      title: "Kalite Mükemmelliği",
      organization: "ISO Kalite Derneği",
      year: "2022",
      icon: "bi-trophy",
      hasNews: true,
      newsUrl: "/news/kalite-mukemmelligi-sertifikasi",
    },
    {
      title: "En İyi Mentor Program",
      organization: "Profesyonel Gelişim Platformu",
      year: "2022",
      icon: "bi-trophy",
      hasNews: false,
    },
    {
      title: "Girişimcilik Teşvik Ödülü",
      organization: "KOSGEB",
      year: "2021",
      icon: "bi-trophy",
      hasNews: true,
      newsUrl: "/news/girisimcilik-tesvik-odulu-kosgeb",
    },
    {
      title: "Toplumsal Katkı Ödülü",
      organization: "Sivil Toplum Kuruluşları Birliği",
      year: "2021",
      icon: "bi-trophy",
      hasNews: false,
    },
  ];

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
            {awards.map((award, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="text-5xl text-primary mb-4">
                  <i className={award.icon}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {award.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 flex-grow">
                  {award.organization}
                </p>
                <div className="mt-auto">
                  <span className="inline-block bg-primary/20 text-primary text-xs font-semibold px-2 py-1 rounded mb-3">
                    {award.year}
                  </span>
                  {award.hasNews && (
                    <div>
                      <button
                        onClick={() => (window.location.href = award.newsUrl)}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-300 w-full cursor-pointer"
                      >
                        İlgili habere git
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AchievementsPage;
