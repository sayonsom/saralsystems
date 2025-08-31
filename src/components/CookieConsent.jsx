"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

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
  let cookie = `${name}=${value}; Path=${path}; Max-Age=${maxAge}; SameSite=${sameSite}`;
  if (secure) cookie += "; Secure";
  document.cookie = cookie;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = useCallback(() => {
    setCookie("cookie_consent", "accepted");
    try {
      const url = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/";
      const existing = getCookie("visited_pages");
      const list = existing ? JSON.parse(decodeURIComponent(existing)) : [];
      if (list[list.length - 1] !== url) {
        list.push(url);
      }
      const serialized = encodeURIComponent(JSON.stringify(list.slice(-100)));
      setCookie("visited_pages", serialized, { days: 180 });
    } catch (_) {
      const url = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/";
      const serialized = encodeURIComponent(JSON.stringify([url]));
      setCookie("visited_pages", serialized, { days: 180 });
    }
    setVisible(false);
  }, []);

  const decline = useCallback(() => {
    setCookie("cookie_consent", "declined");
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-5xl px-4 pb-4">
        <div className="rounded-md border border-gray-200 bg-white/95 backdrop-blur p-4 shadow-lg">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-700">
              We use cookies to personalize content and remember your preferences. Please accept cookies for the best experience on our site.
            </p>
            <div className="flex gap-2 self-end md:self-auto">
              <Button variant="outline" size="sm" onClick={decline}>
                Decline
              </Button>
              <Button size="sm" onClick={accept}>
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
