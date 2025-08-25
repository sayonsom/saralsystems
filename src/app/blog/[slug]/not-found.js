import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Blog Post Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn&apos;t find the blog post you&apos;re looking for.
        </p>
        <Link 
          href="/blog" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-none text-white bg-emerald-600 hover:bg-emerald-700"
        >
          Return to Blog
        </Link>
      </div>
    </div>
  );
}
