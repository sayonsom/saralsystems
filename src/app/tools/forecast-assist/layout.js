export const metadata = {
  title: 'Satellite-based Resilience Monitoring',
  description: 'Track grid resilience using Earth observation data and AI analytics. Monitor outages, vegetation, and infrastructure risks.',
  alternates: { canonical: '/tools/satellite-resilience-monitoring' },
  openGraph: {
    title: 'Satellite-based Resilience Monitoring | Saral',
    description: 'Use satellite data and AI to monitor grid resilience and risks.',
    url: 'https://www.saralsystems.co/tools/satellite-resilience-monitoring',
    images: [{ url: '/og.webp', width: 1200, height: 630, alt: 'Satellite-based Resilience Monitoring' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Satellite-based Resilience Monitoring | Saral',
    description: 'Satellite and AI analytics for grid resilience monitoring.',
    images: ['/vercel.svg'],
  },
};

export default function Layout({ children }) {
  return children;
}
