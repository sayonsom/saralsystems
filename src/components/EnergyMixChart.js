// src/components/EnergyMixChart.js
'use client';

import { useState, useEffect, useRef } from 'react';

export default function EnergyMixChart({ sources, title = "Energy Mix Breakdown" }) {
  const [hoveredSource, setHoveredSource] = useState(null);
  const [selectedView, setSelectedView] = useState('pie'); // 'pie', 'bar', 'tree', 'donut'
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const chartRef = useRef(null);

  // Calculate totals and percentages
  const total = sources.reduce((sum, source) => sum + (source.twh || 0), 0);
  const sortedSources = [...sources].sort((a, b) => b.percent - a.percent);

  // Group sources into renewable vs non-renewable
  const renewableSources = ['Hydro', 'Wind', 'Solar', 'Biomass', 'Geothermal', 'Other Renewables'];
  const renewableData = sources.filter(s => renewableSources.includes(s.source));
  const fossilData = sources.filter(s => !renewableSources.includes(s.source));
  const renewableTotal = renewableData.reduce((sum, s) => sum + s.percent, 0);
  const fossilTotal = fossilData.reduce((sum, s) => sum + s.percent, 0);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setAnimationComplete(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Color mapping for consistent colors
  const getColor = (colorClass) => {
    const colorMap = {
      'bg-gray-800': '#1f2937',
      'bg-gray-500': '#6b7280',
      'bg-gray-400': '#9ca3af',
      'bg-blue-500': '#3b82f6',
      'bg-cyan-500': '#06b6d4',
      'bg-yellow-500': '#eab308',
      'bg-green-600': '#16a34a',
      'bg-green-500': '#10b981',
      'bg-purple-500': '#a855f7',
      'bg-orange-500': '#f97316',
      'bg-red-500': '#ef4444',
      'bg-pink-500': '#ec4899',
      'bg-indigo-500': '#6366f1'
    };
    return colorMap[colorClass] || '#6b7280';
  };

  // Calculate pie/donut chart segments
  const calculatePieSegments = (innerRadius = 0) => {
    let cumulativePercent = 0;
    return sortedSources.map((source, index) => {
      const startAngle = (cumulativePercent * 360) / 100;
      const endAngle = ((cumulativePercent + source.percent) * 360) / 100;
      cumulativePercent += source.percent;
      
      // Convert to radians
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      // Calculate path points
      const x1 = 100 + 80 * Math.cos(startAngleRad);
      const y1 = 100 + 80 * Math.sin(startAngleRad);
      const x2 = 100 + 80 * Math.cos(endAngleRad);
      const y2 = 100 + 80 * Math.sin(endAngleRad);
      
      const x1Inner = 100 + innerRadius * Math.cos(startAngleRad);
      const y1Inner = 100 + innerRadius * Math.sin(startAngleRad);
      const x2Inner = 100 + innerRadius * Math.cos(endAngleRad);
      const y2Inner = 100 + innerRadius * Math.sin(endAngleRad);
      
      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
      
      let pathData;
      if (innerRadius > 0) {
        // Donut chart
        pathData = [
          `M ${x1Inner} ${y1Inner}`,
          `L ${x1} ${y1}`,
          `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          `L ${x2Inner} ${y2Inner}`,
          `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}`,
          'Z'
        ].join(' ');
      } else {
        // Pie chart
        pathData = [
          `M 100 100`,
          `L ${x1} ${y1}`,
          `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ');
      }
      
      // Calculate label position
      const labelAngle = (startAngle + endAngle) / 2;
      const labelRadius = innerRadius > 0 ? (80 + innerRadius) / 2 : 50;
      const labelX = 100 + labelRadius * Math.cos(labelAngle * Math.PI / 180);
      const labelY = 100 + labelRadius * Math.sin(labelAngle * Math.PI / 180);
      
      return {
        ...source,
        pathData,
        startAngle,
        endAngle,
        labelX,
        labelY,
        midAngle: (startAngle + endAngle) / 2
      };
    });
  };

  const pieSegments = calculatePieSegments(selectedView === 'donut' ? 35 : 0);

  // Calculate bar positions for tree map
  const calculateTreeMapPositions = () => {
    const positions = [];
    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;
    const containerWidth = 100;
    
    sortedSources.forEach((source, index) => {
      const width = (source.percent / 100) * containerWidth;
      const height = 20 + (source.percent / 100) * 30;
      
      if (currentX + width > containerWidth) {
        currentX = 0;
        currentY += rowHeight + 2;
        rowHeight = 0;
      }
      
      positions.push({
        ...source,
        x: currentX,
        y: currentY,
        width: width,
        height: height
      });
      
      currentX += width + 2;
      rowHeight = Math.max(rowHeight, height);
    });
    
    return positions;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-2">
          {[
            { id: 'pie', icon: '🥧', label: 'Pie' },
            { id: 'donut', icon: '🍩', label: 'Donut' },
            { id: 'bar', icon: '📊', label: 'Bar' },
            { id: 'tree', icon: '🌳', label: 'Tree' }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                selectedView === view.id
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={view.label}
            >
              <span className="mr-1">{view.icon}</span>
              <span className="hidden sm:inline">{view.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Renewable vs Fossil Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="relative p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-700 font-medium">🌱 Renewable</span>
              <span className="text-2xl font-bold text-green-800">{renewableTotal.toFixed(1)}%</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {renewableData.map((source, idx) => (
                <span key={idx} className="text-xs bg-white/70 px-1.5 py-0.5 rounded text-green-700">
                  {source.source} {source.percent}%
                </span>
              ))}
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-10">🌿</div>
        </div>
        
        <div className="relative p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 font-medium">⚡ Non-Renewable</span>
              <span className="text-2xl font-bold text-gray-800">{fossilTotal.toFixed(1)}%</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {fossilData.map((source, idx) => (
                <span key={idx} className="text-xs bg-white/70 px-1.5 py-0.5 rounded text-gray-700">
                  {source.source} {source.percent}%
                </span>
              ))}
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-10">🏭</div>
        </div>
      </div>

      {/* Pie/Donut Chart View */}
      {(selectedView === 'pie' || selectedView === 'donut') && (
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {/* Segments */}
              {pieSegments.map((segment, index) => (
                <g key={index}>
                  <path
                    d={segment.pathData}
                    fill={getColor(segment.color)}
                    stroke="white"
                    strokeWidth="2"
                    className={`transition-all duration-300 cursor-pointer ${
                      hoveredSource === segment.source 
                        ? 'opacity-100 filter drop-shadow-lg' 
                        : hoveredSource && hoveredSource !== segment.source 
                        ? 'opacity-50' 
                        : 'opacity-90'
                    }`}
                    style={{
                      transform: hoveredSource === segment.source 
                        ? `translate(${5 * Math.cos(segment.midAngle * Math.PI / 180)}px, ${5 * Math.sin(segment.midAngle * Math.PI / 180)}px)` 
                        : 'translate(0, 0)',
                      transformOrigin: '100px 100px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={() => setHoveredSource(segment.source)}
                    onMouseLeave={() => setHoveredSource(null)}
                  />
                  
                  {/* Percentage labels for large segments */}
                  {segment.percent > 8 && (
                    <text
                      x={segment.labelX}
                      y={segment.labelY}
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      pointerEvents="none"
                      style={{
                        transform: hoveredSource === segment.source 
                          ? `translate(${5 * Math.cos(segment.midAngle * Math.PI / 180)}px, ${5 * Math.sin(segment.midAngle * Math.PI / 180)}px)` 
                          : 'translate(0, 0)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {segment.percent}%
                    </text>
                  )}
                </g>
              ))}
              
              {/* Center circle for donut */}
              {selectedView === 'donut' && (
                <>
                  <circle cx="100" cy="100" r="35" fill="white" />
                  <text x="100" y="95" textAnchor="middle" className="text-2xl font-bold fill-gray-800">
                    {total.toFixed(1)}
                  </text>
                  <text x="100" y="110" textAnchor="middle" className="text-xs fill-gray-500">
                    TWh/year
                  </text>
                </>
              )}
            </svg>
            
            {/* Animated rotation effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full rounded-full border-4 border-gray-100 opacity-20 animate-pulse"></div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex-1 lg:ml-8 w-full lg:w-auto">
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {sortedSources.map((source, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    hoveredSource === source.source ? 'bg-gray-50 shadow-md scale-105' : 'hover:bg-gray-50'
                  }`}
                  onMouseEnter={() => setHoveredSource(source.source)}
                  onMouseLeave={() => setHoveredSource(null)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${source.color} rounded shadow-sm`} />
                    <span className="text-sm text-gray-700 font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="font-bold text-gray-900">{source.percent}%</span>
                      <span className="text-xs text-gray-500 ml-2">({source.twh} TWh)</span>
                    </div>
                    {renewableSources.includes(source.source) && (
                      <span className="text-xs text-green-600">🌱</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bar Chart View */}
      {selectedView === 'bar' && (
        <div className="space-y-3">
          {sortedSources.map((source, index) => (
            <div 
              key={index}
              className="group"
              onMouseEnter={() => setHoveredSource(source.source)}
              onMouseLeave={() => setHoveredSource(null)}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${source.color} rounded-full shadow-sm`} />
                  <span className="text-sm text-gray-700 font-medium">{source.source}</span>
                  {renewableSources.includes(source.source) && (
                    <span className="text-xs text-green-600">🌱</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{source.percent}%</span>
                  <span className="text-xs text-gray-500 ml-2">({source.twh} TWh)</span>
                </div>
              </div>
              <div className="relative w-full bg-gray-200 rounded-full h-8 overflow-hidden group-hover:shadow-md transition-shadow">
                <div 
                  className={`absolute top-0 left-0 h-full ${source.color} transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
                  style={{ 
                    width: animationComplete ? `${source.percent}%` : '0%',
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  {source.percent > 5 && animationComplete && (
                    <span className="text-xs text-white font-bold drop-shadow">
                      {source.percent}%
                    </span>
                  )}
                </div>
                {/* Animated shimmer effect */}
                <div 
                  className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                  style={{
                    animation: animationComplete ? 'shimmer 3s infinite' : 'none',
                    animationDelay: `${index * 200}ms`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tree Map View */}
      {selectedView === 'tree' && (
        <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden p-2">
          <div className="grid grid-cols-12 grid-rows-8 gap-1 h-full">
            {sortedSources.map((source, index) => {
              // Calculate grid size based on percentage
              const gridUnits = Math.max(1, Math.round((source.percent / 100) * 96));
              const cols = Math.min(12, Math.max(2, Math.ceil(Math.sqrt(gridUnits * 1.5))));
              const rows = Math.max(1, Math.min(8, Math.ceil(gridUnits / cols)));
              
              return (
                <div
                  key={index}
                  className={`${source.color} rounded-lg flex flex-col items-center justify-center text-white font-bold transition-all duration-300 cursor-pointer hover:scale-105 hover:z-10 shadow-md`}
                  style={{
                    gridColumn: `span ${cols}`,
                    gridRow: `span ${rows}`,
                    fontSize: `${Math.max(10, Math.min(14, source.percent / 2))}px`,
                    opacity: hoveredSource === source.source ? 1 : hoveredSource ? 0.6 : 0.9,
                    transform: animationComplete ? 'scale(1)' : 'scale(0)',
                    transition: 'all 0.5s ease',
                    transitionDelay: `${index * 50}ms`
                  }}
                  onMouseEnter={() => setHoveredSource(source.source)}
                  onMouseLeave={() => setHoveredSource(null)}
                >
                  <div className="text-center p-2">
                    <div className="mb-1">{source.source}</div>
                    <div className="text-xs opacity-90">{source.percent}%</div>
                    {source.twh && (
                      <div className="text-xs opacity-75">{source.twh} TWh</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hover Details Card */}
      {hoveredSource && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 ${sources.find(s => s.source === hoveredSource)?.color} rounded-full shadow`} />
              <span className="text-base font-semibold text-gray-900">{hoveredSource}</span>
              {renewableSources.includes(hoveredSource) && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Renewable
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-700">
                {sources.find(s => s.source === hoveredSource)?.percent}%
              </span>
              <span className="text-sm text-gray-600 ml-3">
                {sources.find(s => s.source === hoveredSource)?.twh} TWh
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-4 text-xs text-gray-600">
            <span>Share of total: {((sources.find(s => s.source === hoveredSource)?.twh / total) * 100).toFixed(1)}%</span>
            <span>•</span>
            <span>Rank: #{sortedSources.findIndex(s => s.source === hoveredSource) + 1} of {sources.length}</span>
          </div>
        </div>
      )}

      {/* Footer Statistics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Total Production</p>
            <p className="text-lg font-bold text-gray-800">{total.toFixed(1)} TWh</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Energy Sources</p>
            <p className="text-lg font-bold text-gray-800">{sources.length}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Largest Source</p>
            <p className="text-lg font-bold text-gray-800">{sortedSources[0]?.source}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Diversity Index</p>
            <p className="text-lg font-bold text-gray-800">
              {(1 - Math.pow(sortedSources[0]?.percent / 100, 2)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}