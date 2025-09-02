import { auth } from "@/lib/firebase";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

export async function getAuthHeader() {
  // Dev: use a fixed token so backend can bypass auth
  if (process.env.NODE_ENV !== "production") {
    return { Authorization: "Bearer dev" };
  }
  try {
    const user = auth.currentUser;
    if (!user) return { Authorization: "Bearer dev" };
    const token = await user.getIdToken(/* forceRefresh */ false);
    return { Authorization: `Bearer ${token}` };
  } catch (e) {
    return { Authorization: "Bearer dev" };
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
  const init = { ...opts, headers };

  const res = await fetch(url, init);
  if (!res.ok) {
    // If unauthorized in prod, try refresh token once
    if (res.status === 401 && process.env.NODE_ENV === "production") {
      try {
        const user = auth.currentUser;
        if (user) await user.getIdToken(true);
        const retryHeaders = { ...(opts.headers || {}), ...(await getAuthHeader()) };
        const retry = await fetch(url, { ...opts, headers: retryHeaders });
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
