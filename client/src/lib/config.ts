// Environment configuration for API endpoints
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // The isolated Kitchen staging domain serves its API through the same Nginx origin.
    // Do not send staging orders or currency requests to the legacy production host.
    if (host === "kitchen-staging.totaggroup.com") {
      return window.location.origin;
    }
    if (host.includes("github.io") || host === "totaggroup.com" || host.includes("totaggroup") || host === "totag.network" || host.includes("totag")) {
      return "https://srv1902704.hstgr.cloud";
    }
  }
  return import.meta.env.VITE_API_BASE_URL || "https://srv1902704.hstgr.cloud";
}

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const base = getApiBaseUrl();
  return `${base}${cleanEndpoint}`;
}

export const config = {
  apiBaseUrl: getApiBaseUrl(),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
