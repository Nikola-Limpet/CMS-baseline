"use client";

import { Button } from '@/components/ui/button';

export default function NewsletterForm() {
  return (
    <div className="flex gap-2">
      <input 
        type="email" 
        placeholder="Your email address" 
        className="px-4 py-2 border border-border rounded-md w-64 bg-background"
        suppressHydrationWarning
      />
      <Button className="bg-primary hover:bg-primary/90" suppressHydrationWarning>
        Subscribe
      </Button>
    </div>
  );
}
