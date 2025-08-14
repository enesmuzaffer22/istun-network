import React from "react";
import Sidebar from "./Sidebar";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store";

const Layout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 