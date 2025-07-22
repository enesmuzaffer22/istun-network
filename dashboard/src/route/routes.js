// routes.js

import Layout from "../components/Layout";

const routes = [
  {
    path: "/login",
    component: () => import("../pages/Login.jsx"),
    isPrivate: false,
  },
  {
    path: "/",
    element: Layout, // JSX değil, fonksiyon referansı
    isPrivate: true,
    children: [
      {
        path: "",
        component: () => import("../pages/Dashboard.jsx"),
        isPrivate: true,
      },
      {
        path: "alumni",
        component: () => import("../pages/Alumni.jsx"),
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