// src/components/ProductionStats.js
'use client';

import { useState, useEffect } from 'react';

export default function ProductionStats({ electricity }) {
  const [animatedValues, setAnimatedValues] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger visibility for animations
    setIsVisible(true);
    
    // Animate numbers on mount
    const targetValues = {
      production: electricity.production.total,
      renewable: electricity.renewable.percentage,
      intensity: electricity.emissions.intensity,
      reliability: electricity.grid.reliability
    };

    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      
      setAnimatedValues({
        production: Math.round(targetValues.production * easeOutQuad * 10) / 10,
        renewable: Math.round(targetValues.renewable * easeOutQuad * 10) / 10,
        intensity: Math.round(targetValues.intensity * easeOutQuad),
        reliability: Math.round(targetValues.reliability * easeOutQuad * 10) / 10
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues(targetValues);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [electricity]);

  const stats = [
    {
      label: 'Total Production',
      value: `${animatedValues.production || 0} TWh`,
      change: electricity.production.growth,
      icon: '⚡',
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      subtext: `${electricity.production.monthlyAverage.toFixed(1)} TWh/month avg`,
      trend: electricity.production.growth.startsWith('+') ? 'up' : 'down',
      detail: `Rank #${electricity.production.rank} globally`,
      metrics: [
        { label: 'Per Capita', value: `${electricity.production.perCapita} kWh` },
        { label: 'Peak Demand', value: `${electricity.production.peakDemand} GW` }
      ]
    },
    {
      label: 'Renewable Energy',
      value: `${animatedValues.renewable || 0}%`,
      change: `Target: ${electricity.renewable.target2030}% by 2030`,
      icon: '🌱',
      color: 'green',
      bgGradient: 'from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      subtext: `Investment: $${electricity.renewable.investment}M`,
      trend: 'up',
      detail: `${electricity.renewable.target2025}% by 2025`,
      metrics: [
        { label: '2025 Target', value: `${electricity.renewable.target2025}%` },
        { label: '2050 Target', value: `${electricity.renewable.target2050}%` }
      ]
    },
    {
      label: 'Carbon Intensity',
      value: animatedValues.intensity || 0,
      change: electricity.emissions.trend,
      icon: '🏭',
      color: electricity.emissions.intensity < 150 ? 'green' : electricity.emissions.intensity < 350 ? 'yellow' : 'red',
      bgGradient: electricity.emissions.intensity < 150 
        ? 'from-green-500 to-green-600' 
        : electricity.emissions.intensity < 350 
        ? 'from-yellow-500 to-orange-500'
        : 'from-red-500 to-red-600',
      lightBg: electricity.emissions.intensity < 150 
        ? 'bg-green-50' 
        : electricity.emissions.intensity < 350 
        ? 'bg-yellow-50'
        : 'bg-red-50',
      subtext: 'gCO₂/kWh',
      trend: electricity.emissions.trend === 'decreasing' ? 'down' : electricity.emissions.trend === 'increasing' ? 'up' : 'stable',
      detail: `${electricity.emissions.total} MtCO₂ total`,
      metrics: [
        { label: 'Total Emissions', value: `${electricity.emissions.total} MtCO₂` },
        { label: 'Per Capita', value: `${electricity.emissions.perCapita} tCO₂` }
      ]
    },
    {
      label: 'Grid Reliability',
      value: `${animatedValues.reliability || 0}%`,
      change: `Losses: ${electricity.grid.losses}%`,
      icon: '🔌',
      color: 'purple',
      bgGradient: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      subtext: `${electricity.grid.smartMeters}% smart meters`,
      trend: 'stable',
      detail: `${electricity.grid.length} km network`,
      metrics: [
        { label: 'Grid Length', value: `${electricity.grid.length} km` },
        { label: 'Smart Meters', value: `${electricity.grid.smartMeters}%` }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200'
    };
    return colors[color] || colors.blue;
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12h10M7 12l-3 3m3-3l-3-3m13 3l-3 3m3-3l-3-3" />
          </svg>
        );
    }
  };

  // Generate sparkline data (mock data for visualization)
  const generateSparklineData = (trend) => {
    const baseData = [40, 65, 45, 70, 55, 80, 75];
    if (trend === 'up') {
      return baseData.map((v, i) => v + i * 5);
    } else if (trend === 'down') {
      return baseData.map((v, i) => v - i * 3);
    }
    return baseData;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`
            group relative bg-white rounded-xl shadow-sm hover:shadow-xl 
            transition-all duration-300 overflow-hidden border border-gray-100
            transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
          style={{
            transitionDelay: `${index * 100}ms`
          }}
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          
          {/* Card content */}
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgGradient} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl filter drop-shadow-md">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.detail}</p>
                </div>
              </div>
              {/* Trend icon */}
              <div className={`p-1.5 rounded-lg ${getColorClasses(stat.color)}`}>
                {getTrendIcon(stat.trend)}
              </div>
            </div>
            
            {/* Main value with animation */}
            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
            </div>
            
            {/* Change indicator */}
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getColorClasses(stat.color)} border`}>
                {stat.change}
              </span>
              
              {/* Mini sparkline chart */}
              <div className="flex items-end space-x-0.5">
                {generateSparklineData(stat.trend).map((height, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-500 ${
                      i === 6 
                        ? (stat.trend === 'up' ? 'bg-green-400' : stat.trend === 'down' ? 'bg-red-400' : 'bg-gray-400')
                        : 'bg-gray-200'
                    }`}
                    style={{
                      height: `${height * 0.3}px`,
                      opacity: isVisible ? 1 : 0,
                      transitionDelay: `${(index * 100) + (i * 50)}ms`
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Progress bar for percentage values */}
            {(stat.label.includes('Renewable') || stat.label.includes('Reliability')) && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{stat.value}</span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${stat.bgGradient} transition-all duration-1500 ease-out`}
                    style={{ 
                      width: `${stat.label.includes('Renewable') ? animatedValues.renewable : animatedValues.reliability}%`,
                      transitionDelay: `${index * 100}ms`
                    }}
                  />
                  {/* Animated shimmer effect */}
                  <div 
                    className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"
                    style={{
                      animationDelay: `${index * 200}ms`
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Additional metrics on hover */}
            <div className={`
              grid grid-cols-2 gap-2 pt-4 border-t border-gray-100
              max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100
              transition-all duration-300 overflow-hidden
            `}>
              {stat.metrics.map((metric, idx) => (
                <div key={idx} className="text-xs">
                  <p className="text-gray-500">{metric.label}</p>
                  <p className="font-semibold text-gray-700">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Hover effect border */}
          <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${stat.bgGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
          
          {/* Corner badge for special states */}
          {stat.trend === 'up' && stat.label === 'Renewable Energy' && (
            <div className="absolute top-2 right-2">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
      `}</style>
    </div>
  );
}