import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import AuthShowPublic from '@/components/AuthShowPublic';

export default function GenerateDistributionModels() {
  return (
    <>
      {/* Public overview */}
      <AuthShowPublic>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
            <Link href="/tools" className="hover:text-gray-700">Tools</Link>
            <span className="mx-2">/</span>
            <span>Generate Distribution System Models</span>
          </nav>
          <header>
            <h1 className="text-3xl font-bold mb-3">Generate Distribution System Models</h1>
            <p className="text-gray-700 mb-6">Automatically build feeder and network models from GIS layers, demand data, and standard templates. Export to GridLAB-D or OpenDSS.</p>
          </header>
          <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p className="text-gray-700">Upload GIS layers and demand datasets to generate validated feeder and LV network models with device libraries and naming conventions.</p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
              <li>Feeder topology extraction from GIS</li>
              <li>Device templating (transformers, regulators, capacitors)</li>
              <li>Demand synthesis and profile mapping</li>
              <li>Export to GLM/OpenDSS</li>
            </ul>
          </section>
          <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">How it works</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Upload GIS layers (lines, buses, switches) and demand data.</li>
              <li>Set device standards and naming rules.</li>
              <li>Auto-generate topology and assign profiles.</li>
              <li>Validate and export models to GLM/OpenDSS.</li>
            </ol>
          </section>
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-3">FAQ</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">What formats do you support?</h3>
                <p className="text-gray-700">Common GIS formats (GeoJSON/Shapefile) and CSV for demand data; exports to GLM and OpenDSS.</p>
              </div>
              <div>
                <h3 className="font-medium">Can I customize device libraries?</h3>
                <p className="text-gray-700">Yes, you can configure device parameters and templates per utility standard.</p>
              </div>
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: [
                    { "@type": "Question", name: "What formats do you support?", acceptedAnswer: { "@type": "Answer", text: "Common GIS formats (GeoJSON/Shapefile) and CSV; exports to GLM and OpenDSS." } },
                    { "@type": "Question", name: "Can I customize device libraries?", acceptedAnswer: { "@type": "Answer", text: "Yes, configure device parameters and templates per standard." } },
                  ],
                }),
              }}
            />
          </section>
        </div>
      </AuthShowPublic>

      {/* Gate actual tool when available */}
      <ProtectedRoute>
        <div className="max-w-5xl mx-auto px-4 pb-10">
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-700">This tool is coming soon. It will help you generate feeder and network models from GIS and demand data.</p>
          </section>
        </div>
      </ProtectedRoute>
    </>
  );
}
