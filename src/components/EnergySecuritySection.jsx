'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CTAButton from './CTAButton';

export default function EnergySecuritySection() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    // Fetch insights data and filter for energy security related content
    fetch('/api/insights')
      .then(res => res.json())
      .then(data => {
        // Filter insights related to India's energy security
        const energySecurityInsights = data.filter(insight => 
          insight.title?.toLowerCase().includes('india') ||
          insight.title?.toLowerCase().includes('energy security') ||
          insight.title?.toLowerCase().includes('infrastructure') ||
          insight.title?.toLowerCase().includes('sustainable') ||
          insight.excerpt?.toLowerCase().includes('india') ||
          insight.excerpt?.toLowerCase().includes('energy security')
        );
        
        // If we have filtered results, use them; otherwise use all insights
        setInsights(energySecurityInsights.length > 0 ? energySecurityInsights : data.slice(0, 6));
      })
      .catch(err => {
        console.error('Failed to fetch insights:', err);
        // Fallback static content
        setInsights([
          {
            slug: 'india-energy-future',
            title: 'India\'s Energy Security: A Path to Self-Reliance',
            excerpt: 'Exploring strategies for achieving energy independence through renewable resources and smart infrastructure.',
            author: 'Energy Team',
            date: new Date().toISOString()
          },
          {
            slug: 'renewable-transition',
            title: 'The Renewable Energy Transition in India',
            excerpt: 'How India is leveraging solar, wind, and hydroelectric power to secure its energy future.',
            author: 'Energy Team',
            date: new Date().toISOString()
          },
          {
            slug: 'smart-grids',
            title: 'Smart Grids: Revolutionizing India\'s Power Distribution',
            excerpt: 'The role of intelligent grid systems in ensuring reliable and efficient energy distribution.',
            author: 'Energy Team',
            date: new Date().toISOString()
          }
        ]);
      });
  }, []);

  if (insights.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            India's Energy Security
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Critical insights and analysis on securing India's energy future through sustainable infrastructure, 
            policy innovation, and technological advancement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {insights.slice(0, 6).map((insight, index) => (
            <Link
              key={insight.slug}
              href={`/insights/${insight.slug}`}
              className="group"
            >
              <article 
                className="bg-gray-50 rounded-none overflow-hidden transition-all duration-300 h-full transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Header with Gradient */}
                <div className="h-32 bg-gradient-to-br from-orange-500 to-orange-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-lg font-bold line-clamp-2">
                      {insight.title}
                    </h3>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
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
                  <span className="text-orange-600 text-sm font-medium group-hover:text-orange-800 transition-colors duration-200 inline-flex items-center">
                    Read Article
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="text-center mb-8">
          <Link 
            href="/insights"
            className="inline-flex items-center px-6 py-3 border-2 border-gray-700 text-gray-700 font-medium rounded-none hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            View All Energy Security Articles
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}