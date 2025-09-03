import React, { useEffect, useState } from "react";
import { gsap } from "gsap";

const ImagePopup = ({ isOpen, onClose, images, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      // Popup açılma animasyonu
      gsap.fromTo(
        ".image-popup-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        ".image-popup-content",
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen, initialIndex]);

  const handleClose = () => {
    // Popup kapanma animasyonu
    gsap.to(".image-popup-overlay", {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: onClose,
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // Klavye kısayolları
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          handleClose();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="image-popup-overlay fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      {/* Kapatma butonu */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <i className="bi bi-x-lg text-3xl"></i>
      </button>

      {/* Ana içerik */}
      <div className="image-popup-content relative w-full max-h-[90vh] flex flex-col">
        {/* Resim */}
        <div
          className="relative flex-1 flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={images[currentIndex]?.img}
            alt={`Resim ${currentIndex + 1}`}
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
          />

          {/* Sol ok - md altı gizli */}
          <button
            onClick={goToPrevious}
            className="hidden md:block absolute left-4 md:left-16 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
          >
            <i className="bi bi-chevron-left text-2xl"></i>
          </button>

          {/* Sağ ok - md altı gizli */}
          <button
            onClick={goToNext}
            className="hidden md:block absolute right-4 md:right-16 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
          >
            <i className="bi bi-chevron-right text-2xl"></i>
          </button>
        </div>

        {/* Alt bilgi */}
        <div className="mt-4 text-center text-white">
          <div className="text-lg font-medium mb-3">
            Resim {currentIndex + 1} / {images.length}
          </div>

          {/* Küçük resimler - flex wrap, satır sayısı dinamik */}
          <div className="px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-primary scale-110"
                      : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <img
                    src={image.img}
                    alt={`Önizleme ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
