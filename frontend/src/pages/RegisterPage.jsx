import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import axios from "../utils/axios";

const RegisterPage = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    tc: "",
    phone: "",
    employmentStatus: "",
    graduationStatus: "",
    graduationDate: "",
    studentDocument: null,
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const validate = () => {
    const newErrors = {};

    // Ad, soyad
    if (!formData.firstName.trim()) newErrors.firstName = "Ad zorunludur";
    if (!formData.lastName.trim()) newErrors.lastName = "Soyad zorunludur";

    // E-mail
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Geçerli bir e-posta adresi girin";

    // Şifre
    if (formData.password.length < 6)
      newErrors.password = "Şifre en az 6 karakter olmalı";

    // TC Kimlik No: 11 haneli ve sadece rakam
    if (!/^[0-9]{11}$/.test(formData.tc))
      newErrors.tc = "TC Kimlik No 11 haneli olmalıdır";

    // Telefon: En az 10 haneli rakamlar
    if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Geçerli bir telefon numarası girin";

    // Diğer zorunlu alanlar
    if (!formData.username) newErrors.username = "Kullanıcı adı zorunludur";
    if (!formData.employmentStatus)
      newErrors.employmentStatus = "Çalışma durumu seçilmelidir";
    if (!formData.graduationStatus)
      newErrors.graduationStatus = "Sınıf/Mezuniyet durumu seçilmelidir";
    if (!formData.studentDocument)
      newErrors.studentDocument = "Belge yüklenmelidir";
    if (!formData.consent) newErrors.consent = "KVKK onayı gereklidir";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const payload = new FormData();
    payload.append("name", formData.firstName);
    payload.append("surname", formData.lastName);
    payload.append("username", formData.username);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("tc", formData.tc);
    payload.append("phone", formData.phone);
    payload.append("workStatus", formData.employmentStatus);
    payload.append("classStatus", formData.graduationStatus);
    payload.append("consent", formData.consent);
    payload.append("document", formData.studentDocument);

    // Opsiyonel alanlar
    if (formData.graduationDate) {
      payload.append("graduationDate", formData.graduationDate);
    }

    try {
      const response = await axios.post("/auth/register", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 201 başarılı kayıt
      if (response.status === 201) {
        alert("Kayıt başarılı! Hoş geldiniz!");
        login();
        navigate("/kariyer");
      }
    } catch (err) {
      console.error("Kayıt hatası:", err);

      if (err.response) {
        // Sunucu hata yanıtı
        switch (err.response.status) {
          case 400:
            alert(
              err.response.data?.message ||
                "Geçersiz veri veya kullanıcı adı zaten kullanılıyor."
            );
            break;
          case 500:
            alert("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
            break;
          default:
            alert("Kayıt sırasında bir hata oluştu.");
        }
      } else if (err.request) {
        // Ağ hatası
        alert(
          "Sunucuya bağlanırken hata oluştu. İnternet bağlantınızı kontrol edin."
        );
      } else {
        // Diğer hatalar
        alert("Beklenmeyen bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary to-red-600 px-8 py-6">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4">
                <i className="bi bi-person-plus text-2xl text-primary"></i>
              </div>
              <h2 className="text-3xl font-bold text-white">Kayıt Ol</h2>
              <p className="text-red-100 mt-2">
                İstanbul Sağlık ve Teknoloji Üniversitesi Kariyer Ağı'na katılın
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-0 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Kişisel Bilgiler */}
              <div className="bg-gray-50 rounded-none md:rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="bi bi-person-circle mr-2 text-primary"></i>
                  Kişisel Bilgiler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="bi bi-person mr-1"></i>Ad *
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Adınızı girin"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <i className="bi bi-exclamation-circle mr-1"></i>
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="bi bi-person mr-1"></i>Soyad *
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Soyadınızı girin"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <i className="bi bi-exclamation-circle mr-1"></i>
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Hesap Bilgileri */}
              <div className="bg-gray-50 rounded-none md:rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="bi bi-shield-lock mr-2 text-primary"></i>
                  Hesap Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="bi bi-at mr-1"></i>Kullanıcı Adı *
                    </label>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Kullanıcı adı"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <i className="bi bi-exclamation-circle mr-1"></i>
                        {errors.username}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="bi bi-envelope mr-1"></i>E-posta *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="ornek@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <i className="bi bi-exclamation-circle mr-1"></i>
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="bi bi-key mr-1"></i>Parola *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="En az 6 karakter"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <i className="bi bi-exclamation-circle mr-1"></i>
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div className="bg-gray-50 rounded-none md:rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="bi bi-telephone mr-2 text-primary"></i>
                  İletişim Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="bi bi-card-text mr-1"></i>T.C. Kimlik No *
                    </label>
                    <input
                      name="tc"
                      value={formData.tc}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="11 haneli TC kimlik no"
                      maxLength="11"
                    />
                    {errors.tc && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <i className="bi bi-exclamation-circle mr-1"></i>
                        {errors.tc}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="bi bi-phone mr-1"></i>Telefon *
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="05xx xxx xx xx"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <i className="bi bi-exclamation-circle mr-1"></i>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Eğitim Bilgileri */}
              <div className="bg-gray-50 rounded-none md:rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="bi bi-mortarboard mr-2 text-primary"></i>
                  Eğitim ve Çalışma Durumu
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="bi bi-briefcase mr-1"></i>Çalışma Durumu *
                    </label>
                    <select
                      name="employmentStatus"
                      value={formData.employmentStatus}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">Seçiniz</option>
                      <option value="öğrenci">Öğrenci</option>
                      <option value="çalışıyor">Çalışıyor</option>
                      <option value="işsiz">İşsiz</option>
                    </select>
                    {errors.employmentStatus && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <i className="bi bi-exclamation-circle mr-1"></i>
                        {errors.employmentStatus}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="bi bi-book mr-1"></i>Sınıf / Mezuniyet *
                    </label>
                    <select
                      name="graduationStatus"
                      value={formData.graduationStatus}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">Seçiniz</option>
                      <option value="hazırlık">Hazırlık</option>
                      <option value="1.sınıf">1. Sınıf</option>
                      <option value="2.sınıf">2. Sınıf</option>
                      <option value="3.sınıf">3. Sınıf</option>
                      <option value="4.sınıf">4. Sınıf</option>
                      <option value="mezun">Mezun</option>
                    </select>
                    {errors.graduationStatus && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <i className="bi bi-exclamation-circle mr-1"></i>
                        {errors.graduationStatus}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="bi bi-calendar-event mr-1"></i>Mezuniyet
                    Tarihi
                  </label>
                  <input
                    type="date"
                    name="graduationDate"
                    value={formData.graduationDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white md:w-1/2"
                  />
                </div>
              </div>

              {/* Belge Yükleme */}
              <div className="bg-gray-50 rounded-none md:rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="bi bi-file-earmark-arrow-up mr-2 text-primary"></i>
                  Belge Yükleme
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="bi bi-file-text mr-1"></i>Öğrenci Belgesi
                    Yükle *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="studentDocument"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-primary hover:file:bg-red-100"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                  {errors.studentDocument && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <i className="bi bi-exclamation-circle mr-1"></i>
                      {errors.studentDocument}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    PDF, JPG, JPEG, PNG formatları kabul edilir
                  </p>
                </div>
              </div>

              {/* KVKK Onayı */}
              <div className="bg-red-50 rounded-none md:rounded-xl p-6 border border-red-200">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <label className="text-sm text-gray-700 flex items-center">
                      <i className="bi bi-shield-check mr-1 text-primary"></i>
                      Kişisel verilerimin işlenmesini kabul ediyorum. *
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      KVKK kapsamında kişisel verileriniz güvenli şekilde
                      işlenecektir.
                    </p>
                  </div>
                </div>
                {errors.consent && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <i className="bi bi-exclamation-circle mr-1"></i>
                    {errors.consent}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-semibold text-lg shadow-lg flex items-center justify-center transition-all duration-200 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-red-600 text-white hover:from-red-700 hover:to-red-700 transform hover:scale-105"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <i className="bi bi-arrow-clockwise mr-2 animate-spin"></i>
                      Kayıt Ediliyor...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus-fill mr-2"></i>
                      Kayıt Ol
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
