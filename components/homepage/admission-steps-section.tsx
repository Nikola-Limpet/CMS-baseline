'use client';

import { ScrollReveal } from './scroll-reveal';
import { FileText, ClipboardCheck, PenLine, BadgeCheck } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Submit Application',
    description: 'Fill out the online application form with student information, academic history, and preferred program.',
  },
  {
    number: '02',
    icon: ClipboardCheck,
    title: 'Academic Review',
    description: 'Our admissions team reviews transcripts, recommendation letters, and academic records thoroughly.',
  },
  {
    number: '03',
    icon: PenLine,
    title: 'Entrance Assessment',
    description: 'Complete the entrance examination and attend a personal interview with our faculty panel.',
  },
  {
    number: '04',
    icon: BadgeCheck,
    title: 'Acceptance & Enrollment',
    description: 'Receive your acceptance letter, complete registration, and join the Nikola community.',
  },
];

export function AdmissionStepsSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-4">
              Admission
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-navy">
              How to enroll at Nikola
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.1}>
              <div className="relative text-center group">
                {/* Connector line (hidden on first and mobile) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-px border-t border-dashed border-navy/15" />
                )}

                {/* Icon circle */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-navy/10 mb-6 group-hover:bg-navy/5 transition-colors duration-300">
                  <step.icon className="w-6 h-6 text-navy" strokeWidth={1.5} />
                </div>

                {/* Step number */}
                <p className="text-xs font-bold text-navy/30 tracking-widest mb-2">
                  STEP {step.number}
                </p>

                {/* Title */}
                <h3 className="text-base font-semibold text-navy mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
