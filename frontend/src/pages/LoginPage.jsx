import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import axios from "../utils/axios";

const LoginPage = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "E-posta veya kullanıcı adı zorunludur";
    }

    if (!formData.password) {
      newErrors.password = "Şifre zorunludur";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await axios.post("/auth/login", {
        identifier: formData.identifier,
        password: formData.password,
      });

      // 200 başarılı giriş
      if (response.status === 200) {
        const { token, refreshToken, user, message } = response.data;

        // Token'ları localStorage'a kaydet
        localStorage.setItem("token", token);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(user));

        // Login işlemini yap
        login(user, token);

        // Kullanıcı status kontrolü yap
        const statusCheck = await useAuthStore.getState().checkUserStatus();

        if (!statusCheck.success) {
          // Status uygun değilse hata mesajı göster ve çıkış yap
          toast.error(statusCheck.message);
          return; // Login işlemini durdur
        }

        toast.success(message || "Giriş başarılı! Hoş geldiniz!");
        navigate("/kariyer");
      }
    } catch (err) {
      console.error("Giriş hatası:", err);

      // Giriş başarısız olduğunda local storage'ı tamamen temizle
      localStorage.clear();

      if (err.response) {
        // Sunucu hata yanıtı
        switch (err.response.status) {
          case 400:
            toast.error("Geçersiz veri. Lütfen bilgilerinizi kontrol edin.");
            break;
          case 401:
            toast.error("Yanlış kullanıcı adı veya şifre.");
            break;
          case 403: {
            // Kullanıcı hesabı onaylanmamış veya reddedilmiş
            const errorMessage = err.response.data?.message;
            if (errorMessage && errorMessage.includes("pending")) {
              toast.warning(
                "Hesabınız henüz onaylanmamış. Öğrenciliğiniz doğrulandıktan sonra giriş yapabileceksiniz. Sizi bilgilendireceğiz."
              );
            } else if (errorMessage && errorMessage.includes("rejected")) {
              toast.error(
                "Hesabınız reddedilmiş. Lütfen yönetici ile iletişime geçin."
              );
            } else {
              toast.warning(
                "Hesabınız henüz onaylanmamış veya erişim yetkiniz bulunmuyor. Lütfen hesap durumunuzu kontrol edin."
              );
            }
            break;
          }
          case 404:
            toast.error("Kullanıcı bulunamadı.");
            break;
          case 500:
            toast.error("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
            break;
          default:
            toast.error("Giriş sırasında bir hata oluştu.");
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
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary to-red-600 px-8 py-6">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4">
                <i className="bi bi-person-check text-2xl text-primary"></i>
              </div>
              <h2 className="text-3xl font-bold text-white">Giriş Yap</h2>
              <p className="text-red-100 mt-2">
                İstanbul Sağlık ve Teknoloji Üniversitesi Kariyer Ağı
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-4 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 my-4">
              {/* Identifier Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="bi bi-person mr-1"></i>E-posta veya Kullanıcı
                  Adı *
                </label>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="E-posta adresiniz veya kullanıcı adınız"
                />
                {errors.identifier && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="bi bi-exclamation-circle mr-1"></i>
                    {errors.identifier}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="bi bi-key mr-1"></i>Şifre *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Şifrenizi girin"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-primary transition-colors duration-200"
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      } text-lg`}
                    ></i>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="bi bi-exclamation-circle mr-1"></i>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-semibold text-lg shadow-lg flex items-center justify-center transition-all duration-200 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-red-600 text-white hover:from-red-700 hover:to-red-700 transform hover:scale-105 cursor-pointer"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <i className="bi bi-arrow-clockwise mr-2 animate-spin"></i>
                      Giriş Yapılıyor...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right mr-2"></i>
                      Giriş Yap
                    </>
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/sifremi-unuttum")}
                  className="text-sm text-gray-600 hover:text-primary transition-colors duration-200 font-medium cursor-pointer"
                >
                  <i className="bi bi-key mr-1"></i>
                  Şifremi Unuttum
                </button>
              </div>

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Hesabınız yok mu?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/kayit-ol")}
                    className="text-primary hover:text-red-700 font-medium transition-colors duration-200 cursor-pointer"
                  >
                    Kayıt Ol
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
