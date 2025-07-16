import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RouteList } from "./route/RouteList";
import MainLayout from "./layout/MainLayout.jsx";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            {RouteList.filter((item) => item.path !== "*").map(
              (item, index) => (
                <Route path={item.path} key={index} element={item.element} />
              )
            )}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
