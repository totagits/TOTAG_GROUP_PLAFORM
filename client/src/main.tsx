import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "@/components/error-boundary";
import "./index.css";

// Register TOTAG Enterprise PWA Service Worker for Offline Field Capabilities
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      console.log("TOTAG Field PWA Worker active:", reg.scope);
    }).catch((err) => {
      console.log("Service Worker registration info:", err);
    });
  });
}

// Suppress unhandled promise rejections during development
window.addEventListener('unhandledrejection', (event) => {
  if (import.meta.env.DEV) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
