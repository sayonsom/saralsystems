import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// GET /api/projects/[projectId]/simulations - List simulations for a project
export async function GET(req, context) {
  try {
    const { projectId } = await context.params;
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const url = `${BASE_URL}/api/projects/${projectId}/simulations${queryString ? `?${queryString}` : ''}`;
    const auth = req.headers.get("authorization");
    const headers = auth ? { Authorization: auth } : {};
    
    const upstream = await fetch(url, { headers, cache: "no-store" });
    
    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => `HTTP ${upstream.status}`);
      console.error(`[Simulations API] GET error: ${upstream.status} - ${errorText}`);
      return NextResponse.json(
        { error: errorText || `Request failed: ${upstream.status}` },
        { status: upstream.status }
      );
    }
    
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error('[Simulations API] GET exception:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}