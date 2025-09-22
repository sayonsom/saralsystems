export const metadata = {
  title: 'Data Center Designer',
  description: 'Plan, size, and analyze data centers: power, cooling, PUE/WUE, costs, IRR/NPV. Compare scenarios and assess risks.',
  alternates: { canonical: '/tools/data-center-designer' },
  openGraph: {
    title: 'Data Center Designer | Saral',
    description: 'Size and cost data centers, simulate energy and financials, and compare scenarios.',
    url: 'https://www.gridspeed.app/tools/data-center-designer',
    images: [{ url: '/og.webp', width: 1200, height: 630, alt: 'Data Center Designer' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Center Designer | Saral',
    description: 'Design and analyze data centers with energy and finance metrics.',
    images: ['/data-center.webp'],
  },
};

export default function Layout({ children }) {
  return children;
}
