import React from 'react';
import Footer from '../../../components/Footer';

export const metadata = {
  metadataBase: new URL('https://gridguard.saralsystems.co'),
  title: {
    default: 'GridLAB-D Cloud — Modern Distribution System Planning Platform',
    template: '%s | SARAL'
  },
  description:
    'GridLAB-D Cloud is a modern distribution system planning platform. Build, simulate, and optimize feeders with a dual visual/code interface, AI-assisted modeling, and cloud-scale simulations.',
  keywords: [
    'GridLAB-D',
    'distribution system planning',
    'distribution planning cloud',
    'hosting capacity',
    'EV charging planning',
    'data center planning',
    'grid resiliency',
    'load flow analysis',
    'feeder modeling',
    'smart grid planning',
    'power systems simulation',
    'AI modeling for power systems',
    'GridLAB-D cloud simulations',
    'SARAL GridLAB-D'
  ],
  alternates: { canonical: '/tools/gridlabd' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, maxSnippet: -1, maxImagePreview: 'large', maxVideoPreview: -1 }
  },
  openGraph: {
    title: 'GridLAB-D Cloud — Modern Distribution System Planning Platform',
    description:
      'Build, simulate, and optimize distribution feeders with a dual visual/code interface, AI assistance, and cloud simulations.',
    url: 'https://gridguard.saralsystems.co/tools/gridlabd',
    siteName: 'GridLAB-D Cloud',
    type: 'website',
    locale: 'en_US',
    images: [
      { url: '/gridlabd-og.webp', width: 1200, height: 630, alt: 'GridLAB-D Cloud — Modern Distribution System Planning' }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GridLAB-D Cloud — Modern Distribution System Planning Platform',
    description:
      'Dual visual/code modeling, AI assistance, and cloud simulations for modern distribution planning.',
    images: ['/gridlabd-og.webp']
  },
  category: 'technology'
};

export default function GridlabDLayout({ children }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'GridLAB-D Cloud',
    applicationCategory: 'EngineeringApplication',
    operatingSystem: 'Any',
    url: 'https://gridguard.saralsystems.co/tools/gridlabd',
    description:
      'Modern distribution planning platform with GridLAB-D at its core. Visual and code interfaces, AI-assisted modeling, and cloud-scale simulations.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Enterprise and on-prem options.'
    },
    keywords:
      'GridLAB-D, distribution planning, power systems simulation, hosting capacity, EV, microgrids, cloud simulations',
    publisher: {
      '@type': 'Organization',
      name: 'SARAL Systems',
      url: 'https://saralsystems.co'
    }
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
