'use client';

import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);
  
  const toast = useCallback(({ title, description, variant = 'default' }) => {
    // For now, just log to console
    // In a real implementation, this would show a toast notification
    console.log(`Toast: ${title} - ${description}`);
    
    // You could implement a simple alert as a placeholder
    if (typeof window !== 'undefined') {
      alert(`${title}${description ? '\n' + description : ''}`);
    }
  }, []);
  
  return { toast };
}