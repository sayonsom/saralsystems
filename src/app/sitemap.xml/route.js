export function GET() {
  const base = "https://www.saral.energy";
  const urls = ["/", "/#services", "/#ai-brief", "/#use-cases", "/#contact"];
  const items = urls
    .map((u) => `<url><loc>${base}${u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`) 
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}

