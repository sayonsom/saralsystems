"use client";

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function GoogleRedirect() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const provider = new GoogleAuthProvider();
        // If returning from redirect, this will resolve to a credential
        const result = await getRedirectResult(auth);
        if (result) {
          // Already signed in via redirect, go to tools
          if (!cancelled) router.replace('/tools');
          return;
        }
        await signInWithRedirect(auth, provider);
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || 'Google sign-in failed');
        }
      }
    };
    run();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 pt-24 text-center">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Signing you in…</h1>
        {!error ? (
          <p className="text-gray-600">Redirecting to Google…</p>
        ) : (
          <div>
            <p className="text-red-600 mb-4">{error}</p>
            <a href="/signin" className="text-orange-600 hover:text-orange-700 font-semibold">Go back</a>
          </div>
        )}
      </div>
    </main>
  );
}
