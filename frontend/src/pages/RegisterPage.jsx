import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axios";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Türkçe karakterleri İngilizce karakterlere çevir
  const turkishToEnglish = (text) => {
    const turkishChars = {
      ç: "c",
      Ç: "C",
      ğ: "g",
      Ğ: "G",
      ı: "i",
      I: "I",
      İ: "I",
      i: "i",
      ö: "o",
      Ö: "O",
      ş: "s",
      Ş: "S",
      ü: "u",
      Ü: "U",
    };

    return text.replace(
      /[çÇğĞıIİiöÖşŞüÜ]/g,
      (match) => turkishChars[match] || match
    );
  };

  // Kullanıcı adını otomatik oluştur: ad.soyad formatında (İngilizce karakterlerle)
  const generateUsername = (firstName, lastName) => {
    const englishFirstName = turkishToEnglish(
      firstName.trim().toLowerCase().replace(/\s+/g, "")
    );
    const englishLastName = turkishToEnglish(
      lastName.trim().toLowerCase().replace(/\s+/g, "")
    );
    return `${englishFirstName}.${englishLastName}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });

    // Şifre alanı için canlı kontrol
    if (name === "password") {
      checkPasswordRequirements(value);
    }
  };

  // Şifre gereksinimlerini canlı kontrol et
  const checkPasswordRequirements = (password) => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    });
  };

  const validate = () => {
    const newErrors = {};

    // Ad, soyad
    if (!formData.firstName.trim()) newErrors.firstName = "Ad zorunludur";
    if (!formData.lastName.trim()) newErrors.lastName = "Soyad zorunludur";

    // E-mail - Gelişmiş syntax kontrolü
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim()))
      newErrors.email =
        "Geçerli bir e-posta adresi girin (örn: ornek@email.com)";

    // Şifre - En az 8 karakter, büyük harf, küçük harf, sayı ve özel karakter
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Şifre en az 8 karakter olmalı ve büyük harf, küçük harf, sayı ve özel karakter içermelidir";
    }

    // TC Kimlik No: 11 haneli, sadece rakam ve TC kimlik algoritması kontrolü
    if (!isValidTCKimlik(formData.tc)) {
      newErrors.tc = "Geçerli bir TC Kimlik No girin";
    }

    // Telefon: 05xxxxxxxxx formatında
    const phoneRegex = /^05\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Telefon numarası 05xxxxxxxxx formatında olmalıdır";
    }

    // Diğer zorunlu alanlar
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

  // TC Kimlik No doğrulama algoritması
  const isValidTCKimlik = (tcKimlik) => {
    if (!tcKimlik || tcKimlik.length !== 11) return false;
    if (!/^[0-9]+$/.test(tcKimlik)) return false;
    if (tcKimlik[0] === "0") return false;

    const digits = tcKimlik.split("").map(Number);

    // 10. hane kontrolü
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
    const tenthDigit = (oddSum * 7 - evenSum) % 10;

    if (tenthDigit !== digits[9]) return false;

    // 11. hane kontrolü
    const sum = digits.slice(0, 10).reduce((acc, digit) => acc + digit, 0);
    const eleventhDigit = sum % 10;

    return eleventhDigit === digits[10];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const username = generateUsername(formData.firstName, formData.lastName);

    const payload = new FormData();
    payload.append("name", formData.firstName);
    payload.append("surname", formData.lastName);
    payload.append("username", username);
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
        toast.success(
          "Kayıt başarılı! Öğrenciliğiniz doğrulandıktan sonra giriş yapabileceksiniz. Sizi bilgilendireceğiz."
        );
        navigate("/giris-yap");
      }
    } catch (err) {
      console.error("Kayıt hatası:", err);

      if (err.response) {
        // Sunucu hata yanıtı
        switch (err.response.status) {
          case 400:
            toast.error(
              err.response.data?.message ||
                "Geçersiz veri veya kullanıcı adı zaten kullanılıyor."
            );
            break;
          case 500:
            toast.error("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
            break;
          default:
            toast.error("Kayıt sırasında bir hata oluştu.");
        }
      } else if (err.request) {
        // Ağ hatası
        toast.error(
          "Sunucuya bağlanırken hata oluştu. İnternet bağlantınızı kontrol edin."
        );
      } else {
        // Diğer hatalar
        toast.error("Beklenmeyen bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-8 py-12 px-4 sm:px-6 lg:px-8">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="En az 8 karakter, büyük/küçük harf, sayı ve özel karakter"
                    />

                    {/* Şifre Gereksinimleri Göstergesi */}
                    {formData.password && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                        <p className="text-xs font-medium text-gray-600 mb-2">
                          Şifre Gereksinimleri:
                        </p>
                        <div className="space-y-1">
                          <div
                            className={`flex items-center text-xs ${
                              passwordRequirements.length
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <i
                              className={`mr-2 ${
                                passwordRequirements.length
                                  ? "bi bi-check-circle-fill"
                                  : "bi bi-circle"
                              }`}
                            ></i>
                            En az 8 karakter
                          </div>
                          <div
                            className={`flex items-center text-xs ${
                              passwordRequirements.uppercase
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <i
                              className={`mr-2 ${
                                passwordRequirements.uppercase
                                  ? "bi bi-check-circle-fill"
                                  : "bi bi-circle"
                              }`}
                            ></i>
                            En az bir büyük harf (A-Z)
                          </div>
                          <div
                            className={`flex items-center text-xs ${
                              passwordRequirements.lowercase
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <i
                              className={`mr-2 ${
                                passwordRequirements.lowercase
                                  ? "bi bi-check-circle-fill"
                                  : "bi bi-circle"
                              }`}
                            ></i>
                            En az bir küçük harf (a-z)
                          </div>
                          <div
                            className={`flex items-center text-xs ${
                              passwordRequirements.number
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <i
                              className={`mr-2 ${
                                passwordRequirements.number
                                  ? "bi bi-check-circle-fill"
                                  : "bi bi-circle"
                              }`}
                            ></i>
                            En az bir sayı (0-9)
                          </div>
                          <div
                            className={`flex items-center text-xs ${
                              passwordRequirements.special
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <i
                              className={`mr-2 ${
                                passwordRequirements.special
                                  ? "bi bi-check-circle-fill"
                                  : "bi bi-circle"
                              }`}
                            ></i>
                            En az bir özel karakter (!@#$%...)
                          </div>
                        </div>

                        {/* Genel Durum */}
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          {Object.values(passwordRequirements).every(
                            (req) => req
                          ) ? (
                            <p className="text-xs text-green-600 font-medium flex items-center">
                              <i className="bi bi-shield-check mr-1"></i>
                              Şifre gereksinimlerini karşılıyor!
                            </p>
                          ) : (
                            <p className="text-xs text-amber-600 flex items-center">
                              <i className="bi bi-exclamation-triangle mr-1"></i>
                              {
                                Object.values(passwordRequirements).filter(
                                  (req) => req
                                ).length
                              }
                              /5 gereksinim karşılandı
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <i className="bi bi-exclamation-circle mr-1"></i>
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 flex items-center">
                    <i className="bi bi-info-circle mr-2"></i>
                    Kullanıcı adınız otomatik olarak ad.soyad formatında
                    oluşturulacaktır. (Türkçe karakterler İngilizce karakterlere
                    çevrilir)
                  </p>
                  {formData.firstName && formData.lastName && (
                    <div className="mt-2 p-2 bg-white rounded border border-blue-300">
                      <p className="text-xs text-gray-600">
                        <strong>Örnek:</strong> {formData.firstName}{" "}
                        {formData.lastName} →
                        <span className="text-blue-600 font-mono ml-1">
                          {generateUsername(
                            formData.firstName,
                            formData.lastName
                          )}
                        </span>
                      </p>
                    </div>
                  )}
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
                      placeholder="05xxxxxxxxx"
                      maxLength="11"
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
