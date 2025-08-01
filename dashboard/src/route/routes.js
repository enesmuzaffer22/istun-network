// dashboard/src/route/routes.js

import Layout from "../components/Layout"; // Layout component'inizin doğru yolda olduğundan emin olun

const routes = [
  // --- Public Route: Giriş Sayfası ---
  {
    path: "/login",
    component: () => import("../pages/Login.jsx"),
    isPrivate: false,
  },

  // --- Private Routes (Layout İçinde) ---
  {
    path: "/",
    element: Layout, // Ana layout'u render edecek element
    isPrivate: true,
    children: [
      {
        path: "", // / yolunun kendisi, yani Dashboard
        component: () => import("../pages/Dashboard.jsx"),
        isPrivate: true,
      },
      {
        // Mevcut rotalarınız
        path: "alumni",
        component: () => import("../pages/Alumni.jsx"),
        isPrivate: true,
      },
      {
        // YENİ ROTA: İş İlanları
        path: "jobs",
        component: () => import("../pages/JobsListPage.jsx"),
        isPrivate: true,
      },
      {
        // YENİ ROTA: Haberler
        path: "news",
        component: () => import("../pages/NewsListPage.jsx"),
        isPrivate: true,
      },
      {
        path: "announcements",
        component: () => import("../pages/Announcements.jsx"),
        isPrivate: true,
      },
      {
        path: "settings",
        component: () => import("../pages/Settings.jsx"),
        isPrivate: true,
      },
    ],
  },
];

export default routes;