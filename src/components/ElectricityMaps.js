// src/components/ElectricityMap.js
'use client';

import { useEffect, useRef, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import { Map, NavigationControl, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Import country data
import { COUNTRY_DATA } from '@/data/countries';
// ISO3 -> ISO2 fallback map for common countries in COUNTRY_DATA
const ISO3_TO_ISO2 = {
  DEU: 'DE',
  FRA: 'FR',
  USA: 'US',
  RUS: 'RU',
  CHN: 'CN',
  IND: 'IN',
  JPN: 'JP',
  BRA: 'BR',
  CAN: 'CA',
  AUS: 'AU',
  AZE: 'AZ',
  GBR: 'GB'
};

function deriveISO2(props = {}) {
  const p = props || {};
  // Prefer 2-letter codes if present (include Natural Earth keys)
  const iso2 =
    p['ISO3166-1-Alpha-2'] ||
    p.ISO_A2 || p.iso_a2 || p.isoA2 || p.ISO2 || p.iso2 ||
    p.cca2 || p.CCA2 || p.iso_2 || p.ISO_2;
  if (iso2 && typeof iso2 === 'string') {
    return String(iso2).slice(0, 2).toUpperCase();
  }
  // Fallback: map 3-letter codes to ISO2 (include Natural Earth keys)
  const iso3 =
    p['ISO3166-1-Alpha-3'] ||
    p.ISO_A3 || p.ADM0_A3 || p.iso_a3 || p.isoA3 ||
    p.cca3 || p.CCA3 || p.iso_3 || p.ISO_3;
  const key = iso3 ? String(iso3).toUpperCase() : undefined;
  if (key && ISO3_TO_ISO2[key]) return ISO3_TO_ISO2[key];
  return undefined;
}

function normalizeName(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Name -> slug map as an additional fallback
const nameToSlug = (() => {
  const map = {};
  try {
    Object.entries(COUNTRY_DATA || {}).forEach(([slug, info]) => {
      if (info?.name) map[normalizeName(info.name)] = slug;
    });
  } catch {}
  return map;
})();

const ElectricityMap = forwardRef(function ElectricityMap({
  country,
  initialData,
  coordinates,
  embedded = false,
  showHoverPanel = true,
  onViewDetails
}, ref) {
  const router = useRouter();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const hoverPopupRef = useRef(null);
  const hoveredIsoRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [noWebGL, setNoWebGL] = useState(false);
  const [activeMetric, setActiveMetric] = useState('carbon'); // 'reserve' | 'carbon' | 'price' | 'renewable'

  // Reverse lookup: ISO_A2 -> slug
  const isoToSlug = useMemo(() => {
    const m = {};
    try {
      Object.entries(COUNTRY_DATA || {}).forEach(([slug, info]) => {
        if (info?.code) m[String(info.code).toUpperCase()] = slug;
      });
      // alias often used in some datasets
      if (!m.UK && m.GB) m.UK = m.GB;
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

  // Carbon intensity scale for map + legend
  const carbonScale = useMemo(() => ({
    stops: [
      0, '#27ae60',
      300, '#f1c40f',
      600, '#8b5e3c',
      900, '#5a3d27',
      1200, '#2b2b2b',
      1500, '#1a1a1a'
    ],
    min: 0,
    max: 1500,
    ticks: [0, 300, 600, 900, 1200, 1500]
  }), []);

  const carbonGradientCSS = useMemo(() => {
    const colors = ['#27ae60', '#f1c40f', '#8b5e3c', '#5a3d27', '#2b2b2b', '#1a1a1a'];
    const step = 100 / (colors.length - 1);
    return `linear-gradient(to right, ${colors.map((c, i) => `${c} ${i * step}%`).join(', ')})`;
  }, []);

  const renewableGradientCSS = useMemo(() => {
    const colors = ['#8b4513', '#cccccc', '#27ae60'];
    const step = 100 / (colors.length - 1);
    return `linear-gradient(to right, ${colors.map((c, i) => `${c} ${i * step}%`).join(', ')})`;
  }, []);

  const reserveGradientCSS = useMemo(() => {
    const colors = ['#ea580b', '#f39c12', '#27ae60'];
    const step = 100 / (colors.length - 1);
    return `linear-gradient(to right, ${colors.map((c, i) => `${c} ${i * step}%`).join(', ')})`;
  }, []);

  const reserveTicks = useMemo(() => [0, 5, 10, 20], []);
  const renewableTicks = useMemo(() => [0, 50, 100], []);

  // Build fill-color expression for given metric with hover/selection overrides
  const buildFillColor = (metric) => {
    let base;
    switch (metric) {
      case 'reserve': {
        // Reserve margin in %, <5% critical (#ea580b), 5–10% warning (#f39c12), >10% healthy (#27ae60)
        base = [
          'interpolate', ['linear'],
          ['coalesce', ['feature-state', 'reserveMargin'], -9999],
          -9999, '#3a3a3a',
          0, '#ea580b',
          5, '#ea580b',
          7.5, '#f39c12',
          10, '#27ae60',
          50, '#27ae60'
        ];
        break;
      }
      case 'carbon': {
        // Carbon intensity gradient 0→1500 gCO₂eq/kWh (matches legend)
        base = [
          'interpolate', ['linear'],
          ['coalesce', ['feature-state', 'carbonIntensity'], -1],
          -1, '#3a3a3a',
          ...carbonScale.stops
        ];
        break;
      }
      case 'price': {
        // Price levels: #2e7cd6 (negative), #f0f0f0 (normal), #ea580b (>= $200/MWh)
        base = [
          'case',
          ['<', ['coalesce', ['feature-state', 'priceMwh'], 999999], 0], '#2e7cd6',
          ['<', ['coalesce', ['feature-state', 'priceMwh'], 999999], 200], '#f0f0f0',
          ['>=', ['coalesce', ['feature-state', 'priceMwh'], 999999], 200], '#ea580b',
          '#3a3a3a'
        ];
        break;
      }
      case 'renewable': {
        // Renewable %: #8b4513 (0%) -> #cccccc (50%) -> #27ae60 (100%)
        base = [
          'interpolate', ['linear'],
          ['coalesce', ['feature-state', 'renewable'], -1],
          -1, '#3a3a3a',
          0, '#8b4513',
          50, '#cccccc',
          100, '#27ae60'
        ];
        break;
      }
      default: {
        base = [
          'interpolate', ['linear'],
          ['coalesce', ['feature-state', 'carbonIntensity'], -1],
          -1, '#3a3a3a',
          0, '#27ae60',
          400, '#666666',
          800, '#1a1a1a'
        ];
      }
    }

    return [
      'case',
      ['boolean', ['feature-state', 'hover'], false], '#ea580b',
      ['boolean', ['feature-state', 'selected'], false], '#ea580b',
      base
    ];
  };

  // Seed feature-state values for all countries + debug coverage
  const seedFeatureState = () => {
    if (!map.current) return;
    try {
      // Collect existing feature ids in source to validate coverage
      let existingIds = new Set();
      try {
        const feats = map.current.querySourceFeatures('countries') || [];
        for (const f of feats) {
          const id = (f && (f.id ?? f.properties?.id)) ? String(f.id ?? f.properties.id).toUpperCase() : undefined;
          if (id) existingIds.add(id);
        }
      } catch {
        // querySourceFeatures may throw before first render; ignore
      }

      let seeded = 0;
      let attempted = 0;
      const missing = [];

      Object.entries(COUNTRY_DATA || {}).forEach(([slug, info]) => {
        const iso2 = info?.code ? String(info.code).toUpperCase() : null;
        if (!iso2) return;
        attempted++;

        const intensity = info?.electricity?.emissions?.intensity;
        const renewablePct = info?.electricity?.renewable?.percentage;
        const productionTWh = info?.electricity?.production?.total;
        const totalCap = info?.electricity?.capacity?.total;
        const peakDemand = info?.electricity?.production?.peakDemand;
        const reserveMargin = (typeof totalCap === 'number' && typeof peakDemand === 'number' && peakDemand > 0)
          ? ((totalCap - peakDemand) / peakDemand) * 100
          : null;
        // TODO: Hook real-time price when available; keeping null by default for now.
        const priceMwh = null;
        const name = info?.name;

        try {
          map.current.setFeatureState(
            { source: 'countries', id: iso2 },
            {
              carbonIntensity: typeof intensity === 'number' ? intensity : null,
              renewable: typeof renewablePct === 'number' ? renewablePct : null,
              production: typeof productionTWh === 'number' ? productionTWh : null,
              reserveMargin: typeof reserveMargin === 'number' ? reserveMargin : null,
              priceMwh: typeof priceMwh === 'number' ? priceMwh : null,
              name: name || null
            }
          );
          seeded++;
        } catch {
          missing.push(iso2);
        }
      });

      // eslint-disable-next-line no-console
      console.info('Feature-state seeding summary', {
        attempted,
        seeded,
        sampleMissing: missing.slice(0, 10),
        sourceFeatureCount: existingIds.size,
        exampleCheck: ['DE','FR','IN','US','GB','BR','RU','CN','CA','AU'].map(k => ({
          id: k,
          state: (() => {
            try { return map.current.getFeatureState({ source: 'countries', id: k }); } catch { return null; }
          })()
        }))
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to seed feature-state', e);
    }
  };

  // Navigate to a country with zoom-out-then-zoom-in animation
  const navigateToCountry = (countrySlug) => {
    if (!map.current || !mapReady) return;
    
    const countryInfo = COUNTRY_DATA[countrySlug];
    if (!countryInfo || !countryInfo.coordinates) return;

    const { center, zoom } = countryInfo.coordinates;
    
    // First zoom out
    map.current.flyTo({
      zoom: 2,
      duration: 800,
      essential: true
    });

    // Then zoom to the target country after zoom-out completes
    setTimeout(() => {
      if (map.current) {
        map.current.flyTo({
          center,
          zoom,
          duration: 1500,
          essential: true
        });
      }
    }, 900);

    // Update selected country for non-embedded views
    if (!embedded) {
      setTimeout(() => {
        const data = COUNTRY_DATA[countrySlug];
        if (data) {
          setSelectedData(data.electricity);
          setSelectedCountry(countrySlug);
          setModalOpen(true);
        }
      }, 2400);
    }
  };

  // Expose navigateToCountry method via ref
  useImperativeHandle(ref, () => ({
    navigateToCountry
  }));

  // Initialize map (Strict Mode safe: only when container exists and map not created)
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // If WebGL is not supported, render a static fallback and skip Map init
    const __isWebGLSupported = (() => {
      try {
        if (typeof window === 'undefined') return false;
        const canvas = document.createElement('canvas');
        const gl =
          canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl');
        return !!gl;
      } catch {
        return false;
      }
    })();
    if (!__isWebGLSupported) {
      setNoWebGL(true);
      setIsLoading(false);
      return;
    }

    // Initial view: Show Asia/Europe/North America region
    const initialView = coordinates || { center: [60, 35], zoom: 2.5 };

    map.current = new Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: initialView.center,
      zoom: initialView.zoom,
      minZoom: 1.5,
      maxZoom: 8,
      projection: 'mercator'
    });

    // Add navigation controls
    map.current.addControl(new NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapReady(true);

      // Add country boundaries from Natural Earth (public GeoJSON)
      // Use promoteId so feature-state can target by ISO_A2 directly
      map.current.addSource('countries', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        promoteId: 'id'
      });

      // Add fill layer with expression-based styling
      map.current.addLayer({
        id: 'countries-fill',
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-color': buildFillColor('carbon'),
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], 0.7,
            ['boolean', ['feature-state', 'selected'], false], 0.5,
            0.6
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

      // Ensure our layers sit on top of the basemap
      try {
        map.current.moveLayer('countries-outline');
        map.current.moveLayer('countries-fill');
      } catch {}
 
      // Ensure seeding occurs once when the 'countries' source finishes loading
      let __seededOnce = false;
      const __onSourceData = (e) => {
        try {
          if (
            e.sourceId === 'countries' &&
            map.current &&
            typeof map.current.isSourceLoaded === 'function' &&
            map.current.isSourceLoaded('countries') &&
            !__seededOnce
          ) {
            __seededOnce = true;
            seedFeatureState();
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('seedFeatureState failed (sourcedata)', err);
        }
      };
      map.current.on('sourcedata', __onSourceData);
 
      // Load and normalize country GeoJSON, then seed feature-state
      fetch('/countries.geojson')
        .then(r => r.json())
        .then(geo => {
          const normalized = {
            type: 'FeatureCollection',
            features: (geo?.features || []).map(f => {
              const p = f.properties || {};
              let iso2 = deriveISO2(p);
              if (!iso2) {
                const nameCandidate = normalizeName(
                  p.NAME_EN || p.name_en ||
                  p.ADMIN || p.admin ||
                  p.NAME || p.name ||
                  p.SOVEREIGNT || p.sovereignt
                );
                const slugGuess = nameCandidate ? nameToSlug[nameCandidate] : undefined;
                const codeFromSlug = slugGuess ? COUNTRY_DATA[slugGuess]?.code : undefined;
                if (codeFromSlug) iso2 = String(codeFromSlug).toUpperCase();
              }
              const id = iso2 || undefined;
              // Ensure the promoted property exists so feature-state targets match by promoteId: 'id'
              return { ...f, id, properties: { ...p, id } };
            })
          };
          const src = map.current && map.current.getSource('countries');
          if (src && typeof src.setData === 'function') {
            src.setData(normalized);
          }
          // Now that features have ids, seed per-country feature-state after style/sources are ready
          const seed = () => {
            try {
              seedFeatureState();
            } catch (e) {
              // eslint-disable-next-line no-console
              console.warn('seedFeatureState failed (post-setData)', e);
            }
          };
          if (map.current && typeof map.current.isStyleLoaded === 'function' && map.current.isStyleLoaded()) {
            seed();
          } else if (map.current) {
            map.current.once('idle', seed);
          }
          // Mark data as loaded after seeding
          setDataLoaded(true);
          setIsLoading(false);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.warn('Failed to load countries geojson', e);
          setDataLoaded(true);
          setIsLoading(false);
        });

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
        const p = feature.properties || {};
        let iso2 = (feature.id || deriveISO2(p) || p.ISO_A2 || p.iso_a2 || p.cca2 || p.CCA2);
        iso2 = iso2 ? String(iso2).toUpperCase() : undefined;
        if (!iso2) {
          const nameCandidate = normalizeName(
            p.NAME_EN || p.name_en ||
            p.ADMIN || p.admin ||
            p.NAME || p.name ||
            p.SOVEREIGNT || p.sovereignt
          );
          const slugGuess = nameCandidate ? nameToSlug[nameCandidate] : undefined;
          const codeFromSlug = slugGuess ? COUNTRY_DATA[slugGuess]?.code : undefined;
          if (codeFromSlug) iso2 = String(codeFromSlug).toUpperCase();
        }
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
        const props = feature.properties || {};
        let slug = isoToSlug[iso2];
        if (!slug) {
          const nameCandidate = normalizeName(
            props.NAME_EN || props.name_en ||
            props.ADMIN || props.admin ||
            props.NAME || props.name ||
            props.SOVEREIGNT || props.sovereignt
          );
          slug = nameCandidate ? nameToSlug[nameCandidate] : null;
        }
        const countryInfo = slug ? COUNTRY_DATA[slug] : null;
        const countryName =
          countryInfo?.name ||
          props.NAME_EN || props.name_en ||
          props.ADMIN || props.admin ||
          props.NAME || props.name ||
          props.SOVEREIGNT || props.sovereignt ||
          iso2;

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
            hoverPopupRef.current = new Popup({
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
                if (typeof onViewDetails === 'function') onViewDetails(slug);
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
        const p = feature.properties || {};
        let iso2 = (feature.id || deriveISO2(p) || p.ISO_A2 || p.iso_a2 || p.cca2 || p.CCA2);
        iso2 = iso2 ? String(iso2).toUpperCase() : undefined;
        if (!iso2) {
          const nameCandidate = normalizeName(
            p.NAME_EN || p.name_en ||
            p.ADMIN || p.admin ||
            p.NAME || p.name ||
            p.SOVEREIGNT || p.sovereignt
          );
          const slugGuess = nameCandidate ? nameToSlug[nameCandidate] : undefined;
          const codeFromSlug = slugGuess ? COUNTRY_DATA[slugGuess]?.code : undefined;
          if (codeFromSlug) iso2 = String(codeFromSlug).toUpperCase();
        }
        let slug = iso2 ? isoToSlug[iso2] : null;
        if (!slug) {
          const nameCandidate = normalizeName(
            p.NAME_EN || p.name_en ||
            p.ADMIN || p.admin ||
            p.NAME || p.name ||
            p.SOVEREIGNT || p.sovereignt
          );
          slug = nameCandidate ? nameToSlug[nameCandidate] : null;
        }
        const countryInfo = slug ? COUNTRY_DATA[slug] : null;

        if (countryInfo) {
          // In embedded country view, open left sidebar panel with selected country; otherwise open modal
          if (embedded) {
            if (typeof onViewDetails === 'function' && slug) onViewDetails(slug);
          } else {
            // Use the zoom-out-then-zoom-in animation for country navigation
            navigateToCountry(slug);
          }
        } else {
          const props = feature.properties || {};
          const countryName =
            props.NAME_EN || props.name_en ||
            props.ADMIN || props.admin ||
            props.NAME || props.name ||
            props.SOVEREIGNT || props.sovereignt ||
            iso2 || 'This country';

          // Debug mapping issues to identify why a supported country didn't resolve
          // This will help verify iso2 and slug inference at runtime
          // eslint-disable-next-line no-console
          console.warn('Map country mapping miss', {
            iso2,
            props,
            nameCandidate: (props.NAME_EN || props.name_en || props.ADMIN || props.admin || props.NAME || props.name || props.SOVEREIGNT || props.sovereignt || '').toString(),
            derivedSlug: (props.NAME_EN || props.name_en || props.ADMIN || props.admin || props.NAME || props.name || props.SOVEREIGNT || props.sovereignt)
              ? (function () {
                  const n = (props.NAME_EN || props.name_en || props.ADMIN || props.admin || props.NAME || props.name || props.SOVEREIGNT || props.sovereignt || '').toString()
                    .toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, ' ')
                    .trim();
                  return n;
                })()
              : null
          });

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

  // Update choropleth colors when active metric changes
  useEffect(() => {
    if (!map.current || !mapReady) return;
    try {
      map.current.setPaintProperty('countries-fill', 'fill-color', buildFillColor(activeMetric));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to update fill-color for metric', activeMetric, e);
    }
  }, [activeMetric, mapReady]);

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
    if (!map.current || !mapReady) return;
    const safeSeed = () => {
      try {
        seedFeatureState();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('seedFeatureState failed (mapReady effect)', e);
      }
    };
    // If the countries source exists and is loaded, seed immediately; otherwise wait for idle
    try {
      const hasIsLoaded = typeof map.current.isSourceLoaded === 'function';
      const sourceExists = !!map.current.getSource('countries');
      if (sourceExists && hasIsLoaded && map.current.isSourceLoaded('countries')) {
        safeSeed();
      } else {
        map.current.once('idle', safeSeed);
      }
    } catch {
      map.current.once('idle', safeSeed);
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
      {/* Loading overlay - shown until map and data are ready */}
      {(isLoading || !dataLoaded) && (
        <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-lg font-semibold">Loading...</p>
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

      {/* Map container - hidden until data is loaded */}
      <div
        ref={mapContainer}
        className="absolute inset-0"
        style={{
          width: '100%',
          height: '100%',
          visibility: dataLoaded ? 'visible' : 'hidden'
        }}
      />

      {/* Metric toggle segmented control (top-right) */}
      {mapReady && (
        <div className="fixed right-4 z-50 flex" style={{ backgroundColor: '#1a1a1a', border: '1px solid #3a3a3a', top: embedded ? 60 : 16 }}>
          <button
            onClick={() => setActiveMetric('reserve')}
            aria-pressed={activeMetric === 'reserve'}
            className="text-[12px] font-semibold"
            style={{
              backgroundColor: activeMetric === 'reserve' ? '#ea580b' : '#1a1a1a',
              color: activeMetric === 'reserve' ? '#0f0f0f' : '#eee',
              padding: '6px 10px',
              borderRight: '1px solid #3a3a3a',
              borderRadius: 0
            }}
          >
            Reserve
          </button>
          <button
            onClick={() => setActiveMetric('carbon')}
            aria-pressed={activeMetric === 'carbon'}
            className="text-[12px] font-semibold"
            style={{
              backgroundColor: activeMetric === 'carbon' ? '#ea580b' : '#1a1a1a',
              color: activeMetric === 'carbon' ? '#0f0f0f' : '#eee',
              padding: '6px 10px',
              borderRight: '1px solid #3a3a3a',
              borderRadius: 0
            }}
          >
            Carbon
          </button>
          <button
            onClick={() => setActiveMetric('price')}
            aria-pressed={activeMetric === 'price'}
            className="text-[12px] font-semibold"
            style={{
              backgroundColor: activeMetric === 'price' ? '#ea580b' : '#1a1a1a',
              color: activeMetric === 'price' ? '#0f0f0f' : '#eee',
              padding: '6px 10px',
              borderRight: '1px solid #3a3a3a',
              borderRadius: 0
            }}
          >
            Price
          </button>
          <button
            onClick={() => setActiveMetric('renewable')}
            aria-pressed={activeMetric === 'renewable'}
            className="text-[12px] font-semibold"
            style={{
              backgroundColor: activeMetric === 'renewable' ? '#ea580b' : '#1a1a1a',
              color: activeMetric === 'renewable' ? '#0f0f0f' : '#eee',
              padding: '6px 10px',
              border: 'none',
              borderRadius: 0
            }}
          >
            Renewable
          </button>
        </div>
      )}

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

      {/* Legends (metric-specific, visible in embedded and non-embedded) */}
      <div
        className="fixed z-40"
        style={{
          bottom: 16,
          left: embedded ? 'auto' : 16,
          right: embedded ? 16 : 'auto',
          backgroundColor: '#1a1a1a',
          color: '#eee',
          border: '1px solid #3a3a3a',
          padding: '12px 14px',
          borderRadius: 0
        }}
      >
        {activeMetric === 'carbon' && (
          <>
            <p className="text-sm font-semibold mb-2">Carbon intensity (gCO₂eq/kWh)</p>
            <div style={{ width: 300 }}>
              <div style={{ height: 10, background: carbonGradientCSS, border: '1px solid #3a3a3a' }} />
              <div className="flex justify-between mt-2 text-xs" style={{ color: '#ccc' }}>
                {carbonScale.ticks.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </>
        )}

        {activeMetric === 'reserve' && (
          <>
            <p className="text-sm font-semibold mb-2">Reserve margin (%)</p>
            <div style={{ width: 300 }}>
              <div style={{ height: 10, background: reserveGradientCSS, border: '1px solid #3a3a3a' }} />
              <div className="flex justify-between mt-2 text-xs" style={{ color: '#ccc' }}>
                {reserveTicks.map((t) => (
                  <span key={t}>{t}%</span>
                ))}
              </div>
            </div>
          </>
        )}

        {activeMetric === 'renewable' && (
          <>
            <p className="text-sm font-semibold mb-2">Renewable (%)</p>
            <div style={{ width: 300 }}>
              <div style={{ height: 10, background: renewableGradientCSS, border: '1px solid #3a3a3a' }} />
              <div className="flex justify-between mt-2 text-xs" style={{ color: '#ccc' }}>
                {renewableTicks.map((t) => (
                  <span key={t}>{t}%</span>
                ))}
              </div>
            </div>
          </>
        )}

        {activeMetric === 'price' && (
          <>
            <p className="text-sm font-semibold mb-2">Price ($/MWh)</p>
            <div className="flex items-center gap-4 text-xs" style={{ color: '#ccc' }}>
              <div className="flex items-center gap-2">
                <span style={{ width: 14, height: 14, backgroundColor: '#2e7cd6', display: 'inline-block', border: '1px solid #3a3a3a' }} />
                <span>Negative</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ width: 14, height: 14, backgroundColor: '#f0f0f0', display: 'inline-block', border: '1px solid #3a3a3a' }} />
                <span>0–200</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ width: 14, height: 14, backgroundColor: '#ea580b', display: 'inline-block', border: '1px solid #3a3a3a' }} />
                <span>≥200</span>
              </div>
            </div>
          </>
        )}
      </div>

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
});

export default ElectricityMap;
