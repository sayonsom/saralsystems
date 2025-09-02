export const runtime = "edge";

// Keep ai.txt route existing

export async function GET() {
  return new Response("ok", { status: 200 });
}
