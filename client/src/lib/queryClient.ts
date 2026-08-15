import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiUrl } from "./config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    
    // Handle authentication errors gracefully (don't trigger runtime error overlay)
    if (res.status === 401) {
      console.log(`Authentication failed: ${text}`);
      // Create a structured error for auth failures
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
        // Add authorization header if token exists
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
    
    // Return parsed JSON response
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`API Request Failed: ${method} ${fullUrl}`, error);
    
    // Provide more detailed error information
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to reach server at ${fullUrl}. Please check your internet connection or try again later.`);
    }
    
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Handle queryKey validation
    if (!queryKey || (Array.isArray(queryKey) && queryKey.length === 0)) {
      console.error("Invalid queryKey provided to query function");
      throw new Error("Invalid queryKey provided");
    }
    
    const endpoint = Array.isArray(queryKey) && queryKey.length > 0 ? queryKey[0] : queryKey;
    
    if (!endpoint || typeof endpoint !== 'string') {
      console.error("Invalid endpoint in queryKey:", queryKey);
      throw new Error("Invalid endpoint in queryKey");
    }
    
    const url = getApiUrl(endpoint);
    console.log("Attempting to fetch:", url);
    
    try {
      // Build headers with optional Authorization
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      const token = localStorage.getItem('saas_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(url, {
        credentials: "include",
        mode: "cors",
        headers,
      });

      console.log("Fetch response:", { status: res.status, ok: res.ok, statusText: res.statusText });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Query data received:", data);
      return data;
    } catch (error: any) {
      console.error("Query function error for", endpoint, ":", error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false, // Let our custom retry logic handle this
    },
    mutations: {
      retry: false,
    },
  },
});
