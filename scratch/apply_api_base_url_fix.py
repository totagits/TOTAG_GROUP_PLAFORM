import re

config_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\lib\config.ts"
dashboard_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\ops\dashboard.tsx"
login_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\ops\login.tsx"

# 1. Update config.ts
config_code = '''// Environment configuration for API endpoints
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("github.io") || host === "totag.network" || host.includes("totag")) {
      return "http://srv1902704.hstgr.cloud";
    }
  }
  return import.meta.env.VITE_API_BASE_URL || "http://srv1902704.hstgr.cloud";
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
'''

with open(config_path, "w", encoding="utf-8") as f:
    f.write(config_code)
print("Updated client/src/lib/config.ts!")

# 2. Update dashboard.tsx cateringFetch
with open(dashboard_path, "r", encoding="utf-8") as f:
    dash_code = f.read()

catering_fetch_replacement = '''function getCateringApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("github.io") || host === "totag.network" || host.includes("totag")) {
      return `http://srv1902704.hstgr.cloud${cleanEndpoint}`;
    }
  }
  return cleanEndpoint;
}

async function cateringFetch(url: string, options?: RequestInit) {
  const fullUrl = getCateringApiUrl(url);
  const res = await fetch(fullUrl, {
    ...options,
    headers: { ...getAuthHeaders(), ...options?.headers }
  });

  if (res.status === 401) {
    localStorage.removeItem("catering_token");
    localStorage.removeItem("catering_user");
    window.location.href = "/catering/ops/login";
    throw new Error("Session expired");
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Server returned invalid content-type (${res.status}): ${text.slice(0, 100)}`);
  }

  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Operation failed");
  return data;
}'''

dash_code = re.sub(
    r'async function cateringFetch\(url: string, options\?: RequestInit\) \{[\s\S]*?return data;\n\}',
    catering_fetch_replacement,
    dash_code
)

with open(dashboard_path, "w", encoding="utf-8") as f:
    f.write(dash_code)
print("Updated cateringFetch in client/src/pages/catering/ops/dashboard.tsx!")

# 3. Update login.tsx to use getCateringApiUrl
with open(login_path, "r", encoding="utf-8") as f:
    login_code = f.read()

if 'getCateringApiUrl' not in login_code:
    login_code = '''function getCateringApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("github.io") || host === "totag.network" || host.includes("totag")) {
      return `http://srv1902704.hstgr.cloud${cleanEndpoint}`;
    }
  }
  return cleanEndpoint;
}
''' + login_code
    login_code = login_code.replace(
        'fetch("/api/catering/auth/login"',
        'fetch(getCateringApiUrl("/api/catering/auth/login")'
    )

with open(login_path, "w", encoding="utf-8") as f:
    f.write(login_code)
print("Updated client/src/pages/catering/ops/login.tsx!")
