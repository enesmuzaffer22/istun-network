import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const AnnouncementFormModal = ({ isOpen, onClose, onSave, announcement }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    created_at: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Modal açıldığında form verilerini doldur
  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || "",
        content: announcement.content || "",
        created_at:
          announcement.created_at || new Date().toISOString().split("T")[0],
        category: announcement.category || "",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        created_at: new Date().toISOString().split("T")[0],
        category: "",
      });
    }
    setErrors({});
  }, [announcement, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hata mesajını temizle
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value || "" }));

    // Hata mesajını temizle
    if (errors.content) {
      setErrors((prev) => ({
        ...prev,
        content: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Başlık gereklidir";
    }

    if (!formData.content.trim()) {
      newErrors.content = "İçerik gereklidir";
    }

    if (!formData.created_at) {
      newErrors.created_at = "Oluşturma tarihi gereklidir";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Kategori gereklidir";
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
      // Tarih formatını ISO string'e çevir
      const submitData = {
        ...formData,
        created_at: new Date(formData.created_at).toISOString(),
      };

      await onSave(submitData, announcement?.id);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {announcement ? "Duyuruyu Düzenle" : "Yeni Duyuru Ekle"}
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
                placeholder="Duyuru başlığı"
                disabled={loading}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              >
                <option value="">Kategori seçin</option>
                <option value="Eğitim">Eğitim</option>
                <option value="Etkinlik">Etkinlik</option>
                <option value="Burs">Burs</option>
                <option value="Kayıt">Kayıt</option>
                <option value="Sınav">Sınav</option>
                <option value="Akademik">Akademik</option>
                <option value="İdari">İdari</option>
                <option value="Sosyal">Sosyal</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>

            {/* Oluşturma Tarihi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oluşturma Tarihi *
              </label>
              <input
                type="date"
                name="created_at"
                value={formData.created_at}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.created_at ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.created_at && (
                <p className="text-red-500 text-xs mt-1">{errors.created_at}</p>
              )}
            </div>

            {/* İçerik */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik *
              </label>
              <div
                className={`border rounded-lg overflow-hidden ${
                  errors.content ? "border-red-500" : "border-gray-300"
                }`}
              >
                <MDEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  preview="edit"
                  height={300}
                  data-color-mode="light"
                />
              </div>
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
            </div>

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
                {announcement ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementFormModal;
