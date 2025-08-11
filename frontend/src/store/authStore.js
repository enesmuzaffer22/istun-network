import { create } from "zustand";

// Token'ın geçerliliğini kontrol et
const isTokenValid = (token) => {
  if (!token) return false;

  try {
    // JWT token'ı decode et (basit base64 decode)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    // Token'ın exp (expiration) claim'i varsa kontrol et
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Token decode hatası:", error);
    return false;
  }
};

// LocalStorage'dan kullanıcı bilgilerini al
const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("User parse hatası:", error);
    return null;
  }
};

// LocalStorage'ı temizle
const clearStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

// İlk yükleme sırasında token kontrolü
const initializeAuth = () => {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (token && isTokenValid(token) && user) {
    return {
      isAuthenticated: true,
      user: user,
      token: token,
    };
  } else {
    // Geçersiz token varsa temizle
    clearStorage();
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  }
};

const useAuthStore = create((set, get) => ({
  // Initial state - token kontrolü ile başlat
  ...initializeAuth(),

  // Login fonksiyonu
  login: (userData = null, token = null) => {
    const storedToken = token || localStorage.getItem("token");
    const storedUser = userData || getStoredUser();

    if (storedToken && isTokenValid(storedToken)) {
      set({
        isAuthenticated: true,
        user: storedUser,
        token: storedToken,
      });
      return true;
    } else {
      clearStorage();
      set({
        isAuthenticated: false,
        user: null,
        token: null,
      });
      return false;
    }
  },

  // Logout fonksiyonu
  logout: () => {
    clearStorage();
    set({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  },

  // Token'ı kontrol et ve gerekirse refresh et
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token) {
      get().logout();
      return false;
    }

    if (isTokenValid(token)) {
      return true;
    }

    // Token geçersizse refresh token ile yenilemeyi dene
    if (refreshToken) {
      try {
        // Burada refresh token ile yeni token almak için API çağrısı yapılabilir
        // Şimdilik sadece logout yapıyoruz
        console.log(
          "Token süresi dolmuş, refresh token ile yenileme gerekiyor"
        );
        get().logout();
        return false;
      } catch (error) {
        console.error("Token refresh hatası:", error);
        get().logout();
        return false;
      }
    } else {
      get().logout();
      return false;
    }
  },

  // Kullanıcı bilgilerini güncelle
  updateUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },
}));

export default useAuthStore;
