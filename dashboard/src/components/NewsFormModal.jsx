// dashboard/src/components/NewsFormModal.jsx

import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import ImageCropper from "./ImageCropper";
import API from "../utils/axios";

function NewsFormModal({ isOpen, onClose, onSave, newsItem }) {
  const isEditing = Boolean(newsItem);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    banner_img_url: "",
    thumbnail_img_url: "",
  });

  const [bannerImage, setBannerImage] = useState(null);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [isBannerCropperOpen, setIsBannerCropperOpen] = useState(false);
  const [isThumbnailCropperOpen, setIsThumbnailCropperOpen] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const categories = [
    "Duyurular",
    "Etkinlikler",
    "Projeler ve Girişimler",
    "Kariyer Başarıları",
    "Akademik Başarılar",
    "Üniversite",
    "Sektör Haberleri",
    "İş Birlikleri",
  ];

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: newsItem.title || "",
        content: newsItem.content || "",
        category: newsItem.category || "",
        banner_img_url: newsItem.banner_img_url || "",
        thumbnail_img_url: newsItem.thumbnail_img_url || "",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        category: "",
        banner_img_url: "",
        thumbnail_img_url: "",
      });
      setBannerImage(null);
      setThumbnailImage(null);
    }
  }, [newsItem, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value || "" }));
  };

  const uploadImage = async (imageBlob) => {
    try {
      const formData = new FormData();
      formData.append("image", imageBlob, "image.jpg");

      const response = await API.post("/news/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.url; // Backend'den dönen resim URL'si
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  const handleBannerCropComplete = async (croppedImageBlob) => {
    setBannerImage(croppedImageBlob);

    // Düzenleme modundaysa resmi hemen yükle
    if (isEditing) {
      setUploadingBanner(true);
      try {
        const imageUrl = await uploadImage(croppedImageBlob);
        setFormData((prev) => ({ ...prev, banner_img_url: imageUrl }));
      } catch (error) {
        console.error("Banner image upload failed:", error);
        alert("Banner resmi yüklenirken hata oluştu.");
      } finally {
        setUploadingBanner(false);
      }
    }
  };

  const handleThumbnailCropComplete = async (croppedImageBlob) => {
    setThumbnailImage(croppedImageBlob);

    // Düzenleme modundaysa resmi hemen yükle
    if (isEditing) {
      setUploadingThumbnail(true);
      try {
        const imageUrl = await uploadImage(croppedImageBlob);
        setFormData((prev) => ({ ...prev, thumbnail_img_url: imageUrl }));
      } catch (error) {
        console.error("Thumbnail image upload failed:", error);
        alert("Thumbnail resmi yüklenirken hata oluştu.");
      } finally {
        setUploadingThumbnail(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Düzenleme modunda JSON olarak gönder
      onSave(formData, newsItem.id);
    } else {
      // Yeni oluşturma modunda FormData olarak gönder
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("created_at", new Date().toISOString());

      if (formData.category) {
        formDataToSend.append("category", formData.category);
      }

      if (bannerImage) {
        formDataToSend.append("banner_img", bannerImage, "banner.jpg");
      }

      if (thumbnailImage) {
        formDataToSend.append("thumbnail_img", thumbnailImage, "thumbnail.jpg");
      }

      onSave(formDataToSend, null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">
            {isEditing ? "Haberi Düzenle" : "Yeni Haber Ekle"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sol Kolon */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Başlık *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Kategori
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Banner Image */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Banner Resmi (1920:640 oranı)
                  </label>

                  {/* Mevcut banner resmi gösterimi */}
                  {formData.banner_img_url && (
                    <div className="mb-3">
                      <img
                        src={formData.banner_img_url}
                        alt="Mevcut banner"
                        className="h-20 w-auto rounded-lg border object-cover"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Mevcut banner resmi
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsBannerCropperOpen(true)}
                      disabled={uploadingBanner}
                      className={`px-4 py-2 rounded-lg ${
                        uploadingBanner
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-primary hover:bg-primary/70"
                      } text-white`}
                    >
                      {uploadingBanner
                        ? "Yükleniyor..."
                        : bannerImage || formData.banner_img_url
                        ? "Resmi Değiştir"
                        : "Resim Seç"}
                    </button>

                    {uploadingBanner && (
                      <span className="text-sm text-blue-600">
                        <i className="bi bi-arrow-clockwise animate-spin mr-1"></i>
                        Yükleniyor...
                      </span>
                    )}

                    {bannerImage && !uploadingBanner && (
                      <span className="text-sm text-green-600">
                        ✓{" "}
                        {isEditing
                          ? "Banner resmi güncellendi"
                          : "Banner resmi seçildi"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnail Image */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Thumbnail Resmi (1:1 oranı)
                  </label>

                  {/* Mevcut thumbnail resmi gösterimi */}
                  {formData.thumbnail_img_url && (
                    <div className="mb-3">
                      <img
                        src={formData.thumbnail_img_url}
                        alt="Mevcut thumbnail"
                        className="h-16 w-16 rounded-lg border object-cover"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Mevcut thumbnail resmi
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsThumbnailCropperOpen(true)}
                      disabled={uploadingThumbnail}
                      className={`px-4 py-2 rounded-lg ${
                        uploadingThumbnail
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-primary hover:bg-primary/70"
                      } text-white`}
                    >
                      {uploadingThumbnail
                        ? "Yükleniyor..."
                        : thumbnailImage || formData.thumbnail_img_url
                        ? "Resmi Değiştir"
                        : "Resim Seç"}
                    </button>

                    {uploadingThumbnail && (
                      <span className="text-sm text-blue-600">
                        <i className="bi bi-arrow-clockwise animate-spin mr-1"></i>
                        Yükleniyor...
                      </span>
                    )}

                    {thumbnailImage && !uploadingThumbnail && (
                      <span className="text-sm text-green-600">
                        ✓{" "}
                        {isEditing
                          ? "Thumbnail resmi güncellendi"
                          : "Thumbnail resmi seçildi"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sağ Kolon - İçerik */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  İçerik (Markdown) *
                </label>
                <div className="border rounded-lg overflow-hidden">
                  <MDEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    preview="edit"
                    height={400}
                    data-color-mode="light"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg"
              >
                {isEditing ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ImageCropper
        isOpen={isBannerCropperOpen}
        onClose={() => setIsBannerCropperOpen(false)}
        onCropComplete={handleBannerCropComplete}
        aspectRatio={1920 / 640}
        title="Banner Resmi Kırp (1920:640)"
      />

      <ImageCropper
        isOpen={isThumbnailCropperOpen}
        onClose={() => setIsThumbnailCropperOpen(false)}
        onCropComplete={handleThumbnailCropComplete}
        aspectRatio={1}
        title="Thumbnail Resmi Kırp (1:1)"
      />
    </>
  );
}

export default NewsFormModal;
