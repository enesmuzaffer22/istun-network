import React, { useState } from "react";

function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Hakkımızda</h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              İstanbul Sağlık ve Teknoloji Üniversitesi’nin 2021 yılında kurulan
              Bilgisayar ve Yazılım Mühendisliği bölümleri, 2025’te ilk
              mezunlarını verdi. Bu yolculuğun devamı olarak İSTÜNetwork,
              öğrenciler ve mezunları güçlü bir iletişim, iş birliği ve
              dayanışma çatısı altında buluşturuyor.
            </p>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mt-4">
              Amacımız, sadece kariyer fırsatları yaratmak değil; aynı zamanda
              bilgi ve deneyimleri paylaşarak, bireysel başarıları kolektif güce
              dönüştürmek. İSTÜNetwork, mezuniyetle bitmeyen; ömür boyu süren
              bir aidiyet kültürünün adresidir.
            </p>
          </div>
        </div>
      </section>

      {/* Rakamlarla İSTÜN */}
      <section className="py-16 md:py-20 bg-primary/90 text-white">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
              Rakamlarla İSTÜN
            </h2>
            <p className="text-white/90 text-lg">Büyüyen topluluğumuzun gücü</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">500+</div>
              <div className="text-white/80">Aktif Öğrenci</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">200+</div>
              <div className="text-white/80">Mezun Üye</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">50+</div>
              <div className="text-white/80">İş Fırsatı</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">15+</div>
              <div className="text-white/80">Sektör Ortağı</div>
            </div>
          </div>
        </div>
      </section>

      {/* Yıl Şeridi (Aidiyet) */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-gray-50">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                2021
              </div>
              <div className="text-gray-700 mt-1">Kuruluş Yılı</div>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                2025
              </div>
              <div className="text-gray-700 mt-1">İlk Mezuniyet</div>
            </div>
          </div>
        </div>
      </section>

      {/* Misyon & Vizyon (tek bölüm altında iki kart) */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Misyon */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <i className="bi bi-bullseye text-2xl text-primary"></i>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Misyonumuz
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                ISTUNetwork olarak misyonumuz; öğrencilerimiz ve mezunlarımız
                arasında güçlü bağlar kurmak, kariyer fırsatları yaratmak, bilgi
                ve deneyim paylaşımını teşvik etmektir.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mt-4">
                Eğitim yolculuğunu desteklerken, sosyal fayda odaklı projelerle
                topluluğumuzu geliştirmeyi ve bireysel başarıları kolektif güce
                dönüştürmeyi hedefliyoruz.
              </p>
            </div>

            {/* Vizyon */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <i className="bi bi-eye text-2xl text-primary"></i>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Vizyonumuz
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                İSTÜN öğrencileri ve mezunlarını yalnızca Türkiye’de değil,
                küresel ölçekte de birbirine bağlayan öncü bir mezun ağı
                oluşturmaktır.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mt-4">
                Dayanışma, inovasyon ve toplumsal katkı kültürüyle öne çıkan bu
                ağ sayesinde, mezunlarımızın bilgi ve birikimleriyle geleceğe
                yön vermelerini; öğrencilerimizin ise güvenle kariyerlerine adım
                atmalarını sağlayan sürdürülebilir bir köprü olmayı amaçlıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Değerlerimiz
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              ISTUNetwork kültürünü besleyen temel ilkeler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <i className="bi bi-people text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Dayanışma
              </h3>
              <p className="text-gray-600">
                Mezunlar ve öğrenciler arasında köprü kurmak, her durumda
                birbirine destek olmak.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <i className="bi bi-bookmark-heart text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Aidiyet</h3>
              <p className="text-gray-600">
                İSTÜN ailesinin bir parçası olma bilincini mezuniyet sonrası da
                sürdürmek.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <i className="bi bi-globe2 text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Toplumsal Fayda
              </h3>
              <p className="text-gray-600">
                Bilgimizi ve enerjimizi yalnızca bireysel değil, toplum için de
                kullanmak.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <i className="bi bi-arrow-repeat text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Sürekli Öğrenme
              </h3>
              <p className="text-gray-600">
                Değişen teknolojiye uyum sağlayarak kendimizi ve topluluğumuzu
                geliştirmek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SSS - Sıkça Sorulan Sorular */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 2xl:px-[120px]">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Sıkça Sorulan Sorular (SSS)
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              ISTUNetwork hakkında merak ettiklerinize hızlı yanıtlar
            </p>
          </div>

          {/* Accordion */}
          <FAQAccordion />
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;

// SSS Bileşenleri
function FAQAccordion() {
  const items = [
    {
      q: "Kimler üye olabilir?",
      a: "İstanbul Sağlık ve Teknoloji Üniversitesi Bilgisayar Mühendisliği ve Yazılım Mühendisliği bölümlerinin mezunu veya öğrencisi olan herkes İSTÜNetwork’e üye olabilir. Böylece hem öğrencilik sürecinde hem de mezuniyet sonrasında topluluğun bir parçası olabilirsiniz.",
    },
    {
      q: "Nasıl üye olabilirim?",
      a: "İSTÜNetwork’e üye olmak için web sitemizde yer alan “Üye Ol” butonuna tıklayarak kayıt formunu doldurmanız yeterlidir. Başvurunuzun onaylanabilmesi için, form sırasında öğrenci belgesi (mezunlar için diploma/mezuniyet belgesi) yüklemeniz gerekmektedir. Onay sürecinden sonra hesabınız aktif hale gelir ve topluluğumuzun bir parçası olabilirsiniz.",
    },
    {
      q: "Üyelik ücretli midir?",
      a: "Hayır, üyelik tamamen ücretsizdir.",
    },
    {
      q: "Platforma üye olurken verilen bilgiler güvende midir?",
      a: "Bilgileriniz, yasal sınırlar dahilinde güvende tutulmaktadır. Ayrıntılı bilgi için, üyelik sırasında dijital onay vermiş olduğunuz Gizlilik Politikasını inceleyebilirsiniz.",
    },
    {
      q: "İş imkânı konusunda fayda sağlar mı?",
      a: "Evet. İşveren mezunlarımız, platforma iş ilanı girebilmekte ve doğrudan İSTÜNetwork ailesi ile buluşabilmektedir.",
    },
    {
      q: "Platformda hangi içerikler yer alıyor?",
      a: "İSTÜNetwork; iş ve staj ilanları, etkinlik duyuruları, sosyal sorumluluk projeleri, mezun buluşmaları ve kişisel gelişim fırsatları gibi birçok içerik sunar.",
    },
    {
      q: "Mezunlarla nasıl iletişim kurabilirim?",
      a: "Platformda yer alan forumlar ve özel mesajlaşma alanları sayesinde mezunlarımızla doğrudan iletişim kurabilir, kariyer danışmanlığı alabilir ve deneyimlerini öğrenebilirsiniz.",
    },
    {
      q: "Etkinliklere nasıl katılabilirim?",
      a: "Etkinlik duyuruları platformda yayınlanmaktadır. Katılmak istediğiniz etkinlik için ilgili formu doldurmanız veya etkinlikte belirtilen kayıt adımlarını takip etmeniz yeterlidir.",
    },
    {
      q: "İş ilanı veya etkinlik paylaşabilir miyim?",
      a: "Evet. Mezunlarımız iş ilanı, etkinlik veya sosyal fayda projelerini platforma ekleyebilir. Böylece topluluk üyeleriyle doğrudan paylaşım yapabilirsiniz.",
    },
    {
      q: "Üyelik bilgilerimi güncelleyebilir miyim?",
      a: "Evet. Profiliniz üzerinden iletişim bilgilerinizi, mezuniyet yılınızı veya iş bilgilerinizi güncelleyebilirsiniz. Böylece güncel kalır ve doğru bağlantılar kurabilirsiniz.",
    },
    {
      q: "Platform sadece Bilgisayar ve Yazılım Mühendisliği için mi?",
      a: "Evet, platform öncelikli olarak İstanbul Sağlık ve Teknoloji Üniversitesi Bilgisayar ve Yazılım Mühendisliği bölümlerinin öğrencileri ve mezunları için kurulmuştur.",
    },
    {
      q: "ISTUNetwork’e katılmanın bana en büyük katkısı ne olur?",
      a: "Kariyer fırsatlarını yakalamanın yanı sıra, mezun–öğrenci dayanışması ile güçlü bir iletişim ağına dahil olur, topluluğun bir parçası olarak aidiyet duygusunu yaşarsınız.",
    },
  ];

  // Birden fazla açık karta izin veriyoruz
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleIndex = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {items.map((item, idx) => (
        <AccordionItem
          key={idx}
          index={idx}
          isOpen={openIndexes.includes(idx)}
          onToggle={toggleIndex}
          question={item.q}
          answer={item.a}
        />
      ))}
    </div>
  );
}

function AccordionItem({ index, isOpen, onToggle, question, answer }) {
  return (
    <div className="border border-primary/15 bg-white rounded-xl overflow-hidden shadow-sm">
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
      >
        <span className="text-base md:text-lg font-semibold text-primary">
          {question}
        </span>
        <i
          className={`bi ${
            isOpen ? "bi-chevron-up" : "bi-chevron-down"
          } text-xl text-gray-600`}
          aria-hidden="true"
        ></i>
      </button>
      <div
        id={`faq-panel-${index}`}
        className={`${
          isOpen ? "block" : "hidden"
        } px-5 pb-5 text-gray-700 leading-relaxed`}
      >
        {answer}
      </div>
    </div>
  );
}
