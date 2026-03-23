'use client';

import Link from 'next/link';
import { GridPattern } from '@/components/common/GridPattern';

const linkColumns = [
  {
    title: 'Links',
    links: [
      { label: 'Homepage v1', href: '/' },
      { label: 'Homepage v2', href: '/' },
      { label: 'Homepage v3', href: '/' },
      { label: 'About', href: '/#about' },
      { label: 'Programs', href: '/#programs' },
      { label: 'Community', href: '/#community' },
    ],
  },
  {
    title: 'Programs',
    links: [
      { label: 'College AP Program', href: '/#programs' },
      { label: 'STEM Program', href: '/#programs' },
      { label: 'Arts Program', href: '/#programs' },
      { label: 'Athletics Program', href: '/#programs' },
      { label: 'Languages Program', href: '/#programs' },
      { label: 'Humanities Program', href: '/#programs' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Logo + Description + Grid Pattern */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <span className="text-2xl tracking-tight font-serif">
                Nikola
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              A modern content management system built for speed, simplicity, and beautiful content.
            </p>
            {/* Grid Pattern decoration */}
            <div className="hidden lg:block">
              <GridPattern variant="dark" rows={4} cols={4} cellSize={40} gap={4} />
            </div>
          </div>

          {/* Link Columns */}
          {linkColumns.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <h3 className="font-semibold text-sm text-white mb-4">{column.title}</h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Address */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-sm text-white mb-4">Address</h3>
            <address className="not-italic text-sm text-white/60 leading-relaxed space-y-2">
              <p>1234 Education Lane, Learning City, EDFG States 056789</p>
              <p>+1 (555) 123-4567</p>
              <p>info@nikola.dev</p>
            </address>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            Copyright &copy; Nikola {new Date().getFullYear()}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-white/50 hover:text-white transition-colors">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
