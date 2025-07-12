import React, { useState } from "react";
import { Link } from "react-router-dom";

const navLinkStyles = "text-gray-500 hover:text-primary transition-colors";
const navPrimaryButtonStyles = "bg-primary text-white px-6 py-2 rounded-full";
const navSecondaryButtonStyles =
  "bg-white text-primary px-6 py-2 rounded-full border border-primary";
const mobileNavLinkStyles =
  "text-white text-lg font-medium hover:text-gray-200 transition-colors";
const mobileNavButtonStyles =
  "bg-transparent text-white border border-white px-6 py-3 rounded-md hover:bg-white hover:text-primary transition-colors";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={navLinkStyles}>
            Haberler
          </Link>
          <Link to="/is-staj-ilanlari" className={navLinkStyles}>
            İş-Staj İlanları
          </Link>
          <Link to="/yol-haritalari" className={navLinkStyles}>
            Yol Haritaları
          </Link>
          <Link to="/forumlar" className={navLinkStyles}>
            Forumlar
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/giris-yap" className={navPrimaryButtonStyles}>
              Giriş Yap
            </Link>
            <Link to="/kayit-ol" className={navSecondaryButtonStyles}>
              Kayıt Ol
            </Link>
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col gap-1 p-2"
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
        <div className="fixed inset-0 bg-primary z-50 md:hidden">
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <div className="logo">
                <span className="text-2xl font-bold text-white">
                  ISTUN NETWORK
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
              <Link to="/" className={mobileNavLinkStyles} onClick={toggleMenu}>
                Haberler
              </Link>
              <Link
                to="/is-staj-ilanlari"
                className={mobileNavLinkStyles}
                onClick={toggleMenu}
              >
                İş-Staj İlanları
              </Link>
              <Link
                to="/yol-haritalari"
                className={mobileNavLinkStyles}
                onClick={toggleMenu}
              >
                Yol Haritaları
              </Link>
              <Link
                to="/forumlar"
                className={mobileNavLinkStyles}
                onClick={toggleMenu}
              >
                Forumlar
              </Link>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
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
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
