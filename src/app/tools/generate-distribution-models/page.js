"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export const metadata = {
  title: 'Generate Distribution System Models',
  description: 'Automatically build feeder and distribution network models from GIS layers, demand data, and templates. Export to GridLAB-D or OpenDSS.',
  keywords: ['distribution models','feeder model','GIS to model','OpenDSS','GridLAB-D','power system modeling','automation'],
  alternates: { canonical: '/tools/generate-distribution-models' },
  openGraph: {
    title: 'Generate Distribution System Models | Saral',
    description: 'Create feeder and network models from GIS and demand data. Export to GridLAB-D/OpenDSS and simulate.',
    url: 'https://www.saralsystems.co/tools/generate-distribution-models',
    images: [{ url: '/vercel.svg', width: 1200, height: 630, alt: 'Generate Distribution System Models' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generate Distribution System Models | Saral',
    description: 'Generate feeder/network models from GIS and demand data, ready for GridLAB-D/OpenDSS.',
    images: ['/vercel.svg'],
  },
};

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
