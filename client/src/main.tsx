import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "@/components/error-boundary";
import "./index.css";

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
