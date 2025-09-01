"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ProjectsDashboard from "@/components/gridlabd/ProjectsDashboard";

export default function ProtectedGridlabdPage() {
  return (
    <ProtectedRoute>
      {/* Show projects dashboard (list or empty state). From there, open IDE per project. */}
      <ProjectsDashboard />
    </ProtectedRoute>
  );
}
