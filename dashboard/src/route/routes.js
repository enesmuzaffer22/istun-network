// dashboard/src/route/routes.js

import Layout from "../components/Layout";

const routes = [
  // === PUBLIC ROUTES ===
  {
    path: "/login",
    component: () => import("../pages/Login.jsx"),
    isPrivate: false,
  },

  // === PRIVATE ROUTES (Layout İçinde) ===
  {
    path: "/",
    element: Layout,
    isPrivate: true,
    children: [
      // Ana Sayfa - Dashboard yerine RoadMap'i ana sayfa olarak kullanıyoruz
      {
        path: "",
        component: () => import("../pages/JobsListPage.jsx"),
        isPrivate: true,
      },

      // Yol Haritası
      {
        path: "roadmaps",
        component: () => import("../pages/RoadMap.jsx"),
        isPrivate: true,
      },

      // Bekleyen İstekler
      {
        path: "pendingrequests",
        component: () => import("../pages/PendingRequests.jsx"),
        isPrivate: true,
      },

      // Kullanıcı Listesi
      {
        path: "userlist",
        component: () => import("../pages/UserList.jsx"),
        isPrivate: true,
      },

      // İş İlanları
      {
        path: "jobs",
        component: () => import("../pages/JobsListPage.jsx"),
        isPrivate: true,
      },

      // Haberler
      {
        path: "news",
        component: () => import("../pages/NewsListPage.jsx"),
        isPrivate: true,
      },

      // Başarılarımız
      {
        path: "achievements",
        component: () => import("../pages/AchievementsListPage.jsx"),
        isPrivate: true,
      },

      // Duyurularımız
      {
        path: "announcements",
        component: () => import("../pages/AnnouncementsListPage.jsx"),
        isPrivate: true,
      },

      // Etkinliklerimiz
      {
        path: "events",
        component: () => import("../pages/EventsListPage.jsx"),
        isPrivate: true,
      },

      // Köprü Projeleri
      {
        path: "bridgeprojects",
        component: () => import("../pages/BridgeProjectsListPage.jsx"),
        isPrivate: true,
      },

      // Köprü Projeleri Etki Skorları
      {
        path: "bridgeprojectsimpact",
        component: () => import("../pages/BridgeProjectsImpactPage.jsx"),
        isPrivate: true,
      },

      // Sosyal Etki Skorları
      {
        path: "socialimpactscores",
        component: () => import("../pages/SocialImpactScoresPage.jsx"),
        isPrivate: true,
      },

      // Ayarlar
      {
        path: "settings",
        component: () => import("../pages/Settings.jsx"),
        isPrivate: true,
      },
    ],
  },
];

export default routes;
