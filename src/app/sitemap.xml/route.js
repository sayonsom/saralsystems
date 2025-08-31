import { getAllEnergyAnalysisPosts } from "@/lib/contentful";
import { getAllInsights } from "@/lib/markdown";

export const dynamic = 'force-dynamic';

export async function GET() {
  const base = "https://www.saralsystems.co";

  const staticUrls = [
    "/",
    "/blog",
    "/insights",
    "/tools",
    "/#services",
    "/#ai-brief",
    "/#use-cases",
    "/#contact",
  ];

  const [posts, insights] = await Promise.all([
    getAllEnergyAnalysisPosts(1000),
    getAllInsights(),
  ]);

  const toItem = (loc, lastmod, priority = 0.7, changefreq = "weekly") =>
    `<url><loc>${base}${loc}</loc>${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ""}<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;

  const items = [
    ...staticUrls.map((u) => toItem(u, new Date(), 0.8, "weekly")),
    ...posts.map((p) => toItem(`/blog/${p.slug}`, p.updatedAt || p.date, 0.9, "weekly")),
    ...insights.map((i) => toItem(`/insights/${i.slug}`, i.date, 0.8, "monthly")),
  ].join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" } });
}

