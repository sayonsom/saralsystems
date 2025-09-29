// src/components/CountryTabs.js
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const TABS = [
  { 
    id: 'overview', 
    label: 'Overview', 
    icon: '📊',
    description: 'Dashboard & key metrics'
  },
  { 
    id: 'electricity-production', 
    label: 'Electricity Production', 
    icon: '⚡',
    description: 'Production data & map'
  },
  { 
    id: 'energy-mix', 
    label: 'Energy Mix', 
    icon: '🔋',
    description: 'Source breakdown'
  },
  { 
    id: 'carbon-emissions', 
    label: 'Carbon Emissions', 
    icon: '🏭',
    description: 'CO₂ data & trends'
  },
  { 
    id: 'renewable-energy', 
    label: 'Renewable Energy', 
    icon: '🌱',
    description: 'Green energy progress'
  },
  { 
    id: 'trade', 
    label: 'Energy Trade', 
    icon: '🔄',
    description: 'Import/Export data'
  },
  { 
    id: 'infrastructure', 
    label: 'Infrastructure', 
    icon: '🏗️',
    description: 'Grid & capacity'
  },
  { 
    id: 'historical', 
    label: 'Historical Data', 
    icon: '📈',
    description: 'Trends & analysis'
  }
];

export default function CountryTabs({ countryCode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSection = searchParams.get('section') || 'overview';
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentTab = TABS.find(tab => tab.id === currentSection) || TABS[0];

  return (
    <>
      {/* Desktop Tabs */}
      <div className={`bg-white border-b sticky top-0 z-30 hidden md:block transition-all duration-200 ${
        isScrolled ? 'shadow-md' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <Link
                key={tab.id}
                href={`/${countryCode}?section=${tab.id}`}
                className={`
                  group flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap
                  transition-all duration-200 relative
                  ${
                    currentSection === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                
                {/* Active indicator dot */}
                {currentSection === tab.id && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
                
                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {tab.description}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Tabs Dropdown */}
      <div className="md:hidden bg-white border-b sticky top-0 z-30">
        <div className="px-4 py-3">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg text-left"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{currentTab.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{currentTab.label}</p>
                <p className="text-xs text-gray-500">{currentTab.description}</p>
              </div>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                showMobileMenu ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {TABS.map((tab) => (
                <Link
                  key={tab.id}
                  href={`/${countryCode}?section=${tab.id}`}
                  onClick={() => setShowMobileMenu(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 text-sm
                    ${
                      currentSection === tab.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <div className="flex-1">
                    <p className={`${currentSection === tab.id ? 'font-medium' : ''}`}>
                      {tab.label}
                    </p>
                    <p className="text-xs text-gray-500">{tab.description}</p>
                  </div>
                  {currentSection === tab.id && (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab Progress Indicator */}
      <div className="bg-gray-100 h-1 relative overflow-hidden">
        <div 
          className="absolute h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{
            width: `${100 / TABS.length}%`,
            left: `${(TABS.findIndex(t => t.id === currentSection) * 100) / TABS.length}%`
          }}
        />
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}