export default function DashboardMock() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Real-Time Results Dashboard</h2>
          <p className="text-xl text-gray-700">Visualize complex simulations with interactive charts and reports</p>
        </div>
        <div className="bg-white border-2 border-[#ea580b]/40 p-8 shadow-sm">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-100 border border-gray-200 p-6 mb-6">
                <h4 className="text-lg font-semibold mb-4 text-[#ea580b]">Voltage Profile</h4>
                <div className="h-48 bg-white flex items-center justify-center border border-dashed border-gray-300">
                  <svg className="w-12 h-12 text-[#ea580b]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                </div>
              </div>
              <div className="bg-gray-100 border border-gray-200 p-6">
                <h4 className="text-lg font-semibold mb-4 text-[#ea580b]">Load Flow Analysis</h4>
                <div className="h-32 bg-white flex items-center justify-center border border-dashed border-gray-300">
                  <svg className="w-8 h-8 text-[#ea580b]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2a1 1 0 100-2H5V5a1 1 0 00-1-1z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-100 border border-gray-200 p-6">
                <h4 className="text-lg font-semibold mb-4 text-[#ea580b]">System Metrics</h4>
                <div className="space-y-4">
                  <div className="flex justify-between"><span className="text-gray-700">Peak Load</span><span className="text-gray-900 font-semibold">12.4 MW</span></div>
                  <div className="flex justify-between"><span className="text-gray-700">Min Voltage</span><span className="text-gray-900 font-semibold">0.95 pu</span></div>
                  <div className="flex justify-between"><span className="text-gray-700">Losses</span><span className="text-gray-900 font-semibold">3.2%</span></div>
                </div>
              </div>
              <div className="bg-gray-100 border border-gray-200 p-6">
                <h4 className="text-lg font-semibold mb-4 text-[#ea580b]">Simulation Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3"><div className="w-3 h-3 bg-green-500" /><span className="text-gray-700">Load Flow: Complete</span></div>
                  <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#ea580b]" /><span className="text-gray-700">Fault Analysis: Running</span></div>
                  <div className="flex items-center gap-3"><div className="w-3 h-3 bg-gray-400" /><span className="text-gray-700">Optimization: Queued</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
