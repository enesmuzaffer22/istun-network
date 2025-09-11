// dashboard/src/components/Sidebar.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

// DEĞİŞİKLİK: Yeni menü elemanları eklendi.
const menu = [
  { name: "İş İlanları", icon: "bi-briefcase", path: "/jobs" }, // Yeni eklendi
  { name: "Haberler", icon: "bi-newspaper", path: "/news" }, // Yeni eklendi
  { name: "Yol Haritaları", icon: "bi-signpost-split", path: "/roadmaps" }, // Yeni eklendi
  { name: "Başarılarımız", icon: "bi-trophy", path: "/achievements" }, // Yeni eklendi
  { name: "Duyurularımız", icon: "bi-megaphone", path: "/announcements" }, // Yeni eklendi
  { name: "Etkinliklerimiz", icon: "bi-calendar-event", path: "/events" }, // Yeni eklendi
  { name: "Köprü Projeleri", icon: "bi-diagram-3", path: "/bridgeprojects" }, // Yeni eklendi
  {
    name: "Etki Skorları (Köprü Projeleri)",
    icon: "bi-graph-up",
    path: "/bridgeprojectsimpact",
  }, // Yeni eklendi
  {
    name: "Sosyal Etki Skorları",
    icon: "bi-heart-pulse",
    path: "/socialimpactscores",
  }, // Yeni eklendi
  {
    name: "Bekleyen Talepler",
    icon: "bi-hourglass-split",
    path: "/pendingrequests",
  }, // ⏳ ikon
  { name: "Kullanıcılar", icon: "bi-person-lines-fill", path: "/userlist" }, // 👤 liste ikon
  { name: "Yöneticiler", icon: "bi-person-gear", path: "/admin-management" }, // 👤 yönetici ikon
];

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // Role tabanlı menü filtreleme
  const getFilteredMenu = () => {
    // Eğer super_admin ise tüm menüyü göster
    if (user?.adminRole === "super_admin") {
      return menu;
    }

    // Eğer content_admin ise belirli menüleri gizle
    if (user?.adminRole === "content_admin") {
      const restrictedPaths = [
        "/userlist",
        "/admin-management",
        "/pendingrequests",
      ];
      return menu.filter((item) => !restrictedPaths.includes(item.path));
    }

    // Varsayılan olarak tüm menüyü göster (güvenlik için)
    return menu;
  };

  const filteredMenu = getFilteredMenu();

  return (
    <aside className="w-64 bg-white shadow-md h-screen flex flex-col">
      <div className="p-6 border-b">
        <div className="text-2xl font-bold text-primary">Admin Paneli</div>
        {user && (
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <i className="bi bi-person-circle"></i>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <i
                className={`bi ${
                  user.adminRole === "super_admin"
                    ? "bi-shield-fill-exclamation text-red-500"
                    : "bi-pencil-square text-blue-500"
                }`}
              ></i>
              <span className="text-xs font-medium">
                {user.adminRole === "super_admin"
                  ? "Süper Admin"
                  : "İçerik Admin"}
              </span>
            </div>
          </div>
        )}
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                // Tailwind class'ları için şablon değişmezlerini doğru kullandık
                className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-primary/10 transition text-gray-700 ${
                  location.pathname === item.path ||
                  (location.pathname === "/" && item.path === "/jobs")
                    ? "bg-primary/10 text-primary font-semibold"
                    : ""
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
