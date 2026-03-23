'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully subscribed!');
      setEmail('');
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
      <input
        type="email"
        placeholder="Enter email address ..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        className="flex-1 h-12 px-5 border border-gray-200 bg-white text-navy text-sm placeholder:text-gray-400 focus:outline-none focus:border-navy/30 focus:ring-2 focus:ring-navy/10 transition-all disabled:opacity-50 rounded-lg"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 px-7 border border-coral-red text-coral-red text-sm font-medium hover:bg-coral-red hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 rounded-lg"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-coral-red/30 border-t-coral-red rounded-full animate-spin" />
            Subscribing...
          </>
        ) : (
          'Subscribe'
        )}
      </button>
    </form>
  );
}
