import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import ImageCropper from "./ImageCropper";
import API from "../utils/axios";

function RoadmapFormModal({ isOpen, onClose, onSave, roadmapItem }) {
  const isEditing = Boolean(roadmapItem);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
  });

  const [roadmapImage, setRoadmapImage] = useState(null);
  const [isImageCropperOpen, setIsImageCropperOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: roadmapItem.title || "",
        content: roadmapItem.content || "",
        image_url: roadmapItem.image_url || "",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        image_url: "",
      });
      setRoadmapImage(null);
    }
  }, [roadmapItem, isEditing]);

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

  const handleImageCropComplete = async (croppedImageBlob) => {
    setRoadmapImage(croppedImageBlob);

    // Düzenleme modundaysa resmi hemen yükle
    if (isEditing) {
      setUploadingImage(true);
      try {
        const imageUrl = await uploadImage(croppedImageBlob);
        setFormData((prev) => ({ ...prev, image_url: imageUrl }));
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Resim yüklenirken hata oluştu.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Düzenleme modunda JSON olarak gönder
      onSave(formData, roadmapItem.id);
    } else {
      // Yeni oluşturma modunda FormData olarak gönder
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("created_at", new Date().toISOString());

      if (roadmapImage) {
        formDataToSend.append("image", roadmapImage, "roadmap.jpg");
      }

      onSave(formDataToSend, null);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">
            {isEditing ? "Yol Haritasını Düzenle" : "Yeni Yol Haritası Ekle"}
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

                {/* Roadmap Image */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Kapak Resmi (16:9 oranı)
                  </label>

                  {/* Mevcut resim gösterimi */}
                  {formData.image_url && (
                    <div className="mb-3">
                      <img
                        src={formData.image_url}
                        alt="Mevcut kapak resmi"
                        className="h-20 w-auto rounded-lg border object-cover"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Mevcut kapak resmi
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsImageCropperOpen(true)}
                      disabled={uploadingImage}
                      className={`px-4 py-2 rounded-lg ${
                        uploadingImage
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white`}
                    >
                      {uploadingImage
                        ? "Yükleniyor..."
                        : roadmapImage || formData.image_url
                        ? "Resmi Değiştir"
                        : "Resim Seç"}
                    </button>

                    {uploadingImage && (
                      <span className="text-sm text-blue-600">
                        <i className="bi bi-arrow-clockwise animate-spin mr-1"></i>
                        Yükleniyor...
                      </span>
                    )}

                    {roadmapImage && !uploadingImage && (
                      <span className="text-sm text-green-600">
                        ✓{" "}
                        {isEditing
                          ? "Kapak resmi güncellendi"
                          : "Kapak resmi seçildi"}
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
        isOpen={isImageCropperOpen}
        onClose={() => setIsImageCropperOpen(false)}
        onCropComplete={handleImageCropComplete}
        aspectRatio={16 / 9}
        title="Kapak Resmi Kırp (16:9)"
      />
    </>
  );
}

export default RoadmapFormModal;
