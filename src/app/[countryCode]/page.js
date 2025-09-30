// src/app/[countryCode]/page.js
// Map-first country page (replaces tabbed layout)

import CountryMapFirstLayout from '@/components/CountryMapFirstLayout';
import Link from 'next/link';
import { getAllCountryCodes, getCountryByCode } from '@/data/countries';

// Generate metadata for SEO
export async function generateMetadata(props) {
  // In Next.js (future) dynamic APIs, params/searchParams can be Promises
  const params = await props.params;
  // const searchParams = await props.searchParams; // not used in the map-first view
  const countryCode = params.countryCode;
  const country = getCountryByCode(countryCode);

  if (!country) {
    return {
      title: 'Country Not Found',
      description: 'The requested country data is not available.',
    };
  }

  const title = `${country.name} - Energy & Electricity Data 2025 | Real-Time Map`;
  const description = `Explore ${country.name} electricity data on an interactive map: ${country.electricity.production.total} TWh production, ${country.electricity.renewable.percentage}% renewables, carbon intensity ${country.electricity.emissions.intensity} gCO2/kWh.`;

  return {
    title,
    description,
    keywords: `${countryCode} electricity production, ${countryCode} energy mix, ${countryCode} power generation, ${countryCode} carbon emissions, ${countryCode} renewable energy, ${country.name} electricity data, ${countryCode} grid`,
    openGraph: {
      title,
      description,
      url: `https://yourdomain.com/${countryCode}`,
      siteName: 'Global Energy Monitor',
      images: [
        {
          url: `/api/og?country=${countryCode}&production=${country.electricity.production.total}&renewable=${country.electricity.renewable.percentage}&carbon=${country.electricity.emissions.intensity}`,
          width: 1200,
          height: 630,
          alt: `${country.name} Energy Data Visualization`
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?country=${countryCode}&production=${country.electricity.production.total}&renewable=${country.electricity.renewable.percentage}&carbon=${country.electricity.emissions.intensity}`],
    },
    alternates: {
      canonical: `https://yourdomain.com/${countryCode}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  };
}

// Generate static params for all countries
export async function generateStaticParams() {
  return getAllCountryCodes().map((countryCode) => ({
    countryCode: countryCode,
  }));
}

// Generate structured data for SEO
function generateStructuredData(countryCode, country) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${country.name} Energy Data`,
    "description": `Comprehensive energy and electricity data for ${country.name}`,
    "url": `https://yourdomain.com/${countryCode}`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://yourdomain.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": country.name,
          "item": `https://yourdomain.com/${countryCode}`
        }
      ]
    },
    "mainEntity": {
      "@type": "Country",
      "name": country.name,
      "alternateName": country.code,
    },
    "dataset": {
      "@type": "Dataset",
      "name": `${country.name} Electricity Production Data`,
      "description": `Real-time electricity production and energy mix data for ${country.name}`,
      "temporalCoverage": "2025",
      "variableMeasured": [
        {
          "@type": "PropertyValue",
          "name": "Total Production",
          "value": country.electricity.production.total,
          "unitText": "TWh"
        },
        {
          "@type": "PropertyValue",
          "name": "Carbon Intensity",
          "value": country.electricity.emissions.intensity,
          "unitText": "gCO2/kWh"
        },
        {
          "@type": "PropertyValue",
          "name": "Renewable Percentage",
          "value": country.electricity.renewable.percentage,
          "unitText": "%"
        }
      ]
    }
  };
}

export default async function CountryPage(props) {
  const params = await props.params;
  const countryCode = params.countryCode;
  const country = getCountryByCode(countryCode);

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f0f', color: '#eee' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Country Not Found</h1>
          <p className="mb-6" style={{ color: '#aaa' }}>The country code "{countryCode}" is not available.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 font-semibold"
            style={{ background: '#ea580b', color: '#0f0f0f', border: '1px solid #3a3a3a' }}
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const structuredData = generateStructuredData(countryCode, country);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Map-first layout with collapsible left sidebar, sharp edges, and gray palette */}
      <CountryMapFirstLayout countryCode={countryCode} country={country} />
    </>
  );
}