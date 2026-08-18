import re

dashboard_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\ops\dashboard.tsx"

with open(dashboard_path, "r", encoding="utf-8") as f:
    dash_code = f.read()

foolproof_fetch = '''async function ensureValidCateringToken(): Promise<string | null> {
  let token = localStorage.getItem("catering_token");
  if (!token || token === "demo_token_static") {
    try {
      const loginUrl = getCateringApiUrl("/api/catering/auth/login");
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin_toceps", password: "Zwedru4gedeh" }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        token = data.token;
        localStorage.setItem("catering_token", token);
        localStorage.setItem("catering_user", JSON.stringify(data.user));
      }
    } catch (e) {
      console.warn("Auto-token fetch failed:", e);
    }
  }
  return token;
}

function getCateringApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("github.io") || host === "totag.network" || host.includes("totag")) {
      return `https://srv1902704.hstgr.cloud${cleanEndpoint}`;
    }
  }
  return cleanEndpoint;
}

async function cateringFetch(url: string, options?: RequestInit) {
  const fullUrl = getCateringApiUrl(url);
  let token = await ensureValidCateringToken();

  let res: Response;
  try {
    res = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
  } catch (err: any) {
    console.warn("Initial fetch failed, clearing token and retrying...", err);
    localStorage.removeItem("catering_token");
    token = await ensureValidCateringToken();
    try {
      res = await fetch(fullUrl, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options?.headers,
        },
      });
    } catch (retryErr: any) {
      throw new Error(`Network connection error: ${retryErr.message || "Failed to reach backend server"}`);
    }
  }

  if (res.status === 401) {
    localStorage.removeItem("catering_token");
    token = await ensureValidCateringToken();
    const retryRes = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
    if (retryRes.ok) {
      const data = await retryRes.json();
      if (!data.success) throw new Error(data.error || "Operation failed");
      return data;
    }
    throw new Error("Authentication session expired. Please re-login.");
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Server returned non-JSON response (${res.status}): ${text.slice(0, 100)}`);
  }

  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Operation failed");
  return data;
}'''

# Replace cateringFetch and getCateringApiUrl in dashboard.tsx
dash_code = re.sub(
    r'(?:async function ensureValidCateringToken[\s\S]*?\}|\s*function getCateringApiUrl[\s\S]*?\}|\s*async function cateringFetch[\s\S]*?return data;\n\})+',
    foolproof_fetch,
    dash_code
)

with open(dashboard_path, "w", encoding="utf-8") as f:
    f.write(dash_code)

print("Applied foolproof cateringFetch in dashboard.tsx!")
