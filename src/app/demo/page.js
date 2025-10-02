'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Plus,
  ShoppingCart,
  Info,
  Search,
  Check,
  Upload,
  Loader2,
  Sparkles,
  Trash2,
  FileText,
  FileSpreadsheet,
  Download,
  Share2,
} from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Header from '@/components/Header';

// Disable worker for client-side to avoid 404 errors (falls back to main thread)
// This is acceptable for demo purposes and smaller datasets
if (typeof window !== 'undefined') {
  maplibregl.workerCount = 0;
}

const INITIAL_FEEDERS = [
  {
    id: 'feeder-12a',
    name: 'Feeder 12-A',
    voltage: '12.47kV',
    customers: 1243,
    isUploaded: false,
    coordinates: [
      [-97.343, 37.688],
      [-97.336, 37.696],
      [-97.327, 37.705],
      [-97.318, 37.713],
      [-97.309, 37.719],
    ],
  },
  {
    id: 'feeder-15b',
    name: 'Feeder 15-B',
    voltage: '12.47kV',
    customers: 892,
    isUploaded: false,
    coordinates: [
      [-97.282, 37.694],
      [-97.274, 37.702],
      [-97.266, 37.709],
      [-97.257, 37.716],
    ],
  },
  {
    id: 'feeder-18c',
    name: 'Feeder 18-C',
    voltage: '12.47kV',
    customers: 1567,
    isUploaded: false,
    coordinates: [
      [-97.329, 37.664],
      [-97.321, 37.671],
      [-97.311, 37.681],
      [-97.304, 37.689],
      [-97.296, 37.695],
    ],
  },
];

const feedersToFeatureCollection = (feeders) => ({
  type: 'FeatureCollection',
  features: feeders.map((feeder) => ({
    type: 'Feature',
    id: feeder.id,
    properties: {
      id: feeder.id,
      name: feeder.name,
      voltage: feeder.voltage,
      customers: feeder.customers,
      isUploaded: feeder.isUploaded ?? false,
    },
    geometry: {
      type: 'LineString',
      coordinates: feeder.coordinates,
    },
  })),
});

// Public data sources with logos
const PUBLIC_DATA_SOURCES = [
  {
    id: 'noaa-historical',
    name: 'NOAA Historical Weather Data',
    category: 'Weather',
    description: 'Historical weather patterns and climate data',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/1024px-NOAA_logo.svg.png',
    logoType: 'image',
  },
  {
    id: 'noaa-forecast',
    name: 'NOAA 7-Day Forecast',
    category: 'Weather',
    description: 'Short-term weather forecasts',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/1024px-NOAA_logo.svg.png',
    logoType: 'image',
  },
  {
    id: 'nasa-satellite',
    name: 'NASA Satellite Imagery',
    category: 'Satellite',
    description: 'High-resolution satellite imagery',
    logo: '🛰️',
    logoType: 'emoji',
  },
  {
    id: 'acs-census',
    name: 'ACS Census Data',
    category: 'Demographics',
    description: 'Population and demographic information',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/US-Census-ACSLogo.svg',
    logoType: 'image',
  },
  {
    id: 'building-data',
    name: 'Building & Real Estate Data',
    category: 'Real Estate',
    description: 'Property characteristics and usage',
    logo: '🏢',
    logoType: 'emoji',
  },
  {
    id: 'nrel-solar',
    name: 'NREL Solar Resource Data',
    category: 'Energy',
    description: 'Solar irradiance and potential',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/National_Renewable_Energy_Laboratory_logo.svg/1200px-National_Renewable_Energy_Laboratory_logo.svg.png',
    logoType: 'image',
  },
  {
    id: 'nrel-wind',
    name: 'NREL Wind Resource Data',
    category: 'Energy',
    description: 'Wind speed and energy potential',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/National_Renewable_Energy_Laboratory_logo.svg/1200px-National_Renewable_Energy_Laboratory_logo.svg.png',
    logoType: 'image',
  },
  {
    id: 'usgs-elevation',
    name: 'USGS Elevation Data',
    category: 'Topography',
    description: 'Digital elevation models',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/USGS_logo_green.svg/1200px-USGS_logo_green.svg.png',
    logoType: 'image',
  },
  {
    id: 'epa-environmental',
    name: 'EPA Environmental Data',
    category: 'Environment',
    description: 'Air quality and environmental factors',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/EPA_logo.svg/2560px-EPA_logo.svg.png',
    logoType: 'image',
  },
  {
    id: 'dot-traffic',
    name: 'DOT Traffic Patterns',
    category: 'Transportation',
    description: 'Traffic flow and vehicle counts',
    logo: '🚗',
    logoType: 'emoji',
  },
  {
    id: 'landsat-imagery',
    name: 'Landsat Imagery',
    category: 'Satellite',
    description: 'Multispectral satellite data',
    logo: '🛰️',
    logoType: 'emoji',
  },
  {
    id: 'fema-flood',
    name: 'FEMA Flood Risk Data',
    category: 'Risk',
    description: 'Flood zone and risk assessment',
    logo: '🌊',
    logoType: 'emoji',
  },
];

