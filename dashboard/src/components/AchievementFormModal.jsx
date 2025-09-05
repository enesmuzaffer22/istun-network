import React, { useState, useEffect } from "react";

const AchievementFormModal = ({ isOpen, onClose, onSave, achievement }) => {
  const [formData, setFormData] = useState({
    title: "",
    given_from: "",
    year: "",
    news_link: "",
    has_link: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Modal açıldığında form verilerini doldur
  useEffect(() => {
    if (achievement) {
      setFormData({
        title: achievement.title || "",
        given_from: achievement.given_from || "",
        year: achievement.year || "",
        news_link: achievement.news_link || "",
        has_link: achievement.has_link || false,
      });
    } else {
      setFormData({
        title: "",
        given_from: "",
        year: "",
        news_link: "",
        has_link: false,
      });
    }
    setErrors({});
  }, [achievement, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Hata mesajını temizle
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Başlık gereklidir";
    }

    if (!formData.given_from.trim()) {
      newErrors.given_from = "Veren kurum gereklidir";
    }

    if (!formData.year.trim()) {
      newErrors.year = "Yıl gereklidir";
    }

    if (formData.has_link && !formData.news_link.trim()) {
      newErrors.news_link = "Haber linki gereklidir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData, achievement?.id);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {achievement ? "Başarıyı Düzenle" : "Yeni Başarı Ekle"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="bi bi-x-lg text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Başarı başlığı"
                disabled={loading}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Veren Kurum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Veren Kurum *
              </label>
              <input
                type="text"
                name="given_from"
                value={formData.given_from}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.given_from ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ödülü veren kurum"
                disabled={loading}
              />
              {errors.given_from && (
                <p className="text-red-500 text-xs mt-1">{errors.given_from}</p>
              )}
            </div>

            {/* Yıl */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yıl *
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.year ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="2024"
                disabled={loading}
              />
              {errors.year && (
                <p className="text-red-500 text-xs mt-1">{errors.year}</p>
              )}
            </div>

            {/* Haber Linki Var mı */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="has_link"
                  checked={formData.has_link}
                  onChange={handleInputChange}
                  className="mr-2"
                  disabled={loading}
                />
                <span className="text-sm font-medium text-gray-700">
                  Haber linki var
                </span>
              </label>
            </div>

            {/* Haber Linki */}
            {formData.has_link && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Haber Linki *
                </label>
                <input
                  type="url"
                  name="news_link"
                  value={formData.news_link}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.news_link ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com/news"
                  disabled={loading}
                />
                {errors.news_link && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.news_link}
                  </p>
                )}
              </div>
            )}

            {/* Butonlar */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
                disabled={loading}
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={loading}
              >
                {loading && (
                  <i className="bi bi-arrow-clockwise animate-spin mr-1"></i>
                )}
                {achievement ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AchievementFormModal;
