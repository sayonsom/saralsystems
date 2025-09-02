'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GridlabdPostsScroll({ 
  title = "GridLAB-D Tutorials & Guides", 
  subtitle = "Learn power system modeling with hands-on tutorials",
  maxPosts = 8 
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts?tag=gridlabd');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.slice(0, maxPosts));
        }
      } catch (error) {
        console.error('Error fetching GridLAB-D posts:', error);
        // Fallback data for development
        setPosts([
          {
            slug: 'building-your-first-microgrid-model-in-gridlabd',
            title: 'Building Your First Microgrid Model in GridLAB-D',
            excerpt: 'Learn how to build sophisticated microgrid models in GridLAB-D with solar panels, battery storage, and smart loads.',
            author: 'Sayonsom Chanda, Ph.D.',
            date: '2025-01-30',
            readingTime: 8,
            tags: ['gridlabd', 'microgrids', 'tutorial']
          },
          {
            slug: 'aipowered-grid-modeling-generate-a-feeder-in-seconds',
            title: 'AI-Powered Grid Modeling: Generate a Feeder in Seconds',
            excerpt: 'Discover how AI can automatically generate distribution feeder models in GridLAB-D, reducing modeling time from hours to seconds.',
            author: 'Saral Team',
            date: '2025-01-28',
            readingTime: 6,
            tags: ['gridlabd', 'AI', 'automation']
          },
          {
            slug: 'beginner-guide-to-gridlabd-everything-you-need-in-one-page',
            title: 'Beginner Guide to GridLAB-D: Everything You Need in One Page',
            excerpt: 'Complete beginner\'s guide to GridLAB-D - from installation to running your first simulation.',
            author: 'Saral Team',
            date: '2025-01-25',
            readingTime: 12,
            tags: ['gridlabd', 'beginner', 'tutorial']
          },
          {
            slug: '5-common-gridlabd-glm-syntax-errors-and-how-to-quickly-fix-them',
            title: '5 Common GridLAB-D GLM Syntax Errors and How to Quickly Fix Them',
            excerpt: 'Avoid the most common GridLAB-D syntax errors that trip up beginners and experienced users alike.',
            author: 'Saral Team',
            date: '2025-01-20',
            readingTime: 7,
            tags: ['gridlabd', 'debugging', 'troubleshooting']
          },
          {
            slug: 'a-practical-guide-to-replicating-the-ieee-13-bus-test-feeder-in-the-cloud',
            title: 'A Practical Guide to Replicating the IEEE 13-Bus Test Feeder in the Cloud',
            excerpt: 'Step-by-step guide to implementing and running the IEEE 13-bus test feeder in GridLAB-D using cloud infrastructure.',
            author: 'Sayonsom Chanda, Ph.D.',
            date: '2025-01-15',
            readingTime: 15,
            tags: ['gridlabd', 'IEEE', 'cloud', 'validation']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [maxPosts]);

  const getTagColor = (tag) => {
    const colors = {
      'gridlabd': 'bg-indigo-500',
      'tutorial': 'bg-green-500',
      'beginner': 'bg-blue-500',
      'AI': 'bg-purple-500',
      'debugging': 'bg-red-500',
      'microgrids': 'bg-orange-500',
      'cloud': 'bg-cyan-500',
      'automation': 'bg-yellow-500',
      'validation': 'bg-gray-500',
      'IEEE': 'bg-pink-500'
    };
    return colors[tag] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="flex gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 h-72 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Horizontal scrolling container */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="flex-shrink-0 w-80 group snap-start"
              >
                <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full">
                  {/* Header with gradient */}
                  <div className="h-32 bg-gradient-to-br from-indigo-500 to-blue-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {post.tags?.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className={`px-2 py-1 text-xs font-medium text-white rounded ${getTagColor(tag)} opacity-90`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>
                        <span>•</span>
                        <span>{post.readingTime} min</span>
                      </div>
                    </div>

                    {/* Read more indicator */}
                    <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-800 transition-colors">
                      Read Article
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}

            {/* View All Posts Card */}
            <Link
              href="/posts?tag=gridlabd"
              className="flex-shrink-0 w-80 group snap-start"
            >
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all duration-300">
                <div className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 group-hover:text-indigo-700 mb-2">
                    View All Posts
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-indigo-600">
                    Explore our complete collection of GridLAB-D tutorials and guides
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Scroll indicators */}
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2 opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2 opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <Link 
            href="/posts?tag=gridlabd"
            className="inline-flex items-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300"
          >
            View All GridLAB-D Posts
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
