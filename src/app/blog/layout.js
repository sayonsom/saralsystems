import React from 'react';
import Header from '@/components/Header';
import { Sen, PT_Serif } from 'next/font/google';

// import PublicFooter from '@/components/Footers/PublicFooter';

const sen = Sen({
  subsets: ['latin'],
  variable: '--font-sen',
  display: 'swap',
});

const ptSerif = PT_Serif({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-pt-serif',
  display: 'swap',
});

export default function BlogLayout({ children }) {
  return (
    <div className={`min-h-screen ${sen.variable} ${ptSerif.variable}`}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
        {children}
      </div>
      {/* <PublicFooter /> */}
    </div>
  );
}