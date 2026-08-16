import { createRoot } from "react";
import App from "./App";
import { ErrorBoundary } from "@/components/error-boundary";
import "./index.css";

// Unregister any legacy service worker to prevent stale browser disk caching
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
    }
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
