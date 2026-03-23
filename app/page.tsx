import Link from 'next/link';
import { connection } from 'next/server';
import { getLatestPublishedBlogs, getUpcomingEvents } from '@/lib/dal';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/homepage/hero-section';
import { AboutSection } from '@/components/homepage/about-section';
import { ProgramsSection } from '@/components/homepage/programs-section';
import { EventCard } from '@/components/homepage/event-card';
import { GallerySection } from '@/components/homepage/gallery-section';
import { AlumniSection } from '@/components/homepage/alumni-section';
import { BlogPostCard } from '@/components/homepage/blog-post-card';
import { CTABannerSection } from '@/components/homepage/cta-banner-section';
import { PricingSection } from '@/components/homepage/pricing-section';
import { FAQSection } from '@/components/homepage/faq-section';
import { NewsletterForm } from '@/components/homepage/newsletter-form';
import { PartnersSection } from '@/components/homepage/partners-section';
import { AdmissionStepsSection } from '@/components/homepage/admission-steps-section';
import { ScrollReveal } from '@/components/homepage/scroll-reveal';
import { GridPattern } from '@/components/common/GridPattern';
import { ArrowUpRight } from 'lucide-react';

export default async function Home() {
  await connection();

  const [blogs, upcomingEvents] = await Promise.all([
    getLatestPublishedBlogs(6),
    getUpcomingEvents(3),
  ]);

  const latestPosts = blogs.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <HeroSection />

      {/* About + Features + Awards */}
      <AboutSection />

      {/* Programs */}
      <ProgramsSection />

      {/* Admission Steps */}
      <AdmissionStepsSection />

      {/* Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 sm:py-28 bg-cream">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Left - Heading + Grid Pattern */}
              <ScrollReveal>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-4">
                    Events
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-serif font-normal text-navy leading-snug">
                    Join our next
                    <br />
                    upcoming events
                  </h2>
                </div>
              </ScrollReveal>

              {/* Right - Event Cards */}
              <div>
                {upcomingEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      <GallerySection />

      {/* Alumni */}
      <AlumniSection />

      {/* Partner Logos */}
      <PartnersSection />

      {/* Blog — Navy background */}
      {latestPosts.length > 0 && (
        <section className="py-20 sm:py-28 bg-navy relative overflow-hidden">
          {/* Grid Pattern decoration in top-right */}
          <div className="absolute top-8 right-8 hidden lg:block">
            <GridPattern variant="dark" rows={4} cols={5} cellSize={44} gap={4} />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-white/50 font-medium mb-4">
                    Blog
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
                    Our latest news
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-coral-red hover:text-coral-red/80 transition-colors no-underline"
                >
                  See all articles
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {latestPosts.map((post, i) => (
                <BlogPostCard key={post.id} post={post} index={i} showReadOverlay={i === 1} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <CTABannerSection />

      {/* Pricing */}
      <PricingSection />

      {/* FAQ */}
      <FAQSection />

      {/* Newsletter */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-navy leading-snug">
                Stay Updated
                <br />
                with Nikola
              </h2>
              <NewsletterForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
