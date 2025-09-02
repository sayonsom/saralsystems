import { NextResponse } from "next/server";
import { getAuthHeader } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function POST(req) {
  const body = await req.json();
  const url = `${BASE_URL}/api/simulations`;
  const headers = { ...(await getAuthHeader()), "content-type": "application/json" };
  const upstream = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
