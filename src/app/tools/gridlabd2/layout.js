import React from 'react';
import Footer from '../../../components/Footer';

export const metadata = {
  metadataBase: new URL('https://gridguard.saralsystems.co'),
  title: {
    default: 'GridLAB-D Cloud | Run Distribution Systems Planning Simulations in the Cloud',
    template: '%s | SARAL'
  },
  description:
    'GridGuard provides AI-driven smart meter data analytics for Indian DISCOMs to detect electricity theft, reduce AT&C losses, improve billing & collection efficiency, and align with the National Smart Grid Mission & India Energy Stack initiatives.',
  keywords: [
    'smart meter theft detection',
    'smart meter data analytics',
    'electricity theft analytics',
    'AI for smart meters',
    'AI revenue protection',
    'AT&C loss reduction',
    'loss reduction discom',
    'indian discom analytics',
    'india energy stack',
    'national smart grid mission',
    'power distribution analytics',
    'distribution loss analytics',
    'energy data platform india',
    'smart grid india',
    'commercial loss detection',
    'technical loss analysis',
    'feeder level analytics',
    'AI anomaly detection energy',
    'machine learning smart meter',
    'gridguard'
  ],
  alternates: { canonical: '/tools/gridguard' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, maxSnippet: -1, maxImagePreview: 'large', maxVideoPreview: -1 }
  },
  openGraph: {
    title: 'GridLAB-D Cloud | Run Distribution Systems Planning Simulations in the Cloud',
    description:
      'AI-powered smart meter data analytics platform for Indian DISCOMs. Detect theft, reduce AT&C losses, prioritize field inspections, and improve revenue protection using existing smart meter data.',
    url: 'https://gridguard.saralsystems.co/tools/gridguard',
    siteName: 'GridLAB-D Cloud',
    type: 'website',
    locale: 'en_IN',
    images: [
      { url: '/gridlabd-og.webp', width: 1200, height: 630, alt: 'GridLAB-D Cloud - AI Revenue Protection' }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GridLAB-D Cloud | Smart Meter Data Analytics & AI Revenue Protection',
    description:
      'Detect smart meter anomalies, reduce AT&C losses & improve collection efficiency with AI-driven analytics for Indian DISCOMs.',
    images: ['/gridlabd-og.webp']
  },
  category: 'technology'
};

export default function GridGuardLayout({ children }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GridGuard',
    applicationCategory: 'EnergyAnalyticsPlatform',
    operatingSystem: 'Cloud',
    description:
      'Smart meter data analytics platform helping Indian DISCOMs detect electricity theft, reduce AT&C losses and improve revenue protection using existing smart meter infrastructure.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Pilot engagement available for qualified DISCOM divisions.'
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Indian DISCOM leadership, revenue protection, metering & operations teams'
    },
    keywords:
      'smart meter theft detection, smart meter data analytics, AI for smart meters, AT&C loss reduction, India energy stack, national smart grid mission'
  };

  return (
    <>
      {children}
      <Footer />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
