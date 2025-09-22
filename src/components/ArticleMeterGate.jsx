"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getConsentAccepted, getJsonCookie, setJsonCookie } from "@/lib/cookies";

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function ArticleMeterGate({ slug, children }) {
  const { user } = useAuth();
  const [allowed, setAllowed] = useState(true);
  const [count, setCount] = useState(0);

  const month = useMemo(() => currentMonthKey(), []);

  useEffect(() => {
    // Logged in users are not metered
    if (user) {
      setAllowed(true);
      return;
    }

    if (!getConsentAccepted()) {
      // No consent -> don't track or gate
      setAllowed(true);
      return;
    }

    const cookie = getJsonCookie("free_reads", { month, slugs: [] });
    let { month: savedMonth, slugs } = cookie || {};
    if (savedMonth !== month) {
      // reset month
      savedMonth = month;
      slugs = [];
    }

    const alreadyRead = slugs.includes(slug);
    const limit = 5;
    const canRead = alreadyRead || slugs.length < limit;

    setAllowed(canRead);
    setCount(slugs.length);

    if (canRead && !alreadyRead) {
      const updated = { month: savedMonth, slugs: [...slugs, slug] };
      setJsonCookie("free_reads", updated, { days: 62 });
      setCount(updated.slugs.length);
    } else {
      // keep cookie as is (don't add slug if over the limit)
      setJsonCookie("free_reads", { month: savedMonth, slugs }, { days: 62 });
    }
  }, [slug, user, month]);

  if (allowed) return children;

  return (
    <div className="relative">
      <div className="pointer-events-none blur-sm select-none opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="max-w-lg w-full rounded-none border border-gray-200 bg-white/95 backdrop-blur shadow-xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">You've reached your 5 free articles this month</h3>
          <p className="text-sm text-gray-700 mb-4">
            Create a free account to keep reading and access all Insights.
          </p>
          <div className="flex justify-center gap-2">
            <a href="/" className="px-4 py-2 border border-gray-300 text-gray-900 hover:bg-gray-100">Go Home</a>
            <a href="#contact" className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700">Contact Us</a>
          </div>
          <div className="mt-3 text-xs text-gray-500">Reads this month: {count} / 5</div>
        </div>
      </div>
    </div>
  );
}
