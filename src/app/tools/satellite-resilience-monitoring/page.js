"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function SatelliteResilienceMonitoring() {
  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
          <Link href="/tools" className="hover:text-gray-700">Tools</Link>
          <span className="mx-2">/</span>
          <span>Satellite-based Resilience Monitoring</span>
        </nav>
        <header>
          <h1 className="text-3xl font-bold mb-3">Satellite-based Resilience Monitoring</h1>
          <p className="text-gray-700 mb-6">Track grid resilience with Earth observation data and AI analytics across regions.</p>
        </header>
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-700">This tool is coming soon. Monitor grid resilience using satellite data and AI analytics.</p>
        </section>
      </div>
    </ProtectedRoute>
  );
}
