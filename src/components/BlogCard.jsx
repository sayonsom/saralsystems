'use client';

import Link from 'next/link';

export default function BlogCard({ post, delay = 0, featured = false }) {
  // Define category colors
  const getCategoryColor = (category) => {
    const colors = {
      'Energy Analysis': 'bg-red-500',
      'Artificial Intelligence': 'bg-blue-500',
      'Finance': 'bg-purple-500',
      'Market Investing': 'bg-green-500',
      'Defence': 'bg-orange-500',
      'Technology': 'bg-indigo-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <article 
      className="bg-white rounded-none overflow-hidden transition-all duration-300 h-full flex flex-col"
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}s both`,
      }}
    >
      {post.featuredImage && (
        <div className={`${featured ? 'h-72' : 'h-56'} overflow-hidden relative`}>
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-3">
          <span className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-none ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-3 flex-grow">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 mt-auto">
          <span>{new Date(post.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric' 
          })}</span>
          <span className="mx-2">•</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </article>
  );
}