"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isTools = pathname?.startsWith('/tools');

  useEffect(() => {
    // For non-tools routes, redirect unauthenticated users to home
    if (!loading && !user && !isTools) {
      router.push('/');
    }
  }, [user, loading, router, isTools]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Inside /tools, show a gentle sign-in prompt instead of redirecting
  if (!user && isTools) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Sign in required</h2>
        <p className="text-gray-600 mb-6">Please sign in to access this part of the tool. Public preview remains available.</p>
        <div className="flex items-center gap-3">
          <a href="/signin" className="px-5 py-2.5 bg-orange-600 text-white rounded-none hover:bg-orange-700">Sign In</a>
          <a href="/tools" className="px-5 py-2.5 border border-gray-300 rounded-none hover:bg-gray-50">Go to Tools</a>
          <a href="/" className="px-5 py-2.5 border border-gray-300 rounded-none hover:bg-gray-50">Home</a>
        </div>
      </div>
    );
  }

  return <>{children}</>; 
}
