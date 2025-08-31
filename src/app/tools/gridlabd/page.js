import ProtectedGridlabdPage from "@/components/ProtectedGridlabdPage";

export const metadata = {
  title: "GridLAB-D Web IDE",
  description:
    "Design and run feeder-level distribution simulations in the browser. Generate GridLAB-D models with AI, synthesize load profiles, and experiment with smart meters, electric vehicles, solar PV, and storage.",
  keywords: [
    "GridLAB-D",
    "distribution simulation",
    "feeder model",
    "smart meter",
    "electric vehicle",
    "solar PV",
    "DER",
    "load profiles",
    "power systems",
    "AI modeling",
    "openDSS alternative",
    "distribution feeder",
    "grid simulation",
  ],
  alternates: {
    canonical: "/tools/gridlabd",
  },
  openGraph: {
    title: "GridLAB-D Web IDE | Saral",
    description:
      "Author and run feeder-level GridLAB-D models. Use AI to generate load profiles and test scenarios with smart meters, EVs, and solar.",
    url: "https://www.saralsystems.co/tools/gridlabd",
    images: [
      {
        url: "/vercel.svg",
        width: 1200,
        height: 630,
        alt: "GridLAB-D Web IDE",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GridLAB-D Web IDE | Saral",
    description:
      "Design and run feeder-level GridLAB-D simulations. AI-generated load profiles; smart meters, EVs, and solar scenarios.",
    images: ["/vercel.svg"],
  },
};

export default function Page() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "GridLAB-D Web IDE",
            applicationCategory: "EngineeringApplication",
            operatingSystem: "Web",
            description:
              "Design and run feeder-level distribution simulations. Generate GridLAB-D models with AI, synthesize load profiles, and evaluate smart meters, EVs, solar PV, and storage.",
            url: "https://www.saralsystems.co/tools/gridlabd",
            publisher: {
              "@type": "Organization",
              name: "Saral",
              url: "https://www.saralsystems.co",
            },
          }),
        }}
      />
      <ProtectedGridlabdPage />
    </main>
  );
}
