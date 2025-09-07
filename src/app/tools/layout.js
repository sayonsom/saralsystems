"use client";

import { Suspense } from 'react';

function ToolsLayoutContent({ children }) {
  return (
    <div className="min-h-screen h-screen w-full bg-gray-50 text-gray-900 flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden">
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
