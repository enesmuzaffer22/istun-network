import React from "react";

function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Hakkımızda</h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              İstanbul Sağlık ve Teknoloji Üniversitesi öğrencileri ve
              mezunlarını güçlü bir network ile buluşturan platform
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Misyon */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <i className="bi bi-bullseye text-2xl text-primary"></i>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Misyonumuz</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                ISTUNetwork olarak amacımız, İstanbul Sağlık ve Teknoloji
                Üniversitesi öğrencileri ile mezunlarını güçlü bir iletişim ve
                iş birliği ağı altında bir araya getirmektir. Öğrencilerimizin
                eğitim hayatları boyunca edindikleri bilgi ve becerileri,
                mezunlarımızın sektördeki tecrübeleri ile buluşturmayı
                hedefliyoruz.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mt-4">
                Bu sayede hem mezunlarımızın kariyer yolculuklarına değer
                katacak fırsatların yaratılmasını, hem de öğrencilerimizin
                gerçek iş dünyasına hazırlanmasını sağlamayı amaçliyoruz.
                Platformumuz, iş ve staj ilanlarının paylaşılabildiği, mentorluk
                desteğinin sunulduğu, kariyer hikâyelerinin ilham kaynağı olduğu
                ve üniversitemizle ilgili güncel gelişmelerin takip edilebildiği
                dinamik bir ekosistem oluşturmayı misyon edinmiştir.
              </p>
            </div>

            {/* Vizyon */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <i className="bi bi-eye text-2xl text-primary"></i>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Vizyonumuz</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                ISTUNetwork olarak vizyonumuz, İstanbul Sağlık ve Teknoloji
                Üniversitesi'ni sadece bir eğitim kurumu değil, mezun olduktan
                sonra da bağlı kalınan, destek alınan ve katkı sağlanan bir
                topluluk haline getirmektir.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mt-4">
                Uzun vadede, öğrenciler ile mezunların etkileşim halinde olduğu,
                kariyer fırsatlarının paylaşıldığı, sektör profesyonelleriyle
                bağlantıların kurulduğu ve üniversitemizin adını ulusal ve
                uluslararası platformlarda başarıyla temsil eden bir network
                oluşturmayı hedefliyoruz. ISTUNetwork; mezunlarımızın bilgi
                birikimlerini gelecek nesillere aktarabildiği, öğrencilerimizin
                ise güvenle kariyer planlaması yapabildiği sürdürülebilir bir
                köprü olmayı vizyon edinmektedir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ISTUNetwork'ü yönlendiren temel değerler ve ilkeler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* İş Birliği */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <i className="bi bi-people text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                İş Birliği
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Öğrenciler ve mezunlar arasında güçlü bağlar kurarak ortak
                hedeflere ulaşmayı destekliyoruz.
              </p>
            </div>

            {/* Sürdürülebilirlik */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <i className="bi bi-arrow-repeat text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Sürdürülebilirlik
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Uzun vadeli ve kalıcı çözümler üreterek gelecek nesillere değer
                katmayı hedefliyoruz.
              </p>
            </div>

            {/* İnovasyon */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <i className="bi bi-lightbulb text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                İnovasyon
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Teknoloji ve yaratıcılığı kullanarak sürekli gelişen çözümler
                sunuyoruz.
              </p>
            </div>

            {/* Şeffaflık */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <i className="bi bi-shield-check text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Şeffaflık
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tüm süreçlerimizde açık ve güvenilir bir yaklaşım benimser,
                hesap verebilirliği önceliriz.
              </p>
            </div>

            {/* Kapsayıcılık */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <i className="bi bi-heart text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Kapsayıcılık
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Herkesi kucaklayan, farklılıkları değer olarak gören bir
                topluluk oluşturuyoruz.
              </p>
            </div>

            {/* Mükemmellik */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <i className="bi bi-award text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Mükemmellik
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sunduğumuz her hizmette yüksek kalite standartlarını koruyarak
                mükemmelliği hedefliyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Rakamlarla ISTUNetwork</h2>
            <p className="text-xl text-white/90">Büyüyen topluluğumuzun gücü</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-white/80 text-lg">Aktif Öğrenci</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
              <div className="text-white/80 text-lg">Mezun Üye</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-white/80 text-lg">İş Fırsatı</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <div className="text-white/80 text-lg">Sektör Ortağı</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;
