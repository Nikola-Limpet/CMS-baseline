'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/language-provider';
import {
  ChevronDown,
  Search,
  HelpCircle,
  BookOpen,
  Users,
  Award,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function StaticFAQ() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['1'])); // First item open by default

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.clear(); // Accordion style - close others
        newSet.add(id);
      }
      return newSet;
    });
  };

  const categories = [
    { id: 'all', label: t('faq.category.all'), icon: HelpCircle },
    { id: 'enrollment', label: t('faq.category.enrollment'), icon: Users },
    { id: 'courses', label: t('faq.category.courses'), icon: BookOpen },
    { id: 'competitions', label: t('faq.category.competitions'), icon: Award },
    { id: 'pricing', label: t('faq.category.pricing'), icon: DollarSign },
  ];

  // Dynamic FAQ Data based on translations
  const faqData = [
    { id: '1', category: 'enrollment', q: t('faq.q.enrollment.1'), a: t('faq.a.enrollment.1') },
    { id: '2', category: 'general', q: t('faq.q.general.1'), a: t('faq.a.general.1') },
    { id: '3', category: 'courses', q: t('faq.q.courses.1'), a: t('faq.a.courses.1') },
    { id: '4', category: 'competitions', q: t('faq.q.competitions.1'), a: t('faq.a.competitions.1') },
    { id: '5', category: 'enrollment', q: t('faq.q.enrollment.2'), a: t('faq.a.enrollment.2') },
    { id: '6', category: 'pricing', q: t('faq.q.pricing.1'), a: t('faq.a.pricing.1') },
    { id: '7', category: 'competitions', q: t('faq.q.competitions.2'), a: t('faq.a.competitions.2') },
    { id: '8', category: 'courses', q: t('faq.q.courses.2'), a: t('faq.a.courses.2') },
    { id: '9', category: 'pricing', q: t('faq.q.pricing.2'), a: t('faq.a.pricing.2') },
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch =
      searchTerm === '' ||
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory || (selectedCategory === 'general' && faq.category === 'general');

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
            {t('nav.resources')}
          </Badge>
          <h2 className={cn(
            "text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight",
            language === 'km' ? 'font-kantumruy' : ''
          )}>
            {t('faq.title')}
          </h2>
          <p className={cn(
            "text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed",
            language === 'km' ? 'font-kantumruy' : ''
          )}>
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-10 space-y-6">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <Input
              type="text"
              placeholder={t('faq.search.placeholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={cn(
                "pl-12 pr-4 py-6 w-full bg-gray-50 border-gray-100 focus:border-blue-500 focus:ring-blue-500 rounded-2xl text-base shadow-sm transition-all hover:bg-white",
                language === 'km' ? 'font-kantumruy' : ''
              )}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    selectedCategory === cat.id
                      ? "bg-gray-900 text-white shadow-md transform scale-105"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className={language === 'km' ? 'font-kantumruy' : ''}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          <AnimatePresence mode='wait'>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => {
                const isOpen = openItems.has(faq.id);
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div 
                      className={cn(
                        "group rounded-2xl border transition-all duration-300 overflow-hidden bg-white",
                        isOpen 
                          ? "border-blue-200 shadow-md ring-1 ring-blue-50" 
                          : "border-gray-100 hover:border-blue-100 hover:shadow-sm"
                      )}
                    >
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full px-6 py-5 text-left flex items-start justify-between gap-4"
                      >
                        <span className={cn(
                          "font-semibold text-gray-900 text-lg leading-snug",
                          language === 'km' ? 'font-kantumruy leading-relaxed' : ''
                        )}>
                          {faq.q}
                        </span>
                        <span 
                          className={cn(
                            "flex-shrink-0 ml-4 p-1 rounded-full border transition-all duration-300",
                            isOpen 
                              ? "bg-blue-600 border-blue-600 text-white rotate-180" 
                              : "bg-gray-50 border-gray-200 text-gray-400 group-hover:border-blue-200 group-hover:text-blue-500"
                          )}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </span>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-6 pt-0">
                              <p className={cn(
                                "text-gray-600 leading-relaxed border-t border-dashed border-gray-100 pt-4",
                                language === 'km' ? 'font-kantumruy' : ''
                              )}>
                                {faq.a}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className={cn("text-lg font-medium text-gray-900", language === 'km' ? 'font-kantumruy' : '')}>
                  {t('faq.no_results')}
                </h3>
                <p className={cn("text-gray-500", language === 'km' ? 'font-kantumruy' : '')}>
                  {t('faq.no_results.desc')}
                </p>
                <Button 
                  variant="link" 
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                  className="mt-2 text-blue-600"
                >
                  {t('faq.clear_filters')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
