import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const RegisterPage = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    tc: '',
    phone: '',
    employmentStatus: '',
    graduationStatus: '',
    graduationDate: '',
    studentDocument: null,
    consent: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
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
    if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, '')))
      newErrors.phone = "Geçerli bir telefon numarası girin";

    // Diğer zorunlu alanlar
    if (!formData.username) newErrors.username = "Kullanıcı adı zorunludur";
    if (!formData.employmentStatus) newErrors.employmentStatus = "Çalışma durumu seçilmelidir";
    if (!formData.graduationStatus) newErrors.graduationStatus = "Sınıf/Mezuniyet durumu seçilmelidir";
    if (!formData.studentDocument) newErrors.studentDocument = "Belge yüklenmelidir";
    if (!formData.consent) newErrors.consent = "KVKK onayı gereklidir";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

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
    payload.append("graduationDate", formData.graduationDate);
    payload.append("document", formData.studentDocument);
    payload.append("consent", formData.consent ? "true" : "false");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Kayıt başarılı!");
        login();
        navigate("/kariyer");
      } else {
        alert(result.message || "Kayıt sırasında hata oluştu.");
      }
    } catch (err) {
      console.error("Kayıt hatası:", err);
      alert("Sunucuya bağlanırken hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Kayıt Ol</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Ad *</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full border p-2" />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
            <div>
              <label>Soyad *</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full border p-2" />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>Kullanıcı Adı *</label>
              <input name="username" value={formData.username} onChange={handleChange} required className="w-full border p-2" />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
            <div>
              <label>E-posta *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border p-2" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <label>Parola *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full border p-2" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>T.C. Kimlik No *</label>
              <input name="tc" value={formData.tc} onChange={handleChange} required className="w-full border p-2" />
              {errors.tc && <p className="text-red-500 text-sm">{errors.tc}</p>}
            </div>
            <div>
              <label>Telefon *</label>
              <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full border p-2" />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Çalışma Durumu *</label>
              <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} required className="w-full border p-2">
                <option value="">Seçiniz</option>
                <option value="öğrenci">Öğrenci</option>
                <option value="çalışıyor">Çalışıyor</option>
                <option value="işsiz">İşsiz</option>
              </select>
              {errors.employmentStatus && <p className="text-red-500 text-sm">{errors.employmentStatus}</p>}
            </div>
            <div>
              <label>Sınıf / Mezuniyet *</label>
              <select name="graduationStatus" value={formData.graduationStatus} onChange={handleChange} required className="w-full border p-2">
                <option value="">Seçiniz</option>
                <option value="hazırlık">Hazırlık</option>
                <option value="1.sınıf">1. Sınıf</option>
                <option value="2.sınıf">2. Sınıf</option>
                <option value="3.sınıf">3. Sınıf</option>
                <option value="4.sınıf">4. Sınıf</option>
                <option value="mezun">Mezun</option>
              </select>
              {errors.graduationStatus && <p className="text-red-500 text-sm">{errors.graduationStatus}</p>}
            </div>
          </div>

          <div>
            <label>Mezuniyet Tarihi</label>
            <input type="date" name="graduationDate" value={formData.graduationDate} onChange={handleChange} className="w-full border p-2" />
          </div>

          <div>
            <label>Öğrenci Belgesi Yükle *</label>
            <input type="file" name="studentDocument" onChange={handleChange} required className="w-full border p-2" />
            {errors.studentDocument && <p className="text-red-500 text-sm">{errors.studentDocument}</p>}
          </div>

          <div className="flex items-center">
            <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="mr-2" />
            <label className="text-sm">Kişisel verilerimin işlenmesini kabul ediyorum.</label>
          </div>
          {errors.consent && <p className="text-red-500 text-sm">{errors.consent}</p>}

          <button type="submit" className="bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">Kayıt Ol</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
