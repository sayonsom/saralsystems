import { Sen } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/contexts/AuthContext";
import CookieConsent from "@/components/CookieConsent";
import RouteTracker from "@/components/RouteTracker";
import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import ToastContainer from '@/components/ui/ToastContainer';
import Header from '@/components/Header';

const sen = Sen({
  variable: "--font-sen",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.voltedge.dev"),
  title: {
    default: "We minimize risks for Energy Transition",
    template: "%s | VoltEdge",
  },
  description:
    "AI-powered services for data center prospecting, energy stack, smart metering, renewable penetration, market policy design, PPA cost analysis, workflow automation, and energy workforce upskilling in India.",
  keywords: [
    "energy transition",
    "India",
    "data center prospecting",
    "PPA analysis",
    "AI automation",
    "workforce upskilling",
  ],
  openGraph: {
    title: "VoltEdge – Smart Grid and Distribution Systems Planning",
    description:
      "",
    url: "https://www.voltedge.dev/",
    siteName: "VoltEdge",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "VoltEdge",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoltEdge – Simplifying India's Energy Transition",
    description:
      "AI-powered services for data center prospecting, PPA cost analysis, workflow automation, and workforce upskilling in India.",
    images: ["/vercel.svg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-video-preview": -1,
    "max-snippet": -1,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
};

export const viewport = {
  themeColor: "#ea580b",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${sen.variable} min-h-screen bg-white text-neutral-900 font-sans antialiased`}
      >
        {/* JSON-LD for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "VoltEdge",
              url: "https://www.voltedge.dev",
              sameAs: [],
              logo: "https://www.voltedge.dev/logo.png",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.voltedge.dev/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <AuthContextProvider>
          <Header />
          {children}
        </AuthContextProvider>
        <ToastContainer />
        {/* Cookie consent banner and simple route tracking cookies */}
        <CookieConsent />
        <Suspense fallback={null}>
          <RouteTracker />
        </Suspense>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
