// app/(marketing)/components/Walkthrough.js
export default function Walkthrough() {
  const steps = [
    {
      n: "01",
      title: "Describe",
      text:
        "Type: “10 km feeder, 500 homes, 20% rooftop solar, 100 EVs by 2030.” We build the model.",
    },
    {
      n: "02",
      title: "Simulate",
      text: "Run power flow, voltage profile, and basic hosting capacity.",
    },
    {
      n: "03",
      title: "Share",
      text:
        "Send a link. Teammates comment, versions auto-save. Export to .glm/.dss.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">
          From prompt to power flow in minutes
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="border border-neutral-200 p-6">
              <div className="text-sm text-neutral-500">{s.n}</div>
              <h3 className="mt-2 font-semibold">{s.title}</h3>
              <p className="mt-2 text-neutral-700">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
