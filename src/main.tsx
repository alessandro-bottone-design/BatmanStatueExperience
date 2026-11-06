import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import NotFound from "./features/not-found/NotFound";
import "./index.css";
const root = document.getElementById("root")!;
const notFound =
  root.hasAttribute("data-not-found") ||
  !["/", "/index.html"].includes(location.pathname);
if (notFound) document.title = "404 | Batman Statue Experience";
createRoot(root).render(
  <StrictMode>{notFound ? <NotFound /> : <App />}</StrictMode>,
);
