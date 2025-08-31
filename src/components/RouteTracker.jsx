"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getCookie(name) {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return undefined;
}

function setCookie(name, value, options = {}) {
  if (typeof document === "undefined") return;
  const {
    days = 365,
    path = "/",
    sameSite = "Lax",
    secure = typeof window !== "undefined" && window.location?.protocol === "https:",
  } = options;

  const maxAge = Math.floor(days * 24 * 60 * 60);
  let cookie = `${name}=${value}; path=${path}; max-age=${maxAge}; samesite=${sameSite}`;
  if (secure) cookie += "; secure";
  document.cookie = cookie;
}

export default function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const consent = getCookie("cookie_consent");
    if (consent !== "accepted") return;

    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    try {
      const existing = getCookie("visited_pages");
      const list = existing ? JSON.parse(decodeURIComponent(existing)) : [];
      // Avoid duplicates for consecutive visits to same URL
      if (list[list.length - 1] !== url) {
        list.push(url);
        const serialized = encodeURIComponent(JSON.stringify(list.slice(-100)));
        setCookie("visited_pages", serialized, { days: 180 });
      }
    } catch (e) {
      // Reset on parse errors
      const serialized = encodeURIComponent(JSON.stringify([url]));
      setCookie("visited_pages", serialized, { days: 180 });
    }
  }, [pathname, searchParams]);

  return null;
}
