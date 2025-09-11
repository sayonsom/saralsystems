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
        return 'border-green-600';
      case 'error':
        return 'border-red-600';
      case 'warning':
        return 'border-yellow-600';
      default:
        return 'border-[#ea580b]';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`w-80 bg-white border border-gray-300 shadow-md pl-3 pr-2 py-2 flex items-start gap-2`}>
          <div className={`w-1 h-full ${variantStyles(t.variant)} border-l-4`} />
          <div className="flex-1">
            {t.title && <div className="text-sm font-semibold text-gray-900">{t.title}</div>}
            {t.description && <div className="text-xs text-gray-700 mt-0.5">{t.description}</div>}
          </div>
          <button className="text-gray-500 hover:text-gray-700 text-xs" onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>✕</button>
        </div>
      ))}
    </div>
  );
}
