import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Ana Footer İçeriği */}
      <div className="2xl:px-[120px] px-4 py-16">
        {/* Üst Kısım - Logo ve CTA */}
        <div className="flex flex-col md:flex-row justify-between mb-12 gap-8">
          {/* Logo ve Açıklama Grubu */}
          <div className="text-left">
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">ISTUNetwork</span>
            </div>
            <p className="text-white/80 text-lg max-w-md leading-relaxed">
              İstanbul Sağlık ve Teknoloji Üniversitesi öğrenci ve mezunları için kariyer, 
              eğitim ve networking platformu.
            </p>
          </div>

          {/* Sosyal Medya Grubu */}
          <div className="flex space-x-6 h-max">
            <a href="#" className="bg-white/10 hover:bg-white p-3 rounded-full transition-all duration-300 group">
              <i className="bi bi-linkedin text-xl text-white group-hover:text-primary"></i>
            </a>
            <a href="#" className="bg-white/10 hover:bg-white p-3 rounded-full transition-all duration-300 group">
              <i className="bi bi-twitter text-xl text-white group-hover:text-primary"></i>
            </a>
            <a href="#" className="bg-white/10 hover:bg-white p-3 rounded-full transition-all duration-300 group">
              <i className="bi bi-instagram text-xl text-white group-hover:text-primary"></i>
            </a>
            <a href="#" className="bg-white/10 hover:bg-white p-3 rounded-full transition-all duration-300 group">
              <i className="bi bi-github text-xl text-white group-hover:text-primary"></i>
            </a>
          </div>
        </div>

        {/* Orta Kısım - Linkler */}
        <div className="border-t border-white/20 pt-12 flex">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Hızlı Linkler */}
            <div className="text-left">
              <h3 className="text-xl font-bold mb-6 text-white">Hızlı Erişim</h3>
              <div className="space-y-3">
                <div>
                  <Link to="/" className="text-white/70 hover:text-white transition-colors duration-300 block py-1">
                    Ana Sayfa
                  </Link>
                </div>
                <div>
                  <Link to="/haberler" className="text-white/70 hover:text-white transition-colors duration-300 block py-1">
                    Haberler
                  </Link>
                </div>
                <div>
                  <Link to="/kariyer" className="text-white/70 hover:text-white transition-colors duration-300 block py-1">
                    İş-Staj İlanları
                  </Link>
                </div>
                <div>
                  <Link to="/yol-haritalari" className="text-white/70 hover:text-white transition-colors duration-300 block py-1">
                    Yol Haritaları
                  </Link>
                </div>
              </div>
            </div>

            {/* Kurumsal */}
            <div className="text-left">
              <h3 className="text-xl font-bold mb-6 text-white">Kurumsal</h3>
              <div className="space-y-3">
                <div>
                  <a href="#" className="text-white/70 hover:text-white transition-colors duration-300 block py-1">
                    Hakkımızda
                  </a>
                </div>
                <div>
                  <a href="#" className="text-white/70 hover:text-white transition-colors duration-300 block py-1">
                    İletişim
                  </a>
                </div>
                <div>
                  <a href="#" className="text-white/70 hover:text-white transition-colors duration-300 block py-1">
                    Gizlilik Politikası
                  </a>
                </div>
                <div>
                  <a href="#" className="text-white/70 hover:text-white transition-colors duration-300 block py-1">
                    Kullanım Şartları
                  </a>
                </div>
              </div>
            </div>

            {/* İletişim */}
            <div className="text-left">
              <h3 className="text-xl font-bold mb-6 text-white">Bize Ulaşın</h3>
              <div className="space-y-4">
                <div className="flex items-start justify-start">
                  <div className="bg-white/10 p-2 rounded-lg mr-4 flex-shrink-0">
                    <i className="bi bi-geo-alt text-white"></i>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Sütlüce Mah. İmrahor Cad. No: 82<br/>
                      Beyoğlu–İstanbul
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-start">
                  <div className="bg-white/10 p-2 rounded-lg mr-4">
                    <i className="bi bi-envelope text-white"></i>
                  </div>
                  <a href="mailto:info@istunetwork.com" className="text-white/70 hover:text-white transition-colors duration-300">
                    info@istunetwork.com
                  </a>
                </div>
                <div className="flex items-center justify-start">
                  <div className="bg-white/10 p-2 rounded-lg mr-4">
                    <i className="bi bi-phone text-white"></i>
                  </div>
                  <a href="tel:+904443788" className="text-white/70 hover:text-white transition-colors duration-300">
                    444 3 788
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Kısım - Telif Hakkı */}
      <div className="bg-black/20 border-t border-white/20">
        <div className="2xl:px-[120px] px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="text-white/60 text-sm mb-4 md:mb-0">
              © 2024 ISTUNetwork. Tüm hakları saklıdır.
            </div>
            <div className="text-white/60 text-sm">
              İstanbul Sağlık ve Teknoloji Üniversitesi ile bağlantılı bir öğrenci platformu
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
