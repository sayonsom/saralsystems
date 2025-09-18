import ToolsHomeClient from './_components/ToolsHomeClient';

export const metadata = {
  title: 'Tools | Saral',
  description: 'AI-powered tools for power systems and infrastructure: GridLAB-D IDE, distribution model generation, smart meter load disaggregation, satellite-based resilience monitoring, and data center designer.',
  alternates: { canonical: '/tools' },
  openGraph: {
    title: 'Tools | Saral',
    description: 'Explore Saral tools for grid simulation, smart meter analytics, model generation, satellite resilience, and data center design.',
    url: 'https://www.voltedge.dev/tools',
    images: [{ url: '/og.webp', width: 1200, height: 630, alt: 'Saral Tools' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tools | Saral',
    description: 'AI-powered tools for power systems, analytics, and planning.',
    images: ['/vercel.svg'],
  },
};

export default function ToolsHomePage() {
  return <ToolsHomeClient />;
}
