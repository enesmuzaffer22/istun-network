import JobsPage from "../pages/JobsPage";
import LandingPage from "../pages/LandingPage";
import NewsPage from "../pages/NewsPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import NewsDetailPage from "../pages/NewsDetailPage";

const RoadmapPage = () => <div className="p-8 text-center">Yol Haritaları yakında!</div>;

export const RouteList = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/giris-yap",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/kayit-ol",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: "/kariyer",
    element: (
      <PrivateRoute>
        <JobsPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/yol-haritalari",
    element: (
      <PrivateRoute>
        <RoadmapPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/haberler",
    element: <NewsPage />,
  },
  {
    path: "/haberler/:slug",
    element: <NewsDetailPage />,
  },
];
