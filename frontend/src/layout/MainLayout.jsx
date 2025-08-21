import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuthStore from "../store/authStore";

const MainLayout = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const location = useLocation();

  // Landing page'de navbar overlay, diğer sayfalarda normal
  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    // Uygulama başlatıldığında auth durumunu kontrol et
    // Bu sayede geçersiz token/user bilgileri temizlenir
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Navbar />
      <div className={isLandingPage ? "" : "pt-20"}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
