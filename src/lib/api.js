import { auth } from "@/lib/firebase";

// Normalize backend base (strip trailing slashes)
const RAW_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";
const BASE_URL = RAW_BASE.replace(/\/+$/, "");

// Enable sending Authorization header
const SEND_AUTH_HEADER = true;

export async function getAuthHeader() {
  try {
    if (!SEND_AUTH_HEADER) return {};
    const user = auth.currentUser;
    if (!user) return {};
    const token = await user.getIdToken(true);
    return { Authorization: `Bearer ${token}` };
  } catch (e) {
    return {};
  }
}

function isJsonResponse(resp) {
  const ct = resp.headers.get("content-type") || "";
  return ct.includes("application/json");
}

export async function apiFetch(path, opts = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${BASE_URL}${cleanPath}`; // guaranteed single slash join
  const authHeader = await getAuthHeader();
  const headers = { ...(opts.headers || {}), ...authHeader };
  const init = { mode: "cors", ...opts, headers };

  let res = await fetch(url, init);
  if (!res.ok) {
    if (res.status === 401 && SEND_AUTH_HEADER) {
      try {
        const user = auth.currentUser;
        if (user) await user.getIdToken(true);
        const retryHeaders = { ...(opts.headers || {}), ...(await getAuthHeader()) };
        res = await fetch(url, { mode: "cors", ...opts, headers: retryHeaders });
      } catch {}
      if (res.status === 401) {
        if (typeof window !== "undefined") {
          // Redirect to sign-in
          setTimeout(() => { window.location.href = "/signin"; }, 50);
        }
      }
    }
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `Request failed: ${res.status}`);
    }
  }
  return isJsonResponse(res) ? res.json() : res.blob();
}
