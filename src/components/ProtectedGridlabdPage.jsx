"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import GridlabdIDE from "@/components/GridlabdIDE";

export default function ProtectedGridlabdPage() {
  return (
    <ProtectedRoute>
      <GridlabdIDE />
    </ProtectedRoute>
  );
}
