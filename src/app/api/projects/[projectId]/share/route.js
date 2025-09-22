import { NextResponse, NextRequest } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function POST(req, context) {
  try {
    const { projectId } = await context.params;
    const body = await req.json();
    const url = `${BASE_URL}/api/projects/${projectId}/share`;

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
    return NextResponse.json({ error: err?.message || "Share failed" }, { status: 500 });
  }
}
