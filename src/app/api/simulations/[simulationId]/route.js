import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function GET(req, { params }) {
  const { simulationId } = await params;
  const url = `${BASE_URL}/api/simulations/${simulationId}`;
  const auth = req.headers.get("authorization");
  const headers = auth ? { Authorization: auth } : {};
  const upstream = await fetch(url, { headers, cache: "no-store" });
  const ct = upstream.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await upstream.json();
    // Attach raw status for debugging
    return NextResponse.json({ ...data, _debug_status: data?.status || data?.state || data?.phase }, { status: upstream.status });
  }
  const text = await upstream.text();
  return new NextResponse(text, { status: upstream.status });
}

export async function PUT(req, { params }) {
  const { simulationId } = await params;
  const contentType = req.headers.get("content-type") || "";

  let body;
  let headers = {};

  if (contentType.includes("multipart/form-data")) {
    // Handle FormData
    const formData = await req.formData();
    body = formData;
    // Don't set content-type header for FormData - let fetch set it automatically
  } else {
    // Handle JSON
    body = await req.json();
    headers = { ...headers, "content-type": "application/json" };
    body = JSON.stringify(body);
  }

  const auth = req.headers.get("authorization");
  if (auth) headers.Authorization = auth;

  const url = `${BASE_URL}/api/simulations/${simulationId}`;
  const upstream = await fetch(url, { method: "PUT", headers, body });
  const ct = upstream.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  }
  const text = await upstream.text();
  return new NextResponse(text, { status: upstream.status });
}

export async function DELETE(req, { params }) {
  const { simulationId } = await params;
  const url = `${BASE_URL}/api/simulations/${simulationId}`;
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
