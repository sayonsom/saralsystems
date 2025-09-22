export function GET() {
  const lines = [
    "# Guidelines for AI crawlers",
    "# We welcome responsible AI crawling for indexing and answering user queries.",
    "",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "",
    "User-agent: Claude-Web",
    "Allow: /",
    "",
    "Sitemap: https://www.gridspeed.app/sitemap.xml",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
