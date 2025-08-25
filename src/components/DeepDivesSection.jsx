import Link from 'next/link';
import { getAllEnergyAnalysisPosts } from '@/lib/contentful';
import BlogCard from './BlogCard';
import CTAButton from './CTAButton';

export default async function DeepDivesSection() {
  let posts = [];
  
  try {
    // Fetch all posts and filter for deep dives
    // In a real implementation, you might want to filter by specific tags
    // or create a separate content type for deep dives
    const allPosts = await getAllEnergyAnalysisPosts(20);
    
    // Filter posts that might be deep dives based on tags or title
    posts = allPosts
      .filter(post => 
        post.tags?.some(tag => 
          tag.toLowerCase().includes('deep dive') || 
          tag.toLowerCase().includes('analysis') ||
          tag.toLowerCase().includes('research')
        ) || 
        post.title?.toLowerCase().includes('deep dive') ||
        post.title?.toLowerCase().includes('comprehensive') ||
        post.title?.toLowerCase().includes('analysis')
      )
      .slice(0, 4); // Get top 4 deep dives
      
  } catch (error) {
    console.error('Error fetching deep dive posts:', error);
    return null;
  }

  if (posts.length === 0) {
    // If no deep dives found, show some regular posts as placeholders
    try {
      const allPosts = await getAllEnergyAnalysisPosts(4);
      posts = allPosts;
    } catch (error) {
      return null;
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">Latest Deep Dives</h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            In-depth analysis and comprehensive research on India's energy infrastructure, data centers, and sustainable technology solutions.
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
            Explore All Deep Dives
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}