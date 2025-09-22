import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function GET(req, context) {
  const { projectId } = await context.params;
  const url = `${BASE_URL}/api/projects/${projectId}`;
  const auth = req.headers.get("authorization");
  const headers = auth ? { Authorization: auth } : {};
  const upstream = await fetch(url, { headers, cache: "no-store" });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}

export async function PUT(req, context) {
  const { projectId } = await context.params;
  const body = await req.json();
  const url = `${BASE_URL}/api/projects/${projectId}`;
  const auth = req.headers.get("authorization");
  const headers = { ...(auth ? { Authorization: auth } : {}), "content-type": "application/json" };
  const upstream = await fetch(url, { method: "PUT", headers, body: JSON.stringify(body) });
  const ct = upstream.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  }
  const text = await upstream.text();
  return new NextResponse(text, { status: upstream.status });
}

export async function DELETE(req, context) {
  const { projectId } = await context.params;
  const url = `${BASE_URL}/api/projects/${projectId}`;
  const auth = req.headers.get("authorization");
  const headers = auth ? { Authorization: auth } : {};
  const upstream = await fetch(url, { method: "DELETE", headers });
  const ct = upstream.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  }
  const text = await upstream.text();
  return new NextResponse(text, { status: upstream.status });
}
