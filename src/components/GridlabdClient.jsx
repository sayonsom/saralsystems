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

  // Logged-out: show only public content in a wide container; no right panel
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {children}
    </div>
  );
}
