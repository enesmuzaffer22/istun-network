import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const RegisterPage = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    navigate("/kariyer");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Kayıt Ol</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Ad Soyad</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Adınız Soyadınız" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">E-posta</label>
            <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="E-posta adresiniz" />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Şifre</label>
            <input type="password" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Şifreniz" />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Kayıt Ol</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 