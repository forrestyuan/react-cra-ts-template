import React from "react";
import "./App.scss";
import { useRoutes } from "react-router-dom";
export function App() {
  const routes = useRoutes([
    { path: "login", element: <h1>登录页面🏮</h1> },
    { path: "/", element: <div>hello world</div> },
  ]);

  return routes;
}
