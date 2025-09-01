import ProtectedGridlabdPage from "@/components/ProtectedGridlabdPage";
import AuthShowPublic from "@/components/AuthShowPublic";

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
      "Build and run feeder-level GridLAB-D models. Use AI to generate load profiles and test scenarios with smart meters, EVs, and solar.",
    url: "https://www.saralsystems.co/tools/gridlabd",
    images: [
      {
        url: "/gridlabd-og.webp",
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
      {/* SoftwareApplication JSON-LD */}
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

      {/* Public overview shown only when logged out */}
      <AuthShowPublic>
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">GridLAB-D Web IDE</h1>
          <p className="text-gray-700 mb-6">
            Design and run feeder-level distribution simulations in your browser. Use AI to generate realistic load profiles, configure DERs (smart meters, EVs, solar PV, storage),
            and iterate quickly—no local installs.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Import or author GLM feeder models</li>
            <li>AI-assisted profile generation for residential, commercial, EV charging, and PV</li>
            <li>Scenario runs with logs, outputs, and charts</li>
            <li>Feeder-level KPIs: voltages, losses, loading, violations</li>
          </ul>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-3">How it works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Start from a template or import your GLM.</li>
            <li>Generate load profiles with AI or upload measured data.</li>
            <li>Add DERs: smart meters, EV adoption, solar PV, storage, TOU tariffs.</li>
            <li>Run simulations and review logs, violations, and KPIs.</li>
            <li>Export results and model variants.</li>
          </ol>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Do I need an account?</h3>
              <p className="text-gray-700">Public overview is open. Running simulations requires sign-in.</p>
            </div>
            <div>
              <h3 className="font-medium">Where do simulations run?</h3>
              <p className="text-gray-700">In a managed sandbox with browser preview and optional cloud execution.</p>
            </div>
            <div>
              <h3 className="font-medium">What formats are supported?</h3>
              <p className="text-gray-700">GridLAB-D GLM models and CSV/JSON for profiles and results.</p>
            </div>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Do I need an account?",
                    acceptedAnswer: { "@type": "Answer", text: "Public overview is open. Running simulations requires sign-in." },
                  },
                  {
                    "@type": "Question",
                    name: "Where do simulations run?",
                    acceptedAnswer: { "@type": "Answer", text: "In a managed sandbox with browser preview and optional cloud execution." },
                  },
                  {
                    "@type": "Question",
                    name: "What formats are supported?",
                    acceptedAnswer: { "@type": "Answer", text: "GridLAB-D GLM models and CSV/JSON for profiles and results." },
                  },
                ],
              }),
            }}
          />
        </section>
      </AuthShowPublic>

      {/* Gated IDE */}
      <ProtectedGridlabdPage />
    </main>
  );
}
