import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const navPrimaryButtonStyles = "bg-primary text-white px-6 py-2 rounded-full";
const navSecondaryButtonStyles =
  "bg-white text-primary px-6 py-2 rounded-full border border-primary";
const mobileNavButtonStyles =
  "bg-transparent text-white border border-white px-6 py-3 rounded-md hover:bg-white hover:text-primary transition-colors";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  // Tooltip için state
  const [showTooltip, setShowTooltip] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive
      ? "text-primary font-bold transition-colors"
      : "text-gray-500 hover:text-primary transition-colors";
  };

  const getMobileNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive
      ? "text-white font-bold text-lg transition-colors"
      : "text-white text-lg font-medium hover:text-gray-200 transition-colors";
  };

  return (
    <>
      <div className="border-b border-gray-200 px-4 2xl:px-[120px] py-5 flex justify-between items-center relative">
        <div className="logo">
          <span className="md:text-2xl font-bold text-xl text-primary">
            ISTUNetwork
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className={getNavLinkClass("/")}>
            Ana Sayfa
          </Link>
          <Link to="/haberler" className={getNavLinkClass("/haberler")}>
            Haberler
          </Link>
          {/* İş-Staj İlanları */}
          <div className="relative">
            {!isAuthenticated ? (
              <span
                className={getNavLinkClass("/kariyer") + " cursor-not-allowed opacity-50"}
                onMouseEnter={() => setShowTooltip("kariyer")}
                onMouseLeave={() => setShowTooltip(null)}
              >
                İş-Staj İlanları
              </span>
            ) : (
              <Link to="/kariyer" className={getNavLinkClass("/kariyer")}>İş-Staj İlanları</Link>
            )}
            {/* Tooltip */}
            {showTooltip === "kariyer" && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow z-10 whitespace-nowrap">
                Giriş yapmalısınız
              </div>
            )}
          </div>
          {/* Yol Haritaları */}
          <div className="relative">
            {!isAuthenticated ? (
              <span
                className={getNavLinkClass("/yol-haritalari") + " cursor-not-allowed opacity-50"}
                onMouseEnter={() => setShowTooltip("yol-haritalari")}
                onMouseLeave={() => setShowTooltip(null)}
              >
                Yol Haritaları
              </span>
            ) : (
              <Link to="/yol-haritalari" className={getNavLinkClass("/yol-haritalari")}>Yol Haritaları</Link>
            )}
            {/* Tooltip */}
            {showTooltip === "yol-haritalari" && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow z-10 whitespace-nowrap">
                Giriş yapmalısınız
              </div>
            )}
          </div>
          {/* Forumlar */}
          <div className="relative">
            <span
              className={getNavLinkClass("/forumlar") + " cursor-not-allowed opacity-50"}
              onMouseEnter={() => setShowTooltip("forumlar")}
              onMouseLeave={() => setShowTooltip(null)}
            >
              Forumlar
            </span>
            {/* Tooltip */}
            {showTooltip === "forumlar" && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow z-10 whitespace-nowrap">
                Şu an geliştirilme aşamasında, çok yakında sizlerle
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/giris-yap" className={navPrimaryButtonStyles}>
                  Giriş Yap
                </Link>
                <Link to="/kayit-ol" className={navSecondaryButtonStyles}>
                  Kayıt Ol
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className={navPrimaryButtonStyles}>
                Çıkış Yap
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden flex flex-col gap-1 p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-primary z-50 lg:hidden">
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <div className="logo">
                <span className="text-2xl font-bold text-white">
                  ISTUNetwork
                </span>
              </div>
              <button
                className="flex flex-col gap-1 p-2"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <span className="block w-6 h-0.5 bg-white rotate-45 translate-y-1.5"></span>
                <span className="block w-6 h-0.5 bg-white opacity-0"></span>
                <span className="block w-6 h-0.5 bg-white -rotate-45 -translate-y-1.5"></span>
              </button>
            </div>

            {/* Navigation Links - Centered */}
            <nav className="flex-1 flex flex-col justify-center items-center gap-8 px-6">
              <Link
                to="/"
                className={getMobileNavLinkClass("/")}
                onClick={toggleMenu}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/haberler"
                className={getMobileNavLinkClass("/haberler")}
                onClick={toggleMenu}
              >
                Haberler
              </Link>
              {/* İş-Staj İlanları */}
              <div className="relative w-full flex justify-center">
                {!isAuthenticated ? (
                  <span
                    className={getMobileNavLinkClass("/kariyer") + " cursor-not-allowed opacity-50"}
                    onMouseEnter={() => setShowTooltip("kariyer-mobil")}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    İş-Staj İlanları
                  </span>
                ) : (
                  <Link to="/kariyer" className={getMobileNavLinkClass("/kariyer")} onClick={toggleMenu}>İş-Staj İlanları</Link>
                )}
                {/* Tooltip */}
                {showTooltip === "kariyer-mobil" && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow z-10 whitespace-nowrap">
                    Giriş yapmalısınız
                  </div>
                )}
              </div>
              {/* Yol Haritaları */}
              <div className="relative w-full flex justify-center">
                {!isAuthenticated ? (
                  <span
                    className={getMobileNavLinkClass("/yol-haritalari") + " cursor-not-allowed opacity-50"}
                    onMouseEnter={() => setShowTooltip("yol-haritalari-mobil")}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    Yol Haritaları
                  </span>
                ) : (
                  <Link to="/yol-haritalari" className={getMobileNavLinkClass("/yol-haritalari")} onClick={toggleMenu}>Yol Haritaları</Link>
                )}
                {/* Tooltip */}
                {showTooltip === "yol-haritalari-mobil" && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow z-10 whitespace-nowrap">
                    Giriş yapmalısınız
                  </div>
                )}
              </div>
              {/* Forumlar */}
              <div className="relative w-full flex justify-center">
                <span
                  className={getMobileNavLinkClass("/forumlar") + " cursor-not-allowed opacity-50"}
                  onMouseEnter={() => setShowTooltip("forumlar-mobil")}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  Forumlar
                </span>
                {/* Tooltip */}
                {showTooltip === "forumlar-mobil" && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow z-10 whitespace-nowrap">
                    Şu an geliştirilme aşamasında, çok yakında sizlerle
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/giris-yap"
                      className={`${mobileNavButtonStyles} text-center`}
                      onClick={toggleMenu}
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      to="/kayit-ol"
                      className={`${mobileNavButtonStyles} text-center`}
                      onClick={toggleMenu}
                    >
                      Kayıt Ol
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className={`${mobileNavButtonStyles} text-center`}
                  >
                    Çıkış Yap
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
