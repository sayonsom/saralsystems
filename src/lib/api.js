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
    if (!user) return {}; // anonymous flow
    const token = await user.getIdToken(true);
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

function isJsonResponse(resp) {
  const ct = resp.headers.get("content-type") || "";
  return ct.includes("application/json");
}

export async function apiFetch(path, opts = {}) {
  const { noRedirect401, ...rest } = opts; // flag to suppress redirect on 401
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${BASE_URL}${cleanPath}`;

  const authHeader = await getAuthHeader();
  const sentAuth = Boolean(authHeader.Authorization);
  const headers = { ...(rest.headers || {}), ...authHeader };
  const init = { mode: "cors", ...rest, headers };

  let res = await fetch(url, init);

  if (res.status === 401) {
    // Only attempt refresh if we actually sent an auth header and a user exists
    const user = auth.currentUser;
    if (sentAuth && user) {
      try {
        await user.getIdToken(true);
        const retryHeaders = { ...(rest.headers || {}), ...(await getAuthHeader()) };
        res = await fetch(url, { mode: "cors", ...rest, headers: retryHeaders });
      } catch {}
    }
    // After optional retry, if still 401 decide whether to redirect
    if (res.status === 401) {
      if (!noRedirect401 && sentAuth && auth.currentUser) {
        if (typeof window !== "undefined" && window.location.pathname !== "/signin") {
          setTimeout(() => { window.location.href = "/signin"; }, 50);
        }
      }
    }
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Request failed: ${res.status}`);
  }

  return isJsonResponse(res) ? res.json() : res.blob();
}
