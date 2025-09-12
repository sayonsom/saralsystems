import Image from 'next/image';

export default function UseCases() {
  const useCaseImages = [
    { src: '/globe.svg', alt: 'Resiliency & Reliability icon' },
    { src: '/data-center.webp', alt: 'Future-Ready Planning icon' },
    { src: '/window.svg', alt: 'Custom Optimization icon' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Built for Modern Distribution Systems and Smart Grids</h2>
        <div className="grid lg:grid-cols-3 gap-8">
          {[1,2,3].map((i) => (
            <div key={i} className="text-center">
              <div className="bg-white aspect-square mb-4 relative overflow-hidden border-2 border-[#ea580b]/30">
                <Image
                  src={useCaseImages[i-1].src}
                  alt={useCaseImages[i-1].alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover border-0"
                />
              </div>
              <p className="text-gray-600 mb-4">Use Case {i}</p>
              <h3 className="text-2xl font-semibold mb-4 text-[#ea580b]">{i === 1 ? 'Resiliency & Reliability' : i === 2 ? 'Future-Ready Planning' : 'Custom Optimization'}</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ea580b] mt-2" />
                  <p className="text-gray-700">Bullet 1</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ea580b] mt-2" />
                  <p className="text-gray-700">Bullet 2</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ea580b] mt-2" />
                  <p className="text-gray-700">Bullet 3</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
