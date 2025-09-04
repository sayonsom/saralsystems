import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function POST(req) {
  if (!BASE_URL) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_BACKEND_BASE_URL" }, { status: 500 });
  }
  
  const url = `${BASE_URL}/api/simulations/archive`;
  const auth = req.headers.get("authorization");
  const headers = auth ? { Authorization: auth } : {};
  
  // Log request details for debugging
  console.log("Archive upload request to:", url);
  console.log("Auth header:", headers);
  
  try {
    const formData = await req.formData();
    const entries = Array.from(formData.entries());
    console.log("Form fields received:", entries.map(([k,v]) => `${k}: ${v instanceof File ? `File(${v.size}B, ${v.name})` : v}`));
    
    const upstream = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
      cache: "no-store",
    });

    console.log("Backend response status:", upstream.status);
    const responseText = await upstream.text();
    console.log("Backend response body:", responseText.slice(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { raw_response: responseText };
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (e) {
    console.error("Archive upload error:", e);
    return NextResponse.json({ error: e?.message || "Upstream error" }, { status: 502 });
  }
}
