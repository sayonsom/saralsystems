export default function Utilities() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{ backgroundImage: "url('/data-center.webp')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-white/75" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Built for Utilities</h2>
        <p className="text-xl text-gray-700 max-w-3xl">
          Plan, simulate, and operationalize distribution studies with enterprise-grade workflows
          and compliance-ready tooling.
        </p>
      </div>
    </section>
  );
}
