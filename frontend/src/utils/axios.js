// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Request interceptor - Her istekte token'ı header'a ekle
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 hatalarını yakala
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz, localStorage'ı temizle ve login sayfasına yönlendir
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Store'u da güncelle (eğer mevcut context'te varsa)
      if (typeof window !== "undefined") {
        window.location.href = "/giris-yap";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
