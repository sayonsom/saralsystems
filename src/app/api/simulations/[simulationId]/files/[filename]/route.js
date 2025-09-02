import { NextResponse } from "next/server";
import { getAuthHeader } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function GET(req, { params }) {
  const { simulationId, filename } = params;
  const url = `${BASE_URL}/api/simulations/${simulationId}/files/${encodeURIComponent(filename)}`;
  const headers = await getAuthHeader();

  const upstream = await fetch(url, { headers });
  if (!upstream.ok) {
    const txt = await upstream.text();
    return new NextResponse(txt || "Failed to download file", { status: upstream.status });
  }

  const ct = upstream.headers.get("content-type") || "application/octet-stream";
  const disp = upstream.headers.get("content-disposition");

  // Stream the body
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "content-type": ct,
      ...(disp ? { "content-disposition": disp } : {}),
    },
  });
}
