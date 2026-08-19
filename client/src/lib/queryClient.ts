import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiUrl } from "./config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    
    // Handle authentication errors gracefully (don't trigger runtime error overlay)
    if (res.status === 401) {
      console.log(`Authentication failed: ${text}`);
      const error = new Error(`Authentication failed: ${text}`);
      (error as any).status = 401;
      (error as any).isAuthError = true;
      throw error;
    }
    
    console.error(`API Error: ${res.status} ${res.statusText}`, text);
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: {
    method?: string;
    body?: string;
  }
): Promise<any> {
  const fullUrl = getApiUrl(url);
  const method = options?.method || 'GET';
  
  console.log(`API Request: ${method} ${fullUrl}`, options?.body ? { body: options.body } : {});
  
  try {
    const res = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem('saas_token') ? {
          'Authorization': `Bearer ${localStorage.getItem('saas_token')}`
        } : {})
      },
      body: options?.body,
      credentials: "include",
      mode: "cors",
    });

    console.log(`API Response: ${res.status} ${res.statusText}`);
    await throwIfResNotOk(res);
    
    // Return parsed JSON response with backward-compatible .json() helper
    const data = await res.json();
    if (data && typeof data === 'object') {
      try {
        if (!('json' in data)) {
          Object.defineProperty(data, 'json', {
            value: async () => data,
            enumerable: false,
            configurable: true,
            writable: true
          });
        }
        if (!('ok' in data)) {
          Object.defineProperty(data, 'ok', {
            value: true,
            enumerable: false,
            configurable: true,
            writable: true
          });
        }
      } catch (_) {}
    }
    return data;
  } catch (error) {
    console.error(`API Request Failed: ${method} ${fullUrl}`, error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Failed to connect to backend server at ${fullUrl}. Please ensure the server is running.`);
    }
    
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  onUnauthorized: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ onUnauthorized: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const fullUrl = getApiUrl(queryKey[0] as string);
    const res = await fetch(fullUrl, {
      credentials: "include",
      headers: {
        ...(localStorage.getItem('saas_token') ? {
          'Authorization': `Bearer ${localStorage.getItem('saas_token')}`
        } : {})
      }
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ onUnauthorized: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
