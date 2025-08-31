import { Sen } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/contexts/AuthContext";
import CookieConsent from "@/components/CookieConsent";
import RouteTracker from "@/components/RouteTracker";
import { Suspense } from "react";

const sen = Sen({
  variable: "--font-sen",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.saralsystems.co"),
  title: {
    default: "We minimize risks for Energy Transition",
    template: "%s | Saral",
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
    title: "Saral – Simplifying India's Energy Transition",
    description:
      "AI-powered services for data center prospecting, PPA cost analysis, workflow automation, and workforce upskilling in India.",
    url: "https://www.saralsystems.co/",
    siteName: "Saral",
    images: [
      {
        url: "/vercel.svg",
        width: 1200,
        height: 630,
        alt: "Saral",
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
    title: "Saral – Simplifying India's Energy Transition",
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
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sen.variable} font-sans antialiased`}
      >
        {/* JSON-LD for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Saral",
              url: "https://www.saralsystems.co",
              sameAs: [],
              logo: "https://www.saralsystems.co/logo.png",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.saralsystems.co/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
        {/* Cookie consent banner and simple route tracking cookies */}
        <CookieConsent />
        <Suspense fallback={null}>
          <RouteTracker />
        </Suspense>
      </body>
    </html>
  );
}
