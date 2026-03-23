'use client';

import React, { Suspense, lazy } from 'react';
import { useLanguage } from '@/components/language-provider';
import EnhancedHero from '@/components/ui/enhanced-hero';
import { LatestBlogs } from '@/components/homepage/LatestBlogs';

import type { BlogPost } from '@/db/schema';

const MissionSection = lazy(() => import('@/components/homepage/MissionSection'));
const FeatureShowcase = lazy(() => import('@/components/ui/feature-showcase'));
const StaticFAQ = lazy(() => import('@/components/homepage/StaticFAQ').then(module => ({ default: module.StaticFAQ })));

const ComponentLoader = () => (
  <div className="animate-pulse bg-slate-50 rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
    <div className="flex items-center space-x-3">
      <div className="w-4 h-4 bg-slate-300 rounded-full animate-bounce" />
      <div className="w-4 h-4 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
      <div className="w-4 h-4 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    </div>
  </div>
);

const DarkComponentLoader = () => (
  <div className="animate-pulse bg-slate-800 rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
    <div className="flex items-center space-x-3">
      <div className="w-4 h-4 bg-slate-600 rounded-full animate-bounce" />
      <div className="w-4 h-4 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
      <div className="w-4 h-4 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    </div>
  </div>
);

/** SVG wave divider — light-to-dark */
const WaveDividerLightToDark = () => (
  <div className="relative -mb-px">
    <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
      <path d="M0 0L60 4.7C120 9.3 240 18.7 360 23.3C480 28 600 28 720 25.3C840 22.7 960 17.3 1080 15.3C1200 13.3 1320 14.7 1380 15.3L1440 16V56H1380C1320 56 1200 56 1080 56C960 56 840 56 720 56C600 56 480 56 360 56C240 56 120 56 60 56H0V0Z" fill="#0f172a" />
    </svg>
  </div>
);

/** SVG wave divider — dark-to-light */
const WaveDividerDarkToLight = ({ fillColor = '#f8fafc' }: { fillColor?: string }) => (
  <div className="relative -mb-px">
    <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
      <path d="M0 0L60 4.7C120 9.3 240 18.7 360 23.3C480 28 600 28 720 25.3C840 22.7 960 17.3 1080 15.3C1200 13.3 1320 14.7 1380 15.3L1440 16V56H1380C1320 56 1200 56 1080 56C960 56 840 56 720 56C600 56 480 56 360 56C240 56 120 56 60 56H0V0Z" fill={fillColor} />
    </svg>
  </div>
);

interface HomepageClientProps {
  blogs: BlogPost[];
}

export default function HomepageClient({ blogs }: HomepageClientProps) {
  const { t, language } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 overflow-x-hidden">
      <main className="flex-1 w-full relative">
        {/* Hero */}
        <EnhancedHero />

        {/* Wave: Hero → Mission (dark) */}
        <WaveDividerLightToDark />

        {/* Mission Section (dark) */}
        <Suspense fallback={<DarkComponentLoader />}>
          <MissionSection />
        </Suspense>

        {/* Wave: Mission (dark) → Features (light) */}
        <WaveDividerDarkToLight />

        {/* Feature Showcase */}
        <Suspense fallback={<ComponentLoader />}>
          <FeatureShowcase />
        </Suspense>

        {/* Latest Blogs */}
        <div className="space-y-16 py-16 bg-slate-50 border-t border-slate-100">
          <LatestBlogs blogs={blogs} />
        </div>

        {/* FAQ */}
        <Suspense fallback={<ComponentLoader />}>
          <StaticFAQ />
        </Suspense>
      </main>
    </div>
  );
}
