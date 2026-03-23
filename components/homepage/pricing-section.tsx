'use client';

import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    grade: 'Grade 10',
    price: '$10,000',
    period: 'Per Semester',
    highlighted: false,
    features: [
      'Modern and full-fleshed teachings',
      'Participation in after-school clubs',
      'Comprehensive library resources',
      'Individual academic counseling',
      'Access to fully-equipped science labs',
    ],
  },
  {
    grade: 'Grade 11',
    price: '$10,000',
    period: 'Per Semester',
    highlighted: true,
    features: [
      'Modern and full-fleshed teachings',
      'Participation in after-school clubs',
      'Comprehensive library resources',
      'Individual academic counseling',
      'Access to fully-equipped science labs',
    ],
  },
];

export function PricingSection() {
  return (
    <section className="py-20 sm:py-28 bg-navy">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-white/50 font-medium mb-4">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
              Our student fees
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <ScrollReveal key={plan.grade} delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-semibold text-navy">{plan.grade}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.period}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-navy">{plan.price}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 flex-1">
                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                        <span className="text-sm text-navy/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/#contact"
                    className={`block w-full text-center py-3.5 rounded-full text-sm font-medium transition-colors duration-300 no-underline ${
                      plan.highlighted
                        ? 'bg-navy text-white hover:bg-navy-light'
                        : 'border border-navy/20 text-navy hover:bg-navy/5'
                    }`}
                  >
                    Explore More
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
