import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

const menu = [
  { name: "Dashboard", icon: "bi-house", path: "/" },
  { name: "Mezunlar", icon: "bi-people", path: "/alumni" },
  { name: "Duyurular", icon: "bi-megaphone", path: "/announcements" },
  { name: "Ayarlar", icon: "bi-gear", path: "/settings" },
];

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  return (
    <aside className="w-64 bg-white shadow h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold text-primary border-b">İstun Mezun</div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-primary/10 transition text-gray-700 ${location.pathname === item.path ? "bg-primary/10 text-primary" : ""}`}
              >
                <i className={`bi ${item.icon} text-lg`}></i>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button onClick={logout} className="m-4 mt-auto flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition">
        <i className="bi bi-box-arrow-right"></i> Çıkış Yap
      </button>
    </aside>
  );
};

export default Sidebar; 