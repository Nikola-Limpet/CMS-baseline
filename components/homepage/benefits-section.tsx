'use client';

import {
  GitFork,
  Lock,
  Type,
  Moon,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';

const benefits = [
  {
    icon: GitFork,
    title: 'Fork & Customize',
    description: 'Modular codebase designed to be forked. Change anything — the code is yours.',
  },
  {
    icon: Lock,
    title: 'Built-in Auth',
    description: 'User management, OAuth, and role-based access out of the box.',
  },
  {
    icon: Type,
    title: 'Rich Text Editor',
    description: 'TipTap-powered editor with headings, lists, code blocks, and image uploads.',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description: 'System-aware theming with light and dark modes via CSS variables.',
  },
  {
    icon: ShieldCheck,
    title: 'Type-Safe',
    description: 'End-to-end TypeScript from database schema to React components.',
  },
  {
    icon: Code2,
    title: 'Open Source',
    description: 'MIT licensed. No subscriptions, no vendor lock-in, no strings attached.',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#0a0a0a] text-white">
      {/* Dot grid pattern */}
      <div className="relative">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs tracking-[0.2em] uppercase text-white/40 font-medium mb-4">
                Why This CMS
              </p>
              <h2 className="text-4xl sm:text-5xl font-serif font-normal tracking-tight text-white">
                Everything you need.
                <br />
                Nothing you don&apos;t.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((benefit, i) => (
              <ScrollReveal key={benefit.title} delay={i * 0.06}>
                <div className="p-6 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:translate-y-[-2px] hover:border-white/[0.12] transition-all duration-300">
                  <benefit.icon className="w-5 h-5 text-white/60 mb-3" />
                  <h3 className="text-sm font-semibold text-white mb-1.5">{benefit.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{benefit.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
