import Link from 'next/link';
import { getAllEnergyAnalysisPosts, getTotalPostsCount } from '@/lib/contentful';
import BlogCard from './BlogCard';
import CTAButton from './CTAButton';

export default async function BlogSection() {
  let posts = [];
  let totalCount = 0;
  
  try {
    posts = await getAllEnergyAnalysisPosts(4); // Fetch 4 latest posts
    totalCount = await getTotalPostsCount();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return null; // Don't show the section if there's an error
  }

  if (posts.length === 0) {
    return null; // Don't show the section if there are no posts
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 gap-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Latest Blogs</h2>
          <p className="text-lg text-gray-600">
            Showing 4 of {totalCount}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} delay={index * 0.1} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 border-2 border-gray-700 text-gray-700 font-medium rounded-none hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            View All Articles
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}