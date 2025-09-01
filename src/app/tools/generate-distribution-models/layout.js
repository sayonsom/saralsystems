export const metadata = {
  title: 'Generate Distribution System Models',
  description: 'Automatically build feeder and distribution network models from GIS layers, demand data, and templates. Export to GridLAB-D or OpenDSS.',
  alternates: { canonical: '/tools/generate-distribution-models' },
  openGraph: {
    title: 'Generate Distribution System Models | Saral',
    description: 'Create feeder and network models from GIS and demand data. Export to GridLAB-D/OpenDSS and simulate.',
    url: 'https://www.saralsystems.co/tools/generate-distribution-models',
    images: [{ url: '/og.webp', width: 1200, height: 630, alt: 'Generate Distribution System Models' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generate Distribution System Models | Saral',
    description: 'Generate feeder/network models from GIS and demand data, ready for GridLAB-D/OpenDSS.',
    images: ['/vercel.svg'],
  },
};

export default function Layout({ children }) {
  return children;
}
