import { getAllInsights } from '@/lib/markdown';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const insights = await getAllInsights();
    // Return only the necessary data for the scroll component
    const simplifiedInsights = insights.map(({ slug, title, excerpt, date, author }) => ({
      slug,
      title,
      excerpt,
      date,
      author
    }));
    return NextResponse.json(simplifiedInsights);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}