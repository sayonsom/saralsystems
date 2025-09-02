import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <svg className="w-24 h-24 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Post Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the technical post you&apos;re looking for. 
          It may have been moved or doesn&apos;t exist.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/posts" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            View All Posts
          </Link>
          
          <div className="text-center">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
