export const metadata = {
  title: 'Smart Meter Load Disaggregation',
  description: 'AI-based NILM to extract appliance-level consumption from smart meter time series. Upload data, analyze loads, and export reports.',
  alternates: { canonical: '/tools/smart-meter-load-disaggregation' },
  openGraph: {
    title: 'Smart Meter Load Disaggregation | Saral',
    description: 'Appliance-level energy insights from smart meter data using AI-based NILM.',
    url: 'https://www.saralsystems.co/tools/smart-meter-load-disaggregation',
    images: [{ url: '/og.webp', width: 1200, height: 630, alt: 'Smart Meter Load Disaggregation' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Meter Load Disaggregation | Saral',
    description: 'Extract appliance-level loads from smart meter data using AI.',
    images: ['/vercel.svg'],
  },
};

export default function Layout({ children }) {
  return children;
}