// Private data sources with logos
const PRIVATE_DATA_SOURCES = [
  {
    id: 'vacant-parcels',
    name: 'Vacant Parcels Database',
    category: 'Real Estate',
    price: 299,
    description: 'Available development parcels',
    logo: '📍',
    logoType: 'emoji',
  },
  {
    id: 'interconnection-queue',
    name: 'Interconnection Queue Data',
    category: 'Energy',
    price: 499,
    description: 'DER interconnection requests',
    logo: '⚡',
    logoType: 'emoji',
  },
  {
    id: 'ev-charging',
    name: 'EV Charging Station Analytics',
    category: 'Transportation',
    price: 399,
    description: 'Current and planned EV infrastructure',
    logo: '🔌',
    logoType: 'emoji',
  },
  {
    id: 'commercial-load',
    name: 'Commercial Load Profiles',
    category: 'Energy',
    price: 599,
    description: 'Detailed commercial usage patterns',
    logo: '📊',
    logoType: 'emoji',
  },
  {
    id: 'solar-adoption',
    name: 'Solar Adoption Trends',
    category: 'Energy',
    price: 349,
    description: 'Residential solar installation data',
    logo: '🏠',
    logoType: 'emoji',
  },
  {
    id: 'property-valuation',
    name: 'Property Valuation Data',
    category: 'Real Estate',
    price: 449,
    description: 'Detailed property assessments',
    logo: '💰',
    logoType: 'emoji',
  },
];

