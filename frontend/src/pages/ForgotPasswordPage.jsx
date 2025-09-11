import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "E-posta adresi zorunludur";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      // API çağrısı henüz hazır olmadığı için simüle ediyoruz
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Başarı mesajı göster
      toast.success(
        "Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen e-posta kutunuzu kontrol edin."
      );

      // 2 saniye sonra giriş sayfasına yönlendir
      setTimeout(() => {
        navigate("/giris-yap");
      }, 2000);
    } catch (err) {
      console.error("Şifre sıfırlama hatası:", err);
      toast.error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
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
                <i className="bi bi-key text-2xl text-primary"></i>
              </div>
              <h2 className="text-3xl font-bold text-white">Şifremi Unuttum</h2>
              <p className="text-red-100 mt-2">
                Şifrenizi sıfırlamak için e-posta adresinizi girin
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-4 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 my-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="bi bi-envelope mr-1"></i>E-posta Adresi *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="E-posta adresinizi girin"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="bi bi-exclamation-circle mr-1"></i>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Information Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <i className="bi bi-info-circle text-blue-500 text-lg mr-3 mt-0.5"></i>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Bilgilendirme:</p>
                    <p>
                      E-posta adresinizi girdikten sonra, şifre sıfırlama linki
                      e-posta kutunuza gönderilecektir. Lütfen spam klasörünüzü
                      de kontrol etmeyi unutmayın.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
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
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send mr-2"></i>
                      Şifre Sıfırlama Linki Gönder
                    </>
                  )}
                </button>
              </div>

              {/* Back to Login Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/giris-yap")}
                  className="text-gray-600 hover:text-primary text-sm font-medium transition-colors duration-200 flex items-center justify-center mx-auto"
                >
                  <i className="bi bi-arrow-left mr-1"></i>
                  Giriş Sayfasına Dön
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
