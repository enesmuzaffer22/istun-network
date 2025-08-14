import { create } from "zustand";

// localStorage'dan mevcut auth durumunu kontrol et
const getInitialAuthState = () => {
  try {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    
    if (token && userData) {
      return {
        user: JSON.parse(userData),
        isAuthenticated: true,
        token: token
      };
    }
  } catch (error) {
    console.error("localStorage'dan auth verisi alınırken hata:", error);
    // Hatalı veri varsa temizle
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
  }
  
  return {
    user: null,
    isAuthenticated: false,
    token: null
  };
};

export const useAuthStore = create((set) => ({
  ...getInitialAuthState(),
  
  login: (user) => {
    const token = localStorage.getItem("authToken");
    set({ user, isAuthenticated: true, token });
  },
  
  logout: () => {
    // localStorage'dan tüm auth verilerini temizle
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    
    // Store'u sıfırla
    set({ user: null, isAuthenticated: false, token: null });
  },
  
  // Token'ı güncelle (refresh token işlemleri için)
  updateToken: (newToken) => {
    localStorage.setItem("authToken", newToken);
    set({ token: newToken });
  }
})); 