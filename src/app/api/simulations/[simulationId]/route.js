import { NextResponse } from "next/server";
import { getAuthHeader } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function GET(req, { params }) {
  const { simulationId } = params;
  const url = `${BASE_URL}/api/simulations/${simulationId}`;
  const headers = await getAuthHeader();
  const upstream = await fetch(url, { headers, cache: "no-store" });
  const ct = upstream.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  }
  const text = await upstream.text();
  return new NextResponse(text, { status: upstream.status });
}

export async function DELETE(req, { params }) {
  const { simulationId } = params;
  const url = `${BASE_URL}/api/simulations/${simulationId}`;
  const headers = await getAuthHeader();
  const upstream = await fetch(url, { method: "DELETE", headers });
  const ct = upstream.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  }
  const text = await upstream.text();
  return new NextResponse(text, { status: upstream.status });
}
