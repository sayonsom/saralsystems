// src/app/api/sitemap/route.js
import { NextResponse } from 'next/server';
import { COUNTRY_DATA, getAllCountryCodes } from '@/data/countries';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://yourdomain.com';

// All available sections for each country page
const SECTIONS = [
  'overview',
  'electricity-production',
  'energy-mix',
  'carbon-emissions',
  'renewable-energy',
  'trade',
  'infrastructure',
  'historical'
];

// Additional static pages
const STATIC_PAGES = [
  '',
  '/about',
  '/methodology',
  '/data-sources',
  '/contact',
  '/privacy',
  '/terms',
  '/api-documentation'
];

// Regions for regional comparison pages
const REGIONS = [
  'europe',
  'asia',
  'north-america',
  'south-america',
  'africa',
  'oceania',
  'middle-east',
  'caribbean',
  'central-america',
  'eastern-europe',
  'western-europe',
  'southeast-asia',
  'south-asia',
  'east-asia',
  'sub-saharan-africa',
  'north-africa'
];

// GET /api/sitemap
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'main'; // main, countries, regions, or index
    
    let sitemap = '';
    
    switch (type) {
      case 'index':
        sitemap = generateSitemapIndex();
        break;
      case 'countries':
        sitemap = generateCountriesSitemap();
        break;
      case 'regions':
        sitemap = generateRegionsSitemap();
        break;
      default:
        sitemap = generateMainSitemap();
    }
    
    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    return new NextResponse('Error generating sitemap', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

// Generate sitemap index
function generateSitemapIndex() {
  const sitemaps = [
    { loc: `${DOMAIN}/api/sitemap`, lastmod: new Date().toISOString() },
    { loc: `${DOMAIN}/api/sitemap?type=countries`, lastmod: new Date().toISOString() },
    { loc: `${DOMAIN}/api/sitemap?type=regions`, lastmod: new Date().toISOString() },
  ];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`;
}

// Generate main sitemap with static pages
function generateMainSitemap() {
  const urls = [];
  const currentDate = new Date().toISOString();
  
  // Add static pages
  STATIC_PAGES.forEach(page => {
    urls.push({
      loc: `${DOMAIN}${page}`,
      lastmod: currentDate,
      changefreq: page === '' ? 'daily' : 'weekly',
      priority: page === '' ? '1.0' : '0.8',
      images: page === '' ? [
        {
          loc: `${DOMAIN}/images/hero-electricity-map.jpg`,
          title: 'Global Electricity Production Map',
          caption: 'Interactive map showing real-time electricity production data worldwide'
        }
      ] : []
    });
  });
  
  // Add comparison pages
  urls.push({
    loc: `${DOMAIN}/compare`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '0.7'
  });
  
  // Add rankings pages
  ['production', 'renewable', 'emissions', 'efficiency'].forEach(ranking => {
    urls.push({
      loc: `${DOMAIN}/rankings/${ranking}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    });
  });
  
  // Add data export page
  urls.push({
    loc: `${DOMAIN}/data/export`,
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.6'
  });
  
  return generateXMLSitemap(urls);
}

