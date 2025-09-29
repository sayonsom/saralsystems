// src/components/ElectricityMap.js
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Import country data
import { COUNTRY_DATA } from '@/data/countries';

export default function ElectricityMap({
  country,
  initialData,
  coordinates,
  embedded = false,
  showHoverPanel = true,
  onViewDetails
}) {
  const router = useRouter();
  const pathname = usePathname();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const hoverPopupRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [hoveredStateId, setHoveredStateId] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [noWebGL, setNoWebGL] = useState(false);

  // Format country name for display
  const formatCountryName = (slug) => {
    if (!slug) return '';
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // If WebGL is not supported, render a static fallback and skip Mapbox init
    if (!mapboxgl.supported()) {
      setNoWebGL(true);
      setIsLoading(false);
      return;
    }

    // Configure token and base style (fallback to public OSM raster when token missing)
    const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    mapboxgl.accessToken = TOKEN || '';
    // Inline OSM raster fallback style (no token required)
    const fallbackStyle = {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [
        { id: 'osm', type: 'raster', source: 'osm' }
      ]
    };
    
    // Set initial view based on country or global
    const initialView = coordinates || { center: [10, 30], zoom: 2 };

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: (TOKEN ? 'mapbox://styles/sayonmapbox/cmg5gmws1009o01s79oca91lw' : fallbackStyle),
      center: initialView.center,
      zoom: initialView.zoom,
      projection: 'mercator'
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Surface mapbox errors and fallback to OSM when style/sources fail
    map.current.on('error', (e) => {
      // eslint-disable-next-line no-console
      console.error('Mapbox GL error:', e && e.error ? e.error : e);
      try {
        const msg = (e && e.error && e.error.message) ? String(e.error.message) : '';
        // If token missing/invalid or style/source blocked, switch to fallback
        if (!TOKEN || /access token|unauthorized|forbidden|failed to load|style/i.test(msg)) {
          if (map.current) {
            map.current.setStyle(fallbackStyle);
          }
        }
      } catch {}
    });
    
    map.current.on('load', () => {
      setIsLoading(false);
      setMapReady(true);

      // If no Mapbox token or in embedded mode (using fallback raster), skip Mapbox-only vector layers to avoid errors
      if (!TOKEN) {
        return;
      }
      
      // Add country boundaries (guarded)
      try {
        map.current.addSource('countries', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1'
        });

        // Build a data-driven color expression from initialData or fallback to COUNTRY_DATA intensities
        const intensityColorsByISO2 = (() => {
          const colors = {};
          try {
            // Seed from built-in COUNTRY_DATA (fallback dataset for demo)
            Object.entries(COUNTRY_DATA || {}).forEach(([slug, info]) => {
              const iso2 = info?.code;
              const intensity = info?.electricity?.emissions?.intensity;
              if (iso2 && typeof intensity === 'number') {
                const color =
                  intensity < 150 ? '#9be180' :
                  intensity < 350 ? '#f0d264' :
                  intensity < 550 ? '#e58a3b' :
                  '#b43f2d';
                colors[iso2] = color;
              }
            });
            // Allow caller to override with provided initialData:
            // - { IN: 300, FR: 56 } numbers map to the green-yellow-red ramp
            // - or { IN: "#ff00aa" } hex colors directly
            if (initialData && typeof initialData === 'object') {
              Object.entries(initialData).forEach(([k, v]) => {
                const iso2 = (k.length === 2 ? k.toUpperCase() : (COUNTRY_DATA?.[k]?.code));
                if (!iso2) return;
                const color = (typeof v === 'string' && v.startsWith('#'))
                  ? v
                  : (typeof v === 'number'
                      ? (v < 150 ? '#9be180' : v < 350 ? '#f0d264' : v < 550 ? '#e58a3b' : '#b43f2d')
                      : null);
                if (color) colors[iso2] = color;
              });
            }
          } catch {}
          return colors;
        })();

        const matchExpression = ['match', ['get', 'iso_3166_1_alpha_2']];
        Object.entries(intensityColorsByISO2).forEach(([code, color]) => {
          matchExpression.push(code, color);
        });
        matchExpression.push('#3a3a3a'); // default

        // Add fill layer with data-driven styling
        map.current.addLayer({
          'id': 'countries-fill',
          'type': 'fill',
          'source': 'countries',
          'source-layer': 'country_boundaries',
          'paint': {
            'fill-color': [
              'case',
              ['boolean', ['feature-state', 'hover'], false], '#ea580b',
              ['boolean', ['feature-state', 'selected'], false], '#ea580b',
              matchExpression
            ],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false], 0.7,
              ['boolean', ['feature-state', 'selected'], false], 0.5,
              0.35
            ]
          }
        });
        
        // Add outline layer
        map.current.addLayer({
          'id': 'countries-outline',
          'type': 'line',
          'source': 'countries',
          'source-layer': 'country_boundaries',
          'paint': {
            'line-color': [
              'case',
              ['any',
                ['boolean', ['feature-state', 'hover'], false],
                ['boolean', ['feature-state', 'selected'], false]
              ],
              '#ea580b',
              '#4a4a4a'
            ],
            'line-width': [
              'case',
              ['any',
                ['boolean', ['feature-state', 'hover'], false],
                ['boolean', ['feature-state', 'selected'], false]
              ],
              2.5,
              1
            ],
            'line-opacity': 0.8
          }
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Country boundaries source unavailable; continuing with base map.', err);
      }

      // If country is specified, highlight it and open modal
      if (country && !embedded) {
        const data = COUNTRY_DATA[country];
        if (data) {
          setSelectedData(data.electricity);
          setModalOpen(true);
          setSelectedCountry(country);
        }
      }

      // Mouse move handler: hover selects boundary and shows an anchored popup with 3 KPIs
      map.current.on('mousemove', 'countries-fill', (e) => {
        map.current.getCanvas().style.cursor = 'pointer';
        if (!e.features || e.features.length === 0) return;

        // Remove previous hover/selection state
        if (hoveredStateId !== null) {
          map.current.setFeatureState(
            { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredStateId },
            { hover: false, selected: false }
          );
        }

        const feature = e.features[0];
        const newHoveredStateId = feature.id;
        setHoveredStateId(newHoveredStateId);

        // Add hover and selection state (to emphasize boundary)
        map.current.setFeatureState(
          { source: 'countries', sourceLayer: 'country_boundaries', id: newHoveredStateId },
          { hover: true, selected: true }
        );

        // Resolve country and show a popup near cursor
        const countryName = feature.properties.name_en;
        const countrySlug = countryName.toLowerCase().replace(/\s+/g, '-');
        const countryInfo = COUNTRY_DATA[countrySlug];

        if (countryInfo) {
          const eData = countryInfo.electricity || {};
          const btnId = `map-view-details-${Date.now()}`;
          const html = `
            <div class="text-[13px]">
              <div class="font-semibold mb-1">${countryName}</div>
              <div class="grid grid-cols-3 gap-3 my-2">
                <div>
                  <div class="text-[10px] text-gray-400 uppercase">Carbon</div>
                  <div class="text-sm font-semibold">${eData?.emissions?.intensity ?? '--'}<span class="text-[10px] ml-1">gCO₂/kWh</span></div>
                </div>
                <div>
                  <div class="text-[10px] text-gray-400 uppercase">Renewable</div>
                  <div class="text-sm font-semibold">${eData?.renewable?.percentage ?? '--'}<span class="text-[10px] ml-1">%</span></div>
                </div>
                <div>
                  <div class="text-[10px] text-gray-400 uppercase">Production</div>
                  <div class="text-sm font-semibold">${eData?.production?.total ?? '--'}<span class="text-[10px] ml-1">TWh</span></div>
                </div>
              </div>
              <button id="${btnId}" class="mt-2 w-full text-[12px] px-2 py-1.5" style="background:#ea580b;color:#0f0f0f;border:1px solid #3a3a3a;">View Details</button>
            </div>
          `;

          if (!hoverPopupRef.current) {
            hoverPopupRef.current = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'saral-map-popup'
            });
          }

          hoverPopupRef.current
            .setLngLat(e.lngLat)
            .setHTML(html)
            .addTo(map.current);

          // Attach click handler for "View Details" to open left sidebar via parent
          setTimeout(() => {
            const btn = document.getElementById(btnId);
            if (btn) {
              btn.onclick = (evt) => {
                evt.preventDefault();
                if (typeof onViewDetails === 'function') onViewDetails();
              };
            }
          }, 0);
        }
      });

      // Mouse leave handler
      map.current.on('mouseleave', 'countries-fill', () => {
        map.current.getCanvas().style.cursor = '';

        if (hoveredStateId !== null) {
          map.current.setFeatureState(
            { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredStateId },
            { hover: false, selected: false }
          );
        }
        setHoveredStateId(null);

        // Remove popup
        if (hoverPopupRef.current) {
          try { hoverPopupRef.current.remove(); } catch {}
          hoverPopupRef.current = null;
        }

        // Hide right-side panel (if it was used) only when configured
        if (showHoverPanel) {
          setModalOpen(false);
          setSelectedCountry(null);
          setSelectedData(null);
        }
      });

      // Click handler
      map.current.on('click', 'countries-fill', (e) => {
        if (e.features.length > 0) {
          const countryName = e.features[0].properties.name_en;
          const countrySlug = countryName.toLowerCase().replace(/\s+/g, '-');
          const countryInfo = COUNTRY_DATA[countrySlug];
          
          if (countryInfo) {
            // If embedded in country page, navigate to that country
            if (embedded) {
              router.push(`/${countrySlug}`);
            } else {
              // Show modal with country data
              setSelectedCountry(countrySlug);
              setSelectedData(countryInfo.electricity);
              setModalOpen(true);
              
              // Fly to country
              map.current.flyTo({
                center: countryInfo.coordinates.center,
                zoom: countryInfo.coordinates.zoom,
                duration: 1500
              });
            }
          } else {
            // Show message for countries without data
            alert(`Data not available for ${countryName} yet.`);
          }
        }
      });
    });

    return () => {
      // Hide tooltip on cleanup
      const tooltip = document.getElementById('map-tooltip');
      if (tooltip) {
        tooltip.remove();
      }
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Only run once on mount

  // Update map when country changes (for navigation)
  useEffect(() => {
    if (!map.current || !mapReady || !country || !coordinates) return;

    // Fly to country
    map.current.flyTo({
      center: coordinates.center,
      zoom: coordinates.zoom,
      duration: 2000
    });

    // Update modal data if not embedded
    if (!embedded) {
      const data = COUNTRY_DATA[country];
      if (data) {
        setSelectedData(data.electricity);
        setSelectedCountry(country);
        setModalOpen(true);
      }
    }
  }, [country, coordinates, mapReady, embedded]);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCountry(null);
    setSelectedData(null);
  };

  // Calculate color based on carbon intensity
  const getIntensityColor = (intensity) => {
    if (intensity < 150) return 'green';
    if (intensity < 350) return 'yellow';
    return 'red';
  };

  // Get country name from data
  const getCountryName = () => {
    if (!selectedCountry) return '';
    const countryInfo = COUNTRY_DATA[selectedCountry];
    return countryInfo ? countryInfo.name : formatCountryName(selectedCountry);
  };

  return (
    <div className={`relative w-full ${embedded ? 'h-full' : 'h-screen'}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Loading electricity map...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />

      {/* Data Modal (right-side panel on hover or click) */}
      {modalOpen && selectedData && (showHoverPanel || !embedded) && (
        <div className="fixed top-4 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-50 max-h-[calc(100vh-2rem)] overflow-hidden animate-slideIn">
          <div className="relative">
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            {/* Modal Header */}
            <div className={`relative h-32 p-6 bg-gradient-to-br ${
              getIntensityColor(selectedData.emissions?.intensity) === 'green' 
                ? 'from-green-400 to-green-600' 
                : getIntensityColor(selectedData.emissions?.intensity) === 'yellow'
                ? 'from-yellow-400 to-orange-500'
                : 'from-red-400 to-red-600'
            }`}>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {getCountryName()}
                </h2>
                <p className="text-white/90">Electricity Production Data</p>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
              {/* Production Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Production</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedData.production?.total} TWh
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedData.production?.growth} YoY
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Renewable Share</p>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedData.renewable?.percentage}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Target: {selectedData.renewable?.target2030}% by 2030
                  </p>
                </div>
              </div>

              {/* Carbon Intensity Card */}
              <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">Carbon Intensity</span>
                  <span className={`text-sm px-2 py-1 rounded-full bg-white ${
                    selectedData.emissions?.trend === 'decreasing' ? 'text-green-600' :
                    selectedData.emissions?.trend === 'increasing' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {selectedData.emissions?.trend === 'decreasing' ? '↓ Decreasing' :
                     selectedData.emissions?.trend === 'increasing' ? '↑ Increasing' :
                     '→ Stable'}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-800">
                    {selectedData.emissions?.intensity}
                  </span>
                  <span className="ml-2 text-gray-600">gCO₂/kWh</span>
                </div>
                <div className="mt-3 h-2 bg-white/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      getIntensityColor(selectedData.emissions?.intensity) === 'green' 
                        ? 'bg-green-500' 
                        : getIntensityColor(selectedData.emissions?.intensity) === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((selectedData.emissions?.intensity / 800) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Energy Mix */}
              {selectedData.sources && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Energy Sources</h3>
                  <div className="space-y-3">
                    {selectedData.sources.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                          <span className="text-gray-700 text-sm">{item.source}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className={`${item.color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${item.percent}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-600 font-medium text-sm w-12 text-right">
                            {item.percent}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm text-gray-600">Per Capita</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">
                    {selectedData.production?.perCapita?.toLocaleString()} kWh
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm text-gray-600">World Rank</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">
                    #{selectedData.production?.rank}
                  </p>
                </div>
              </div>

              {/* View Details Button */}
              <button
                onClick={() => router.push(`/${selectedCountry}`)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Full Country Data →
              </button>

              {/* Last Updated */}
              <div className="text-center text-sm text-gray-500 mt-4">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend (only show if not embedded) */}
      {!embedded && (
        <div className="fixed bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 z-40">
          <p className="text-sm font-semibold text-gray-700 mb-2">Carbon Intensity</p>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-1"></div>
              <span className="text-xs text-gray-600">&lt;150</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-1"></div>
              <span className="text-xs text-gray-600">150-350</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-1"></div>
              <span className="text-xs text-gray-600">&gt;350</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">gCO₂/kWh</span>
          </div>
        </div>
      )}

      {/* Quick Stats Panel (only for embedded view) */}
      {embedded && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-40 max-w-xs">
          <p className="text-xs font-semibold text-gray-700 mb-2">Map Controls</p>
          <p className="text-xs text-gray-600">
            • Click any country to view details<br/>
            • Hover for quick stats<br/>
            • Use mouse wheel to zoom
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        /* Hover popup styling */
        :global(.mapboxgl-popup.saral-map-popup) {
          pointer-events: auto;
        }
        :global(.saral-map-popup .mapboxgl-popup-content) {
          background: #1a1a1a;
          color: #eee;
          border: 1px solid #3a3a3a;
          border-radius: 0px;
          padding: 12px 14px;
          box-shadow: none;
        }
        :global(.saral-map-popup .mapboxgl-popup-tip) {
          display: none;
        }
      `}</style>
    </div>
  );
}