import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function GET(req, { params }) {
  const { simulationId } = await params;
  const url = `${BASE_URL}/api/simulations/${simulationId}/outputs`;
  const auth = req.headers.get("authorization");
  const headers = auth ? { Authorization: auth } : {};

  const upstream = await fetch(url, { headers });
  if (!upstream.ok) {
    const txt = await upstream.text();
    return new NextResponse(txt || "Failed to download outputs.zip", { status: upstream.status });
  }

  const ct = upstream.headers.get("content-type") || "application/zip";
  const disp = upstream.headers.get("content-disposition") || `attachment; filename=outputs-${simulationId}.zip`;

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "content-type": ct,
      "content-disposition": disp,
      "cache-control": "no-store",
    },
  });
}
