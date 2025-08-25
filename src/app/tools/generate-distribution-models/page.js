"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function GenerateDistributionModels() {
  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
          <Link href="/tools" className="hover:text-gray-700">Tools</Link>
          <span className="mx-2">/</span>
          <span>Generate Distribution System Models</span>
        </nav>
        <header>
          <h1 className="text-3xl font-bold mb-3">Generate Distribution System Models</h1>
          <p className="text-gray-700 mb-6">Automatically build feeder and network models from GIS layers, demand data, and standard templates.</p>
        </header>
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-700">This tool is coming soon. It will help you generate feeder and network models from GIS and demand data.</p>
        </section>
      </div>
    </ProtectedRoute>
  );
}
