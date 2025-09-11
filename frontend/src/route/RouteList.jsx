import JobsPage from "../pages/JobsPage";
import LandingPage from "../pages/LandingPage";
import NewsPage from "../pages/NewsPage";
import AnnouncementsPage from "../pages/AnnouncementsPage";
import AnnouncementDetailPage from "../pages/AnnouncementDetailPage";
import EventsPage from "../pages/EventsPage";
import EventDetailPage from "../pages/EventDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ProfilePage from "../pages/ProfilePage";
import AboutUsPage from "../pages/AboutUsPage";
import SocialImpactPage from "../pages/SocialImpactPage";
import BridgeProjectsPage from "../pages/BridgeProjectsPage";
import ActivityDetailPage from "../pages/ActivityDetailPage";
import AchievementsPage from "../pages/AchievementsPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import NewsDetailPage from "../pages/NewsDetailPage";
import JobDetailPage from "../pages/JobDetailPage";
import RoadmapsPage from "../pages/RoadmapsPage";
import RoadmapDetailPage from "../pages/RoadmapDetailPage";

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
    path: "/sifremi-unuttum",
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
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
    // DEĞİŞİKLİK BURADA: :slug yerine :id kullandık.
    path: "/kariyer/:id",
    element: (
      <PrivateRoute>
        <JobDetailPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/yol-haritalari",
    element: (
      <PrivateRoute>
        <RoadmapsPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/yol-haritalari/:id",
    element: (
      <PrivateRoute>
        <RoadmapDetailPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/haberler",
    element: <NewsPage />,
  },
  {
    path: "/haberler/:id",
    element: <NewsDetailPage />,
  },
  {
    path: "/duyurular",
    element: <AnnouncementsPage />,
  },
  {
    path: "/duyurular/:id",
    element: <AnnouncementDetailPage />,
  },
  {
    path: "/etkinlikler",
    element: <EventsPage />,
  },
  {
    path: "/etkinlikler/:id",
    element: <EventDetailPage />,
  },
  {
    path: "/profil",
    element: (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/hakkimizda",
    element: <AboutUsPage />,
  },
  {
    path: "/sosyal-etki",
    element: <SocialImpactPage />,
  },
  {
    path: "/birlikte-iz-birak",
    element: <BridgeProjectsPage />,
  },
  {
    path: "/birlikte-iz-birak/etkinlik/:id",
    element: <ActivityDetailPage />,
  },
  {
    path: "/basarilarimiz",
    element: <AchievementsPage />,
  },
];
