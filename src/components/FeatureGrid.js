// app/(marketing)/components/FeatureGrid.js
const features = [
  { t: "AI Feeder Builder", d: "Prompt → model scaffolding you can edit/validate." },
  { t: "CSV/GIS Import", d: "Auto-map loads/meters to nodes; fix quickly in UI." },
  { t: "DER Modules", d: "Solar, EV, storage—basic parameters built-in." },
  { t: "Hosting Capacity (basic)", d: "First-pass insights for DER/EV rollout." },
  { t: "Versioning & Audit", d: "Every change tracked; export logs." },
  { t: "Export .glm/.dss", d: "Continue work in GridLAB-D/OpenDSS." },
  { t: "Team Sharing", d: "Invite, comment, and collaborate." },
  { t: "On-prem Option", d: "Utilities can deploy privately." },
];

export default function FeatureGrid() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Built for speed and collaboration</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-4 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.t} className="border border-neutral-200 p-6">
              <h3 className="font-semibold">{f.t}</h3>
              <p className="mt-2 text-neutral-700">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
