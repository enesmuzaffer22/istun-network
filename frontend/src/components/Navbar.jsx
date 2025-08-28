import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const navPrimaryButtonStyles = "bg-primary text-white px-6 py-2 rounded-full";
const navSecondaryButtonStyles =
  "bg-white text-primary px-6 py-2 rounded-full border border-primary";
const mobileNavButtonStyles =
  "bg-transparent text-white border border-white px-6 py-3 rounded-md hover:bg-white hover:text-primary transition-colors";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Dropdown delay için timeout ref
  const dropdownTimeoutRef = useRef(null);
  const newsDropdownTimeoutRef = useRef(null);

  // Landing page tespiti
  const isLandingPage = location.pathname === "/";

  // Tooltip için state
  const [showTooltip, setShowTooltip] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Dropdown hover handlers
  const handleDropdownEnter = () => {
    // Clear any existing timeout
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsAboutDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    // Set timeout to close dropdown after 500ms
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsAboutDropdownOpen(false);
    }, 100);
  };

  // News dropdown hover handlers
  const handleNewsDropdownEnter = () => {
    if (newsDropdownTimeoutRef.current) {
      clearTimeout(newsDropdownTimeoutRef.current);
      newsDropdownTimeoutRef.current = null;
    }
    setIsNewsDropdownOpen(true);
  };

  const handleNewsDropdownLeave = () => {
    newsDropdownTimeoutRef.current = setTimeout(() => {
      setIsNewsDropdownOpen(false);
    }, 100);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      if (newsDropdownTimeoutRef.current) {
        clearTimeout(newsDropdownTimeoutRef.current);
      }
    };
  }, []);

  // Scroll event listener - sadece landing page'de
  useEffect(() => {
    if (!isLandingPage) {
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage]);

  const getNavLinkClass = (path) => {
    const isActive =
      location.pathname === path ||
      (path === "/hakkimizda" &&
        [
          "/hakkimizda",
          "/sosyal-etki",
          "/birlikte-iz-birak",
          "/basarilarimiz",
        ].includes(location.pathname)) ||
      (path === "/haberler" &&
        ["/haberler", "/duyurular", "/etkinlikler"].includes(
          location.pathname
        ));

    // Landing page'de scroll durumuna göre, diğer sayfalarda her zaman normal renkler
    const textColor = isLandingPage
      ? isScrolled
        ? "text-primary"
        : "text-white"
      : "text-primary";
    const textColorInactive = isLandingPage
      ? isScrolled
        ? "text-gray-500 hover:text-primary"
        : "text-white/80 hover:text-white"
      : "text-gray-500 hover:text-primary";
    const underlineColor = isLandingPage
      ? isScrolled
        ? "after:bg-primary"
        : "after:bg-white"
      : "after:bg-primary";

    return isActive
      ? `${textColor} font-bold transition-colors relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 ${underlineColor} after:transition-all after:duration-300`
      : `${textColorInactive} transition-colors relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-0.5 ${underlineColor} after:transition-all after:duration-300 hover:after:w-full`;
  };

  const getMobileNavLinkClass = (path) => {
    const isActive =
      location.pathname === path ||
      (path === "/hakkimizda" &&
        [
          "/hakkimizda",
          "/sosyal-etki",
          "/birlikte-iz-birak",
          "/basarilarimiz",
        ].includes(location.pathname)) ||
      (path === "/haberler" &&
        ["/haberler", "/duyurular", "/etkinlikler"].includes(
          location.pathname
        ));
    return isActive
      ? "text-white font-bold text-lg transition-colors"
      : "text-white text-lg font-medium hover:text-gray-200 transition-colors";
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 px-4 2xl:px-[120px] py-5 flex justify-between items-center transition-all duration-300 ${
          isLandingPage
            ? isScrolled
              ? "bg-white border-b border-gray-200 shadow-sm"
              : "bg-transparent border-b border-white/20"
            : "bg-white border-b border-gray-200 shadow-sm"
        }`}
      >
        <div className="logo">
          <span
            className={`md:text-2xl font-bold text-xl transition-colors duration-300 ${
              isLandingPage
                ? isScrolled
                  ? "text-primary"
                  : "text-white"
                : "text-primary"
            }`}
          >
            ISTUNetwork
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className={getNavLinkClass("/")}>
            Ana Sayfa
          </Link>
          {/* Haberler Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleNewsDropdownEnter}
            onMouseLeave={handleNewsDropdownLeave}
          >
            <div
              className={`${getNavLinkClass(
                "/haberler"
              )} cursor-pointer flex items-center gap-1`}
            >
              Haberler
              <i
                className={`bi bi-chevron-down text-sm transition-transform ${
                  isNewsDropdownOpen ? "rotate-180" : ""
                }`}
              ></i>
            </div>
            {/* Dropdown Menu */}
            {isNewsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                <Link
                  to="/haberler"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  Haberler
                </Link>
                <Link
                  to="/duyurular"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  Duyurular
                </Link>
                <Link
                  to="/etkinlikler"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  Etkinlikler
                </Link>
              </div>
            )}
          </div>
          {/* Hakkımızda Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div
              className={`${getNavLinkClass(
                "/hakkimizda"
              )} cursor-pointer flex items-center gap-1`}
            >
              Hakkımızda
              <i
                className={`bi bi-chevron-down text-sm transition-transform ${
                  isAboutDropdownOpen ? "rotate-180" : ""
                }`}
              ></i>
            </div>
            {/* Dropdown Menu */}
            {isAboutDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                <Link
                  to="/hakkimizda"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  Hakkımızda
                </Link>
                <Link
                  to="/sosyal-etki"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  Sosyal Etki
                </Link>
                <Link
                  to="/birlikte-iz-birak"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  Birlikte İz Bırak
                </Link>
                <Link
                  to="/basarilarimiz"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  Başarılarımız
                </Link>
              </div>
            )}
          </div>
          {/* İş-Staj İlanları */}
          <div className="relative">
            {!isAuthenticated ? (
              <span
                className={
                  getNavLinkClass("/kariyer") + " cursor-not-allowed opacity-50"
                }
                onMouseEnter={() => setShowTooltip("kariyer")}
                onMouseLeave={() => setShowTooltip(null)}
              >
                İş-Staj İlanları
              </span>
            ) : (
              <Link to="/kariyer" className={getNavLinkClass("/kariyer")}>
                İş-Staj İlanları
              </Link>
            )}
            {/* Tooltip */}
            {showTooltip === "kariyer" && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow z-10 whitespace-nowrap">
                Giriş yapmalısınız
              </div>
            )}
          </div>
          {/* Kariyer Rotaları */}
          <div className="relative">
            {!isAuthenticated ? (
              <span
                className={
                  getNavLinkClass("/yol-haritalari") +
                  " cursor-not-allowed opacity-50"
                }
                onMouseEnter={() => setShowTooltip("yol-haritalari")}
                onMouseLeave={() => setShowTooltip(null)}
              >
                Kariyer Rotaları
              </span>
            ) : (
              <Link
                to="/yol-haritalari"
                className={getNavLinkClass("/yol-haritalari")}
              >
                Kariyer Rotaları
              </Link>
            )}
            {/* Tooltip */}
            {showTooltip === "yol-haritalari" && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow z-10 whitespace-nowrap">
                Giriş yapmalısınız
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
              <>
                {/* Profil Avatar/Butonu */}
                <Link
                  to="/profil"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user?.name || "Profil"}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${navPrimaryButtonStyles} cursor-pointer`}
                >
                  Çıkış Yap
                </button>
              </>
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
            className={`block w-6 h-0.5 transition-all duration-300 ${
              isLandingPage
                ? isScrolled
                  ? "bg-primary"
                  : "bg-white"
                : "bg-primary"
            } ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
          ></span>
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              isLandingPage
                ? isScrolled
                  ? "bg-primary"
                  : "bg-white"
                : "bg-primary"
            } ${isMenuOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              isLandingPage
                ? isScrolled
                  ? "bg-primary"
                  : "bg-white"
                : "bg-primary"
            } ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
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
              {/* Haberler Mobile Dropdown */}
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`${getMobileNavLinkClass(
                    "/haberler"
                  )} cursor-pointer flex items-center gap-2`}
                  onClick={() => setIsNewsDropdownOpen(!isNewsDropdownOpen)}
                >
                  Haberler
                  <i
                    className={`bi bi-chevron-down text-sm transition-transform ${
                      isNewsDropdownOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </div>
                {/* Mobile Dropdown Menu */}
                {isNewsDropdownOpen && (
                  <div className="flex flex-col gap-3 pl-4">
                    <Link
                      to="/haberler"
                      className="text-white/80 text-base hover:text-white transition-colors flex items-center gap-2"
                      onClick={toggleMenu}
                    >
                      Haberler
                    </Link>
                    <Link
                      to="/duyurular"
                      className="text-white/80 text-base hover:text-white transition-colors flex items-center gap-2"
                      onClick={toggleMenu}
                    >
                      Duyurular
                    </Link>
                    <Link
                      to="/etkinlikler"
                      className="text-white/80 text-base hover:text-white transition-colors flex items-center gap-2"
                      onClick={toggleMenu}
                    >
                      Etkinlikler
                    </Link>
                  </div>
                )}
              </div>
              {/* Hakkımızda Mobile Dropdown */}
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`${getMobileNavLinkClass(
                    "/hakkimizda"
                  )} cursor-pointer flex items-center gap-2`}
                  onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                >
                  Hakkımızda
                  <i
                    className={`bi bi-chevron-down text-sm transition-transform ${
                      isAboutDropdownOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </div>
                {/* Mobile Dropdown Menu */}
                {isAboutDropdownOpen && (
                  <div className="flex flex-col gap-3 pl-4">
                    <Link
                      to="/hakkimizda"
                      className="text-white/80 text-base hover:text-white transition-colors"
                      onClick={toggleMenu}
                    >
                      Hakkımızda
                    </Link>
                    <Link
                      to="/sosyal-etki"
                      className="text-white/80 text-base hover:text-white transition-colors"
                      onClick={toggleMenu}
                    >
                      Sosyal Etki
                    </Link>
                    <Link
                      to="/birlikte-iz-birak"
                      className="text-white/80 text-base hover:text-white transition-colors"
                      onClick={toggleMenu}
                    >
                      Birlikte İz Bırak
                    </Link>
                    <Link
                      to="/basarilarimiz"
                      className="text-white/80 text-base hover:text-white transition-colors"
                      onClick={toggleMenu}
                    >
                      Başarılarımız
                    </Link>
                  </div>
                )}
              </div>
              {/* İş-Staj İlanları */}
              <div className="relative w-full flex justify-center">
                {!isAuthenticated ? (
                  <span
                    className={
                      getMobileNavLinkClass("/kariyer") +
                      " cursor-not-allowed opacity-50"
                    }
                    onMouseEnter={() => setShowTooltip("kariyer-mobil")}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    İş-Staj İlanları
                  </span>
                ) : (
                  <Link
                    to="/kariyer"
                    className={getMobileNavLinkClass("/kariyer")}
                    onClick={toggleMenu}
                  >
                    İş-Staj İlanları
                  </Link>
                )}
                {/* Tooltip */}
                {showTooltip === "kariyer-mobil" && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow z-10 whitespace-nowrap">
                    Giriş yapmalısınız
                  </div>
                )}
              </div>
              {/* Kariyer Rotaları */}
              <div className="relative w-full flex justify-center">
                {!isAuthenticated ? (
                  <span
                    className={
                      getMobileNavLinkClass("/yol-haritalari") +
                      " cursor-not-allowed opacity-50"
                    }
                    onMouseEnter={() => setShowTooltip("yol-haritalari-mobil")}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    Kariyer Rotaları
                  </span>
                ) : (
                  <Link
                    to="/yol-haritalari"
                    className={getMobileNavLinkClass("/yol-haritalari")}
                    onClick={toggleMenu}
                  >
                    Kariyer Rotaları
                  </Link>
                )}
                {/* Tooltip */}
                {showTooltip === "yol-haritalari-mobil" && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow z-10 whitespace-nowrap">
                    Giriş yapmalısınız
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
                  <>
                    {/* Profil Butonu */}
                    <Link
                      to="/profil"
                      className="flex items-center justify-center gap-3 bg-white/10 text-white px-6 py-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                      onClick={toggleMenu}
                    >
                      <div className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center text-lg font-bold">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {user?.name && user?.surname
                            ? `${user.name} ${user.surname}`
                            : "Profilim"}
                        </span>
                        <span className="text-sm text-white/70">
                          Profili görüntüle
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className={`${mobileNavButtonStyles} text-center cursor-pointer`}
                    >
                      Çıkış Yap
                    </button>
                  </>
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
