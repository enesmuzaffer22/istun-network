import React from "react";
import { useNavigate } from "react-router-dom";

function BridgeProjectsPage() {
  const navigate = useNavigate();

  // Örnek etkinlik verileri
  const activities = [
    {
      id: 1,
      title: "Çevre Temizlik Projesi",
      image: "/api/placeholder/400/500",
      description:
        "Üniversitemiz çevresinde düzenlenen kapsamlı temizlik etkinliği. Öğrencilerimiz çevre bilinci ile bir araya gelerek kampüs ve çevre alanların temizlenmesi için gönüllü olarak katıldı.",
      details:
        "Bu proje kapsamında 50'den fazla öğrenci bir araya gelerek üniversite kampüsü ve çevre mahallelerinde temizlik çalışması gerçekleştirdi. Toplanan atıklar geri dönüşüm merkezlerine teslim edildi.",
      participants: 52,
      duration: "1 gün",
      impact: "2 ton atık toplandı",
      date: "15 Mart 2024",
    },
    {
      id: 2,
      title: "Dijital Okuryazarlık Eğitimi",
      image: "/api/placeholder/400/500",
      description:
        "Yaşlı vatandaşlara yönelik düzenlenen dijital okuryazarlık eğitimi programı. Teknoloji kullanımında rehberlik sağlandı.",
      details:
        "65 yaş üstü vatandaşlara akıllı telefon ve tablet kullanımı, e-devlet işlemleri, video arama yapma gibi temel dijital beceriler öğretildi. 8 hafta süren program ile toplam 120 kişiye ulaşıldı.",
      participants: 30,
      duration: "8 hafta",
      impact: "120 yaşlı vatandaşa ulaşıldı",
      date: "10 Şubat - 5 Nisan 2024",
    },
    {
      id: 3,
      title: "Kod Öğretim Atölyesi",
      image: "/api/placeholder/400/500",
      description:
        "Lise öğrencilerine yönelik programlama eğitimi. Geleceğin teknoloji liderleri için temel kodlama becerileri aktarıldı.",
      details:
        "İstanbul'daki 5 farklı lisede düzenlenen atölyelerde Python programlama dili temel seviyede öğretildi. Öğrenciler basit projeler geliştirerek pratik deneyim kazandı.",
      participants: 25,
      duration: "4 hafta",
      impact: "200 lise öğrencisine ulaşıldı",
      date: "1-28 Mayıs 2024",
    },
    {
      id: 4,
      title: "Kitap Bağış Kampanyası",
      image: "/api/placeholder/400/500",
      description:
        "Kırsal bölgelerdeki okullara kitap bağışı için düzenlenen kampanya. Eğitim fırsatlarının artırılması hedeflendi.",
      details:
        "Üniversite öğrencileri ve akademik personelden toplanan 2000'den fazla kitap, Anadolu'nun farklı illerindeki 15 okula ulaştırıldı. Kütüphaneler kuruldu ve okuma kültürü desteklendi.",
      participants: 40,
      duration: "2 ay",
      impact: "15 okula 2000+ kitap ulaştırıldı",
      date: "1 Ekim - 30 Kasım 2023",
    },
    {
      id: 5,
      title: "Teknoloji Mentorluğu",
      image: "/api/placeholder/400/500",
      description:
        "Dezavantajlı bölgelerdeki gençlere teknoloji alanında mentorluk desteği sağlandı.",
      details:
        "İstanbul'un farklı ilçelerindeki gençlik merkezlerinde teknoloji mentorluğu verildi. Kariyer rehberliği, proje geliştirme ve sektör bilgisi paylaşıldı.",
      participants: 35,
      duration: "6 ay",
      impact: "80 gence mentorluk sağlandı",
      date: "1 Ocak - 30 Haziran 2024",
    },
    {
      id: 6,
      title: "Sağlık Tarama Etkinliği",
      image: "/api/placeholder/400/500",
      description:
        "Mahalle sakinleri için ücretsiz sağlık tarama ve bilgilendirme etkinliği düzenlendi.",
      details:
        "Üniversitemizin sağlık bilimleri öğrencileri ile birlikte düzenlenen etkinlikte tansiyon, kan şekeri ölçümü ve temel sağlık bilgilendirmesi yapıldı.",
      participants: 45,
      duration: "1 hafta",
      impact: "300 kişiye sağlık taraması",
      date: "15-22 Haziran 2024",
    },
  ];

  const impactStats = [
    { number: "500+", label: "Gönüllü Öğrenci" },
    { number: "100+", label: "Bağış Yapılan Kurum" },
    { number: "25", label: "Aktif Proje" },
    { number: "1000+", label: "Gönüllü Saati" },
  ];

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
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 text-lg">{stat.label}</div>
              </div>
            ))}
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
            {activities.map((activity) => (
              <div
                key={activity.id}
                onClick={() =>
                  navigate(`/birlikte-iz-birak/etkinlik/${activity.id}`)
                }
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden">
                  <img
                    src={activity.image}
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
                      <span>{activity.participants} katılımcı</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <i className="bi bi-calendar text-primary"></i>
                      <span>{activity.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default BridgeProjectsPage;
