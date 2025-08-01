// dashboard/src/utils/axios.js

import axios from 'axios';

// Bu instance, backend API'mize bağlanmak için kullanılacak.
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend'inizin adresi
  withCredentials: true, // Oturum (cookie) bilgilerini göndermek için
});

// Token'ı her isteğe otomatik eklemek için bir interceptor ekleyelim.
// Bu, "protect" middleware'ini kullanan rotalara erişim için gereklidir.
API.interceptors.request.use((config) => {
  // Token'ı localStorage'dan alıyoruz (veya nereden saklıyorsanız).
  const token = localStorage.getItem('authToken'); // 'authToken' anahtarını kendi projenize göre değiştirin.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;