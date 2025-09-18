import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function POST(req) {
  try {
    const body = await req.json();
    const url = `${BASE_URL}/api/users/lookup`;
    const auth = req.headers.get("authorization");
    const headers = { ...(auth ? { Authorization: auth } : {}), "content-type": "application/json" };
    const upstream = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), cache: "no-store" });
    const ct = upstream.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await upstream.json();
      return NextResponse.json(data, { status: upstream.status });
    }
    const text = await upstream.text();
    return new NextResponse(text, { status: upstream.status });
  } catch (err) {
    return NextResponse.json({ error: err?.message || "Lookup failed" }, { status: 500 });
  }
}