// Use a simple, reliable OSM raster tile style
const MAP_STYLE = {
  version: 8,
  sources: {
    'osm-raster': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-raster-layer',
      type: 'raster',
      source: 'osm-raster',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

const WORKFLOW_RULES = [
  {
    id: 'land-parcels',
    triggerLabel: 'Land & Parcel Data',
    predicate: (source) =>
      source.name?.toLowerCase().includes('parcel') || source.category === 'Real Estate',
    suggestions: [
      {
        id: 'commercial-growth-analysis',
        title: 'Commercial Growth Analysis',
        description: 'Combine parcel insights with feeder load profiles to target high-growth commercial corridors.',
      },
      {
        id: 'solar-storage-land-screening',
        title: 'Solar + Storage Land Potential',
        description: 'Screen parcels for interconnection capacity and siting suitability to fast-track hybrid DER projects.',
      },
    ],
  },
  {
    id: 'weather-insights',
    triggerLabel: 'Wind Intelligence',
    predicate: (source) => source.category === 'Weather',
    suggestions: [
      {
        id: 'short-term-load-forecast',
        title: 'Short-Term Load Forecast',
        description: 'Blend forecasted weather with historical usage to project feeder demand for the next 7 days.',
      },
      {
        id: 'wind-risk-hardening',
        title: 'Poles at Wind Risk Analysis',
        description: 'Map high-wind segments to vulnerable structures and prioritise hardening budgets.',
      },
    ],
  },
  {
    id: 'satellite-overwatch',
    triggerLabel: 'Satellite Imagery',
    predicate: (source) => source.category === 'Satellite',
    suggestions: [
      {
        id: 'risky-vegetation-growth',
        title: 'Risky Vegetation Growth',
        description: 'Leverage multispectral imagery to flag vegetation encroachment risks along critical spans.',
      },
    ],
  },
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const flattenGeometriesToLines = (geometry) => {
  if (!geometry) return [];
  const { type, coordinates, geometries } = geometry;

  switch (type) {
    case 'LineString':
      return [coordinates];
    case 'MultiLineString':
      return coordinates;
    case 'Polygon':
      return [coordinates[0]];
    case 'MultiPolygon':
      return coordinates.map((poly) => poly[0]);
    case 'GeometryCollection':
      return geometries.flatMap((geom) => flattenGeometriesToLines(geom));
    default:
      return [];
  }
};

const normaliseFeederGeoJSON = (input, fileName) => {
  if (!input) return { type: 'FeatureCollection', features: [] };

  const toCollection = (data) => {
    if (data.type === 'FeatureCollection') return data;
    if (data.type === 'Feature') return { type: 'FeatureCollection', features: [data] };
    if (data.type === 'GeometryCollection') {
      return {
        type: 'FeatureCollection',
        features: data.geometries.map((geometry, idx) => ({
          type: 'Feature',
          geometry,
          properties: { id: `geometry-${idx}` },
        })),
      };
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: data,
          properties: {},
        },
      ],
    };
  };

  const collection = toCollection(input);
  const baseName = fileName.replace(/\.[^/.]+$/, '');

  const features = collection.features.flatMap((feature, idx) => {
    const lines = flattenGeometriesToLines(feature.geometry);
    if (lines.length === 0) return [];

    const featureName =
      feature.properties?.name ||
      feature.properties?.Name ||
      feature.properties?.FEEDER ||
      `${baseName} ${idx + 1}`;

    const voltage =
      feature.properties?.voltage ||
      feature.properties?.Voltage ||
      '12.47kV';

    const customers =
      Number(feature.properties?.customers || feature.properties?.Customers) ||
      randomInt(500, 2200);

    return lines.map((coords, lineIdx) => {
      const id = `${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idx}-${lineIdx}-${Date.now()}`;
      return {
        type: 'Feature',
        id,
        properties: {
          id,
          name: featureName,
          voltage,
          customers,
          isUploaded: true,
        },
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      };
    });
  });

  return {
    type: 'FeatureCollection',
    features,
  };
};

function DataSourceLogo({ logo, logoType = 'emoji', name }) {
  const [failed, setFailed] = useState(false);
  const isImage = logoType === 'image' && !failed && logo;

  if (isImage) {
    return (
      <img
        src={logo}
        alt={name ? `${name} logo` : 'Data source logo'}
        className="w-10 h-10 object-contain rounded border border-slate-200 bg-white"
        onError={() => setFailed(true)}
      />
    );
  }

  const fallback = logoType === 'image' ? name?.slice(0, 2)?.toUpperCase() || '?' : logo;

  return (
    <div className="w-10 h-10 flex items-center justify-center rounded border border-slate-200 bg-slate-100 text-xl">
      {fallback}
    </div>
  );
}

export default function GridspeedGISFeeder() {
  const [feederData, setFeederData] = useState(feedersToFeatureCollection(INITIAL_FEEDERS));
  const [selectedFeeder, setSelectedFeeder] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showPublicDataModal, setShowPublicDataModal] = useState(false);
  const [showPrivateDataModal, setShowPrivateDataModal] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [selectedPublicData, setSelectedPublicData] = useState([]);
  const [selectedPrivateData, setSelectedPrivateData] = useState([]);
  const [attachedData, setAttachedData] = useState([]);
  const [mockDataRows, setMockDataRows] = useState([]);
  const [workflowModal, setWorkflowModal] = useState({ open: false, workflow: null });
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [workflowResults, setWorkflowResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [hoveredFeeder, setHoveredFeeder] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const workflowTimeoutRef = useRef(null);
  const previousSelectedIdRef = useRef(null);
  const previousHoveredIdRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    console.log('Initializing MapLibre GL map...');

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLE,
        center: [-97.315, 37.69],
        zoom: 11,
        interactive: true,
      });

      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

      mapInstanceRef.current = map;

      let handleLineClick;
      let handleLineMouseMove;
      let handleLineMouseLeave;
      let mapBackgroundClick;
      const handleMapError = (event) => {
        console.error('MapLibre error:', event?.error ?? event);
        console.error('Error details:', {
          type: event?.type,
          sourceId: event?.sourceId,
          error: event?.error,
        });
      };

      map.on('error', handleMapError);

      const handleWindowResize = () => {
        map.resize();
      };

      window.addEventListener('resize', handleWindowResize);

      map.on('load', () => {
        console.log('Map loaded successfully');
        
        // Force map to resize and render properly
        setTimeout(() => {
          map.resize();
        }, 100);
        
        map.addSource('feeders', {
          type: 'geojson',
          data: feederData,
          promoteId: 'id',
        });
        
        console.log('Added feeders source with data:', feederData);

        map.addLayer({
          id: 'feeders-line',
          type: 'line',
          source: 'feeders',
          paint: {
            'line-color': [
              'case',
              ['boolean', ['feature-state', 'selected'], false], '#ea580b',
              ['boolean', ['feature-state', 'hovered'], false], '#3b82f6',
              ['==', ['get', 'isUploaded'], true], '#10b981',
              '#2563eb',
            ],
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'selected'], false], 5,
              ['boolean', ['feature-state', 'hovered'], false], 4,
              2.5,
            ],
            'line-opacity': 0.9,
          },
        });
        
        console.log('Added feeders-line layer');

        handleLineClick = (event) => {
          console.log('Feeder clicked!', event);
          const feature = event.features?.[0];
          if (!feature) {
            console.log('No feature found in click event');
            return;
          }

          console.log('Feature:', feature);
          event.originalEvent?.stopPropagation?.();

          // Calculate position relative to viewport, accounting for header
          const rect = mapContainerRef.current?.getBoundingClientRect();
          console.log('Container rect:', rect);
          if (rect) {
            setContextMenuPosition({
              x: event.point.x + rect.left,
              y: event.point.y + rect.top,
            });
          } else {
            // Fallback positioning
            setContextMenuPosition({
              x: event.point.x,
              y: event.point.y + 48, // Account for header height
            });
          }

          map.getCanvas().focus();
          setSelectedFeeder(feature);
          setShowContextMenu(true);
          console.log('Context menu should show now');
        };

        handleLineMouseMove = (event) => {
          const feature = event.features?.[0];
          map.getCanvas().style.cursor = feature ? 'pointer' : '';
          if (!feature) return;
          setHoveredFeeder(feature.id ?? feature.properties?.id ?? null);
        };

        handleLineMouseLeave = () => {
          map.getCanvas().style.cursor = '';
          setHoveredFeeder(null);
        };

        map.on('click', 'feeders-line', handleLineClick);
        map.on('mousemove', 'feeders-line', handleLineMouseMove);
        map.on('mouseleave', 'feeders-line', handleLineMouseLeave);
        
        console.log('Attached click handlers to feeders-line layer');

        mapBackgroundClick = (event) => {
          // Don't close if clicking on a feeder line
          const features = map.queryRenderedFeatures(event.point, {
            layers: ['feeders-line']
          });
          if (features.length > 0) {
            return;
          }
          setShowContextMenu(false);
        };

        map.on('click', mapBackgroundClick);

        map.once('styledata', () => {
          // Ensure initial selection state is reflected
          if (selectedFeeder?.id || selectedFeeder?.properties?.id) {
            setSelectedFeeder((prev) => ({ ...prev }));
          }
        });
      });

      return () => {
        window.removeEventListener('resize', handleWindowResize);
        if (map.getLayer('feeders-line')) {
          if (handleLineClick) map.off('click', 'feeders-line', handleLineClick);
          if (handleLineMouseMove) map.off('mousemove', 'feeders-line', handleLineMouseMove);
          if (handleLineMouseLeave) map.off('mouseleave', 'feeders-line', handleLineMouseLeave);
        }
        if (mapBackgroundClick) {
          map.off('click', mapBackgroundClick);
        }
        map.off('error', handleMapError);
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (error) {
      console.error('Failed to initialise MapLibre map', error);
    }
  }, []);

  useEffect(() => () => {
    if (workflowTimeoutRef.current) {
      clearTimeout(workflowTimeoutRef.current);
      workflowTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource('feeders');
    if (source) {
      source.setData(feederData);
    }
  }, [feederData]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource('feeders');
    if (!source) return;

    const selectedFeederId = selectedFeeder?.properties?.id ?? selectedFeeder?.id ?? null;
    const previousSelected = previousSelectedIdRef.current;
    const currentSelected = selectedFeederId;

    if (previousSelected && previousSelected !== currentSelected) {
      map.setFeatureState({ source: 'feeders', id: previousSelected }, { selected: false });
    }

    if (currentSelected) {
      map.setFeatureState({ source: 'feeders', id: currentSelected }, { selected: true });
      previousSelectedIdRef.current = currentSelected;
    } else {
      previousSelectedIdRef.current = null;
    }
  }, [selectedFeeder]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource('feeders');
    if (!source) return;

    const previousHovered = previousHoveredIdRef.current;
    const currentHovered = hoveredFeeder ?? null;

    if (previousHovered && previousHovered !== currentHovered) {
      map.setFeatureState({ source: 'feeders', id: previousHovered }, { hovered: false });
    }

    if (currentHovered) {
      map.setFeatureState({ source: 'feeders', id: currentHovered }, { hovered: true });
      previousHoveredIdRef.current = currentHovered;
    } else {
      previousHoveredIdRef.current = null;
    }
  }, [hoveredFeeder]);

  const generateMockRow = (source) => {
    const isPublic = source.type === 'public';
    const metric = isPublic ? 'Spatial Coverage' : 'Projected ROI';
    const value = isPublic
      ? `${(82 + Math.random() * 12).toFixed(1)}%`
      : `${(6 + Math.random() * 9).toFixed(1)}%`;
    const records = Math.floor(500 + Math.random() * 4500).toLocaleString();

    return {
      sourceId: source.id,
      sourceName: source.name,
      metric,
      value,
      records,
      updatedAt: new Date().toLocaleString(),
    };
  };

  const updateMockDataRows = (newSources) => {
    if (newSources.length === 0) return;

    setMockDataRows((prev) => {
      const merged = new Map(prev.map((row) => [row.sourceId, row]));
      newSources.forEach((source) => {
        merged.set(source.id, generateMockRow(source));
      });
      return Array.from(merged.values());
    });
  };

  const generateWindRiskResults = () => {
    const sustainedWind = Number((58 + Math.random() * 8).toFixed(1));
    const peakGust = Number((sustainedWind + 12 + Math.random() * 6).toFixed(1));
    const circuitPool = ['South Loop 12kV', 'Depot Spur', 'Airport Main', 'West Ridge 4kV', 'Industrial Backbone'];

    const poles = Array.from({ length: 25 }, (_, idx) => {
      const failureProbability = 0.28 + Math.random() * 0.35; // 28% - 63%
      const customersImpacted = 90 + Math.floor(Math.random() * 240);
      const riskScore = Math.min(100, Math.round(68 + failureProbability * 45 + Math.random() * 12));
      const spanLength = 280 + Math.round(Math.random() * 220);
      const lat = (39.1 + Math.random() * 0.6).toFixed(4);
      const lng = (-97.1 + Math.random() * 0.6).toFixed(4);
      const circuit = circuitPool[Math.floor(Math.random() * circuitPool.length)];
      const impactLevel = customersImpacted >= 150 ? 'High Impact' : 'Low Impact';
      const probabilityLevel = failureProbability >= 0.35 ? 'High Probability' : 'Low Probability';

      return {
        id: `PL-${4100 + idx}`,
        circuit,
        spanLength,
        failureProbability,
        riskScore,
        customersImpacted,
        lat,
        lng,
        impactLevel,
        probabilityLevel,
      };
    }).sort((a, b) => b.failureProbability - a.failureProbability);

    const riskMatrix = {
      highImpactHighProbability: 0,
      highImpactLowProbability: 0,
      lowImpactHighProbability: 0,
      lowImpactLowProbability: 0,
    };

    poles.forEach((pole) => {
      if (pole.impactLevel === 'High Impact' && pole.probabilityLevel === 'High Probability') {
        riskMatrix.highImpactHighProbability += 1;
      } else if (pole.impactLevel === 'High Impact' && pole.probabilityLevel === 'Low Probability') {
        riskMatrix.highImpactLowProbability += 1;
      } else if (pole.impactLevel === 'Low Impact' && pole.probabilityLevel === 'High Probability') {
        riskMatrix.lowImpactHighProbability += 1;
      } else {
        riskMatrix.lowImpactLowProbability += 1;
      }
    });

    const totalCustomers = poles.reduce((sum, pole) => sum + pole.customersImpacted, 0);
    const avgFailureProbability = poles.reduce((sum, pole) => sum + pole.failureProbability, 0) / poles.length;
    const highRiskCount = poles.filter((pole) => pole.riskScore >= 85).length;
    const circuitsImpacted = new Set(poles.map((pole) => pole.circuit)).size;

    const secondDegreeImpacts = [
      `${totalCustomers.toLocaleString()} customers potentially interrupted across ${circuitsImpacted} impacted circuits`,
      `Estimated ${Math.ceil(totalCustomers * 0.14)} critical service customers (hospitals, public safety) require contingency plans`,
      `${Math.ceil(poles.length * 0.32)} downstream switching operations likely to maintain service continuity`,
    ];

    return {
      sustainedWind,
      peakGust,
      poles,
      riskMatrix,
      stats: {
        totalCustomers,
        avgFailureProbability,
        highRiskCount,
        circuitsImpacted,
      },
      secondDegreeImpacts,
    };
  };

  const workflowSuggestions = useMemo(() => {
    if (attachedData.length === 0) return [];

    const triggered = new Map();

    WORKFLOW_RULES.forEach((rule) => {
      if (attachedData.some((source) => rule.predicate(source))) {
        rule.suggestions.forEach((suggestion) => {
          triggered.set(suggestion.id, {
            ...suggestion,
            triggerLabel: suggestion.triggerLabel || rule.triggerLabel,
          });
        });
      }
    });

    return Array.from(triggered.values());
  }, [attachedData]);

  const handleRemoveAttachedData = (sourceId) => {
    setAttachedData((prev) => prev.filter((data) => data.id !== sourceId));
    setMockDataRows((prev) => prev.filter((row) => row.sourceId !== sourceId));
  };

  const handleWorkflowSelect = (workflow) => {
    if (workflowTimeoutRef.current) {
      clearTimeout(workflowTimeoutRef.current);
    }

    setWorkflowModal({ open: true, workflow });
    setWorkflowLoading(true);
    setWorkflowResults(null);

    const loadTime = workflow.id === 'wind-risk-hardening' ? 1400 : 800;

    workflowTimeoutRef.current = setTimeout(() => {
      if (workflow.id === 'wind-risk-hardening') {
        setWorkflowResults(generateWindRiskResults());
      } else {
        setWorkflowResults({
          message: 'This workflow preview will be available in a future build. In production, this launches the full analytics run.',
        });
      }
      setWorkflowLoading(false);
      workflowTimeoutRef.current = null;
    }, loadTime);
  };

  const closeWorkflowModal = () => {
    if (workflowTimeoutRef.current) {
      clearTimeout(workflowTimeoutRef.current);
      workflowTimeoutRef.current = null;
    }
    setWorkflowModal({ open: false, workflow: null });
    setWorkflowLoading(false);
    setWorkflowResults(null);
  };

  const renderWindWorkflowContent = () => {
    if (!workflowResults) return null;

    const { sustainedWind, peakGust, poles, riskMatrix, stats, secondDegreeImpacts } = workflowResults;
    const summaryCards = [
      {
        label: 'Sustained Winds',
        value: `${sustainedWind.toFixed(1)} mph`,
        sublabel: '12-hour forecast window',
      },
      {
        label: 'Peak Gusts',
        value: `${peakGust.toFixed(1)} mph`,
        sublabel: 'NOAA warning zone',
      },
      {
        label: 'Avg Failure Probability',
        value: `${(stats.avgFailureProbability * 100).toFixed(1)}%`,
        sublabel: 'Across monitored spans',
      },
      {
        label: 'Customers at Risk',
        value: stats.totalCustomers.toLocaleString(),
        sublabel: `${stats.circuitsImpacted} circuits impacted`,
      },
    ];

    const matrixCells = [
      {
        label: 'High Impact / High Probability',
        value: riskMatrix.highImpactHighProbability,
        tone: 'danger',
        guidance: 'Immediate field response required',
      },
      {
        label: 'High Impact / Low Probability',
        value: riskMatrix.highImpactLowProbability,
        tone: 'warn',
        guidance: 'Pre-stage crews and monitoring',
      },
      {
        label: 'Low Impact / High Probability',
        value: riskMatrix.lowImpactHighProbability,
        tone: 'info',
        guidance: 'Bundle into patrol routes',
      },
      {
        label: 'Low Impact / Low Probability',
        value: riskMatrix.lowImpactLowProbability,
        tone: 'good',
        guidance: 'Monitor via SCADA only',
      },
    ];

    const toneStyles = {
      danger: 'border-red-200 bg-red-50 text-red-700',
      warn: 'border-amber-200 bg-amber-50 text-amber-700',
      info: 'border-blue-200 bg-blue-50 text-blue-700',
      good: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };

    const insightList = [
      `${stats.highRiskCount} poles flagged in the urgent queue (risk score ≥ 85).`,
      `Average failure probability of ${(stats.avgFailureProbability * 100).toFixed(1)}% across ${stats.circuitsImpacted} feeder circuits.`,
      `Peak gusts exceed sustained limits by ${((peakGust / sustainedWind - 1) * 100).toFixed(1)}%, escalating crossarm and hardware fatigue risk.`,
    ];

    return (
      <>
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Wind Conditions Overview</h3>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            {summaryCards.map((card) => (
              <div key={card.label} className="border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">{card.label}</div>
                <div className="text-lg font-semibold text-slate-900 mt-1">{card.value}</div>
                <div className="text-[11px] text-slate-500 mt-1">{card.sublabel}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">2 × 2 Risk Matrix</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {matrixCells.map((cell) => (
                <div
                  key={cell.label}
                  className={`border p-4 h-full ${toneStyles[cell.tone]}`}
                >
                  <div className="text-xs font-semibold uppercase tracking-wide">{cell.label}</div>
                  <div className="text-2xl font-bold mt-2">{cell.value}</div>
                  <div className="text-[11px] mt-2 leading-snug">{cell.guidance}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Key Observations</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
              {insightList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Pole-Level Detail ({poles.length})</h3>
          <div className="mt-3 overflow-x-auto border border-slate-200">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Pole ID</th>
                  <th className="px-3 py-2 text-left font-semibold">Circuit</th>
                  <th className="px-3 py-2 text-right font-semibold">Failure Prob.</th>
                  <th className="px-3 py-2 text-right font-semibold">Risk Score</th>
                  <th className="px-3 py-2 text-right font-semibold">Customers</th>
                  <th className="px-3 py-2 text-right font-semibold">Span (ft)</th>
                  <th className="px-3 py-2 text-left font-semibold">Location</th>
                </tr>
              </thead>
              <tbody>
                {poles.map((pole) => (
                  <tr key={pole.id} className="odd:bg-white even:bg-slate-50/60">
                    <td className="px-3 py-2 font-semibold text-slate-900">{pole.id}</td>
                    <td className="px-3 py-2 text-slate-700">{pole.circuit}</td>
                    <td className="px-3 py-2 text-right text-slate-900">{(pole.failureProbability * 100).toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right text-slate-900">{pole.riskScore}</td>
                    <td className="px-3 py-2 text-right text-slate-700">{pole.customersImpacted}</td>
                    <td className="px-3 py-2 text-right text-slate-700">{pole.spanLength}</td>
                    <td className="px-3 py-2 text-slate-600">{pole.lat}, {pole.lng}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Potential 2nd Degree Impacts</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
            {secondDegreeImpacts.map((impact, idx) => (
              <li key={idx}>{impact}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <FileText className="w-4 h-4" />
              Export CSV
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Download className="w-4 h-4" />
              Download PDF Summary
            </button>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ea580b] text-white text-xs font-semibold hover:bg-[#dc4a05]"
          >
            <Share2 className="w-4 h-4" />
            Share analysis
          </button>
        </div>
      </>
    );
  };

  const handleAddPublicData = () => {
    setShowContextMenu(false);
    setShowPublicDataModal(true);
    setSelectedPublicData([]);
  };

  const handleBuyPrivateData = () => {
    setShowContextMenu(false);
    setShowPrivateDataModal(true);
    setSelectedPrivateData([]);
  };

  const handleShowDetails = () => {
    setShowContextMenu(false);
    setShowDetailsPanel(true);
  };

  const togglePublicDataSelection = (dataId) => {
    setSelectedPublicData((prev) =>
      prev.includes(dataId) ? prev.filter((id) => id !== dataId) : [...prev, dataId],
    );
  };

  const togglePrivateDataSelection = (dataId) => {
    setSelectedPrivateData((prev) =>
      prev.includes(dataId) ? prev.filter((id) => id !== dataId) : [...prev, dataId],
    );
  };

  const attachPublicData = async () => {
    setIsLoading(true);
    setLoadingMessage('Spatially joining public data sources...');
    setShowPublicDataModal(false);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoadingMessage('Processing geospatial data...');

    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoadingMessage('Finalizing data attachment...');

    await new Promise((resolve) => setTimeout(resolve, 600));

    const newData = PUBLIC_DATA_SOURCES.filter((d) => selectedPublicData.includes(d.id)).map((d) => ({
      ...d,
      type: 'public',
      attachedAt: new Date(),
    }));
    setAttachedData((prev) => {
      const merged = new Map(prev.map((item) => [item.id, item]));
      newData.forEach((item) => merged.set(item.id, item));
      return Array.from(merged.values());
    });
    updateMockDataRows(newData);

    setIsLoading(false);
    setShowDetailsPanel(true);
  };

  const attachPrivateData = async () => {
    setIsLoading(true);
    setLoadingMessage('Processing payment...');
    setShowPrivateDataModal(false);

    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoadingMessage('Downloading private datasets...');

    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoadingMessage('Spatially joining data to feeder...');

    await new Promise((resolve) => setTimeout(resolve, 600));

    const newData = PRIVATE_DATA_SOURCES.filter((d) => selectedPrivateData.includes(d.id)).map((d) => ({
      ...d,
      type: 'private',
      attachedAt: new Date(),
    }));
    setAttachedData((prev) => {
      const merged = new Map(prev.map((item) => [item.id, item]));
      newData.forEach((item) => merged.set(item.id, item));
      return Array.from(merged.values());
    });
    updateMockDataRows(newData);

    setIsLoading(false);
    setShowDetailsPanel(true);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setLoadingMessage('Reading feeder file...');

    try {
      const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
      let geojson;

      if (extension === 'geojson' || extension === 'json') {
        const text = await file.text();
        geojson = JSON.parse(text);
      } else if (extension === 'zip' || extension === 'shp') {
        setLoadingMessage('Extracting shapefile data...');
        const arrayBuffer = await file.arrayBuffer();
        const shpModule = await import('shpjs');
        const shpParser = shpModule.default ?? shpModule;
        geojson = await shpParser(arrayBuffer);
      } else {
        throw new Error('Unsupported file type');
      }

      setLoadingMessage('Preparing feeder geometries...');
      await new Promise((resolve) => setTimeout(resolve, 400));

      const normalised = normaliseFeederGeoJSON(geojson, file.name);

      if (!normalised.features.length) {
        throw new Error('No line features were detected in the uploaded file.');
      }

      setFeederData((prev) => ({
        type: 'FeatureCollection',
        features: [...prev.features, ...normalised.features],
      }));

      setLoadingMessage('Rendering feeders on map...');
      await new Promise((resolve) => setTimeout(resolve, 400));

      const firstCoordinate = normalised.features[0]?.geometry?.coordinates?.[0];
      if (mapInstanceRef.current && Array.isArray(firstCoordinate)) {
        mapInstanceRef.current.flyTo({ center: firstCoordinate, zoom: 12, essential: true });
      }
    } catch (error) {
      console.error('Failed to ingest feeder file', error);
      setLoadingMessage('Unable to load feeder file. Please upload a valid shapefile (.zip) or GeoJSON.');
      await new Promise((resolve) => setTimeout(resolve, 1400));
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  const filteredPublicData = PUBLIC_DATA_SOURCES.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredPrivateData = PRIVATE_DATA_SOURCES.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const categories = [...new Set(PUBLIC_DATA_SOURCES.map((d) => d.category))];
  const isWindWorkflow = workflowModal.workflow?.id === 'wind-risk-hardening';
  const feederCount = feederData.features.length;
  const selectedFeederProps = selectedFeeder?.properties ?? selectedFeeder ?? null;
  const selectedFeederId = selectedFeederProps?.id ?? null;
  const formattedSelectedFeederCustomers = (() => {
    const customers = selectedFeederProps?.customers;
    if (typeof customers === 'number') return customers.toLocaleString();
    if (typeof customers === 'string') return customers;
    return 'Unknown';
  })();

  // Debug logging for context menu state
  console.log('Component render - showContextMenu:', showContextMenu, 'selectedFeeder:', selectedFeeder);
  
  return (
    <>
      <Header pageTitle="GridSpeed" />
      
      {/* Context Menu - render at top level to avoid overflow issues */}
      {showContextMenu && selectedFeeder && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              console.log('Backdrop clicked, closing menu');
              setShowContextMenu(false);
            }}
          />
          <div
            className="fixed z-50 bg-white shadow-xl border border-slate-200 py-2 min-w-[240px]"
            style={{
              left: `${contextMenuPosition.x}px`,
              top: `${contextMenuPosition.y}px`,
              pointerEvents: 'auto'
            }}
          >
            {console.log('Rendering context menu at', contextMenuPosition)}
            <div className="px-4 py-2 border-b border-slate-200 mb-2">
              <div className="font-bold text-sm">{selectedFeederProps?.name ?? 'Selected feeder'}</div>
              <div className="text-xs text-slate-600">
                {selectedFeederProps?.voltage ?? 'Voltage N/A'} • {formattedSelectedFeederCustomers} customers
              </div>
            </div>
            <button
              onClick={handleAddPublicData}
              className="w-full px-4 py-2 text-left hover:bg-slate-100 flex items-center gap-3 text-sm"
            >
              <Plus className="w-4 h-4 text-green-600" />
              Add Public Data
            </button>
            <button
              onClick={handleBuyPrivateData}
              className="w-full px-4 py-2 text-left hover:bg-slate-100 flex items-center gap-3 text-sm"
            >
              <ShoppingCart className="w-4 h-4 text-[#ea580b]" />
              Buy Private Data
            </button>
            <button
              onClick={handleShowDetails}
              className="w-full px-4 py-2 text-left hover:bg-slate-100 flex items-center gap-3 text-sm"
            >
              <Info className="w-4 h-4 text-blue-600" />
              Show Details
            </button>
          </div>
        </>
      )}
      
      <div className="w-full flex flex-col bg-slate-50" style={{ height: 'calc(100vh - 48px)', marginTop: '48px' }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="w-12 h-12 text-[#ea580b] animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Processing</h3>
              <p className="text-sm text-slate-600">{loadingMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Feeder Data Management</h1>
            <p className="text-sm text-slate-600 mt-1">Select a feeder to add or view data sources</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".shp,.zip,.geojson,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-[#ea580b] text-white hover:bg-[#dc4a05] transition-colors text-sm font-semibold"
            >
              <Upload className="w-4 h-4" />
              Upload Feeder
            </button>
            <span className="text-sm text-slate-600">{feederCount} feeder{feederCount === 1 ? '' : 's'} in view</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative overflow-hidden" style={{ minHeight: 0 }}>
        {/* Map Area */}
        <div className="flex-1 relative" style={{ minHeight: 0 }}>
          <div ref={mapContainerRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />

          {/* Legend */}
          <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 p-4 shadow-lg max-w-xs">
            <h3 className="font-bold text-sm mb-2 text-slate-900">Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-blue-600" />
                <span>Distribution Feeder</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-green-600" />
                <span>Uploaded Feeder</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-[#ea580b]" style={{ height: '3px' }} />
                <span>Selected Feeder</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        {showDetailsPanel && selectedFeederProps && (
          <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">{selectedFeederProps.name ?? 'Feeder Overview'}</h2>
                <p className="text-xs text-slate-600">
                  {selectedFeederProps.voltage ?? 'Voltage N/A'} • {formattedSelectedFeederCustomers} customers
                </p>
              </div>
              <button
                onClick={() => setShowDetailsPanel(false)}
                className="p-2 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-sm mb-3 text-slate-900">Attached Data Sources</h3>
                {attachedData.length === 0 ? (
                  <div className="text-sm text-slate-500 py-8 text-center border-2 border-dashed border-slate-200">
                    No data sources attached yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attachedData.map((data, idx) => (
                      <div key={idx} className="border border-slate-200 p-4">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-shrink-0">
                            <DataSourceLogo logo={data.logo} logoType={data.logoType} name={data.name} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-slate-900">{data.name}</div>
                            <div className="text-xs text-slate-600 mt-1 leading-relaxed">{data.description}</div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`text-xs px-2 py-1 ${
                                data.type === 'public'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-[#ea580b] text-white'
                              }`}
                            >
                              {data.type === 'public' ? 'Public' : 'Private'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachedData(data.id)}
                              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                          <span className="text-xs text-slate-500">
                            Attached {new Date(data.attachedAt).toLocaleDateString()}
                          </span>
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
                            View Data
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {mockDataRows.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm mb-3 text-slate-900">Latest Data Snapshot</h3>
                  <div className="overflow-hidden border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 uppercase tracking-wide">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Data Source</th>
                          <th className="px-3 py-2 font-semibold">Metric</th>
                          <th className="px-3 py-2 font-semibold">Value</th>
                          <th className="px-3 py-2 font-semibold">Records Added</th>
                          <th className="px-3 py-2 font-semibold">Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockDataRows.map((row) => (
                          <tr key={row.sourceId} className="odd:bg-white even:bg-slate-50/60">
                            <td className="px-3 py-2 font-semibold text-slate-900">{row.sourceName}</td>
                            <td className="px-3 py-2 text-slate-700">{row.metric}</td>
                            <td className="px-3 py-2 text-slate-900">{row.value}</td>
                            <td className="px-3 py-2 text-slate-700">{row.records}</td>
                            <td className="px-3 py-2 text-slate-500">{row.updatedAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {attachedData.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm mb-3 text-slate-900">Suggested Workflows</h3>
                  {workflowSuggestions.length === 0 ? (
                    <div className="text-sm text-slate-500 py-4 px-4 border border-dashed border-slate-200 bg-slate-50">
                      Attach weather, satellite, or parcel datasets to unlock tailored workflow recommendations.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {workflowSuggestions.map((workflow) => (
                        <button
                          key={workflow.id}
                          type="button"
                          onClick={() => handleWorkflowSelect(workflow)}
                          className="w-full border border-slate-200 p-4 bg-white text-left transition shadow-sm hover:border-[#ea580b] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ea580b]/70"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-[#ea580b] mt-0.5">
                              <Sparkles className="w-4 h-4" />
                            </span>
                            <div className="flex-1 space-y-2">
                              {workflow.triggerLabel && (
                                <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wide text-[#ea580b] bg-orange-50 border border-[#ea580b]/30 px-2 py-0.5">
                                  {workflow.triggerLabel}
                                </span>
                              )}
                              <div>
                                <div className="text-sm font-semibold text-slate-900">{workflow.title}</div>
                                <p className="text-xs text-slate-600 leading-relaxed mt-1">{workflow.description}</p>
                              </div>
                              <span className="inline-flex items-center text-xs font-semibold text-[#ea580b]">
                                Launch workflow →
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleAddPublicData}
                  className="flex-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-semibold"
                >
                  Add Public Data
                </button>
                <button
                  onClick={handleBuyPrivateData}
                  className="flex-1 px-4 py-2 bg-[#ea580b] text-white hover:bg-[#dc4a05] transition-colors text-sm font-semibold"
                >
                  Buy Private Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Public Data Modal */}
      {showPublicDataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-6">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Add Public Data Sources</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Select data sources to spatially join to {selectedFeederProps?.name ?? 'this feeder'}
                </p>
              </div>
              <button onClick={() => setShowPublicDataModal(false)} className="p-2 hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search data sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 focus:outline-none focus:border-[#ea580b]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {categories.map((category) => {
                  const categoryData = filteredPublicData.filter((d) => d.category === category);
                  if (categoryData.length === 0) return null;

                  return (
                    <div key={category}>
                      <h3 className="font-bold text-sm mb-3 text-slate-700">{category}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {categoryData.map((data) => (
                          <button
                            key={data.id}
                            onClick={() => togglePublicDataSelection(data.id)}
                            className={`p-4 border-2 text-left transition-all hover:border-green-600 ${
                              selectedPublicData.includes(data.id)
                                ? 'border-green-600 bg-green-50'
                                : 'border-slate-200'
                            }`}
                          >
                            <div className="flex items-start gap-3 mb-2">
                              <div className="flex-shrink-0">
                                <DataSourceLogo logo={data.logo} logoType={data.logoType} name={data.name} />
                              </div>
                              <div className="flex-1 pr-2">
                                <div className="font-semibold text-sm">{data.name}</div>
                                <div className="text-xs text-slate-600 mt-1">{data.description}</div>
                              </div>
                              {selectedPublicData.includes(data.id) && <Check className="w-5 h-5 text-green-600 flex-shrink-0" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {selectedPublicData.length} source{selectedPublicData.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPublicDataModal(false)}
                  className="px-6 py-2 border-2 border-slate-300 hover:bg-slate-50 transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={attachPublicData}
                  disabled={selectedPublicData.length === 0}
                  className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Attach Selected Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Private Data Modal */}
      {showPrivateDataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-6">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Buy Private Data Sources</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Purchase premium data sources for {selectedFeederProps?.name ?? 'this feeder'}
                </p>
              </div>
              <button onClick={() => setShowPrivateDataModal(false)} className="p-2 hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search private data sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 focus:outline-none focus:border-[#ea580b]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                {filteredPrivateData.map((data) => (
                  <button
                    key={data.id}
                    onClick={() => togglePrivateDataSelection(data.id)}
                    className={`p-4 border-2 text-left transition-all hover:border-[#ea580b] ${
                      selectedPrivateData.includes(data.id)
                        ? 'border-[#ea580b] bg-orange-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-shrink-0">
                        <DataSourceLogo logo={data.logo} logoType={data.logoType} name={data.name} />
                      </div>
                      <div className="flex-1 pr-2">
                        <div className="font-semibold text-sm">{data.name}</div>
                        <div className="text-xs text-slate-600 mt-1">{data.description}</div>
                        <div className="text-sm font-bold text-[#ea580b] mt-2">${data.price}</div>
                      </div>
                      {selectedPrivateData.includes(data.id) && <Check className="w-5 h-5 text-[#ea580b] flex-shrink-0" />}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700">{data.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-slate-600">
                  {selectedPrivateData.length} source{selectedPrivateData.length !== 1 ? 's' : ''} selected
                </span>
                {selectedPrivateData.length > 0 && (
                  <span className="ml-3 font-bold text-[#ea580b]">
                    Total: $
                    {PRIVATE_DATA_SOURCES.filter((d) => selectedPrivateData.includes(d.id)).reduce(
                      (sum, d) => sum + d.price,
                      0,
                    )}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPrivateDataModal(false)}
                  className="px-6 py-2 border-2 border-slate-300 hover:bg-slate-50 transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={attachPrivateData}
                  disabled={selectedPrivateData.length === 0}
                  className="px-6 py-2 bg-[#ea580b] text-white hover:bg-[#dc4a05] transition-colors text-sm font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Purchase & Attach
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {workflowModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {workflowModal.workflow?.title || 'Workflow Analysis'}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {isWindWorkflow
                    ? 'Severe wind event detected – prioritised structural risk assessment for overhead distribution assets.'
                    : 'Review generated insights and recommended next steps for this workflow.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeWorkflowModal}
                className="p-2 hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {workflowLoading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-600">
                  <Loader2 className="w-10 h-10 animate-spin text-[#ea580b]" />
                  <p className="text-sm">Crunching pole-level risk metrics…</p>
                </div>
              ) : workflowResults ? (
                isWindWorkflow ? (
                  renderWindWorkflowContent()
                ) : (
                  <div className="text-sm text-slate-600 leading-relaxed">{workflowResults.message}</div>
                )
              ) : (
                <div className="text-sm text-slate-600">
                  Select a workflow from the Suggested Workflows list to view details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
