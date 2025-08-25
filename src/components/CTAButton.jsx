import Link from 'next/link';

export default function CTAButton({ className = '' }) {
  return (
    <div className={`text-center mt-12 ${className}`}>
      <Link 
        href="#contact"
        className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-bold text-lg rounded-none hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
      >
        Request a Consultation
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}