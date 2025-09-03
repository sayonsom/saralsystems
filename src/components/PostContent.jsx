'use client';

import { useEffect, useRef } from 'react';

export default function PostContent({ content }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Add Prism.js highlighting if available
    if (typeof window !== 'undefined' && window.Prism) {
      window.Prism.highlightAll();
    }

    // Enhance code blocks: add copy button and ensure proper layout
    const container = containerRef.current;
    if (!container) return;

    const pres = container.querySelectorAll('pre');
    pres.forEach((pre) => {
      // Avoid duplicating buttons on re-renders
      if (pre.querySelector('.copy-btn')) return;

      // Positioning context
      pre.classList.add('relative');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Copy code');

      const copySvg = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" class="h-4 w-4">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="1.8"></rect>
          <rect x="2" y="2" width="13" height="13" rx="2" ry="2" stroke-width="1.8"></rect>
        </svg>`;
      const checkSvg = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" class="h-4 w-4">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>`;

      const setIcon = (state) => {
        btn.innerHTML = state === 'copied' ? checkSvg : copySvg;
      };

      btn.className = [
        'copy-btn',
        'absolute top-2 right-2 md:top-2 md:right-2 z-20',
        'inline-flex items-center justify-center h-8 w-8',
        'rounded-md border border-white/20 shadow-sm',
        'bg-black/40 text-white/90 backdrop-blur-sm',
        'hover:bg-black/60 transition',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500',
      ].join(' ');
      setIcon('copy');

      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        if (!code) return;
        const text = code.textContent || '';
        navigator.clipboard
          .writeText(text)
          .then(() => {
            setIcon('copied');
            setTimeout(() => setIcon('copy'), 1500);
          })
          .catch(() => {
            setIcon('copy');
          });
      });

      pre.appendChild(btn);
    });
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="prose prose-lg max-w-none font-[family-name:var(--font-pt-serif)] prose-headings:font-bold prose-headings:text-gray-900 prose-headings:font-[family-name:var(--font-sen)] prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:text-indigo-800 hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-semibold prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-gray-800 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-6 prose-pre:relative prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-li:mb-1 prose-li:text-gray-700 prose-table:min-w-full prose-table:divide-y prose-table:divide-gray-200 prose-table:border prose-table:border-gray-200 prose-thead:bg-gray-50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-medium prose-th:text-gray-900 prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-gray-700 prose-td:border-t prose-td:border-gray-200 prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-hr:border-gray-200 prose-hr:my-8"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
