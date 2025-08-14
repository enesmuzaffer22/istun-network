import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuthStore from "../store/authStore";

const MainLayout = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Uygulama başlatıldığında auth durumunu kontrol et
    // Bu sayede geçersiz token/user bilgileri temizlenir
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
