import { Sen } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/contexts/AuthContext";

const sen = Sen({
  variable: "--font-sen",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.saral.energy"),
  title: {
    default: "We minimize risks for Energy Transition",
    template: "%s | Saral",
  },
  description:
    "AI-powered services for data center prospecting, PPA cost analysis, workflow automation, and workforce upskilling in India.",
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
    url: "https://www.saral.energy/",
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
              url: "https://www.saral.energy",
              sameAs: [],
              logo: "/vercel.svg",
            }),
          }}
        />
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
