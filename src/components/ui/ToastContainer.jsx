'use client';

import { useEffect, useRef, useState } from 'react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e) => {
      const { title, description, variant = 'default', duration = 4000 } = e.detail || {};
      const id = `${Date.now()}-${counterRef.current++}`;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    };
    window.addEventListener('app:toast', handler);
    return () => window.removeEventListener('app:toast', handler);
  }, []);

  const variantStyles = (v) => {
    switch (v) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'error':
      case 'destructive': // backward-compat mapping to error styling
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      default:
        return 'bg-white border-gray-300 text-gray-900';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`w-80 ${variantStyles(t.variant)} border shadow-md px-3 py-2 flex items-start gap-2 rounded-md`}
        >
          <div className="flex-1">
            {t.title && <div className="text-sm font-semibold text-current">{t.title}</div>}
            {t.description && <div className="text-xs text-current/80 mt-0.5">{t.description}</div>}
          </div>
          <button
            className="text-current/60 hover:text-current text-xs"
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
