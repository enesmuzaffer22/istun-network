import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/kariyer" replace />;
};

export default PublicRoute; 