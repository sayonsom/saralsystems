import { auth } from "@/lib/firebase";

// Normalize backend base (strip trailing slashes)
const RAW_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";
const BASE_URL = RAW_BASE.replace(/\/+$/, "");

// Enable sending Authorization header when user logged in
const SEND_AUTH_HEADER = true;

export async function getAuthHeader() {
  try {
    if (!SEND_AUTH_HEADER) return {};
    
    const user = auth.currentUser;
    if (!user) {
      // No user logged in - don't send any auth header
      // This prevents demo token interference with real user sessions
      console.log('[API] No authenticated user - skipping auth header');
      return {};
    }
    
    // Get fresh token for authenticated user
    const token = await user.getIdToken(true);
    console.log('[API] Auth header prepared for:', user.email);
    return { Authorization: `Bearer ${token}` };
  } catch (error) {
    console.error('[API] Failed to get auth token:', error);
    // Don't fall back to demo token - just return empty headers
    return {};
  }
}

function isJsonResponse(resp) {
  const ct = resp.headers.get("content-type") || "";
  return ct.includes("application/json");
}

export async function apiFetch(path, opts = {}) {
  const { noRedirect401, forceLocal, allowAnonymous = false, ...rest } = opts;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = forceLocal ? cleanPath : `${BASE_URL}${cleanPath}`;

  const authHeader = await getAuthHeader();
  const sentAuth = Boolean(authHeader.Authorization);
  const headers = { ...(rest.headers || {}), ...authHeader };
  const init = forceLocal ? { ...rest, headers } : { mode: 'cors', ...rest, headers };

  console.log('[API] Fetching:', url, 'Auth:', sentAuth ? 'Yes' : 'No');

  let res;
  try {
    res = await fetch(url, init);
  } catch (err) {
    console.error('[API] Fetch error:', err);
    throw err;
  }

  // Handle 401 Unauthorized responses
  if (res.status === 401) {
    console.log('[API] Got 401 response');
    
    // Only attempt token refresh if we have an authenticated user
    const user = auth.currentUser;
    if (sentAuth && user) {
      try {
        console.log('[API] Attempting token refresh for:', user.email);
        const newToken = await user.getIdToken(true);
        const retryHeaders = {
          ...(rest.headers || {}),
          Authorization: `Bearer ${newToken}`
        };
        res = await fetch(url, forceLocal ? { ...rest, headers: retryHeaders } : { mode: 'cors', ...rest, headers: retryHeaders });
        
        if (res.ok) {
          console.log('[API] Token refresh successful');
        }
      } catch (refreshError) {
        console.error('[API] Token refresh failed:', refreshError);
      }
    }
    
    // After retry, if still 401 and not allowing anonymous access, redirect to signin
    if (res.status === 401) {
      if (!noRedirect401 && !allowAnonymous && auth.currentUser) {
        console.log('[API] Redirecting to signin due to persistent 401');
        if (typeof window !== "undefined" && window.location.pathname !== "/signin") {
          setTimeout(() => { window.location.href = "/signin"; }, 50);
        }
      } else if (!auth.currentUser && !allowAnonymous) {
        console.log('[API] No user authenticated and anonymous not allowed');
        if (typeof window !== "undefined" && window.location.pathname !== "/signin") {
          setTimeout(() => { window.location.href = "/signin"; }, 50);
        }
      }
    }
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error('[API] Request failed:', res.status, txt);
    throw new Error(txt || `Request failed: ${res.status}`);
  }

  return isJsonResponse(res) ? res.json() : res.blob();
}

// Helper to clear auth cache and force re-authentication
export async function clearAuthCache() {
  try {
    const user = auth.currentUser;
    if (user) {
      console.log('[API] Clearing auth cache for:', user.email);
      await user.getIdToken(true); // Force refresh
    }
  } catch (error) {
    console.error('[API] Failed to clear auth cache:', error);
  }
}
