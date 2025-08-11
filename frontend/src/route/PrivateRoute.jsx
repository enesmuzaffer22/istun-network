import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/giris-yap" replace />;
};

export default PrivateRoute;
