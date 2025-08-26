import { getAllInsights } from '@/lib/markdown';
import Link from 'next/link';

export const metadata = {
  title: 'Insights | Saral - AI & Data Center Expertise',
  description: 'Explore our latest insights on AI, data centers, and digital transformation in India.',
};

export default async function InsightsPage() {
  const insights = await getAllInsights();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">Insights & Analysis</h1>
          <p className="text-xl max-w-3xl">
            Deep dives into AI infrastructure, data center operations, and the future of digital transformation in India.
          </p>
        </div>
      </section>

      {/* Insights Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {insights.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No insights available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {insights.map((insight) => (
                <Link
                  key={insight.slug}
                  href={`/insights/${insight.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-none overflow-hidden transition-all duration-300 h-full flex flex-col">
                    {/* Card Image Placeholder - You can add actual images later */}
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-white text-xl font-bold line-clamp-2">
                          {insight.title}
                        </h2>
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {insight.excerpt}
                      </p>
                      
                      {/* Metadata */}
                      <div className="text-sm text-gray-500 mb-4">
                        <span>{insight.author}</span>
                        <span className="mx-2">•</span>
                        <time dateTime={insight.date}>
                          {new Date(insight.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                      </div>

                      {/* Tags */}
                      {insight.tags && insight.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {insight.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read More Link */}
                      <div className="mt-auto">
                        <span className="text-blue-600 font-medium group-hover:text-blue-800 transition-colors duration-200">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8 text-gray-300">
            Get the latest insights on AI and data center innovations delivered to your inbox.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-none text-gray-900 bg-white hover:bg-gray-100 transition-colors duration-200"
          >
            Subscribe to Updates
          </Link>
        </div>
      </section>
    </div>
  );
}