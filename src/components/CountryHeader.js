// src/components/CountryHeader.js
'use client';

import { useState, useEffect } from 'react';

export default function CountryHeader({ country }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Determine status color based on carbon intensity
  const getStatusColor = (intensity) => {
    if (intensity < 150) return 'bg-green-500';
    if (intensity < 350) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left side - Country info */}
          <div className="flex items-center space-x-4">
            {/* Country Flag */}
            <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-xl shadow-inner">
              <span className="text-5xl">{country.flag}</span>
            </div>
            
            {/* Country Name and Details */}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {country.name}
                </h1>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                  {country.code}
                </span>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(country.electricity.emissions.intensity)} animate-pulse`} 
                     title="Carbon intensity status" />
              </div>
              <div className="mt-1 flex items-center space-x-3 text-sm text-gray-600">
                <span>{country.region}</span>
                <span>•</span>
                <span>Energy & Electricity Data Dashboard</span>
                <span>•</span>
                <span className="text-xs">
                  Updated: {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>
          
          {/* Right side - Quick stats */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Production */}
            <div className="text-center px-4 py-2 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-xs text-blue-600 font-medium">Production</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {country.electricity.production.total}
                <span className="text-sm font-normal text-blue-600 ml-1">TWh</span>
              </p>
              <p className="text-xs text-blue-500 mt-0.5">
                {country.electricity.production.growth}
              </p>
            </div>
            
            {/* Renewable */}
            <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <p className="text-xs text-green-600 font-medium">Renewable</p>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {country.electricity.renewable.percentage}
                <span className="text-sm font-normal text-green-600 ml-0.5">%</span>
              </p>
              <p className="text-xs text-green-500 mt-0.5">
                Target: {country.electricity.renewable.target2030}%
              </p>
            </div>
            
            {/* Carbon Intensity */}
            <div className="text-center px-4 py-2 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <svg className="w-4 h-4 text-orange-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p className="text-xs text-orange-600 font-medium">Carbon</p>
              </div>
              <p className="text-2xl font-bold text-orange-700">
                {country.electricity.emissions.intensity}
              </p>
              <p className="text-xs text-orange-500 mt-0.5">
                gCO₂/kWh
              </p>
            </div>
            
            {/* World Rank */}
            <div className="text-center px-4 py-2 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <svg className="w-4 h-4 text-purple-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-purple-600 font-medium">Rank</p>
              </div>
              <p className="text-2xl font-bold text-purple-700">
                #{country.electricity.production.rank}
              </p>
              <p className="text-xs text-purple-500 mt-0.5">
                World
              </p>
            </div>
          </div>
        </div>
        
        {/* Comparison Bar */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Quick Comparison:</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Per Capita:</span>
                <span className="font-semibold text-gray-800">
                  {formatNumber(country.electricity.production.perCapita)} kWh
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Peak Demand:</span>
                <span className="font-semibold text-gray-800">
                  {country.electricity.production.peakDemand} GW
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Grid Reliability:</span>
                <span className="font-semibold text-gray-800">
                  {country.electricity.grid.reliability}%
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                country.electricity.emissions.trend === 'decreasing' 
                  ? 'bg-green-100 text-green-800' 
                  : country.electricity.emissions.trend === 'increasing'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {country.electricity.emissions.trend === 'decreasing' ? '↓' :
                 country.electricity.emissions.trend === 'increasing' ? '↑' : '→'} 
                Emissions {country.electricity.emissions.trend}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                country.electricity.trade.netExporter 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                Net {country.electricity.trade.netExporter ? 'Exporter' : 'Importer'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}