// Generate countries sitemap
function generateCountriesSitemap() {
  const urls = [];
  const currentDate = new Date().toISOString();
  const countries = getAllCountryCodes();
  
  countries.forEach(countryCode => {
    const countryData = COUNTRY_DATA[countryCode];
    if (!countryData) return;
    
    // Main country page (overview)
    urls.push({
      loc: `${DOMAIN}/${countryCode}`,
      lastmod: currentDate,
      changefreq: 'hourly',
      priority: '0.9',
      images: [
        {
          loc: `${DOMAIN}/api/og?country=${countryCode}&production=${countryData.electricity.production.total}&renewable=${countryData.electricity.renewable.percentage}&carbon=${countryData.electricity.emissions.intensity}`,
          title: `${countryData.name} Electricity Production Data`,
          caption: `Real-time electricity data for ${countryData.name}`
        }
      ],
      alternates: generateAlternateLanguages(countryCode)
    });
    
    // Section-specific pages
    SECTIONS.forEach(section => {
      if (section === 'overview') return; // Skip overview as it's the main page
      
      urls.push({
        loc: `${DOMAIN}/${countryCode}?section=${section}`,
        lastmod: currentDate,
        changefreq: section === 'electricity-production' ? 'hourly' : 'daily',
        priority: section === 'electricity-production' ? '0.85' : '0.75',
        alternates: generateAlternateLanguages(`${countryCode}?section=${section}`)
      });
    });
    
    // Add year-specific archives for historical data
    const currentYear = new Date().getFullYear();
    for (let year = 2020; year <= currentYear; year++) {
      urls.push({
        loc: `${DOMAIN}/${countryCode}/data/${year}`,
        lastmod: currentDate,
        changefreq: year === currentYear ? 'daily' : 'yearly',
        priority: '0.6'
      });
    }
    
    // Add comparison URLs with neighboring countries
    const neighbors = getNeighboringCountries(countryCode);
    neighbors.slice(0, 3).forEach(neighbor => {
      if (COUNTRY_DATA[neighbor]) {
        urls.push({
          loc: `${DOMAIN}/compare/${countryCode}-vs-${neighbor}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: '0.65'
        });
      }
    });
  });
  
  return generateXMLSitemap(urls);
}

// Generate regions sitemap
function generateRegionsSitemap() {
  const urls = [];
  const currentDate = new Date().toISOString();
  
  REGIONS.forEach(region => {
    // Regional overview page
    urls.push({
      loc: `${DOMAIN}/region/${region}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    });
    
    // Regional section pages
    SECTIONS.forEach(section => {
      urls.push({
        loc: `${DOMAIN}/region/${region}/${section}`,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '0.7'
      });
    });
    
    // Regional rankings
    urls.push({
      loc: `${DOMAIN}/region/${region}/rankings`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    });
    
    // Regional comparisons
    urls.push({
      loc: `${DOMAIN}/region/${region}/compare`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.65'
    });
  });
  
  return generateXMLSitemap(urls);
}

// Generate XML sitemap from URLs array
function generateXMLSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${urls.map(url => `
  <url>
    <loc>${escapeXML(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${
    url.images ? url.images.map(img => `
    <image:image>
      <image:loc>${escapeXML(img.loc)}</image:loc>
      <image:title>${escapeXML(img.title)}</image:title>
      <image:caption>${escapeXML(img.caption)}</image:caption>
    </image:image>`).join('') : ''
    }${
    url.alternates ? url.alternates.map(alt => `
    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${escapeXML(alt.href)}"/>`).join('') : ''
    }
  </url>`).join('')}
</urlset>`;
}

// Generate alternate language URLs
function generateAlternateLanguages(path) {
  const languages = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'ru', 'ar', 'hi'];
  
  return languages.map(lang => ({
    lang: lang,
    href: lang === 'en' ? `${DOMAIN}/${path}` : `${DOMAIN}/${lang}/${path}`
  }));
}

// Get neighboring countries for comparison pages
function getNeighboringCountries(countryCode) {
  const neighbors = {
    'azerbaijan': ['georgia', 'armenia', 'iran', 'russia', 'turkey'],
    'germany': ['france', 'poland', 'czech-republic', 'austria', 'switzerland', 'denmark', 'netherlands', 'belgium'],
    'france': ['spain', 'italy', 'switzerland', 'germany', 'belgium', 'luxembourg'],
    'united-states': ['canada', 'mexico'],
    'china': ['india', 'japan', 'south-korea', 'russia', 'mongolia', 'vietnam'],
    // Add more as needed
  };
  
  return neighbors[countryCode] || [];
}

// Escape XML special characters
function escapeXML(str) {
  if (!str) return '';
  
  const xmlSpecialChars = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  };
  
  return str.replace(/[&<>"']/g, char => xmlSpecialChars[char]);
}

// Generate robots.txt content (bonus)
export async function generateRobotsTxt() {
  return `# Robots.txt for Energy Monitor Platform
User-agent: *
Allow: /

# Priority crawling for country pages
Allow: /*/electricity-production
Allow: /*/energy-mix
Allow: /*/carbon-emissions
Allow: /api/electricity/*

# Sitemaps
Sitemap: ${DOMAIN}/api/sitemap
Sitemap: ${DOMAIN}/api/sitemap?type=index
Sitemap: ${DOMAIN}/api/sitemap?type=countries
Sitemap: ${DOMAIN}/api/sitemap?type=regions

# Crawl delay
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Crawl-delay: 0
Allow: /api/

User-agent: Bingbot
Crawl-delay: 1
Allow: /api/

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# API rate limiting notice
User-agent: *
Disallow: /api/internal/

Host: ${DOMAIN}`;
}