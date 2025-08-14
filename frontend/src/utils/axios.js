// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Request interceptor - Her istekte token'ı header'a ekle
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // Token varsa ama user bilgisi yoksa local storage'ı tamamen temizle
    if (token && !user) {
      localStorage.clear();
      return Promise.reject(new Error("Kullanıcı bilgisi bulunamadı"));
    }

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
      // Token geçersiz, localStorage'ı tamamen temizle ve login sayfasına yönlendir
      localStorage.clear();

      // Store'u da güncelle (eğer mevcut context'te varsa)
      if (typeof window !== "undefined") {
        window.location.href = "/giris-yap";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
