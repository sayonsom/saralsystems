export default function Hero() {
  // set your nav height (px). 64 or 80 are common.
  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ minHeight: 'calc(100svh - 80px)' }} // 80px = your nav height
    >
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/bg_video.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-white/60" />
      <div className="relative z-20 w-full text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900">
            Saral: Simplifying{" "}
            <span className="text-orange-600">India&apos;s Energy Transition</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-700 mb-8">
            We provide the simplified AI tools and expertise to accelerate
            India&apos;s move to a sustainable energy future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/tools"
              className="bg-orange-600 text-white px-8 py-3 rounded-none font-bold text-lg hover:bg-orange-700 transition-transform duration-300 inline-block transform hover:scale-105"
            >
              Access Tools
            </a>
            <a
              href="#contact"
              className="bg-transparent border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-none font-bold text-lg hover:bg-orange-50 transition-transform duration-300 inline-block transform hover:scale-105"
            >
              Call us today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
