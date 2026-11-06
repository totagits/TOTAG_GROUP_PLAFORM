import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "@/components/error-boundary";
import "./index.css";

// Kitchen is a scoped, installable PWA. Private orders, staff screens and messages remain network-only.
if (typeof window !== "undefined") {
  const kitchen = window.location.pathname.startsWith("/catering/kitchen");
  if (kitchen) {
    document.querySelector('link[rel="manifest"]')?.setAttribute("href","/kitchen-manifest.json");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content","#052e16");
    document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute("content","TOTAG Kitchen");
    if ("serviceWorker" in navigator) {
      window.addEventListener("load",() => {
        navigator.serviceWorker.register("/sw.js",{scope:"/catering/kitchen"})
          .catch(error=>console.warn("Kitchen offline shell registration unavailable:",error));
      },{once:true});
    }
  } else {
    // Preserve the existing no-cache behavior for other TOTAG applications during this staged upgrade.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations=>{
        for(const registration of registrations) registration.unregister();
      }).catch(()=>{});
    }
    if ("caches" in window) {
      caches.keys().then(keys=>{for(const key of keys)caches.delete(key);}).catch(()=>{});
    }
  }
}

// Global window error listener for seamless recovery
window.addEventListener('error', (event) => {
  console.error("Runtime window error captured:", event.error);
});

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
