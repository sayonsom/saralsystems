import { Suspense } from 'react';
import Link from 'next/link';
import { getAllPosts, getPostsByTag, getPostsByCategory, getAllTags, getAllCategories } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import NewsletterForm from '@/components/NewsletterForm';

// Metadata for SEO
export const metadata = {
  title: 'Technical Posts - Power Systems, GridLAB-D, and Smart Grid Tutorials',
  description: 'In-depth technical posts on power systems modeling, GridLAB-D simulations, smart grid technologies, and distribution system analysis.',
  alternates: { canonical: '/posts' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Technical Posts - Power Systems & GridLAB-D Tutorials',
    description: 'Expert tutorials and guides on power systems modeling, GridLAB-D simulations, and smart grid technologies.',
    type: 'website',
    url: 'https://www.saralsystems.co/posts',
  },
};

async function PostsPage({ searchParams }) {
  const params = await searchParams;
  const selectedTag = params?.tag || '';
  const selectedCategory = params?.category || '';
  const page = parseInt(params?.page) || 1;
  const POSTS_PER_PAGE = 12;

  // Fetch posts based on filters
  let allPosts;
  if (selectedTag) {
    allPosts = await getPostsByTag(selectedTag);
  } else if (selectedCategory) {
    allPosts = await getPostsByCategory(selectedCategory);
  } else {
    allPosts = await getAllPosts();
  }

  // Get available tags and categories for filters
  const [allTags, allCategories] = await Promise.all([
    getAllTags(),
    getAllCategories()
  ]);

  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  
  // Calculate pagination slice
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Technical Posts
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          In-depth tutorials, guides, and insights on power systems modeling, GridLAB-D simulations, 
          and smart grid technologies from our team of experts.
        </p>
        
        {/* Stats */}
        <div className="mt-8 flex justify-center items-center gap-6 text-sm text-gray-500">
          <span>{totalPosts} total posts</span>
          <span>•</span>
          <span>{allTags.length} topics</span>
          <span>•</span>
          <span>{allCategories.length} categories</span>
        </div>
      </header>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Tag Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Filter by Topic:</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/posts"
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                !selectedTag 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
              }`}
            >
              All Topics
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/posts?tag=${encodeURIComponent(tag)}`}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Filter by Category:</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/posts"
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                !selectedCategory 
                  ? 'bg-green-600 text-white border-green-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
              }`}
            >
              All Categories
            </Link>
            {allCategories.map((category) => (
              <Link
                key={category}
                href={`/posts?category=${encodeURIComponent(category)}`}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedTag || selectedCategory) && (
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm text-gray-600">Active filters:</span>
          <div className="flex gap-2">
            {selectedTag && (
              <span className="inline-flex items-center px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full">
                Topic: {selectedTag}
                <Link href="/posts" className="ml-2 text-indigo-600 hover:text-indigo-900">
                  ×
                </Link>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                Category: {selectedCategory}
                <Link href="/posts" className="ml-2 text-green-600 hover:text-green-900">
                  ×
                </Link>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {posts.map((post, index) => (
            <PostCard
              key={post.slug}
              post={post}
              delay={index * 0.1}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600 mb-4">
            {selectedTag || selectedCategory 
              ? 'Try adjusting your filters or browse all posts.' 
              : 'No posts available at the moment.'
            }
          </p>
          {(selectedTag || selectedCategory) && (
            <Link
              href="/posts"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All Posts
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-12" aria-label="Pagination Navigation">
          {page > 1 && (
            <Link
              href={`/posts?${new URLSearchParams({ 
                ...(selectedTag && { tag: selectedTag }),
                ...(selectedCategory && { category: selectedCategory }),
                page: (page - 1).toString()
              }).toString()}`}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Previous
            </Link>
          )}
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              
              return (
                <Link
                  key={pageNum}
                  href={`/posts?${new URLSearchParams({ 
                    ...(selectedTag && { tag: selectedTag }),
                    ...(selectedCategory && { category: selectedCategory }),
                    page: pageNum.toString()
                  }).toString()}`}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pageNum === page
                      ? 'text-white bg-indigo-600'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-current={pageNum === page ? 'page' : undefined}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>

          {page < totalPages && (
            <Link
              href={`/posts?${new URLSearchParams({ 
                ...(selectedTag && { tag: selectedTag }),
                ...(selectedCategory && { category: selectedCategory }),
                page: (page + 1).toString()
              }).toString()}`}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}

      {/* Newsletter */}
      <NewsletterForm />
    </main>
  );
}

// Loading state
function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="text-center mb-12">
        <div className="h-12 bg-gray-200 rounded mb-4 w-1/3 mx-auto" />
        <div className="h-6 bg-gray-200 rounded mb-8 w-2/3 mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-80 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

export default function PostsPageWrapper({ searchParams }) {
  return (
    <Suspense fallback={<Loading />}>
      <PostsPage searchParams={searchParams} />
    </Suspense>
  );
}
