"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export const metadata = {
  title: 'Satellite-based Resilience Monitoring',
  description: 'Track grid resilience using Earth observation data and AI analytics. Monitor outages, vegetation, and infrastructure risks.',
  keywords: ['satellite monitoring','grid resilience','EO data','remote sensing','outage detection','vegetation risk'],
  alternates: { canonical: '/tools/satellite-resilience-monitoring' },
  openGraph: {
    title: 'Satellite-based Resilience Monitoring | Saral',
    description: 'Use satellite data and AI to monitor grid resilience and risks.',
    url: 'https://www.saralsystems.co/tools/satellite-resilience-monitoring',
    images: [{ url: '/vercel.svg', width: 1200, height: 630, alt: 'Satellite-based Resilience Monitoring' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Satellite-based Resilience Monitoring | Saral',
    description: 'Satellite and AI analytics for grid resilience monitoring.',
    images: ['/vercel.svg'],
  },
};

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
