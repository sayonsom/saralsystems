'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function InsightsScroll({ 
  title = "Latest Insights", 
  subtitle = "Explore our thoughts on AI and data infrastructure",
  direction = "left",
  bgColor = "bg-gray-50"
}) {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch insights data
    fetch('/api/insights')
      .then(res => res.json())
      .then(data => {
        setInsights(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch insights:', err);
        setIsLoading(false);
      });
  }, []);

  // Duplicate insights array for seamless loop
  const duplicatedInsights = [...insights, ...insights];

  if (isLoading) {
    return (
      <section className={`py-16 ${bgColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded-none w-1/4 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded-none w-1/3 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 ${bgColor} overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">{title}</h2>
        <p className="text-gray-600 text-center">{subtitle}</p>
      </div>
      
      <div className="relative">
        <div className="insights-scroll-container">
          <div className={`insights-scroll-track ${direction === 'right' ? 'scroll-right' : 'scroll-left'}`}>
            {duplicatedInsights.map((insight, index) => (
              <Link
                key={`${insight.slug}-${index}`}
                href={`/insights/${insight.slug}`}
                className="insight-card group"
              >
                <article className="bg-white rounded-none overflow-hidden transition-all duration-300 h-full w-80 mx-3 transform hover:scale-105">
                  {/* Card Image */}
                  <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-lg font-bold line-clamp-2">
                        {insight.title}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-5">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {insight.excerpt}
                    </p>
                    
                    {/* Metadata */}
                    <div className="text-xs text-gray-500 mb-3">
                      <span>{insight.author}</span>
                      <span className="mx-2">•</span>
                      <time dateTime={insight.date}>
                        {new Date(insight.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>

                    {/* Read More Link */}
                    <span className="text-blue-600 text-sm font-medium group-hover:text-blue-800 transition-colors duration-200 inline-flex items-center">
                      Read More 
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Gradient overlays for smooth edges */}
        <div className={`absolute top-0 left-0 w-24 h-full bg-gradient-to-r pointer-events-none z-10 ${bgColor === 'bg-gray-50' ? 'from-gray-50' : 'from-white'} to-transparent`}></div>
        <div className={`absolute top-0 right-0 w-24 h-full bg-gradient-to-l pointer-events-none z-10 ${bgColor === 'bg-gray-50' ? 'from-gray-50' : 'from-white'} to-transparent`}></div>
      </div>
      
      <style jsx>{`
        .insights-scroll-container {
          position: relative;
          width: 100%;
        }
        
        .insights-scroll-track {
          display: flex;
          width: max-content;
        }
        
        .scroll-left {
          animation: scrollLeft ${insights.length * 10}s linear infinite;
        }
        
        .scroll-right {
          animation: scrollRight ${insights.length * 10}s linear infinite;
        }
        
        .insights-scroll-track:hover {
          animation-play-state: paused;
        }
        
        .insight-card {
          flex-shrink: 0;
        }
        
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes scrollRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        @media (max-width: 640px) {
          .scroll-left {
            animation-duration: ${insights.length * 8}s;
          }
          .scroll-right {
            animation-duration: ${insights.length * 8}s;
          }
        }
      `}</style>
    </section>
  );
}