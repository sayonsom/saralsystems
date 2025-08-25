"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function SmartMeterLoadDisaggregation() {
  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
          <Link href="/tools" className="hover:text-gray-700">Tools</Link>
          <span className="mx-2">/</span>
          <span>Smart Meter Load Disaggregation</span>
        </nav>
        <header>
          <h1 className="text-3xl font-bold mb-3">Smart Meter Load Disaggregation</h1>
          <p className="text-gray-700 mb-6">Appliance-level energy insights from smart meter time series data. Upload data and run AI-based NILM.</p>
        </header>
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-700">This tool is coming soon. Here you will be able to upload smart meter data and run appliance-level disaggregation.</p>
        </section>
      </div>
    </ProtectedRoute>
  );
}
