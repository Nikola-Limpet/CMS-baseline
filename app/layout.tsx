import type { Metadata } from 'next';
import { Inter, Poppins, Kantumruy_Pro } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/components/language-provider';
import { Navbar } from '@/components/layout/Navbar';
import ContactChat from '@/components/layout/ContactChat';

// Load Poppins font as primary font for the entire website
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

// Load Inter font as secondary font
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

// Load Kantumruy Pro for Khmer
const kantumruyPro = Kantumruy_Pro({
  subsets: ['khmer'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kantumruy',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MOVE - Mathematics Learning Center and Math Competition',
  description:
    'Premier mathematics education center with international competitions, expert instruction, and personalized learning for K-12 students across Asia',
  keywords: [
    'education',
    'math',
    'mathematics',
    'learning',
    'interactive',
    'personalized',
    'K-12',
    'competition',
    'olympiad',
    'asia',
    'tutoring',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MOVE',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'MOVE - Mathematics Learning Center',
    description:
      'Premier mathematics education center with international competitions and expert instruction',
    siteName: 'MOVE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOVE - Mathematics Learning Center',
    description:
      'Premier mathematics education center with international competitions and expert instruction',
  },
};

// Suppress hydration warnings caused by browser extensions or form auto-fill
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    args.length > 1 &&
    typeof args[0] === 'string' &&
    args[0].includes('Hydration failed because')
  ) {
    if (args[0].includes('fdprocessedid') || args[0].includes('autocomplete')) {
      return;
    }
  }
  originalConsoleError(...args);
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2A5C8D" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} ${kantumruyPro.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageProvider>
            <Navbar />
            {children}
            <ContactChat />
            <Toaster />
            <SonnerToaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
