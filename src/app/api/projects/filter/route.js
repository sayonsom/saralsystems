import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get('view');
  const tag = searchParams.get('tag');
  const q = searchParams.get('q');
  const sp = new URLSearchParams();
  if (view) sp.set('view', view);
  if (tag) sp.set('tag', tag);
  if (q) sp.set('q', q);

  const url = `${BASE_URL}/api/projects/filter?${sp.toString()}`;
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
