"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedGridlabdPage from "@/components/ProtectedGridlabdPage";

export default function GridlabdClient({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    // Logged-in: IDE full width (no containers or borders)
    return <ProtectedGridlabdPage />;
  }

  // Logged-out: show public content (children) + sticky IDE sidebar
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10 md:grid md:grid-cols-5 md:gap-6">
      <div className="md:col-span-3">{children}</div>
      <aside className="mt-8 md:mt-0 md:col-span-2 self-start">
        <div className="md:sticky md:top-4">
          <div className="rounded-xl border bg-white shadow-sm p-4 sm:p-5 md:max-h-[calc(100vh-1rem)] md:overflow-auto">
            <ProtectedGridlabdPage />
          </div>
        </div>
      </aside>
    </div>
  );
}
