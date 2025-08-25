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
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subscription_type: 'newsletter'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      if (data.isExisting) {
        toast({
          title: "Already Subscribed",
          description: "Thank you, you are already subscribed with this email ID.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Welcome to Gridleaf!",
          description: "Thank you for subscribing to our newsletter! You'll receive our latest insights soon.",
          duration: 5000,
        });
      }

      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
            <div className="bg-neutral-light dark:bg-[#222222] rounded-none p-8">
      <h3 className="text-xl font-semibold mb-4 text-text-dark dark:text-text-light">Subscribe to our newsletter</h3>
      <p className="text-text-medium dark:text-text-light/80 mb-6">
        Get the latest insights on AI, energy, and technology delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-2 rounded-none border border-primary-start/30 dark:border-primary-start/50 bg-white dark:bg-[#181818] focus:outline-none focus:ring-2 focus:ring-primary-start text-text-dark dark:text-text-light placeholder-text-medium/50 dark:placeholder-text-light/50"
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="whitespace-nowrap"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
} 