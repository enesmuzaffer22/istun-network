import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import routes from "./route/routes";
import { useAuthStore } from "./store";

const PrivateRoute = ({ element: Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Element /> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ element: Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <Element /> : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {routes.map((route, idx) => {
          if (route.isPrivate && route.children) {
            // Layout ve children'lı private route
            return (
              <Route key={idx} path={route.path} element={<route.element />}>
                {route.children.map((child, cidx) => {
                  const Element = React.lazy(child.component);
                  return (
                    <Route
                      key={cidx}
                      index={child.path === ""}
                      path={child.path}
                      element={
                        <React.Suspense fallback={<div>Yükleniyor...</div>}>
                          <PrivateRoute element={Element} />
                        </React.Suspense>
                      }
                    />
                  );
                })}
              </Route>
            );
          } else {
            // Public veya eski tip private route
            const Element = React.lazy(route.component);
            const Wrapper = route.isPrivate ? PrivateRoute : PublicRoute;
            return (
              <Route
                key={idx}
                path={route.path}
                element={
                  <React.Suspense fallback={<div>Yükleniyor...</div>}>
                    <Wrapper element={Element} />
                  </React.Suspense>
                }
              />
            );
          }
        })}
      </Routes>
    </Router>
  );
};

export default App;
