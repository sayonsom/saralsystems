// src/app/blog/page.js
import { Suspense } from 'react';
import { getAllPosts, fetchCategoryPosts } from '@/lib/contentful';
import { Button } from "@/components/ui/button";
import BlogCard from '@/components/BlogCard';
import NewsletterForm from '@/components/NewsletterForm';

// Metadata for SEO
export const metadata = {
  title: 'Gridleaf Blog - Insights on AI, Energy, and Technology',
  description: 'Explore articles on artificial intelligence, energy systems, economics, productivity, and technical writing from industry experts.',
};

const categories = [
  'All',
  'AI',
  'Energy',
  'Economics'
];

async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const selectedCategory = params?.category || 'All';
  const page = parseInt(params?.page) || 1;
  const POSTS_PER_PAGE = 32;

  // Fetch total count and paginated posts
  const allPosts = selectedCategory === 'All' 
    ? await getAllPosts()
    : await fetchCategoryPosts(selectedCategory);

  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  
  // Calculate pagination slice
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Gridleaf Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Insights on AI, energy systems, and technology
        </p>
      </header>

      {/* Category Navigation */}
      <nav className="mb-12 border-b dark:border-gray-800">
        <div className="flex flex-wrap gap-8">
          {categories.map((category) => (
            <a
              key={category}
              href={`/blog?category=${category}`}
              className={`
                pb-4 text-sm font-medium relative
                ${selectedCategory === category 
                  ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white -mb-px' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              {category}
            </a>
          ))}
        </div>
      </nav>

      {/* Post Grid */}
      <div className="grid gap-8">
        {/* Featured Section (2x1) */}
        {posts.slice(0, 2).length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {posts.slice(0, 2).map((post) => (
              <BlogCard
                key={post.slug}
                post={post}
                featured={true}
              />
            ))}
          </div>
        )}

        {/* Regular Posts Section (3x1) */}
        <div className="grid md:grid-cols-3 gap-8">
          {posts.slice(2).map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {page > 1 && (
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={`/blog?category=${selectedCategory}&page=${page - 1}`}>
                  Previous
                </a>
              </Button>
            )}
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <a href={`/blog?category=${selectedCategory}&page=${pageNum}`}>
                    {pageNum}
                  </a>
                </Button>
              ))}
            </div>

            {page < totalPages && (
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={`/blog?category=${selectedCategory}&page=${page + 1}`}>
                  Next
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// Loading state
function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
              <div className="h-12 bg-gray-200 rounded-none mb-8 w-1/3" />
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {[1, 2].map((n) => (
                      <div key={n} className="h-96 bg-gray-200 rounded-none" />
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-64 bg-gray-200 rounded-none" />
        ))}
      </div>
    </div>
  );
}

export default function BlogPageWrapper({ searchParams }) {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <BlogPage searchParams={searchParams} />
      </Suspense>

      <NewsletterForm />
    </>
    
  );
}