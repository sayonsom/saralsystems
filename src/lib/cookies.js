export function getCookie(name) {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return undefined;
}

export function setCookie(name, value, options = {}) {
  if (typeof document === "undefined") return;
  const {
    days = 365,
    path = "/",
    sameSite = "Lax",
    secure = typeof window !== "undefined" && window.location?.protocol === "https:",
  } = options;

  const maxAge = Math.floor(days * 24 * 60 * 60);
  let cookie = `${name}=${value}; Path=${path}; Max-Age=${maxAge}; SameSite=${sameSite}`;
  if (secure) cookie += "; Secure";
  document.cookie = cookie;
}

export function getConsentAccepted() {
  return getCookie("cookie_consent") === "accepted";
}

export function getJsonCookie(name, fallback) {
  try {
    const raw = getCookie(name);
    if (!raw) return fallback;
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return fallback;
  }
}

export function setJsonCookie(name, obj, options) {
  try {
    const serialized = encodeURIComponent(JSON.stringify(obj));
    setCookie(name, serialized, options);
  } catch {
    // ignore
  }
}
