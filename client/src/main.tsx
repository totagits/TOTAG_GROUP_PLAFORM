import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Suppress unhandled promise rejections during development
window.addEventListener('unhandledrejection', (event) => {
  if (import.meta.env.DEV) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
