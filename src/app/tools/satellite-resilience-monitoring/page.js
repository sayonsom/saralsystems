import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import AuthShowPublic from '@/components/AuthShowPublic';

export default function SatelliteResilienceMonitoring() {
  return (
    <>
      {/* Public overview */}
      <AuthShowPublic>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
            <Link href="/tools" className="hover:text-gray-700">Tools</Link>
            <span className="mx-2">/</span>
            <span>Satellite-based Resilience Monitoring</span>
          </nav>
          <header>
            <h1 className="text-3xl font-bold mb-3">Satellite-based Resilience Monitoring</h1>
            <p className="text-gray-700 mb-6">Track grid resilience with Earth observation data and AI analytics across regions.</p>
          </header>
          <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p className="text-gray-700">Combine multi-spectral imagery with network data to measure vegetation encroachment, flood risk, and infrastructure stress.</p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
              <li>Change detection for outages and anomalies</li>
              <li>Vegetation proximity and growth forecasting</li>
              <li>Event impact assessment and recovery tracking</li>
            </ul>
          </section>
          <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">How it works</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Ingest EO datasets and utility geodata.</li>
              <li>Run AI models for change and risk detection.</li>
              <li>View dashboards for risk heatmaps and trends.</li>
              <li>Export shapefiles and reports for field ops.</li>
            </ol>
          </section>
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-3">FAQ</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">What imagery do you use?</h3>
                <p className="text-gray-700">Public EO sources (e.g., Sentinel/Landsat) and optional commercial imagery.</p>
              </div>
              <div>
                <h3 className="font-medium">How often are updates?</h3>
                <p className="text-gray-700">Weekly to monthly depending on source and cloud coverage.</p>
              </div>
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: [
                    { "@type": "Question", name: "What imagery do you use?", acceptedAnswer: { "@type": "Answer", text: "Public EO sources and optional commercial." } },
                    { "@type": "Question", name: "How often are updates?", acceptedAnswer: { "@type": "Answer", text: "Weekly to monthly depending on source." } },
                  ],
                }),
              }}
            />
          </section>
        </div>
      </AuthShowPublic>

      {/* Gate until tool is available */}
      <ProtectedRoute>
        <div className="max-w-5xl mx-auto px-4 pb-10">
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-700">This tool is coming soon. Monitor grid resilience using satellite data and AI analytics.</p>
          </section>
        </div>
      </ProtectedRoute>
    </>
  );
}
