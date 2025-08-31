"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export const metadata = {
  title: 'Smart Meter Load Disaggregation',
  description: 'AI-based NILM to extract appliance-level consumption from smart meter time series. Upload data, analyze loads, and export reports.',
  keywords: ['smart meter','NILM','load disaggregation','appliance detection','AMI analytics','meter data analytics'],
  alternates: { canonical: '/tools/smart-meter-load-disaggregation' },
  openGraph: {
    title: 'Smart Meter Load Disaggregation | Saral',
    description: 'Appliance-level energy insights from smart meter data using AI-based NILM.',
    url: 'https://www.saralsystems.co/tools/smart-meter-load-disaggregation',
    images: [{ url: '/vercel.svg', width: 1200, height: 630, alt: 'Smart Meter Load Disaggregation' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Meter Load Disaggregation | Saral',
    description: 'Extract appliance-level loads from smart meter data using AI.',
    images: ['/vercel.svg'],
  },
};

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
