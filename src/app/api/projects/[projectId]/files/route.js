import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// GET /api/projects/[projectId]/files - List files
export async function GET(req, context) {
  try {
    const { projectId } = await context.params;
    const url = `${BASE_URL}/api/projects/${projectId}/files`;
    const auth = req.headers.get("authorization");
    const headers = auth ? { Authorization: auth } : {};
    
    const upstream = await fetch(url, { headers, cache: "no-store" });
    
    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => `HTTP ${upstream.status}`);
      console.error(`[Files API] GET error: ${upstream.status} - ${errorText}`);
      return NextResponse.json(
        { error: errorText || `Request failed: ${upstream.status}` },
        { status: upstream.status }
      );
    }
    
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error('[Files API] GET exception:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[projectId]/files - Create file
export async function POST(req, context) {
  try {
    const { projectId } = await context.params;
    const body = await req.json();
    const url = `${BASE_URL}/api/projects/${projectId}/files`;
    const auth = req.headers.get("authorization");
    const headers = { 
      ...(auth ? { Authorization: auth } : {}), 
      "content-type": "application/json" 
    };
    
    const upstream = await fetch(url, { 
      method: "POST", 
      headers, 
      body: JSON.stringify(body),
      cache: "no-store"
    });
    
    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => `HTTP ${upstream.status}`);
      console.error(`[Files API] POST error: ${upstream.status} - ${errorText}`);
      return NextResponse.json(
        { error: errorText || `Request failed: ${upstream.status}` },
        { status: upstream.status }
      );
    }
    
    const ct = upstream.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await upstream.json();
      return NextResponse.json(data, { status: upstream.status });
    }
    const text = await upstream.text();
    return new NextResponse(text, { status: upstream.status });
  } catch (error) {
    console.error('[Files API] POST exception:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}