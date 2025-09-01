import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import AuthShowPublic from '@/components/AuthShowPublic';

export default function SmartMeterLoadDisaggregation() {
  return (
    <>
      {/* Public overview */}
      <AuthShowPublic>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
            <Link href="/tools" className="hover:text-gray-700">Tools</Link>
            <span className="mx-2">/</span>
            <span>Smart Meter Load Disaggregation</span>
          </nav>
          <header>
            <h1 className="text-3xl font-bold mb-3">Smart Meter Load Disaggregation</h1>
            <p className="text-gray-700 mb-6">AI-based NILM to extract appliance-level consumption from smart meter time series. Upload data, analyze loads, and export reports.</p>
          </header>
          <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p className="text-gray-700">Identify appliance signatures (HVAC, EV chargers, water heaters) from AMI intervals and generate time-of-use insights for DSM programs.</p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
              <li>Upload CSV with timestamps and kWh/kW</li>
              <li>Model library for common appliances</li>
              <li>Interactive charts and PDF reporting</li>
            </ul>
          </section>
          <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">How it works</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Upload AMI interval data.</li>
              <li>Run AI-based NILM to separate loads.</li>
              <li>Review appliance-level usage, costs, and TOU impacts.</li>
              <li>Export dashboards and CSV reports.</li>
            </ol>
          </section>
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-3">FAQ</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">What sampling interval do you support?</h3>
                <p className="text-gray-700">Common AMI intervals (1–60 minutes). Higher resolution yields better detection.</p>
              </div>
              <div>
                <h3 className="font-medium">Is my data private?</h3>
                <p className="text-gray-700">Yes. Data is processed securely and not shared with third parties.</p>
              </div>
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: [
                    { "@type": "Question", name: "What sampling interval do you support?", acceptedAnswer: { "@type": "Answer", text: "Common AMI intervals (1–60 minutes)." } },
                    { "@type": "Question", name: "Is my data private?", acceptedAnswer: { "@type": "Answer", text: "Yes. Data is processed securely and not shared." } },
                  ],
                }),
              }}
            />
          </section>
        </div>
      </AuthShowPublic>

      {/* Gate tool access */}
      <ProtectedRoute>
        <div className="max-w-5xl mx-auto px-4 pb-10">
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-700">This tool is coming soon. Here you will be able to upload smart meter data and run appliance-level disaggregation.</p>
          </section>
        </div>
      </ProtectedRoute>
    </>
  );
}
