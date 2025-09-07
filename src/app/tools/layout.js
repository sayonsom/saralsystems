"use client";

import { Suspense } from 'react';
import Header from '@/components/Header';

function ToolsLayoutContent({ children }) {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <Header />
      <main className="pt-16 h-[calc(100vh-4rem)] flex flex-col overflow-hidden">{/* 4rem = header height */}
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
