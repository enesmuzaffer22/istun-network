import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import axios from "../utils/axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [profileData, setProfileData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    workStatus: "",
    classStatus: "",
    about: "",
    status: "",
    createdAt: "",
  });

  const [editableData, setEditableData] = useState({
    name: "",
    surname: "",
    phone: "",
    workStatus: "",
    classStatus: "",
    about: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Türkçe karakterler için gelişmiş kapitalizasyon fonksiyonu
  const capitalizeText = (text) => {
    if (!text) return "-";

    // Özel durumlar için mapping
    const specialCases = {
      i: "İ",
      ı: "I",
      ö: "Ö",
      ü: "Ü",
      ş: "Ş",
      ç: "Ç",
      ğ: "Ğ",
    };

    // Özel kelime düzeltmeleri
    const wordCorrections = {
      işsiz: "İşsiz",
      öğrenci: "Öğrenci",
      çalışıyor: "Çalışıyor",
      "1.sınıf": "1. Sınıf",
      "2.sınıf": "2. Sınıf",
      "3.sınıf": "3. Sınıf",
      "4.sınıf": "4. Sınıf",
      hazırlık: "Hazırlık",
      mezun: "Mezun",
    };

    const lowerText = text.toLowerCase();

    // Önce özel kelime düzeltmelerini kontrol et
    if (wordCorrections[lowerText]) {
      return wordCorrections[lowerText];
    }

    // Genel kapitalizasyon - ilk karakteri özel karakterler tablosundan kontrol et
    const firstChar = text.charAt(0).toLowerCase();
    const capitalizedFirst =
      specialCases[firstChar] || text.charAt(0).toUpperCase();

    return capitalizedFirst + text.slice(1).toLowerCase();
  };

  // Profil verilerini çek
  useEffect(() => {
    let isCancelled = false;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/users/me");

        if (!isCancelled) {
          const data = response.data;
          setProfileData(data);
          setEditableData({
            name: data.name || "",
            surname: data.surname || "",
            phone: data.phone || "",
            workStatus: data.workStatus || "",
            classStatus: data.classStatus || "",
            about: data.about || "",
          });
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Profil bilgileri alınamadı:", error);
          if (error.response?.status === 401) {
            navigate("/giris-yap");
          }
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isCancelled = true;
    };
  }, [navigate]);

  // Form değişikliklerini handle et
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Error'u temizle
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validasyon
  const validateForm = () => {
    const newErrors = {};

    if (!editableData.name.trim()) {
      newErrors.name = "Ad zorunludur";
    }

    if (!editableData.surname.trim()) {
      newErrors.surname = "Soyad zorunludur";
    }

    // Telefon kontrolü
    const phoneRegex = /^05\d{9}$/;
    if (
      editableData.phone &&
      !phoneRegex.test(editableData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Telefon numarası 05xxxxxxxxx formatında olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Profil güncelleme
  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await axios.put("/users/me", editableData);

      // Başarılı güncelleme
      const updatedData = response.data;
      setProfileData((prev) => ({ ...prev, ...updatedData }));

      // Auth store'u güncelle
      updateUser({ ...user, ...updatedData });

      setIsEditing(false);
      toast.success("Profil başarıyla güncellendi!");

      // Sayfayı yenile
      window.location.reload();
    } catch (error) {
      console.error("Profil güncellenirken hata:", error);
      toast.error(
        "Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setSaving(false);
    }
  };

  // Düzenlemeyi iptal et
  const handleCancel = () => {
    setEditableData({
      name: profileData.name || "",
      surname: profileData.surname || "",
      phone: profileData.phone || "",
      workStatus: profileData.workStatus || "",
      classStatus: profileData.classStatus || "",
      about: profileData.about || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  // Status badge rengi
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Status metni
  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Onaylandı";
      case "pending":
        return "Beklemede";
      case "rejected":
        return "Reddedildi";
      default:
        return "Bilinmiyor";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-48"></div>
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-red-600 px-4 md:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4 min-w-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold text-primary flex-shrink-0">
                  {profileData.name
                    ? profileData.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl md:text-2xl font-bold text-white truncate">
                    {profileData.name} {profileData.surname}
                  </h1>
                  <p className="text-red-100 text-sm md:text-base truncate">
                    @{profileData.username}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        profileData.status
                      )}`}
                    >
                      {getStatusText(profileData.status)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-primary px-4 md:px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 text-sm md:text-base w-full sm:w-auto"
                  >
                    <i className="bi bi-pencil mr-2"></i>
                    Düzenle
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors duration-200 text-sm md:text-base w-full sm:w-auto order-2 sm:order-1"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-white text-primary px-4 md:px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 text-sm md:text-base w-full sm:w-auto order-1 sm:order-2"
                    >
                      {saving ? (
                        <>
                          <i className="bi bi-arrow-clockwise mr-2 animate-spin"></i>
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check mr-2"></i>
                          Kaydet
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="bi bi-person mr-1"></i>Ad *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editableData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Adınızı girin"
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {profileData.name || "-"}
                  </div>
                )}
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="bi bi-exclamation-circle mr-1"></i>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Soyad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="bi bi-person mr-1"></i>Soyad *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="surname"
                    value={editableData.surname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Soyadınızı girin"
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {profileData.surname || "-"}
                  </div>
                )}
                {errors.surname && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="bi bi-exclamation-circle mr-1"></i>
                    {errors.surname}
                  </p>
                )}
              </div>

              {/* Kullanıcı Adı - Değiştirilemez */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="bi bi-at mr-1"></i>Kullanıcı Adı
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500">
                  @{profileData.username || "-"}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Bu alan değiştirilemez
                </p>
              </div>

              {/* E-posta - Değiştirilemez */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="bi bi-envelope mr-1"></i>E-posta
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500">
                  {profileData.email || "-"}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Bu alan değiştirilemez
                </p>
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="bi bi-phone mr-1"></i>Telefon
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editableData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="05xxxxxxxxx"
                    maxLength="11"
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {profileData.phone || "-"}
                  </div>
                )}
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="bi bi-exclamation-circle mr-1"></i>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Çalışma Durumu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="bi bi-briefcase mr-1"></i>Çalışma Durumu
                </label>
                {isEditing ? (
                  <select
                    name="workStatus"
                    value={editableData.workStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Seçiniz</option>
                    <option value="öğrenci">Öğrenci</option>
                    <option value="çalışıyor">Çalışıyor</option>
                    <option value="işsiz">İşsiz</option>
                  </select>
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {capitalizeText(profileData.workStatus)}
                  </div>
                )}
              </div>

              {/* Sınıf Durumu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="bi bi-book mr-1"></i>Sınıf Durumu
                </label>
                {isEditing ? (
                  <select
                    name="classStatus"
                    value={editableData.classStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Seçiniz</option>
                    <option value="hazırlık">Hazırlık</option>
                    <option value="1.sınıf">1. Sınıf</option>
                    <option value="2.sınıf">2. Sınıf</option>
                    <option value="3.sınıf">3. Sınıf</option>
                    <option value="4.sınıf">4. Sınıf</option>
                    <option value="mezun">Mezun</option>
                  </select>
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {capitalizeText(profileData.classStatus)}
                  </div>
                )}
              </div>
            </div>

            {/* Hakkında */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="bi bi-info-circle mr-1"></i>Hakkında
              </label>
              {isEditing ? (
                <textarea
                  name="about"
                  value={editableData.about}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Kendiniz hakkında bilgi verin..."
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 min-h-[100px]">
                  {profileData.about || "Henüz bir açıklama eklenmemiş."}
                </div>
              )}
            </div>

            {/* Kayıt Tarihi */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <i className="bi bi-calendar mr-2"></i>
                Kayıt Tarihi:{" "}
                {profileData.createdAt
                  ? new Date(profileData.createdAt).toLocaleDateString("tr-TR")
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
