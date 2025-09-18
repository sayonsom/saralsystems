import Link from 'next/link';

export default function Hero() {
  return (
    <section className="pt-20 md:pt-24 pb-20 bg-white text-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#ea580b]/10 to-orange-400/10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-[#ea580b] bg-clip-text text-transparent">
              Modern Distribution Planning
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Model. Simulate. Optimize. <br />
              The cloud platform that modernizes distribution system planning workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/projects"
                className="bg-[#ea580b] hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold transition-all transform hover:scale-[1.02] text-center"
                aria-label="Start Simulating"
              >
                Start Simulating
              </Link>
              <Link
                href="/contact"
                className="border-2 border-[#ea580b] text-[#ea580b] hover:bg-[#ea580b] hover:text-white px-8 py-4 text-lg font-semibold transition-all text-center"
                aria-label="Watch Demo"
              >
                Request Demo
              </Link>
            </div>
          </div>
          <div className="relative" id="demo">
            <div className="bg-gray-100 border-2 border-[#ea580b] aspect-video relative overflow-hidden rounded">
              <iframe
                src={`https://www.youtube.com/embed/tDmjz6HB-yw?rel=0&modestbranding=1&playsinline=1`}
                title="VoltEdge Cloud Demo"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
              />
            </div>
            <p className="text-center text-gray-600 mt-4 text-sm">
              Watch how VoltEdge Cloud transforms distribution planning workflows
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
