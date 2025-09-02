import { NextResponse } from "next/server";
import { getAuthHeader } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function POST(req) {
  const url = `${BASE_URL}/api/simulations/archive`;
  const auth = await getAuthHeader();
  const contentType = req.headers.get("content-type");

  const upstream = await fetch(url, {
    method: "POST",
    headers: { ...auth, ...(contentType ? { "content-type": contentType } : {}) },
    body: req.body,
    duplex: "half",
  });

  const ct = upstream.headers.get("content-type") || "application/json";
  if (ct.includes("application/json")) {
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  }
  const blob = await upstream.blob();
  return new NextResponse(blob, { status: upstream.status, headers: { "content-type": ct } });
}
