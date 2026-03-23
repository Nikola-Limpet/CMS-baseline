'use client';

import { useLanguage } from './../language-provider';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative border-2 border-accent/80 bg-white/20 text-primary hover:bg-accent/10 shadow-sm transition-all font-medium pr-8 rounded-full"
      >
        <span className="text-sm">
          {language === 'en' ? 'English' : 'ភាសាខ្មែរ'}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-300 text-accent ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white border-2 border-accent/30 z-50 overflow-hidden"
          >
            <div className="py-1">
              <button
                onClick={() => {
                  setLanguage('en');
                  setIsOpen(false);
                }}
                className={`${
                  language === 'en'
                    ? 'bg-accent/20 text-primary font-medium border-l-4 border-accent'
                    : 'text-gray-700 hover:border-l-4 hover:border-accent/50'
                } flex items-center w-full px-4 py-3 text-sm hover:bg-accent/5 transition-all font-poppins`}
              >
                English
              </button>
              <button
                onClick={() => {
                  setLanguage('km');
                  setIsOpen(false);
                }}
                className={`${
                  language === 'km'
                    ? 'bg-accent/20 text-primary font-medium border-l-4 border-accent'
                    : 'text-gray-700 hover:border-l-4 hover:border-accent/50'
                } flex items-center w-full px-4 py-3 text-sm hover:bg-accent/5 transition-all font-kantumruy`}
              >
                ភាសាខ្មែរ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
