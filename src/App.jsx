import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RouteList } from "./route/RouteList";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {RouteList.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
