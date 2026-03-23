'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export function Footer() {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const footerSections: FooterSection[] = [
    {
      title: 'Content',
      links: [
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Sign In', href: '/sign-in' },
        { label: 'Dashboard', href: '/dashboard' },
      ],
    },
  ];

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 pt-12 pb-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10">
          {/* Logo and Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="CMS" width={32} height={32} className="rounded-md" />
              <span className="font-serif font-normal text-xl text-white tracking-tight">Nikola</span>
            </div>

            <p className="text-white/70 mb-6 max-w-sm text-sm leading-relaxed">
              A modern content management system built with Next.js, Better Auth, and Drizzle ORM.
            </p>
          </div>

          {/* Navigation Sections */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <div className="grid grid-cols-2 gap-6">
              {footerSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-white/90 mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-white/60 hover:text-white transition-colors text-sm"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/90 mb-4">
              Stay Updated
            </h3>

            <p className="text-white/60 mb-4 text-sm">
              Get the latest news and updates.
            </p>

            <form onSubmit={handleNewsletterSignup} className="space-y-3">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={isSubscribing}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubscribing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 text-sm"
              >
                {isSubscribing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                    Subscribing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="h-4 w-4 mr-2" />
                    Subscribe
                  </div>
                )}
              </Button>
            </form>

            <p className="text-xs text-white/40 mt-2">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex items-center justify-between">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Nikola. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </footer>
  );
}
