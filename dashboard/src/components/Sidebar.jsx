// dashboard/src/components/Sidebar.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

// DEĞİŞİKLİK: Yeni menü elemanları eklendi.
const menu = [
  { name: "Dashboard", icon: "bi-house", path: "/" },
  { name: "Mezunlar", icon: "bi-people", path: "/alumni" },
  { name: "İş İlanları", icon: "bi-briefcase", path: "/jobs" }, // Yeni eklendi
  { name: "Haberler", icon: "bi-newspaper", path: "/news" }, // Yeni eklendi
  { name: "Duyurular", icon: "bi-megaphone", path: "/announcements" },
  { name: "Ayarlar", icon: "bi-gear", path: "/settings" },
  { name: "Yol Haritaları", icon: "bi-map", path: "/roadmaps" },
  { name: "Bekleyen Talepler", icon: "bi-hourglass-split", path: "/pendingrequests" }, // ⏳ ikon
  { name: "Kullanıcılar", icon: "bi-person-lines-fill", path: "/userlist" }, // 👤 liste ikon
];

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-md h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold text-primary border-b">Admin Paneli</div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                // Tailwind class'ları için şablon değişmezlerini doğru kullandık
                className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-primary/10 transition text-gray-700 ${
                  location.pathname === item.path ? "bg-primary/10 text-primary font-semibold" : ""
                }`}
              >
                <i className={`bi ${item.icon} text-lg`}></i>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <button 
          onClick={logout} 
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;