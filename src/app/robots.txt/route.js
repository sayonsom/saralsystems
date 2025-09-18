export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Sitemap: https://www.voltedge.dev/sitemap.xml",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}

