import Link from 'next/link';
import { ArrowRight, Cpu, Zap, Settings } from 'lucide-react';

export const metadata = {
  title: 'Engineering Trainings | GridSpeed',
  description: 'Technical training programs for automotive and power systems engineers. System-level prototyping, simulation, and validation using open-source tools.',
  alternates: { canonical: '/trainings' },
  robots: { index: true, follow: true },
};

export default function TrainingsPage() {
  const trainings = [
    {
      slug: 'node-red-automotive',
      title: 'Node-RED for Automotive System Integration',
      category: 'Automotive Engineering',
      description: 'Flow-based programming for rapid prototyping of vehicle systems, ECU simulation, and HIL test bench development.',
      icon: Cpu,
      status: 'Available',
      audience: ['System Engineers', 'Test Engineers', 'Integration Engineers'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Engineering Trainings</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Technical training programs focused on practical system integration, simulation, and validation.
            Built for engineers who need working solutions, not theory.
          </p>
        </div>
      </section>

      {/* Trainings Grid */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8">
            {trainings.map((training) => {
              const IconComponent = training.icon;
              return (
                <Link
                  key={training.slug}
                  href={`/trainings/${training.slug}`}
                  className="group"
                >
                  <article className="bg-white border border-gray-200 hover:border-gray-400 transition-all duration-300">
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-100">
                            <IconComponent className="w-6 h-6 text-gray-700" />
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {training.category}
                            </span>
                            <h2 className="text-xl font-bold text-gray-900 mt-1">
                              {training.title}
                            </h2>
                          </div>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800">
                          {training.status}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-6">
                        {training.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {training.audience.map((role) => (
                            <span
                              key={role}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-900 font-medium group-hover:text-orange-600 transition-colors flex items-center gap-2">
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* More Coming Section */}
      <section className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Settings className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">More Trainings in Development</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Additional training programs for power systems, embedded development, and industrial automation
            are currently being developed.
          </p>
        </div>
      </section>
    </div>
  );
}
