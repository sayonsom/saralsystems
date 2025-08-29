import { getInsightData, getInsightSlugs } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = await getInsightSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }) {
  try {
    const insightData = await getInsightData(params.slug);
    return {
      title: `${insightData.title} | Saral Insights`,
      description: insightData.excerpt,
      openGraph: {
        title: insightData.title,
        description: insightData.excerpt,
        type: 'article',
        publishedTime: insightData.date,
        authors: [insightData.author],
      },
    };
  } catch (error) {
    return {
      title: 'Insight Not Found | Saral',
    };
  }
}

export default async function InsightPage({ params }) {
  let insightData;
  
  try {
    insightData = await getInsightData(params.slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/insights" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Insights
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {insightData.title}
          </h1>
          <div className="flex items-center text-sm text-gray-600 space-x-4">
            <span>By {insightData.author}</span>
            <span>•</span>
            <time dateTime={insightData.date}>
              {new Date(insightData.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {insightData.readingTime && (
              <>
                <span>•</span>
                <span>{insightData.readingTime} min read</span>
              </>
            )}
          </div>
          {insightData.tags && insightData.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {insightData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-none text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article 
          className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
            prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3
            prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:my-4 prose-ol:my-4
            prose-li:text-gray-700 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4
            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-none prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:overflow-x-auto prose-pre:rounded-none prose-pre:p-4
            prose-img:rounded-none prose-img:my-8"
          dangerouslySetInnerHTML={{ __html: insightData.contentHtml }}
        />
      </main>

      {/* Footer CTA */}
      <section className="bg-gray-900 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business with AI?</h2>
          <p className="text-lg mb-8 text-gray-300">
            Let's discuss how Saral can help you leverage AI for your business growth.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-none text-gray-900 bg-white hover:bg-gray-100 transition-colors duration-200"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}