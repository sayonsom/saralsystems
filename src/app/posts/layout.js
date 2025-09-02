import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sen, PT_Serif } from 'next/font/google';

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

export default function PostsLayout({ children }) {
  return (
    <div className={`min-h-screen bg-white ${sen.variable} ${ptSerif.variable}`}>
      <Header />
      <div className="pt-16">
        {children}
      </div>
      <Footer />
    </div>
  );
}
