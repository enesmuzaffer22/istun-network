import JobsPage from "../pages/JobsPage";
import LandingPage from "../pages/LandingPage";
import NewsPage from "../pages/NewsPage";

export const RouteList = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/kariyer",
    element: <JobsPage />,
  },
  {
    path: "/haberler",
    element: <NewsPage />,
  },
];
