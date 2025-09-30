// src/components/ElectricityMap.js
'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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
  const mapContainer = useRef(null);
  const map = useRef(null);
  const hoverPopupRef = useRef(null);
  const hoveredIsoRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [noWebGL, setNoWebGL] = useState(false);

  // Reverse lookup: ISO_A2 -> slug
  const isoToSlug = useMemo(() => {
    const m = {};
    try {
      Object.entries(COUNTRY_DATA || {}).forEach(([slug, info]) => {
        if (info?.code) m[String(info.code).toUpperCase()] = slug;
      });
    } catch {}
    return m;
  }, []);

  // Format country name for display
  const formatCountryName = (slug) => {
    if (!slug) return '';
    return slug.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Build MapLibre expression for choropleth by carbonIntensity feature-state
  const carbonPaintExpression = useMemo(() => {
    return [
      'case',
      ['!=', ['feature-state', 'carbonIntensity'], null],
      [
        'interpolate',
        ['linear'],
        ['feature-state', 'carbonIntensity'],
        0, '#9be180',      // very low
        150, '#9be180',
        350, '#f0d264',
        550, '#e58a3b',
        800, '#b43f2d'     // very high
      ],
      '#3a3a3a' // default when no data
    ];
  }, []);

  // Helper to get intensity color class for modal header bar
  const getIntensityColor = (intensity) => {
    if (intensity < 150) return 'green';
    if (intensity < 350) return 'yellow';
    return 'red';
  };

  // Seed feature-state values for all countries
  const seedFeatureState = () => {
    if (!map.current) return;
    try {
      Object.entries(COUNTRY_DATA || {}).forEach(([slug, info]) => {
        const iso2 = info?.code;
        if (!iso2) return;
        const intensity = info?.electricity?.emissions?.intensity;
        const renewablePct = info?.electricity?.renewable?.percentage;
        const productionTWh = info?.electricity?.production?.total;
        const name = info?.name;

        map.current.setFeatureState(
          { source: 'countries', id: iso2 },
          {
            carbonIntensity: typeof intensity === 'number' ? intensity : null,
            renewable: typeof renewablePct === 'number' ? renewablePct : null,
            production: typeof productionTWh === 'number' ? productionTWh : null,
            name: name || null
          }
        );
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to seed feature-state', e);
    }
  };

  // Initialize map (Strict Mode safe: only when container exists and map not created)
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // If WebGL is not supported, render a static fallback and skip Map init
    if (!maplibregl.supported()) {
      setNoWebGL(true);
      setIsLoading(false);
      return;
    }

    const initialView = coordinates || { center: [10, 30], zoom: 2 };

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: initialView.center,
      zoom: initialView.zoom,
      minZoom: 1.5,
      maxZoom: 8,
      projection: 'mercator'
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setIsLoading(false);
      setMapReady(true);

      // Add country boundaries from Natural Earth (public GeoJSON)
      // Use promoteId so feature-state can target by ISO_A2 directly
      map.current.addSource('countries', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/cultural/ne_110m_admin_0_countries.geojson',
        promoteId: 'ISO_A2'
      });

      // Add fill layer with expression-based styling
      map.current.addLayer({
        id: 'countries-fill',
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], '#ea580b',
            ['boolean', ['feature-state', 'selected'], false], '#ea580b',
            carbonPaintExpression
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
        id: 'countries-outline',
        type: 'line',
        source: 'countries',
        paint: {
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

      // Seed feature-state; MapLibre re-colors automatically via expression on updates
      seedFeatureState();

      // If country is specified, highlight it and open modal (non-embedded)
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

        const feature = e.features[0];
        const iso2 = feature.properties?.ISO_A2;
        if (!iso2) return;

        // Remove previous hover/selection state
        if (hoveredIsoRef.current && hoveredIsoRef.current !== iso2) {
          map.current.setFeatureState(
            { source: 'countries', id: hoveredIsoRef.current },
            { hover: false, selected: false }
          );
        }

        hoveredIsoRef.current = iso2;

        // Add hover and selection state (to emphasize boundary)
        map.current.setFeatureState(
          { source: 'countries', id: iso2 },
          { hover: true, selected: true }
        );

        // Resolve country and show a popup near cursor
        const slug = isoToSlug[iso2];
        const countryInfo = slug ? COUNTRY_DATA[slug] : null;
        const countryName = countryInfo?.name || feature.properties?.NAME_EN || feature.properties?.ADMIN || iso2;

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
            hoverPopupRef.current = new maplibregl.Popup({
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
                if (!embedded) {
                  // Also open modal in non-embedded mode
                  setSelectedCountry(slug);
                  setSelectedData(countryInfo.electricity);
                  setModalOpen(true);
                }
              };
            }
          }, 0);
        }
      });

      // Mouse leave handler
      map.current.on('mouseleave', 'countries-fill', () => {
        map.current.getCanvas().style.cursor = '';

        if (hoveredIsoRef.current) {
          map.current.setFeatureState(
            { source: 'countries', id: hoveredIsoRef.current },
            { hover: false, selected: false }
          );
        }
        hoveredIsoRef.current = null;

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
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const iso2 = feature.properties?.ISO_A2;
        const slug = iso2 ? isoToSlug[iso2] : null;
        const countryInfo = slug ? COUNTRY_DATA[slug] : null;

        if (countryInfo) {
          // If embedded in country page, navigate to that country
          if (embedded) {
            router.push(`/${slug}`);
          } else {
            // Show modal with country data
            setSelectedCountry(slug);
            setSelectedData(countryInfo.electricity);
            setModalOpen(true);

            // Fly to country if coordinates available
            if (countryInfo.coordinates?.center && countryInfo.coordinates?.zoom) {
              map.current.flyTo({
                center: countryInfo.coordinates.center,
                zoom: countryInfo.coordinates.zoom,
                duration: 1500
              });
            }
          }
        } else {
          const countryName = feature.properties?.NAME_EN || feature.properties?.ADMIN || iso2 || 'This country';
          // eslint-disable-next-line no-alert
          alert(`Data not available for ${countryName} yet.`);
        }
      });
    });

    return () => {
      // Cleanup
      if (hoverPopupRef.current) {
        try { hoverPopupRef.current.remove(); } catch {}
        hoverPopupRef.current = null;
      }
      if (map.current) {
        try { map.current.remove(); } catch {}
        map.current = null;
      }
    };
  }, [coordinates, country, embedded, isoToSlug, carbonPaintExpression, showHoverPanel, onViewDetails, router]);

  // Update map when country changes (for navigation)
  useEffect(() => {
    if (!map.current || !mapReady) return;
    if (country && coordinates) {
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
    }
  }, [country, coordinates, mapReady, embedded]);

  // Example: if some external updates arrive, re-seed states to auto-recolor via expressions
  useEffect(() => {
    if (map.current && mapReady) {
      seedFeatureState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, initialData]);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCountry(null);
    setSelectedData(null);
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

      {/* No WebGL fallback */}
      {noWebGL && (
        <div className="absolute inset-0 bg-gray-100 text-gray-800 flex items-center justify-center z-40">
          <div className="max-w-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">WebGL not supported</h2>
            <p className="text-sm text-gray-600">
              Your browser does not support WebGL. Please try a modern browser to view the interactive map.
            </p>
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
                          <span className="text-gray-700 text-sm capitalize">{item.source}</span>
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
              <div className="w-4 h-4 bg-[#9be180] rounded mr-1"></div>
              <span className="text-xs text-gray-600">&lt;150</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#f0d264] rounded mr-1"></div>
              <span className="text-xs text-gray-600">150-350</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#e58a3b] rounded mr-1"></div>
              <span className="text-xs text-gray-600">350-550</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#b43f2d] rounded mr-1"></div>
              <span className="text-xs text-gray-600">&gt;550</span>
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

        /* Hover popup styling for MapLibre */
        :global(.maplibregl-popup.saral-map-popup) {
          pointer-events: auto;
        }
        :global(.saral-map-popup .maplibregl-popup-content) {
          background: #1a1a1a;
          color: #eee;
          border: 1px solid #3a3a3a;
          border-radius: 0px;
          padding: 12px 14px;
          box-shadow: none;
        }
        :global(.saral-map-popup .maplibregl-popup-tip) {
          display: none;
        }
      `}</style>
    </div>
  );
}
