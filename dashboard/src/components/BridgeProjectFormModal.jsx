import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import ImageCropper from "./ImageCropper";
import API from "../utils/axios";

function BridgeProjectFormModal({ isOpen, onClose, onSave, projectItem }) {
  const isEditing = Boolean(projectItem);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    event_date: "",
    location: "",
    number_of_participants: "",
    project_impact: "",
    crew: [],
    achievements: [],
  });

  const [image, setImage] = useState(null);
  const [isImageCropperOpen, setIsImageCropperOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [crewInput, setCrewInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");

  useEffect(() => {
    if (isEditing) {
      // Crew ve achievements array'lerini düzgün şekilde parse et
      let parsedCrew = [];
      let parsedAchievements = [];

      if (projectItem.crew && Array.isArray(projectItem.crew)) {
        parsedCrew = projectItem.crew
          .map((member) => {
            // Eğer string ise ve JSON formatında ise parse et
            if (typeof member === "string") {
              // JSON array formatında mı kontrol et
              if (member.startsWith("[") && member.endsWith("]")) {
                try {
                  const parsed = JSON.parse(member);
                  return Array.isArray(parsed) ? parsed : [member];
                } catch (e) {
                  return [member];
                }
              }
              // Virgülle ayrılmış string ise split et
              else if (member.includes(",")) {
                return member
                  .split(",")
                  .map((item) => item.trim())
                  .filter((item) => item);
              }
              // Tek string ise direkt döndür
              else {
                return [member.trim()];
              }
            }
            return member;
          })
          .flat()
          .filter((member) => member && member.trim()); // Boş değerleri filtrele
      }

      if (projectItem.achievements && Array.isArray(projectItem.achievements)) {
        parsedAchievements = projectItem.achievements
          .map((achievement) => {
            // Eğer string ise ve JSON formatında ise parse et
            if (typeof achievement === "string") {
              // JSON array formatında mı kontrol et
              if (achievement.startsWith("[") && achievement.endsWith("]")) {
                try {
                  const parsed = JSON.parse(achievement);
                  return Array.isArray(parsed) ? parsed : [achievement];
                } catch (e) {
                  return [achievement];
                }
              }
              // Virgülle ayrılmış string ise split et
              else if (achievement.includes(",")) {
                return achievement
                  .split(",")
                  .map((item) => item.trim())
                  .filter((item) => item);
              }
              // Tek string ise direkt döndür
              else {
                return [achievement.trim()];
              }
            }
            return achievement;
          })
          .flat()
          .filter((achievement) => achievement && achievement.trim()); // Boş değerleri filtrele
      }

      setFormData({
        title: projectItem.title || "",
        content: projectItem.content || "",
        description: projectItem.description || "",
        event_date: projectItem.event_date
          ? projectItem.event_date.split("T")[0]
          : "",
        location: projectItem.location || "",
        number_of_participants: projectItem.number_of_participants || "",
        project_impact: projectItem.project_impact || "",
        crew: parsedCrew,
        achievements: parsedAchievements,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        description: "",
        event_date: "",
        location: "",
        number_of_participants: "",
        project_impact: "",
        crew: [],
        achievements: [],
      });
      setImage(null);
      setCrewInput("");
      setAchievementInput("");
    }
  }, [projectItem, isEditing]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value || "" }));
  };

  const uploadImage = async (imageBlob) => {
    try {
      const formData = new FormData();
      formData.append("image", imageBlob, "image.jpg");

      const response = await API.post(
        "/bridgeprojects/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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

  const handleAddCrew = () => {
    if (crewInput.trim() && !formData.crew.includes(crewInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        crew: [...prev.crew, crewInput.trim()],
      }));
      setCrewInput("");
    }
  };

  const handleRemoveCrew = (memberToRemove) => {
    setFormData((prev) => ({
      ...prev,
      crew: prev.crew.filter((member) => member !== memberToRemove),
    }));
  };

  const handleAddAchievement = () => {
    if (
      achievementInput.trim() &&
      !formData.achievements.includes(achievementInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()],
      }));
      setAchievementInput("");
    }
  };

  const handleRemoveAchievement = (achievementToRemove) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter(
        (achievement) => achievement !== achievementToRemove
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Düzenleme modunda JSON olarak gönder
      const projectData = {
        ...formData,
        event_date: formData.event_date
          ? new Date(formData.event_date).toISOString()
          : "",
        created_at: new Date().toISOString(),
      };
      onSave(projectData, projectItem.id);
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

      if (formData.location) {
        formDataToSend.append("location", formData.location);
      }
      if (formData.number_of_participants) {
        formDataToSend.append(
          "number_of_participants",
          formData.number_of_participants
        );
      }
      if (formData.project_impact) {
        formDataToSend.append("project_impact", formData.project_impact);
      }

      // Crew array'i JSON string olarak gönder
      if (formData.crew.length > 0) {
        formDataToSend.append("crew", JSON.stringify(formData.crew));
      }

      // Achievements array'i JSON string olarak gönder
      if (formData.achievements.length > 0) {
        formDataToSend.append(
          "achievements",
          JSON.stringify(formData.achievements)
        );
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
            {isEditing ? "Köprü Projesini Düzenle" : "Yeni Köprü Projesi Ekle"}
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
                      htmlFor="number_of_participants"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Katılımcı Sayısı
                    </label>
                    <input
                      type="number"
                      name="number_of_participants"
                      id="number_of_participants"
                      value={formData.number_of_participants}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="0"
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
                    placeholder="Örn: B103, Konferans Salonu"
                  />
                </div>

                <div>
                  <label
                    htmlFor="project_impact"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Proje Değeri
                  </label>
                  <textarea
                    name="project_impact"
                    id="project_impact"
                    value={formData.project_impact}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg h-20"
                    placeholder="Projenin değeri ve etkisi hakkında bilgi..."
                  />
                </div>

                {/* Crew */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Ekip Üyeleri
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={crewInput}
                      onChange={(e) => setCrewInput(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg"
                      placeholder="Ekip üyesi adı..."
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddCrew())
                      }
                    />
                    <button
                      type="button"
                      onClick={handleAddCrew}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Ekle
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.crew.map((member, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                      >
                        {member}
                        <button
                          type="button"
                          onClick={() => handleRemoveCrew(member)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Başarılar
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={achievementInput}
                      onChange={(e) => setAchievementInput(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg"
                      placeholder="Başarı ekle..."
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddAchievement())
                      }
                    />
                    <button
                      type="button"
                      onClick={handleAddAchievement}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Ekle
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.achievements.map((achievement, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                      >
                        {achievement}
                        <button
                          type="button"
                          onClick={() => handleRemoveAchievement(achievement)}
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
                    Proje Resmi (4:5 oranı)
                  </label>

                  {/* Mevcut resim gösterimi */}
                  {projectItem?.image_url && (
                    <div className="mb-3">
                      <img
                        src={projectItem.image_url}
                        alt="Mevcut resim"
                        className="h-20 w-16 rounded-lg border object-cover"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Mevcut proje resmi
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
                        : image || projectItem?.image_url
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
        title="Köprü Projesi Resmi Kırp (4:5)"
      />
    </>
  );
}

export default BridgeProjectFormModal;
