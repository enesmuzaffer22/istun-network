// dashboard/src/utils/axios.js

import axios from "axios";

// Bu instance, backend API'mize bağlanmak için kullanılacak.
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Backend'inizin adresi
  withCredentials: true, // Oturum (cookie) bilgilerini göndermek için
});

// Request interceptor - Token'ı her isteğe otomatik ekler
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 hatalarında logout yapar
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized hatası alındığında kullanıcıyı logout yap
    if (error.response?.status === 401) {
      // localStorage'daki TÜM verileri temizle
      localStorage.clear();

      // Login sayfasına yönlendir
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
