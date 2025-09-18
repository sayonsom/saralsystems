export default function Overview() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white border-2 border-[#ea580b] aspect-video flex items-center justify-center">
              <div className="text-center">
                <svg className="w-20 h-20 text-[#ea580b] mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
                <p className="text-gray-600">Visual & Code Interface</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold mb-6 text-[#ea580b]">Dual Interface Design</h2>
            <p className="text-xl text-gray-700 mb-8">Drag-and-drop modeling for rapid prototyping. Code when you need precision control.</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-[#ea580b] mt-2" />
                <p className="text-gray-700">Visual feeder builder with component library</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-[#ea580b] mt-2" />
                <p className="text-gray-700">VoltEdge code editor with syntax highlighting</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-[#ea580b] mt-2" />
                <p className="text-gray-700">Seamless switching between interfaces</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
