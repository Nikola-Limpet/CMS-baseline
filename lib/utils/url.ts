/**
 * Helper function to get the correct base URL for API calls
 * Handles different deployment environments (local, Vercel, custom domain)
 */
export function getBaseURL(): string {
  // If we have an explicit API URL set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // For client-side (browser), use relative URLs
  if (typeof window !== 'undefined') {
    return '';
  }

  // For server-side, construct the full URL
  // Check for Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Check for custom deployment URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    // Ensure the URL has a protocol
    const url = process.env.NEXT_PUBLIC_APP_URL;
    return url.startsWith('http') ? url : `https://${url}`;
  }

  // Fallback for local development
  // Check if we're running on a different port (like 3001 when 3000 is busy)
  const port = process.env.PORT || process.env.NEXT_PUBLIC_PORT || 3000;
  console.log('🔧 Using port for API calls:', port);
  return `http://localhost:${port}`;
}

/**
 * Helper function to construct API URLs
 */
export function getApiURL(path: string): string {
  const baseURL = getBaseURL();

  // Normalize the path
  const apiPath = path.startsWith('/') ? path : `/${path}`;

  // Avoid duplicate /api prefix
  if (apiPath.startsWith('/api/')) {
    return `${baseURL}${apiPath}`;
  }

  return `${baseURL}/api${apiPath}`;
} 