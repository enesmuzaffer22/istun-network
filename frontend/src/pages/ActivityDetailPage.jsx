import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Etkinlik verileri (gerçek uygulamada API'den gelecek)
  const activities = [
    {
      id: 1,
      title: "Çevre Temizlik Projesi",
      image: "/api/placeholder/800/600",
      description:
        "Üniversitemiz çevresinde düzenlenen kapsamlı temizlik etkinliği. Öğrencilerimiz çevre bilinci ile bir araya gelerek kampüs ve çevre alanların temizlenmesi için gönüllü olarak katıldı.",
      details:
        "Bu proje kapsamında 50'den fazla öğrenci bir araya gelerek üniversite kampüsü ve çevre mahallelerinde temizlik çalışması gerçekleştirdi. Toplanan atıklar geri dönüşüm merkezlerine teslim edildi. Proje, çevre bilincinin artırılması ve toplumsal sorumluluk anlayışının geliştirilmesi amacıyla hayata geçirildi.",
      fullDescription:
        "Çevre Temizlik Projesi, bilgisayar mühendisliği öğrencilerinin sosyal sorumluluk bilinciyle hareket ederek çevre koruma konusunda farkındalık yaratmak amacıyla başlattığı kapsamlı bir girişimdir. Proje, sadece temizlik yapmakla kalmayıp aynı zamanda çevre bilincinin toplumda yaygınlaştırılması hedefini de güder.\n\nProje kapsamında öğrenciler, üniversite kampüsü ve çevresindeki parklar, sokaklar ve yeşil alanları sistematik olarak temizledi. Toplanan atıklar türlerine göre ayrıştırılarak geri dönüşüm tesislerine ulaştırıldı. Bu süreçte öğrenciler, atık yönetimi ve geri dönüşüm konularında pratik deneyim kazandı.\n\nEtkinlik boyunca mahalle sakinleri de sürece dahil edilerek, çevre bilinci konusunda bilgilendirme çalışmaları yapıldı. Özellikle çocuklara yönelik eğitici aktiviteler düzenlenerek gelecek nesillerin çevre konusunda daha bilinçli olması hedeflendi.",
      participants: 52,
      duration: "1 gün",
      impact: "2 ton atık toplandı",
      date: "15 Mart 2024",
      location: "ISTU Kampüsü ve Çevresi",
      teamLeader: "Ahmet Yılmaz",
      teamMembers: [
        "Mehmet Demir",
        "Ayşe Kaya",
        "Fatma Özkan",
        "Ali Çelik",
        "Zeynep Arslan",
      ],
      gallery: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
      ],
      achievements: [
        "2 ton plastik atık toplandı",
        "500 kg cam atık ayrıştırıldı",
        "300 kg kağıt atık geri dönüştürüldü",
        "50 aile çevre bilinci konusunda bilgilendirildi",
      ],
    },
    {
      id: 2,
      title: "Dijital Okuryazarlık Eğitimi",
      image: "/api/placeholder/800/600",
      description:
        "Yaşlı vatandaşlara yönelik düzenlenen dijital okuryazarlık eğitimi programı. Teknoloji kullanımında rehberlik sağlandı.",
      details:
        "65 yaş üstü vatandaşlara akıllı telefon ve tablet kullanımı, e-devlet işlemleri, video arama yapma gibi temel dijital beceriler öğretildi. 8 hafta süren program ile toplam 120 kişiye ulaşıldı.",
      fullDescription:
        "Dijital Okuryazarlık Eğitimi, teknoloji çağında yaşlı vatandaşlarımızın dijital dünyaya entegrasyonunu sağlamak amacıyla başlatılan sosyal sorumluluk projesidir. Bu proje, kuşaklar arası dijital uçurumu kapatmayı ve yaşlıların günlük hayatlarını kolaylaştırmayı hedeflemektedir.\n\nProgram kapsamında 65 yaş üstü vatandaşlara temel teknoloji kullanımı öğretildi. Akıllı telefon ve tablet kullanımından başlayarak, internet tarama, e-posta gönderme, video arama yapma, sosyal medya kullanımı ve e-devlet işlemleri gibi konular ele alındı.\n\n8 haftalık eğitim programı boyunca her katılımcıya birebir destek sağlandı. Öğrenciler, sabırlı ve anlayışlı yaklaşımlarıyla yaşlı vatandaşların teknoloji korkusunu yenmelerine yardımcı oldu. Program sonunda katılımcılar, teknoloji kullanımında kendilerini çok daha güvenli hissettiklerini ifade etti.",
      participants: 30,
      duration: "8 hafta",
      impact: "120 yaşlı vatandaşa ulaşıldı",
      date: "10 Şubat - 5 Nisan 2024",
      location: "Belediye Sosyal Tesisleri",
      teamLeader: "Elif Şahin",
      teamMembers: [
        "Burak Yıldız",
        "Seda Koç",
        "Emre Acar",
        "Gizem Türk",
        "Okan Güzel",
      ],
      gallery: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
      ],
      achievements: [
        "120 yaşlı vatandaş eğitim aldı",
        "8 haftalık kapsamlı program tamamlandı",
        "95% katılımcı memnuniyet oranı",
        "Temel dijital beceriler kazandırıldı",
      ],
    },
    {
      id: 3,
      title: "Kod Öğretim Atölyesi",
      image: "/api/placeholder/800/600",
      description:
        "Lise öğrencilerine yönelik programlama eğitimi. Geleceğin teknoloji liderleri için temel kodlama becerileri aktarıldı.",
      details:
        "İstanbul'daki 5 farklı lisede düzenlenen atölyelerde Python programlama dili temel seviyede öğretildi. Öğrenciler basit projeler geliştirerek pratik deneyim kazandı.",
      fullDescription:
        "Kod Öğretim Atölyesi, lise öğrencilerinin teknoloji dünyasına adım atmalarını sağlamak ve programlama becerilerini geliştirmek amacıyla düzenlenen eğitim programıdır. Bu proje, geleceğin teknoloji liderlerini yetiştirme vizyonuyla hayata geçirilmiştir.\n\nProgram kapsamında İstanbul'daki 5 farklı lisede Python programlama dili temel seviyede öğretildi. Eğitimler, teorik bilgiyi pratikle pekiştiren bir yaklaşımla tasarlandı. Öğrenciler, basit oyunlar, hesap makineleri ve web uygulamaları gibi projeler geliştirerek öğrendiklerini uyguladı.\n\nAtölyeler boyunca öğrencilerin yaratıcılıklarını ortaya çıkarmaları için çeşitli proje yarışmaları düzenlendi. En başarılı projeler ödüllendirildi ve öğrencilerin motivasyonu artırıldı. Program sonunda birçok öğrenci, teknoloji alanında kariyer yapmaya karar verdiğini belirtti.",
      participants: 25,
      duration: "4 hafta",
      impact: "200 lise öğrencisine ulaşıldı",
      date: "1-28 Mayıs 2024",
      location: "İstanbul - 5 Farklı Lise",
      teamLeader: "Murat Kılıç",
      teamMembers: [
        "Deniz Aktaş",
        "Ceren Uysal",
        "Berkay Doğan",
        "İrem Polat",
        "Kaan Erdoğan",
      ],
      gallery: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
      ],
      achievements: [
        "200 lise öğrencisi eğitim aldı",
        "50 proje geliştirildi",
        "5 liseye ulaşıldı",
        "Python programlama dili öğretildi",
      ],
    },
    {
      id: 4,
      title: "Kitap Bağış Kampanyası",
      image: "/api/placeholder/800/600",
      description:
        "Kırsal bölgelerdeki okullara kitap bağışı için düzenlenen kampanya. Eğitim fırsatlarının artırılması hedeflendi.",
      details:
        "Üniversite öğrencileri ve akademik personelden toplanan 2000'den fazla kitap, Anadolu'nun farklı illerindeki 15 okula ulaştırıldı. Kütüphaneler kuruldu ve okuma kültürü desteklendi.",
      fullDescription:
        "Kitap Bağış Kampanyası, eğitimde fırsat eşitliğini sağlamak ve kırsal bölgelerdeki öğrencilerin kitaplara erişimini artırmak amacıyla başlatılan kapsamlı bir sosyal sorumluluk projesidir. Bu kampanya, eğitimin gücüne olan inancımızı ve toplumsal dayanışma ruhunu yansıtmaktadır.\n\nKampanya süresince üniversite öğrencileri, akademik personel ve gönüllülerden 2000'den fazla kitap toplandı. Toplanan kitaplar çocuk kitapları, ders kitapları, roman, şiir kitapları ve ansiklopediler gibi geniş bir yelpazede yer aldı.\n\nKitaplar, Anadolu'nun farklı illerindeki 15 okula ulaştırıldı. Bu okullarda mini kütüphaneler kuruldu ve öğrencilerin kitaplara kolayca erişebilmeleri sağlandı. Ayrıca okuma saatleri düzenlenerek öğrencilerin okuma alışkanlığı kazanmaları desteklendi.",
      participants: 40,
      duration: "2 ay",
      impact: "15 okula 2000+ kitap ulaştırıldı",
      date: "1 Ekim - 30 Kasım 2023",
      location: "Anadolu - 15 Farklı İl",
      teamLeader: "Ayşe Demir",
      teamMembers: [
        "Mehmet Ali Yıldırım",
        "Esra Çetin",
        "Hasan Öztürk",
        "Merve Aydın",
        "Serkan Kaya",
      ],
      gallery: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
      ],
      achievements: [
        "2000+ kitap toplandı",
        "15 okula ulaşıldı",
        "Mini kütüphaneler kuruldu",
        "Okuma kültürü desteklendi",
      ],
    },
    {
      id: 5,
      title: "Teknoloji Mentorluğu",
      image: "/api/placeholder/800/600",
      description:
        "Dezavantajlı bölgelerdeki gençlere teknoloji alanında mentorluk desteği sağlandı.",
      details:
        "İstanbul'un farklı ilçelerindeki gençlik merkezlerinde teknoloji mentorluğu verildi. Kariyer rehberliği, proje geliştirme ve sektör bilgisi paylaşıldı.",
      fullDescription:
        "Teknoloji Mentorluğu programı, dezavantajlı bölgelerdeki gençlerin teknoloji alanında kariyer yapabilmeleri için gerekli bilgi, beceri ve motivasyonu kazanmalarını sağlamak amacıyla tasarlanmış uzun soluklu bir projedir.\n\nProgram kapsamında İstanbul'un farklı ilçelerindeki gençlik merkezlerinde mentorluk hizmetleri verildi. Gençlere teknoloji sektörü hakkında bilgi verildi, kariyer yolları gösterildi ve kişisel gelişim konularında destek sağlandı.\n\n6 aylık program boyunca her gence bir mentor atandı. Mentorlar, gençlerle düzenli olarak buluşarak onların sorularını yanıtladı, projelerine rehberlik etti ve sektördeki deneyimlerini paylaştı. Program sonunda birçok genç, teknoloji alanında eğitim almaya karar verdi.",
      participants: 35,
      duration: "6 ay",
      impact: "80 gence mentorluk sağlandı",
      date: "1 Ocak - 30 Haziran 2024",
      location: "İstanbul Gençlik Merkezleri",
      teamLeader: "Can Özdemir",
      teamMembers: [
        "Pınar Yılmaz",
        "Tolga Şen",
        "Nihan Koç",
        "Barış Tunç",
        "Gamze Ersoy",
      ],
      gallery: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
      ],
      achievements: [
        "80 gence mentorluk sağlandı",
        "6 aylık kapsamlı program",
        "Kariyer rehberliği verildi",
        "Teknoloji bilinci artırıldı",
      ],
    },
    {
      id: 6,
      title: "Sağlık Tarama Etkinliği",
      image: "/api/placeholder/800/600",
      description:
        "Mahalle sakinleri için ücretsiz sağlık tarama ve bilgilendirme etkinliği düzenlendi.",
      details:
        "Üniversitemizin sağlık bilimleri öğrencileri ile birlikte düzenlenen etkinlikte tansiyon, kan şekeri ölçümü ve temel sağlık bilgilendirmesi yapıldı.",
      fullDescription:
        "Sağlık Tarama Etkinliği, toplum sağlığının korunması ve sağlık bilincinin artırılması amacıyla düzenlenen kapsamlı bir sosyal sorumluluk projesidir. Bu etkinlik, sağlık hizmetlerine erişimde yaşanan zorlukları göz önünde bulundurarak, halka ücretsiz sağlık hizmetleri sunmayı hedeflemiştir.\n\nEtkinlik, üniversitemizin sağlık bilimleri öğrencileri ile bilgisayar mühendisliği öğrencilerinin iş birliğiyle gerçekleştirildi. Mahalle sakinlerine tansiyon ölçümü, kan şekeri ölçümü, boy-kilo indeksi hesaplaması gibi temel sağlık taramaları ücretsiz olarak sunuldu.\n\nAyrıca katılımcılara sağlıklı yaşam, beslenme alışkanlıkları, düzenli egzersizin önemi ve kronik hastalıklardan korunma yolları hakkında bilgilendirme yapıldı. Etkinlik boyunca 300'den fazla kişiye sağlık taraması yapıldı ve sağlık bilinci artırıldı.",
      participants: 45,
      duration: "1 hafta",
      impact: "300 kişiye sağlık taraması",
      date: "15-22 Haziran 2024",
      location: "Mahalle Muhtarlığı",
      teamLeader: "Dr. Zehra Akgül",
      teamMembers: [
        "Cem Yıldırım",
        "Sibel Kara",
        "Onur Güneş",
        "Elif Çakır",
        "Mert Özkan",
      ],
      gallery: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
      ],
      achievements: [
        "300 kişiye sağlık taraması",
        "Ücretsiz sağlık hizmeti",
        "Sağlık bilinci artırıldı",
        "Multidisipliner ekip çalışması",
      ],
    },
  ];

  const activity = activities.find((act) => act.id === parseInt(id));

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
                  {activity.participants}
                </div>
                <div className="text-white/80 text-sm">Katılımcı</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <i className="bi bi-calendar text-2xl mb-2 block"></i>
                <div className="text-lg font-bold mb-1">{activity.date}</div>
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
                    src={activity.image}
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
                    {activity.fullDescription
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>

                {/* Başarılar */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Elde Edilen Başarılar
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {activity.achievements.map((achievement, index) => (
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
                    {activity.teamMembers.map((member, index) => (
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
