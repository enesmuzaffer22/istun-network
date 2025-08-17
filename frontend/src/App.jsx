import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RouteList } from "./route/RouteList";
import MainLayout from "./layout/MainLayout.jsx";
import useAuthStore from "./store/authStore";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Uygulama başladığında token kontrolü yap
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            {RouteList.filter((item) => item.path !== "*").map(
              (item, index) => (
                <Route path={item.path} key={index} element={item.element} />
              )
            )}
          </Route>
        </Routes>
      </Router>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
    </div>
  );
}

export default App;
