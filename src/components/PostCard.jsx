'use client';

import Link from 'next/link';

export default function PostCard({ post, delay = 0, featured = false }) {
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
      'IEEE': 'bg-pink-500',
      'power systems': 'bg-teal-500',
      'simulation': 'bg-emerald-500',
      'troubleshooting': 'bg-rose-500',
      'test systems': 'bg-violet-500',
      'artificial intelligence': 'bg-fuchsia-500'
    };
    return colors[tag] || 'bg-gray-500';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'power systems': 'bg-blue-600',
      'tutorial': 'bg-green-600',
      'microgrids': 'bg-orange-600',
      'artificial intelligence': 'bg-purple-600',
      'troubleshooting': 'bg-red-600',
      'test systems': 'bg-indigo-600',
      'cloud computing': 'bg-cyan-600',
      'beginner': 'bg-emerald-600',
      'debugging': 'bg-rose-600',
      'simulation': 'bg-teal-600'
    };
    return colors[category] || 'bg-gray-600';
  };

  return (
    <article 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300 h-full flex flex-col"
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}s both`,
      }}
    >
      {/* Media header: cover image if available, otherwise gradient */}
      {post.coverImage ? (
        <div className={`${featured ? 'h-40' : 'h-32'} relative overflow-hidden`}>
          <img
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-4 left-4 right-4">
            <div className="flex flex-wrap gap-1 mb-2">
              {post.categories?.slice(0, 1).map((category, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 text-xs font-medium text-white rounded ${getCategoryColor(category)}`}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-1">
              {post.tags?.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getTagColor(tag)} opacity-90`}
                >
                  {tag}
                </span>
              ))}
              {post.tags?.length > 3 && (
                <span className="px-2 py-1 text-xs font-medium text-white rounded-full bg-gray-500 opacity-90">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={`${featured ? 'h-40' : 'h-32'} bg-gradient-to-br from-gray-900 to-gray-700 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-600/20"></div>
          <div className="absolute top-4 left-4 right-4">
            <div className="flex flex-wrap gap-1 mb-2">
              {post.categories?.slice(0, 1).map((category, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 text-xs font-medium text-white rounded ${getCategoryColor(category)}`}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-1">
              {post.tags?.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getTagColor(tag)} opacity-90`}
                >
                  {tag}
                </span>
              ))}
              {post.tags?.length > 3 && (
                <span className="px-2 py-1 text-xs font-medium text-white rounded-full bg-gray-500 opacity-90">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className={`${featured ? 'text-xl' : 'text-lg'} font-bold text-gray-900 mb-3 line-clamp-2 flex-grow`}>
          <Link 
            href={`/posts/${post.slug}`} 
            className="hover:text-indigo-600 transition-colors"
          >
            {post.title}
          </Link>
        </h3>
        
        <p className="text-black text-[15px] mb-4 line-clamp-3 font-[family-name:var(--font-sen)]">
          {post.excerpt}
        </p>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
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

        {/* Read more link */}
        <Link 
          href={`/posts/${post.slug}`}
          className="mt-4 inline-flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors group"
        >
          Read Article
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </article>
  );
}
