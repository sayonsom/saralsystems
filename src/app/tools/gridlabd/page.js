import AuthShowPublic from "@/components/AuthShowPublic";
import GridlabdClient from "@/components/GridlabdClient";
import GridlabdPostsScroll from "@/components/GridlabdPostsScroll";

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

      <GridlabdClient>
        <AuthShowPublic>
          {/* HERO */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-transparent" />
            <div className="relative max-w-5xl mx-auto px-4 py-14 sm:py-18">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700">
                <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-80">
                  <path fill="currentColor" d="M12 2L2 7l10 5l10-5zM2 17l10 5l10-5M2 12l10 5l10-5" />
                </svg>
                AI-powered distribution simulations
              </span>

              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
                Simulate feeders with EVs, Solar & Microgrids—<span className="text-indigo-600">right in your browser</span>
              </h1>

              <p className="mt-3 text-gray-700 sm:text-lg">
                No installs. Prompt to generate models. Run long or large scenarios in the cloud or on-prem. See insights in beautiful charts.
              </p>

              {/* Single Hero CTA */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="/signin" className="inline-flex items-center justify-center rounded-lg bg-black text-white px-5 py-3 font-semibold hover:bg-gray-900">
                  Get started
                </a>
              </div>

              {/* Hero image placeholder */}
              <div className="mt-8 aspect-[16/9] w-full rounded-2xl border bg-white shadow-sm flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gray-200" />
                  <p className="text-sm text-gray-500">Hero Placeholder — dashboard view of voltages, loading, EV peaks, PV backfeed</p>
                </div>
              </div>

              {/* mini "trusted by" placeholders */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-70">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 rounded-lg bg-gray-100" />
                ))}
              </div>
            </div>
          </section>

          {/* QUICK VALUE */}
          <section className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Why engineers pick this</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { t: "No complex local setup", d: "Run GridLAB-D from your browser—dev laptop or phone." },
                { t: "Prompt to model", d: "Describe feeders, EV adoption, solar mix, storage & tariffs—AI drafts the GLM." },
                { t: "Cloud or on-prem scale", d: "Burst for long runs, or deploy on enterprise infra." },
                { t: "Microgrids & behavior", d: "Model islanding, resiliency, and customer load behaviors." },
                { t: "Beautiful visuals", d: "Auto-generated KPIs, constraint heatmaps, and event timelines." },
                { t: "Version & export", d: "Track scenarios and export models/results cleanly." },
              ].map((f) => (
                <div key={f.t} className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="mb-3 h-10 w-10 rounded-lg bg-indigo-100" />
                  <h3 className="font-semibold">{f.t}</h3>
                  <p className="mt-1 text-sm text-gray-600">{f.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS (short & punchy) */}
          <section className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">How it works</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { s: "1", t: "Code, Clone, Prompt, or Import", d: "Whatever works best for you to build your GLM." },
                { s: "2", t: "Prompt & Configure", d: "EVs, PV, storage, TOU—AI fills the details." },
                { s: "3", t: "Run & Review", d: "Cloud/on-prem runs; inspect logs, violations, KPIs." },
              ].map((step) => (
                <div key={step.s} className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">{step.s}</div>
                    <h3 className="font-semibold">{step.t}</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{step.d}</p>
                  <div className="mt-3 aspect-video w-full rounded-lg bg-gray-100" />
                </div>
              ))}
            </div>
          </section>

          {/* FEATURED SCENARIOS (visual hooks) */}
          <section className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Popular scenarios</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { t: "EV Evening Peak", d: "What-if 25–60% EV penetration on a summer weekday." },
                { t: "PV Midday Backfeed", d: "Reverse power flows, regulator tap ops, volt var." },
                { t: "Microgrid Islanding", d: "Outage islands, blackstart, load shed priorities." },
                { t: "Behavior Modeling", d: "Customer response to price signals & DR events." },
              ].map((card) => (
                <div key={card.t} className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="aspect-video w-full rounded-lg bg-gray-100 mb-3" />
                  <h3 className="font-semibold">{card.t}</h3>
                  <p className="mt-1 text-sm text-gray-600">{card.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA STRIP */}
          <section className="max-w-5xl mx-auto px-4 py-10">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 p-6 sm:p-8 text-white">
              <h3 className="text-xl sm:text-2xl font-bold">Build & run your first feeder in minutes</h3>
              <p className="mt-1 text-white/90">Prompt the model, adjust DERs, launch a cloud run, share results.</p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <a href="/signin" className="inline-flex items-center justify-center rounded-lg bg-white text-gray-900 px-5 py-3 font-semibold hover:bg-gray-100">
                  Simulate a feeder model
                </a>
              </div>
            </div>
          </section>

          {/* ORIGINAL CONTENT (tightened & SEO FAQ stays) */}
          <section className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Do I need an account?</h3>
                <p className="text-gray-700">Public overview is open. Running simulations requires sign-in.</p>
              </div>
              <div>
                <h3 className="font-medium">Where do simulations run?</h3>
                <p className="text-gray-700">In a managed sandbox with browser preview and optional cloud or on-prem execution.</p>
              </div>
              <div>
                <h3 className="font-medium">What formats are supported?</h3>
                <p className="text-gray-700">GridLAB-D GLM for models; CSV/JSON for profiles and results.</p>
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
                      acceptedAnswer: { "@type": "Answer", text: "In a managed sandbox with browser preview and optional cloud or on-prem execution." },
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

          {/* GRIDLAB-D POSTS SECTION */}
          <GridlabdPostsScroll />
        </AuthShowPublic>
      </GridlabdClient>
    </main>
  );
}
