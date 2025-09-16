// app/(marketing)/components/FAQ.js
const faqs = [
  {
    q: "Can this replace CYME/ETAP/PSSE for filings?",
    a: "No. It is a sandbox for exploration/teaching. Export models to incumbent tools for regulatory submissions.",
  },
  {
    q: "Do you support on-prem deployments?",
    a: "Yes. Private cloud/air-gapped modes, SSO/SAML, and VPC peering are supported for enterprise.",
  },
  {
    q: "Which templates are included?",
    a: "IEEE 13/34-Node to start, with more feeders and examples added regularly.",
  },
  {
    q: "Is AI-generated feeder scaffolding accurate?",
    a: "It provides a baseline you can edit and validate. Full logs are kept for auditability.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">FAQs</h2>
        <dl className="mt-6 grid gap-6 md:grid-cols-2">
          {faqs.map((f) => (
            <div key={f.q} className="border border-neutral-200 p-6">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-2 text-neutral-700">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
