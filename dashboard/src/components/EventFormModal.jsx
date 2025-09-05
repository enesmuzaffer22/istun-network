import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import ImageCropper from "./ImageCropper";
import API from "../utils/axios";

function EventFormModal({ isOpen, onClose, onSave, eventItem }) {
  const isEditing = Boolean(eventItem);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    event_date: "",
    category: "",
    location: "",
    time: "",
    organizer: "",
    registration_required: false,
    registration_deadline: "",
    registration_link: "",
    has_registration_link: false,
    tags: [],
  });

  const [image, setImage] = useState(null);
  const [isImageCropperOpen, setIsImageCropperOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const categories = [
    "Kariyer",
    "Teknoloji",
    "Girişimcilik",
    "Network",
    "Kodlama",
    "Gelişim",
    "Fintech",
  ];

  useEffect(() => {
    if (isEditing) {
      // Etiketleri düzgün şekilde parse et
      let parsedTags = [];
      if (eventItem.tags && Array.isArray(eventItem.tags)) {
        parsedTags = eventItem.tags
          .map((tag) => {
            // Eğer tag bir string ise ve JSON formatında ise parse et
            if (typeof tag === "string") {
              // JSON array formatında mı kontrol et
              if (tag.startsWith("[") && tag.endsWith("]")) {
                try {
                  const parsed = JSON.parse(tag);
                  return Array.isArray(parsed) ? parsed : [tag];
                } catch (e) {
                  return [tag];
                }
              }
              // Virgülle ayrılmış string ise split et
              else if (tag.includes(",")) {
                return tag
                  .split(",")
                  .map((item) => item.trim())
                  .filter((item) => item);
              }
              // Tek string ise direkt döndür
              else {
                return [tag.trim()];
              }
            }
            return tag;
          })
          .flat()
          .filter((tag) => tag && tag.trim()); // Boş değerleri filtrele
      }

      setFormData({
        title: eventItem.title || "",
        content: eventItem.content || "",
        description: eventItem.description || "",
        event_date: eventItem.event_date
          ? eventItem.event_date.split("T")[0]
          : "",
        category: eventItem.category || "",
        location: eventItem.location || "",
        time: eventItem.time || "",
        organizer: eventItem.organizer || "",
        registration_required: eventItem.registration_required || false,
        registration_deadline: eventItem.registration_deadline
          ? eventItem.registration_deadline.split("T")[0]
          : "",
        registration_link: eventItem.registration_link || "",
        has_registration_link: eventItem.has_registration_link || false,
        tags: parsedTags,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        description: "",
        event_date: "",
        category: "",
        location: "",
        time: "",
        organizer: "",
        registration_required: false,
        registration_deadline: "",
        registration_link: "",
        has_registration_link: false,
        tags: [],
      });
      setImage(null);
      setTagInput("");
    }
  }, [eventItem, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value || "" }));
  };

  const uploadImage = async (imageBlob) => {
    try {
      const formData = new FormData();
      formData.append("image", imageBlob, "image.jpg");

      const response = await API.post("/events/upload-image", formData, {
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
    setImage(croppedImageBlob);

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

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Düzenleme modunda JSON olarak gönder
      const eventData = {
        ...formData,
        event_date: formData.event_date
          ? new Date(formData.event_date).toISOString()
          : "",
        registration_deadline: formData.registration_deadline
          ? new Date(formData.registration_deadline).toISOString()
          : "",
        created_at: new Date().toISOString(),
      };
      onSave(eventData, eventItem.id);
    } else {
      // Yeni oluşturma modunda FormData olarak gönder
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("description", formData.description);
      formDataToSend.append(
        "event_date",
        formData.event_date ? new Date(formData.event_date).toISOString() : ""
      );
      formDataToSend.append("created_at", new Date().toISOString());

      if (formData.category) {
        formDataToSend.append("category", formData.category);
      }
      if (formData.location) {
        formDataToSend.append("location", formData.location);
      }
      if (formData.time) {
        formDataToSend.append("time", formData.time);
      }
      if (formData.organizer) {
        formDataToSend.append("organizer", formData.organizer);
      }
      if (formData.registration_deadline) {
        formDataToSend.append(
          "registration_deadline",
          new Date(formData.registration_deadline).toISOString()
        );
      }
      if (formData.registration_link) {
        formDataToSend.append("registration_link", formData.registration_link);
      }

      formDataToSend.append(
        "registration_required",
        formData.registration_required
      );
      formDataToSend.append(
        "has_registration_link",
        formData.has_registration_link
      );

      // Tags array'i JSON string olarak gönder
      if (formData.tags.length > 0) {
        formDataToSend.append("tags", JSON.stringify(formData.tags));
      }

      if (image) {
        formDataToSend.append("image", image, "image.jpg");
      }

      onSave(formDataToSend, null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-red-600">
            {isEditing ? "Etkinliği Düzenle" : "Yeni Etkinlik Ekle"}
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
                    htmlFor="description"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Açıklama *
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg h-20"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="event_date"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Etkinlik Tarihi *
                    </label>
                    <input
                      type="date"
                      name="event_date"
                      id="event_date"
                      value={formData.event_date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="time"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Saat
                    </label>
                    <input
                      type="time"
                      name="time"
                      id="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Konum
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Örn: B1012, Konferans Salonu"
                  />
                </div>

                <div>
                  <label
                    htmlFor="organizer"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Organizatör
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    id="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* Kayıt Bilgileri */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Kayıt Bilgileri
                  </h3>

                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      name="registration_required"
                      id="registration_required"
                      checked={formData.registration_required}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="registration_required"
                      className="text-gray-700"
                    >
                      Kayıt Gerekli
                    </label>
                  </div>

                  {formData.registration_required && (
                    <>
                      <div className="mb-3">
                        <label
                          htmlFor="registration_deadline"
                          className="block text-gray-700 font-semibold mb-2"
                        >
                          Kayıt Son Tarihi
                        </label>
                        <input
                          type="date"
                          name="registration_deadline"
                          id="registration_deadline"
                          value={formData.registration_deadline}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>

                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          name="has_registration_link"
                          id="has_registration_link"
                          checked={formData.has_registration_link}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <label
                          htmlFor="has_registration_link"
                          className="text-gray-700"
                        >
                          Kayıt Linki Var
                        </label>
                      </div>

                      {formData.has_registration_link && (
                        <div>
                          <label
                            htmlFor="registration_link"
                            className="block text-gray-700 font-semibold mb-2"
                          >
                            Kayıt Linki
                          </label>
                          <input
                            type="url"
                            name="registration_link"
                            id="registration_link"
                            value={formData.registration_link}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="https://..."
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Etiketler
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg"
                      placeholder="Etiket ekle..."
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Ekle
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Etkinlik Resmi (4:5 oranı)
                  </label>

                  {/* Mevcut resim gösterimi */}
                  {eventItem?.image_url && (
                    <div className="mb-3">
                      <img
                        src={eventItem.image_url}
                        alt="Mevcut resim"
                        className="h-20 w-16 rounded-lg border object-cover"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Mevcut etkinlik resmi
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
                          : "bg-red-600 hover:bg-red-700"
                      } text-white`}
                    >
                      {uploadingImage
                        ? "Yükleniyor..."
                        : image || eventItem?.image_url
                        ? "Resmi Değiştir"
                        : "Resim Seç"}
                    </button>

                    {uploadingImage && (
                      <span className="text-sm text-red-600">
                        <i className="bi bi-arrow-clockwise animate-spin mr-1"></i>
                        Yükleniyor...
                      </span>
                    )}

                    {image && !uploadingImage && (
                      <span className="text-sm text-green-600">
                        ✓ {isEditing ? "Resim güncellendi" : "Resim seçildi"}
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
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
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
        aspectRatio={4 / 5}
        title="Etkinlik Resmi Kırp (4:5)"
      />
    </>
  );
}

export default EventFormModal;
