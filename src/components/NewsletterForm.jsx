'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Simulate a subscription request (to be replaced with real API later)
      await new Promise((resolve) => setTimeout(resolve, 900));

      toast({
        title: "Welcome to Gridleaf!",
        description: "Thank you for subscribing to our newsletter! You'll receive our latest insights soon.",
        duration: 5000,
      });

      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-200/70 bg-amber-50 p-8 shadow-sm backdrop-blur-sm dark:border-amber-300/40 dark:bg-amber-100/10 md:p-10">
      <h3 className="text-2xl font-semibold tracking-tight text-text-dark dark:text-text-light">Subscribe to our newsletter</h3>
      <p className="mt-2 text-text-medium dark:text-text-light/80">
        Get the latest insights on AI, energy, and technology delivered to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="email" className="sr-only">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          required
          className="flex-1 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-text-dark placeholder-neutral-400 outline-none ring-0 transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300 dark:border-amber-300/40 dark:bg-white dark:text-text-dark dark:placeholder-neutral-400"
          aria-label="Email address"
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2.5 whitespace-nowrap"
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </Button>
      </form>

      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">No spam. Unsubscribe anytime.</p>
    </div>
  );
}