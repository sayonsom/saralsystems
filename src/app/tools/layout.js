"use client";

import { Suspense } from 'react';
import Header from '@/components/Header';

function ToolsLayoutContent({ children }) {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      {/* Global header */}
      <Header />
      {/* Page content with spacing under fixed header */}
      <main className="pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}

export default function ToolsLayout({ children }) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ToolsLayoutContent>{children}</ToolsLayoutContent>
    </Suspense>
  );
}
