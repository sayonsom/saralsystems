import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostData, getAllPosts } from '@/lib/posts';
import NewsletterForm from '@/components/NewsletterForm';
import PostContent from '@/components/PostContent';
import ArticleMeterGate from '@/components/ArticleMeterGate';

const BASE = 'https://www.gridspeed.app';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  if (!slug) {
    return {
      title: 'Post Not Found | Technical Posts',
      description: 'The requested post could not be found.',
      alternates: { canonical: `${BASE}/posts` },
    };
  }

  const post = await getPostData(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Technical Posts',
      description: 'The requested post could not be found.',
      alternates: { canonical: `${BASE}/posts` },
    };
  }

  const url = `${BASE}/posts/${post.slug}`;

  return {
    title: `${post.title} | Technical Posts`,
    description: post.description || post.excerpt,
    alternates: { canonical: url },
    keywords: [...(post.tags || []), ...(post.categories || [])].join(', '),
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      type: 'article',
      url,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      siteName: 'Saral Systems',
      images: post.coverImage ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.coverAlt || post.title,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
    authors: [{ name: post.author }],
    publisher: 'Saral Systems',
  };
}

// Generate static params for static generation
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Schema.org structured data
function generateStructuredData(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechnicalArticle',
    headline: post.title,
    description: post.description || post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: post.coverImage ? [post.coverImage] : undefined,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Saral Systems',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE}/posts/${post.slug}`
    },
    keywords: [...(post.tags || []), ...(post.categories || [])].join(', '),
    articleSection: post.categories?.[0] || 'Technical',
    wordCount: post.contentHtml ? post.contentHtml.replace(/<[^>]*>/g, '').split(/\s+/).length : 0,
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  try {
    const post = await getPostData(slug);

    if (!post) {
      notFound();
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData(post))
          }}
        />
        
        <ArticleMeterGate slug={`post:${slug}`}>
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <link rel="canonical" href={`${BASE}/posts/${post.slug}`} />
            
            {/* Header */}
            <header className="mb-12">
              {/* Breadcrumb */}
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-gray-700">Home</Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link href="/posts" className="hover:text-gray-700">Posts</Link>
                  </li>
                  <li>/</li>
                  <li className="text-gray-900 font-medium">{post.title}</li>
                </ol>
              </nav>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                {post.title}
              </h1>
              
              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Author and Date moved above the image, with bottom border */}
              <div className="flex items-center text-sm text-gray-600 border-b border-gray-200 pb-6 mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600 font-medium">
                      {post.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{post.author}</div>
                    <div className="flex items-center gap-2">
                      <time dateTime={post.date} itemProp="datePublished">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                      <span>•</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              {post.coverImage && (
                <figure className="mb-8">
                  <div className="relative w-full overflow-hidden rounded-none border border-gray-200">
                    <img
                      src={post.coverImage}
                      alt={post.coverAlt || post.title}
                      className="w-full h-auto object-cover"
                      loading="eager"
                    />
                  </div>
                  {post.coverAlt && (
                    <figcaption className="text-sm text-gray-500 mt-2 text-center">
                      {post.coverAlt}
                    </figcaption>
                  )}
                </figure>
              )}
            </header>

            {/* Content */}
            <PostContent content={post.contentHtml} />

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-gray-200">
              {/* Tags for easy navigation (moved to bottom) */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <a
                        key={i}
                        href={`/posts?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                      >
                        #{tag}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to action */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to try GridSpeed?
                </h3>
                <p className="text-gray-600 mb-4">
                  Start modeling power systems in your browser with our cloud-based GridSpeed platform.
                </p>
                <a
                  href="/tools/gridlabd"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Open GridSpeed IDE
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <NewsletterForm />
            </footer>
          </article>
        </ArticleMeterGate>
      </>
    );
  } catch (error) {
    console.error('Error rendering post:', error);
    notFound();
  }
}
