import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 relative overflow-hidden bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-r from-[#ea580b]/10 to-orange-400/10" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Ready to build the future?</h2>
        <p className="text-xl text-gray-700 mb-8">Join researchers and utilities building the future of distribution systems and smart grids.</p>
  <Link href="/projects" className="inline-block bg-[#ea580b] hover:bg-orange-600 text-white px-10 py-4 text-lg font-semibold transition-all transform hover:scale-[1.02]">
          Get Started Free Today
        </Link>
      </div>
    </section>
  );
}
