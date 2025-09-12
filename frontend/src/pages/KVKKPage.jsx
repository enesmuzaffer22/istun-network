import React from "react";

const KVKKPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-4">
            ISTUNetwork KVKK Aydınlatma Metni
          </h1>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-primary mx-auto"></div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Giriş Paragrafı */}
            <div className="mb-6 sm:mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK")
                uyarınca, ISTUNetwork Mezunlar Topluluğu olarak kişisel
                verilerinizin güvenliğine önem veriyoruz.
              </p>
            </div>

            {/* İşlenen Kişisel Veriler */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center flex-wrap">
                <i className="bi bi-person-check text-primary mr-2 sm:mr-3"></i>
                <span>İşlenen Kişisel Veriler</span>
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-r-lg">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Kayıt formu aracılığıyla; kimlik bilgileriniz (ad, soyad, T.C.
                  kimlik no), iletişim bilgileriniz (telefon, e-posta), hesap
                  bilgileriniz (parola), eğitim ve çalışma durumunuz, mezuniyet
                  bilgileriniz ve belge yüklemeleriniz tarafımızca
                  işlenmektedir.
                </p>
              </div>
            </div>

            {/* İşleme Amaçları */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center flex-wrap">
                <i className="bi bi-target text-primary mr-2 sm:mr-3"></i>
                <span>İşleme Amaçları</span>
              </h2>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 sm:p-6 rounded-r-lg">
                <ul className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
                  <li className="flex items-start">
                    <i className="bi bi-check-circle text-green-600 mr-2 mt-1 flex-shrink-0"></i>
                    Mezunlar ve öğrenciler arasında iletişim sağlamak,
                  </li>
                  <li className="flex items-start">
                    <i className="bi bi-check-circle text-green-600 mr-2 mt-1 flex-shrink-0"></i>
                    İş ve staj ilanlarını paylaşmak,
                  </li>
                  <li className="flex items-start">
                    <i className="bi bi-check-circle text-green-600 mr-2 mt-1 flex-shrink-0"></i>
                    Kariyer etkinlikleri ve duyurularını yürütmek,
                  </li>
                  <li className="flex items-start">
                    <i className="bi bi-check-circle text-green-600 mr-2 mt-1 flex-shrink-0"></i>
                    Üyelik doğrulaması ve platform güvenliğini sağlamak.
                  </li>
                </ul>
              </div>
            </div>

            {/* Saklama Süresi */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center flex-wrap">
                <i className="bi bi-clock text-primary mr-2 sm:mr-3"></i>
                <span>Saklama Süresi</span>
              </h2>
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 sm:p-6 rounded-r-lg">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Verileriniz, üyeliğiniz devam ettiği sürece saklanacak;
                  üyeliğin sona ermesi halinde yasal yükümlülükler dışında
                  silinecek veya anonim hale getirilecektir.
                </p>
              </div>
            </div>

            {/* Veri Aktarımı */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center flex-wrap">
                <i className="bi bi-shield-check text-primary mr-2 sm:mr-3"></i>
                <span>Veri Aktarımı</span>
              </h2>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 sm:p-6 rounded-r-lg">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Kişisel verileriniz, yalnızca yasal zorunluluk halinde yetkili
                  kurumlarla paylaşılacak, bunun dışında üçüncü kişilerle
                  paylaşılmayacaktır.
                </p>
              </div>
            </div>

            {/* Haklarınız */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center flex-wrap">
                <i className="bi bi-person-gear text-primary mr-2 sm:mr-3"></i>
                <span>Haklarınız</span>
              </h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 sm:p-6 rounded-r-lg">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                  KVKK'nın 11. maddesi kapsamında; verilerinize erişme,
                  düzeltilmesini veya silinmesini isteme, işlenme amacını
                  öğrenme gibi haklara sahipsiniz.
                </p>
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-red-200">
                  <p className="text-gray-700 text-sm sm:text-base font-medium">
                    Bu haklarınızı kullanmak için bizimle{" "}
                    <a
                      href="mailto:istunceng@gmail.com"
                      className="text-primary hover:text-red-700 font-semibold underline transition-colors duration-200 break-all sm:break-normal"
                    >
                      istunceng@gmail.com
                    </a>{" "}
                    üzerinden iletişime geçebilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="bg-gradient-to-r from-primary to-red-600 text-white rounded-xl p-4 sm:p-6 md:p-8 text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                <i className="bi bi-envelope-heart mr-2"></i>
                Sorularınız için
              </h3>
              <p className="text-sm sm:text-base md:text-lg mb-4 px-2">
                KVKK ile ilgili herhangi bir sorunuz varsa, bizimle iletişime
                geçmekten çekinmeyin.
              </p>
              <a
                href="mailto:istunceng@gmail.com"
                className="inline-flex items-center bg-white text-primary px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base break-all sm:break-normal"
              >
                <i className="bi bi-envelope mr-1 sm:mr-2 flex-shrink-0"></i>
                <span className="truncate sm:whitespace-normal">
                  istunceng@gmail.com
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Son Güncelleme */}
        <div className="text-center mt-6 sm:mt-8 px-4">
          <p className="text-gray-500 text-xs sm:text-sm">
            Son güncelleme:{" "}
            {new Date().toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KVKKPage;
