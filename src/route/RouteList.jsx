import JobsPage from "../pages/JobsPage";
import LandingPage from "../pages/LandingPage";

export const RouteList = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/kariyer",
    element: <JobsPage />,
  },
];
