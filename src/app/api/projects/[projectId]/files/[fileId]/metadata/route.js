import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// PATCH /api/projects/[projectId]/files/[fileId]/metadata - Update file metadata
export async function PATCH(req, context) {
  try {
    const params = await context.params;
    const { projectId, fileId } = params;
    const body = await req.json();
    const url = `${BASE_URL}/api/projects/${projectId}/files/${fileId}/metadata`;
    const auth = req.headers.get("authorization");
    const headers = { 
      ...(auth ? { Authorization: auth } : {}), 
      "content-type": "application/json" 
    };
    
    const upstream = await fetch(url, { 
      method: "PATCH", 
      headers, 
      body: JSON.stringify(body),
      cache: "no-store"
    });
    
    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => `HTTP ${upstream.status}`);
      console.error(`[File Metadata API] PATCH error: ${upstream.status} - ${errorText}`);
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
    console.error('[File Metadata API] PATCH exception:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}