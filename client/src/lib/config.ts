// Environment configuration for API endpoints
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("github.io") || host === "totaggroup.com" || host.includes("totaggroup") || host === "totag.network" || host.includes("totag")) {
      return "https://totaggroup.com";
    }
  }
  return import.meta.env.VITE_API_BASE_URL || "https://totaggroup.com";
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
