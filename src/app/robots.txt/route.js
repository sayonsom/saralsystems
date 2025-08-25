export function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: https://www.saral.energy/sitemap.xml`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}

