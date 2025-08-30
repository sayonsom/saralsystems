import Link from 'next/link';
import { getAllEnergyAnalysisPosts } from '@/lib/contentful';
import { getAllInsights } from '@/lib/markdown';
import Fuse from 'fuse.js';

export const metadata = {
  title: 'Search | Saral',
  description: 'Search articles and insights across the site.',
};

// Escape HTML to prevent injection when using dangerouslySetInnerHTML
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Build highlighted HTML from indices (Fuse match ranges)
function buildHighlighted(text = '', indices = []) {
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
}

// Create a snippet around the first match for the given key
function createSnippet(text = '', indices = [], radius = 90) {
  if (!indices || indices.length === 0 || !text) return '';
  const [start] = indices[0];
  const from = Math.max(0, start - radius);
  const to = Math.min(text.length, start + radius);
  const prefix = from > 0 ? '…' : '';
  const suffix = to < text.length ? '…' : '';
  const within = text.slice(from, to);

  // Shift indices to the sliced window
  const shifted = indices
    .map(([s, e]) => [s - from, e - from])
    .filter(([s, e]) => e >= 0 && s <= within.length);

  return prefix + buildHighlighted(within, shifted) + suffix;
}

export default async function SearchPage({ searchParams }) {
  const q = (searchParams?.q || searchParams?.query || '').toString();
  const query = q.trim();

  let results = [];
  if (query) {
    const [posts, insights] = await Promise.all([
      getAllEnergyAnalysisPosts(1000),
      getAllInsights(),
    ]);

    const items = [
      ...posts.map((p) => ({
        type: 'blog',
        title: p.title,
        excerpt: p.excerpt,
        tags: p.tags || [],
        date: p.date,
        href: `/blog/${p.slug}`,
        content: p.plainTextContent || '',
      })),
      ...insights.map((i) => ({
        type: 'insight',
        title: i.title,
        excerpt: i.excerpt,
        tags: i.tags || [],
        date: i.date,
        href: `/insights/${i.slug}`,
        content: '',
      })),
    ];

    const fuse = new Fuse(items, {
      includeScore: true,
      includeMatches: true,
      shouldSort: true,
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'excerpt', weight: 0.3 },
        { name: 'tags', weight: 0.1 },
        { name: 'content', weight: 0.6 },
      ],
    });

    const fuseResults = fuse.search(query);

    results = fuseResults.map(({ item, score, matches }) => {
      // Derive highlighted title and excerpt
      const titleMatch = matches?.find((m) => m.key === 'title');
      const excerptMatch = matches?.find((m) => m.key === 'excerpt');
      const contentMatch = matches?.find((m) => m.key === 'content');

      const highlightedTitle = buildHighlighted(item.title, titleMatch?.indices);
      const highlightedExcerpt = buildHighlighted(item.excerpt, excerptMatch?.indices);

      // Prefer content snippet, fallback to excerpt snippet, else empty
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

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <form action="/search" method="get" className="mb-8 flex gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search articles and insights"
          className="flex-1 border border-gray-300 px-3 py-2"
          aria-label="Search the site"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 text-white"
        >
          Search
        </button>
      </form>

      {q && (
        <p className="text-sm text-gray-600 mb-4">
          {results.length} results for “{q}”
        </p>
      )}

      <ul className="space-y-5">
        {results.map((r, i) => (
          <li key={i} className="border-b border-gray-200 pb-4">
            <div className="text-xs uppercase text-gray-500 mb-1">{r.type}</div>
            <Link href={r.href} className="text-lg font-semibold hover:underline" dangerouslySetInnerHTML={{ __html: r.highlightedTitle || escapeHtml(r.title) }} />
            {r.snippet ? (
              <p className="text-gray-700 mt-1" dangerouslySetInnerHTML={{ __html: r.snippet }} />
            ) : (
              r.excerpt && <p className="text-gray-600 mt-1" dangerouslySetInnerHTML={{ __html: r.highlightedExcerpt || escapeHtml(r.excerpt) }} />
            )}
            {r.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {r.tags.map((t) => (
                  <span key={t} className="text-xs bg-gray-100 px-2 py-1">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      {q && results.length === 0 && (
        <p className="text-gray-600">No results found.</p>
      )}
    </main>
  );
}
