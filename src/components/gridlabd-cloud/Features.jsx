const features = [
  { title: 'AI-Powered Assistance', desc: 'Generate models automatically. Fix bugs instantly.' },
  { title: 'Cloud Simulations', desc: 'Run complex studies without infrastructure investment.' },
  { title: 'Open Source Core', desc: 'Build custom modules. Unlimited customization.' },
  { title: 'Modern Planning Studies', desc: 'Data centers. EVs. Hosting capacity. Microgrids.' },
  { title: 'Enterprise Ready', desc: 'SOC-2 & NERC CIP compliance. On-premise options.' },
  { title: 'Collaboration Tools', desc: 'Team workspaces. Version control. Shared models.' },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-8 border-2 border-gray-200 hover:border-[#ea580b] transition-colors shadow-sm">
              <div className="w-16 h-16 bg-[#ea580b] mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
