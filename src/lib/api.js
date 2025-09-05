import { auth } from "@/lib/firebase";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

// Temporary toggle to disable sending Authorization header from the frontend
const SEND_AUTH_HEADER = false;

export async function getAuthHeader() {
  // Always use Firebase ID token; never send Google OAuth access token
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
  const url = `${BASE_URL}${path}`;
  const authHeader = await getAuthHeader();
  const headers = { ...(opts.headers || {}), ...authHeader };
  const init = { mode: "cors", ...opts, headers };

  const res = await fetch(url, init);
  if (!res.ok) {
    // If unauthorized, try refresh token once and retry (only when auth header is enabled)
    if (res.status === 401 && SEND_AUTH_HEADER) {
      try {
        const user = auth.currentUser;
        if (user) await user.getIdToken(true);
        const retryHeaders = { ...(opts.headers || {}), ...(await getAuthHeader()) };
        const retry = await fetch(url, { mode: "cors", ...opts, headers: retryHeaders });
        if (!retry.ok) throw new Error(await retry.text());
        return isJsonResponse(retry) ? retry.json() : retry.blob();
      } catch (e) {
        throw e;
      }
    }
    const txt = await res.text();
    throw new Error(txt || `Request failed: ${res.status}`);
  }

  return isJsonResponse(res) ? res.json() : res.blob();
}
