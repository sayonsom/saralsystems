export default function AIFeatures() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-[#ea580b]">AI-Powered Modeling</h2>
            <p className="text-xl text-gray-700 mb-8">Let AI handle the heavy lifting. Generate distribution feeders from specifications.</p>
            <div className="space-y-6">
              <div className="bg-white p-6 border-l-4 border-[#ea580b] shadow-sm">
                <h4 className="font-semibold mb-2 text-gray-900">Natural Language Input</h4>
                <p className="text-gray-700">"Create a 12.47kV feeder with 3 laterals serving residential loads"</p>
              </div>
              <div className="bg-white p-6 border-l-4 border-orange-500 shadow-sm">
                <h4 className="font-semibold mb-2 text-gray-900">Automatic Code Generation</h4>
                <p className="text-gray-700">Complete GridLAB-D models with proper syntax and configurations</p>
              </div>
              <div className="bg-white p-6 border-l-4 border-orange-300 shadow-sm">
                <h4 className="font-semibold mb-2 text-gray-900">Error Detection & Fixes</h4>
                <p className="text-gray-700">AI identifies and suggests fixes for common modeling errors</p>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white border-2 border-[#ea580b] shadow-sm">
              <div className="bg-[#ea580b] text-white p-4">
                <h4 className="font-semibold">AI Assistant</h4>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-100 p-4">
                  <p className="text-sm text-gray-700">You: Generate a feeder for downtown area</p>
                </div>
                <div className="bg-orange-500/10 p-4">
                  <p className="text-sm text-gray-900">AI: I'll create a distribution feeder optimized for urban commercial loads. Let me generate the GridLAB-D model...</p>
                </div>
                <div className="bg-gray-100 p-4 text-center">
                  <svg className="w-8 h-8 text-[#ea580b] mx-auto" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633z" />
                  </svg>
                  <p className="text-xs text-gray-500 mt-2">Generated Code Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

