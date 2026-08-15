// Environment configuration for API endpoints
export const config = {
  apiBaseUrl: import.meta.env.PROD 
    ? import.meta.env.VITE_API_BASE_URL || 'https://totaggroup.com' // Use environment variable or fallback
    : '', // Use relative URLs in development since Vite serves both frontend and backend
    
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Helper function to build API URLs
export function getApiUrl(endpoint: string): string {
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // In development, use relative URLs since Express and Vite are integrated
  // In production, use full URL
  if (config.isDevelopment) {
    return cleanEndpoint;
  }
  
  return `${config.apiBaseUrl}${cleanEndpoint}`;
}