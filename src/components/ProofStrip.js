// app/(marketing)/components/ProofStrip.js
export default function ProofStrip() {
  const items = [
    {
      kpi: "EV hosting pre-study in 2 days",
      text: "Faster PoC delivery with prompt-to-model.",
    },
    {
      kpi: "Class of 60, 180 scenarios",
      text: "Zero installs. Real learning by doing.",
    },
    {
      kpi: "NGO grid audit with transparent models",
      text: "Reproducible results; public-interest planning.",
    },
  ];

  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((x) => (
            <div key={x.kpi} className="border border-neutral-200 p-6">
              <div className="font-semibold">{x.kpi}</div>
              <p className="mt-2 text-neutral-700">{x.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
