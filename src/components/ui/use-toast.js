'use client';

import { useCallback } from 'react';

export function useToast() {
  const toast = useCallback(({ title, description, variant = 'default', duration = 4000 }) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { title, description, variant, duration } }));
    } else {
      // SSR fallback
      console.log(`Toast: ${title} - ${description}`);
    }
  }, []);
  return { toast };
}