import React from "react";
import { useAuthStore } from "../store";

const Login = () => {
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Örnek kullanıcı ile giriş
    login({ name: "Ali Veli", email: "ali@uni.edu" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Giriş Yap</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">E-posta</label>
            <input type="email" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary" placeholder="E-posta adresiniz" />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-gray-700">Şifre</label>
            <input type="password" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Şifreniz" />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 transition">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
};

export default Login; 