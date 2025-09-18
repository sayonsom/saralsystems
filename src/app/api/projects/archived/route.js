import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function GET(req) {
  const url = `${BASE_URL}/api/projects/archived`;
  const auth = req.headers.get("authorization");
  const headers = auth ? { Authorization: auth } : {};
  const upstream = await fetch(url, { headers, cache: "no-store" });
  const ct = upstream.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  }
  const text = await upstream.text();
  return new NextResponse(text, { status: upstream.status });
}
