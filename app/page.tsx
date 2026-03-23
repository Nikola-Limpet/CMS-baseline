import Link from 'next/link';
import Image from 'next/image';
import { connection } from 'next/server';
import { getLatestPublishedBlogs, getFeaturedBlogPost } from '@/lib/dal';
import { Footer } from '@/components/layout/footer';
import { HeroSection, HeroItem } from '@/components/homepage/hero-section';
import { FeaturedPost } from '@/components/homepage/featured-post';
import { BlogPostCard } from '@/components/homepage/blog-post-card';
import { NewsletterForm } from '@/components/homepage/newsletter-form';
import { ScrollReveal } from '@/components/homepage/scroll-reveal';
import { TechStackSection } from '@/components/homepage/tech-stack-section';
import { BenefitsSection } from '@/components/homepage/benefits-section';
import { OpenSourceSection } from '@/components/homepage/open-source-section';
import { ProductShowcase } from '@/components/homepage/product-showcase';
import { InfrastructureSection } from '@/components/homepage/infrastructure-section';
import {
  ArrowRight,
  LayoutDashboard,
} from 'lucide-react';

export default async function Home() {
  await connection();

  const [featured, blogs] = await Promise.all([
    getFeaturedBlogPost(),
    getLatestPublishedBlogs(6),
  ]);

  const latestPosts = featured
    ? blogs.filter((p) => p.id !== featured.id).slice(0, 3)
    : blogs.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════════
          HERO — Dark, 2-Column Split
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 sm:pt-40 sm:pb-32">
          <HeroSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text Column */}
              <div className="max-w-xl">
                {/* Badge */}
                <HeroItem className="mb-8">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/60 text-xs tracking-[0.15em] uppercase font-medium backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Open Source CMS
                  </div>
                </HeroItem>

                {/* Headline */}
                <HeroItem>
                  <h1 className="text-[3.25rem] sm:text-6xl lg:text-7xl font-serif font-normal text-white tracking-[-0.02em] leading-[1.05]">
                    Your Content,
                    <br />
                    <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                      Beautifully Managed.
                    </span>
                  </h1>
                </HeroItem>

                {/* Description */}
                <HeroItem className="mt-6">
                  <p className="text-base sm:text-lg text-white/40 max-w-md leading-relaxed font-sans">
                    A modern CMS with a powerful blog editor, user management,
                    and a dashboard built for speed and simplicity.
                  </p>
                </HeroItem>

                {/* Dual CTAs */}
                <HeroItem className="mt-8">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Link
                      href="/blog"
                      className="group inline-flex items-center gap-3 px-8 py-3.5 bg-white text-[#0a0a0a] rounded-full text-sm font-medium hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.06)] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] no-underline"
                    >
                      Read the Blog
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/dashboard"
                      className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-medium text-white/70 border border-white/[0.12] hover:bg-white/[0.06] hover:text-white transition-all duration-300 no-underline"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </div>
                </HeroItem>
              </div>

              {/* Image Column */}
              <HeroItem>
                <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                  <div className="aspect-square">
                    <Image
                      src="/images/landing/hero_bg_real_person.png"
                      alt="Content creator writing on a laptop — modern CMS for writers and teams"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                  </div>
                </div>
              </HeroItem>
            </div>
          </HeroSection>
        </div>

        {/* Bottom gradient transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════
          TECH STACK — Compact Trust Bar
          ═══════════════════════════════════════════ */}
      <TechStackSection variant="compact" />

      {/* ═══════════════════════════════════════════
          PRODUCT SHOWCASE — Dashboard Screenshot
          ═══════════════════════════════════════════ */}
      <ProductShowcase />

      {/* ═══════════════════════════════════════════
          INFRASTRUCTURE — Server + Features
          ═══════════════════════════════════════════ */}
      <InfrastructureSection />

      {/* ═══════════════════════════════════════════
          BENEFITS — Dark Grid
          ═══════════════════════════════════════════ */}
      <BenefitsSection />

      {/* ═══════════════════════════════════════════
          FEATURED POST
          ═══════════════════════════════════════════ */}
      {featured && (
        <section className="py-20 sm:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-8">
                Featured
              </p>
            </ScrollReveal>

            <FeaturedPost post={featured} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          LATEST POSTS GRID
          ═══════════════════════════════════════════ */}
      {latestPosts.length > 0 && (
        <section className="py-20 sm:py-28 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-2">
                    Latest
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight">
                    From the Blog
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="group mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors no-underline"
                >
                  View all posts
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {latestPosts.map((post, i) => (
                <BlogPostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          OPEN SOURCE CTA — With Workspace Image
          ═══════════════════════════════════════════ */}
      <OpenSourceSection />

      {/* ═══════════════════════════════════════════
          NEWSLETTER — Dark
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-[#0a0a0a] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl font-serif font-normal tracking-tight text-white">
                Stay in the loop.
              </h2>
              <p className="text-white/45 text-base mt-4 mb-8 leading-relaxed">
                Get the latest posts and updates delivered straight to your inbox.
              </p>

              <NewsletterForm />

              <p className="text-xs text-white/25 mt-4">
                No spam. Unsubscribe at any time.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
