"use client";

const features = [
  {
    name: 'Load forecasting',
    description: 'Plan upgrades early.',
  },
  {
    name: '8760 profile generation',
    description: 'Year-long scenarios fast.',
  },
  {
    name: 'EV & DER feasibility',
    description: 'Hosting and impacts.',
  },
  {
    name: 'Transformer upgrades',
    description: 'Capacity and timing.',
  },
  {
    name: 'Feeder studies',
    description: 'N-1/N-2 at scale.',
  },
  {
    name: 'Resiliency & microgrids',
    description: 'Islanding and recovery.',
  },
  {
    name: 'Group studies for DER',
    description: 'Batch interconnection reviews.',
  },
  {
    name: 'Substation studies',
    description: 'Protection, loading, expansions.',
  },
  {
    name: 'Regulatory filings check',
    description: 'Format, completeness, correctness.',
  },
];

export default function UseCasesFeatures() {
  return (
    <section id="use-cases" className="bg-white border-t border-neutral-200" style={{ fontFamily: "var(--font-sen), 'Sen', sans-serif" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            Use cases
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-700">
            From forecasting to resiliency planning, accelerate common utility workflows with confidence.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="group relative overflow-hidden rounded-none border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-[#EA580B]"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 flex-none overflow-hidden rounded-none border border-neutral-200 bg-neutral-100">
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                    Img
                  </div>
                </div>
                <dl className="min-w-0">
                  <dt className="font-semibold text-neutral-900">{feature.name}</dt>
                  <dd className="mt-1 text-neutral-700">{feature.description}</dd>
                </dl>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-none ring-0 ring-[#EA580B]/0 transition-all duration-300 group-hover:ring-4 group-hover:ring-[#EA580B]/20"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}