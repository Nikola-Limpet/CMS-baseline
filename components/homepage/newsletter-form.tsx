'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        className="flex-1 h-12 px-6 rounded-full bg-white/[0.06] border border-white/[0.1] text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/25 focus:ring-2 focus:ring-white/10 transition-all disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 px-6 rounded-full bg-white text-[#0a0a0a] text-sm font-medium hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
            Subscribing...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Subscribe
          </>
        )}
      </button>
    </form>
  );
}
