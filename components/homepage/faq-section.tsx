'use client';

import { ScrollReveal } from './scroll-reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How can I schedule a campus tour?',
    answer: 'You can schedule a campus tour by contacting our admissions office at admissions@nikola.dev or by filling out the tour request form on our Contact Us page. Tours are available Monday through Friday during school hours.',
  },
  {
    question: 'How can I contact teachers directly?',
    answer: 'You can reach out to teachers via email or through the school\'s website communication portal. If you meet any challenge, feel free to contact our administration office for assistance.',
  },
  {
    question: 'Is there a school dress code?',
    answer: 'Yes, Nikola has a dress code that promotes a professional and inclusive learning environment. Details about the dress code policy can be found in the student handbook provided during enrollment.',
  },
  {
    question: 'What is the enrollment process?',
    answer: 'The enrollment process includes submitting an application form, providing academic transcripts, completing an entrance assessment, and attending an interview. Applications open in January each year for the following academic year.',
  },
  {
    question: 'What extracurricular activities are available?',
    answer: 'We offer a wide range of extracurricular activities including sports teams, debate club, robotics club, art society, music ensemble, volunteer programs, and many student-led organizations.',
  },
  {
    question: 'What are the school hours?',
    answer: 'School hours are from 7:30 AM to 3:00 PM, Monday through Friday. After-school programs and clubs run from 3:30 PM to 5:00 PM. The library remains open until 6:00 PM.',
  },
];

export function FAQSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Heading */}
          <ScrollReveal>
            <div className="lg:sticky lg:top-32">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-4">
                FAQ
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-navy leading-snug">
                Answers to
                <br />
                your questions
              </h2>
            </div>
          </ScrollReveal>

          {/* Right - Accordion */}
          <ScrollReveal delay={0.1}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b-0 mb-2"
                >
                  <AccordionTrigger className="text-left text-base font-medium text-navy hover:text-navy/80 hover:no-underline py-4 px-4 rounded-lg hover:bg-cream border-l-2 border-navy/20 data-[state=open]:border-navy transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed px-4 pb-4 ml-[2px] border-l-2 border-navy">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
