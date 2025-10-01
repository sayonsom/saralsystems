import { NextResponse } from 'next/server';
import { getAllEnergyAnalysisPosts } from '@/lib/contentful';
import { getAllInsights } from '@/lib/markdown';
import { getAllPosts } from '@/lib/posts';
import { COUNTRY_DATA } from '@/data/countries';
import Fuse from 'fuse.js';

function buildResultsWithHighlights(items, query) {
  const minMatch = query && query.length >= 5 ? 4 : query && query.length >= 3 ? 3 : 2;
  const fuse = new Fuse(items, {
    includeScore: true,
    includeMatches: true,
    shouldSort: true,
    threshold: 0.2, // stricter matching
    ignoreLocation: true,
    minMatchCharLength: minMatch,
    keys: [
      { name: 'title', weight: 0.55 },
      { name: 'excerpt', weight: 0.25 },
      { name: 'tags', weight: 0.1 },
      { name: 'content', weight: 0.65 },
    ],
  });
  const searchRes = fuse.search(query);

  const escapeHtml = (str = '') =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const buildHighlighted = (text = '', indices = []) => {
    if (!indices || indices.length === 0) return escapeHtml(text);
    let result = '';
    let lastIndex = 0;
    for (const [start, end] of indices) {
      result += escapeHtml(text.slice(lastIndex, start));
      result += `<mark>${escapeHtml(text.slice(start, end + 1))}</mark>`;
      lastIndex = end + 1;
    }
    result += escapeHtml(text.slice(lastIndex));
    return result;
  };

  const createSnippet = (text = '', indices = [], radius = 90) => {
    if (!indices || indices.length === 0 || !text) return '';
    const [start] = indices[0];
    const from = Math.max(0, start - radius);
    const to = Math.min(text.length, start + radius);
    const prefix = from > 0 ? '…' : '';
    const suffix = to < text.length ? '…' : '';
    const within = text.slice(from, to);
    const shifted = indices
      .map(([s, e]) => [s - from, e - from])
      .filter(([s, e]) => e >= 0 && s <= within.length);
    return prefix + buildHighlighted(within, shifted) + suffix;
  };

  return searchRes.map(({ item, score, matches }) => {
    const titleMatch = matches?.find((m) => m.key === 'title');
    const excerptMatch = matches?.find((m) => m.key === 'excerpt');
    const contentMatch = matches?.find((m) => m.key === 'content');

    const highlightedTitle = buildHighlighted(item.title, titleMatch?.indices);
    const highlightedExcerpt = buildHighlighted(item.excerpt, excerptMatch?.indices);

    const snippet = contentMatch
      ? createSnippet(item.content, contentMatch.indices)
      : excerptMatch
        ? createSnippet(item.excerpt, excerptMatch.indices)
        : '';

    return {
      ...item,
      score,
      highlightedTitle,
      highlightedExcerpt,
      snippet,
    };
  });
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || url.searchParams.get('query') || '').trim();
    const limit = parseInt(url.searchParams.get('limit') || '0', 10);
    const query = q;

    if (!query) {
      return NextResponse.json({ query: q, count: 0, results: [] });
    }

    const [posts, insights, mdPosts] = await Promise.all([
      getAllEnergyAnalysisPosts(1000),
      getAllInsights(),
      getAllPosts(),
    ]);

    const stripHtml = (html = '') => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // Build country search items
    const countries = Object.entries(COUNTRY_DATA).map(([slug, country]) => ({
      type: 'country',
      title: country.name,
      excerpt: `${country.flag} ${country.region} • ${country.electricity.production.total} TWh electricity production`,
      tags: [country.region, country.subregion, 'electricity', 'energy'],
      date: new Date().toISOString(),
      href: `/${slug}`,
      countrySlug: slug,
      content: `${country.name} ${country.region} ${country.subregion} electricity production renewable energy carbon emissions`,
    }));

    const items = [
      // Countries (high priority)
      ...countries,
      // Contentful blog posts
      ...posts.map((p) => ({
        type: 'blog',
        title: p.title,
        excerpt: p.excerpt,
        tags: p.tags || [],
        date: p.date,
        href: `/blog/${p.slug}`,
        content: p.plainTextContent || '',
      })),
      // Markdown insights (metadata only, as before)
      ...insights.map((i) => ({
        type: 'insight',
        title: i.title,
        excerpt: i.excerpt,
        tags: i.tags || [],
        date: i.date,
        href: `/insights/${i.slug}`,
        content: '',
      })),
      // Local markdown technical posts in src/app/posts
      ...mdPosts.map((p) => ({
        type: 'post',
        title: p.title,
        excerpt: p.excerpt,
        tags: p.tags || [],
        date: p.date,
        href: `/posts/${p.slug}`,
        content: stripHtml(p.contentHtml || ''),
      })),
    ];

    // Build results with fuzzy scoring and highlights
    let results = buildResultsWithHighlights(items, query);

    // Tokenize the query
    const tokens = query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    // Helper utilities for word-boundary filtering
    const escapeRegExp = (s = '') => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const buildWordRegex = (tok) => {
      const esc = escapeRegExp(tok);
      // For longer tokens, allow common morphological suffixes while anchoring to word boundary
      return tok.length >= 4
        ? new RegExp(`\\b${esc}[a-z]{0,4}\\b`, 'i')
        : new RegExp(`\\b${esc}\\b`, 'i');
    };

    if (tokens.length > 0) {
      const regexes = tokens.map(buildWordRegex);
      const haystack = (r) => [r.title, r.excerpt, r.content, (r.tags || []).join(' ')].join(' ');

      let filtered = results.filter((r) => regexes.every((rx) => rx.test(haystack(r))));

      // If the strict filter removes everything, gently relax for single long-token queries
      if (filtered.length === 0 && tokens.length === 1 && query.length >= 4) {
        const lcQuery = query.toLowerCase();
        filtered = results.filter((r) => haystack(r).toLowerCase().includes(lcQuery));
      }

      if (filtered.length > 0) {
        results = filtered;
      }
    }

    // Sort by combined score and recency
    results.sort((a, b) => {
      const scoreA = a.score ?? 1;
      const scoreB = b.score ?? 1;
      if (scoreA !== scoreB) return scoreA - scoreB; // lower score is better
      return new Date(b.date || 0) - new Date(a.date || 0);
    });

    if (limit > 0) {
      results = results.slice(0, limit);
    }

    return NextResponse.json({ query: q, count: results.length, results });
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json({ query: '', count: 0, results: [], error: 'Search failed' }, { status: 500 });
  }
}
