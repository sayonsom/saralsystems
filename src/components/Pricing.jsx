import Link from 'next/link';

export default function Pricing() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Free for Research and Non-Commercial Use.</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 border-2 border-gray-200 shadow-sm">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Free</h3>
            <p className="text-4xl font-bold mb-6 text-gray-900">$0<span className="text-lg text-gray-500">/month</span></p>
            <ul className="space-y-3 mb-8">
              {['Full platform access','10,000 AI Credits','Map-based Visual, & code interface','AI model generation','Cloud simulations'].map(i => (
                <li key={i} className="flex items-center gap-3"><div className="w-2 h-2 bg-[#ea580b]" /><span className="text-gray-700">{i}</span></li>
              ))}
            </ul>
            <Link href="/signin" className="block w-full text-center border-2 border-[#ea580b] text-[#ea580b] hover:bg-[#ea580b] hover:text-white py-3 transition-all">
              Start Free
            </Link>
          </div>

          <div className="bg-white p-8 border-2 border-[#ea580b] relative shadow-sm">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ea580b] text-white px-4 py-1 text-sm font-semibold">Free Pilots</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Enterprise</h3>
            <p className="text-4xl font-bold mb-6 text-gray-900">Custom</p>
            <ul className="space-y-3 mb-8">
              {['Everything in Free','10x compute speeds', 'Unlimited AI tokens', 'SOC-2 compliance','NERC CIP compliance','Priority support'].map(i => (
                <li key={i} className="flex items-center gap-3"><div className="w-2 h-2 bg-[#ea580b]" /><span className="text-gray-700">{i}</span></li>
              ))}
            </ul>
            <Link href="/contact" className="block w-full text-center bg-[#ea580b] text-white hover:bg-orange-600 py-3 transition-all">
              Contact Sales
            </Link>
          </div>

          <div className="bg-white p-8 border-2 border-gray-200 shadow-sm">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">On-Premise</h3>
            <p className="text-4xl font-bold mb-6 text-gray-900">Custom</p>
            <ul className="space-y-3 mb-8">
              {['Full enterprise features','Your infrastructure','Air-gapped deployment','Custom integrations'].map(i => (
                <li key={i} className="flex items-center gap-3"><div className="w-2 h-2 bg-[#ea580b]" /><span className="text-gray-700">{i}</span></li>
              ))}
            </ul>
            <Link href="/contact" className="block w-full text-center border-2 border-[#ea580b] text-[#ea580b] hover:bg-[#ea580b] hover:text-white py-3 transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
