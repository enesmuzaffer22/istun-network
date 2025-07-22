import React from "react";
import { useAuthStore } from "../store";

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <>
      <h1 className="text-3xl font-bold text-primary mb-4">Dashboard</h1>
      <p className="text-gray-700">Hoş geldiniz{user ? `, ${user.name}` : ""}! Burası ana yönetim ekranı.</p>
    </>
  );
};

export default Dashboard; 