"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

export default function SearchModal({ isOpen, onClose, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setTimeout(() => inputRef.current?.focus(), 0);
      // prevent background scroll
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [isOpen, initialQuery]);

  // Close on ESC or outside click
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;
    const q = query.trim();
    if (q.length < 1) {
      setResults([]);
      setError('');
      return;
    }

    let active = true;
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!active) return;
        setResults(data.results || []);
      } catch (e) {
        if (!active) return;
        setError('Search failed');
      } finally {
        if (active) setLoading(false);
      }
    }, 250);
    return () => { active = false; clearTimeout(t); };
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50">
      <div ref={containerRef} className="mt-20 w-full max-w-5xl mx-4 bg-white shadow-2xl">
        <div className="border-b border-gray-200 p-4">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the site"
            aria-label="Search the site"
            className="w-full px-4 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="max-h-[70vh] overflow-y-auto divide-y divide-gray-100">
          {loading && (
            <div className="p-4 text-sm text-gray-600">Searching…</div>
          )}
          {!loading && error && (
            <div className="p-4 text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && results.length === 0 && query.trim().length > 0 && (
            <div className="p-4 text-sm text-gray-600">No results</div>
          )}

          {!loading && !error && results.map((r, i) => (
            <a key={i} href={r.href} className="block p-4 hover:bg-gray-50">
              <div className="text-[10px] uppercase text-gray-500 mb-1">{r.type}</div>
              <div className="text-base font-semibold leading-snug" dangerouslySetInnerHTML={{ __html: r.highlightedTitle || escapeHtml(r.title) }} />
              {r.snippet ? (
                <p className="text-gray-700 mt-1 text-sm" dangerouslySetInnerHTML={{ __html: r.snippet }} />
              ) : (
                r.highlightedExcerpt && (
                  <p className="text-gray-600 mt-1 text-sm" dangerouslySetInnerHTML={{ __html: r.highlightedExcerpt }} />
                )
              )}
              {r.tags?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.tags.map((t) => (
                    <span key={t} className="text-[11px] bg-gray-100 px-2 py-0.5">{t}</span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>

        <div className="p-3 flex justify-end gap-2 text-sm bg-gray-50 border-t border-gray-200">
          <button onClick={onClose} className="px-3 py-1.5 border border-gray-300 hover:bg-white">Close</button>
        </div>
      </div>
    </div>
  );
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
