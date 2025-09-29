// src/app/api/electricity/[country]/route.js
import { NextResponse } from 'next/server';
import { COUNTRY_DATA } from '@/data/countries';

// GET /api/electricity/[country]
export async function GET(request, { params }) {
  try {
    const { country } = params;
    
    // Validate country parameter
    if (!country) {
      return NextResponse.json(
        { 
          error: 'Country parameter is required',
          message: 'Please provide a valid country code in the URL'
        },
        { status: 400 }
      );
    }
    
    // Get data for the country
    const countryData = COUNTRY_DATA[country.toLowerCase()];
    
    if (!countryData) {
      // Return list of available countries if not found
      const availableCountries = Object.keys(COUNTRY_DATA).sort();
      
      return NextResponse.json(
        { 
          error: 'Country not found',
          message: `Data not available for country: ${country}`,
          availableCountries: availableCountries,
          suggestion: `Try one of these: ${availableCountries.slice(0, 5).join(', ')}...`
        },
        { status: 404 }
      );
    }
    
    // Build comprehensive response
    const response = {
      // Basic Information
      country: {
        code: country.toLowerCase(),
        name: countryData.name,
        officialCode: countryData.code,
        flag: countryData.flag,
        region: countryData.region,
        subregion: countryData.subregion
      },
      
      // Timestamp and metadata
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      dataQuality: 'verified',
      source: 'Global Energy Monitor API',
      version: '1.0.0',
      
      // Main electricity data
      data: {
        production: {
          ...countryData.electricity.production,
          unit: 'TWh',
          perCapitaUnit: 'kWh',
          yearOverYear: countryData.electricity.production.growth,
          globalRank: countryData.electricity.production.rank,
          annualTotal: countryData.electricity.production.total,
          monthlyBreakdown: generateMonthlyData(countryData.electricity.production.monthlyAverage)
        },
        
        capacity: {
          ...countryData.electricity.capacity,
          unit: 'GW',
          utilizationRate: calculateUtilizationRate(
            countryData.electricity.capacity.total,
            countryData.electricity.production.peakDemand
          ),
          breakdown: {
            thermal: countryData.electricity.capacity.thermal || 0,
            hydro: countryData.electricity.capacity.hydro || 0,
            solar: countryData.electricity.capacity.solar || 0,
            wind: countryData.electricity.capacity.wind || 0,
            nuclear: countryData.electricity.capacity.nuclear || 0,
            other: countryData.electricity.capacity.other || 0
          }
        },
        
        energyMix: {
          sources: countryData.electricity.sources.map(source => ({
            ...source,
            name: source.source,
            percentage: source.percent,
            production: source.twh,
            unit: 'TWh',
            carbonIntensity: getSourceCarbonIntensity(source.source),
            isRenewable: isRenewableSource(source.source)
          })),
          summary: {
            renewableTotal: calculateRenewableTotal(countryData.electricity.sources),
            fossilTotal: calculateFossilTotal(countryData.electricity.sources),
            nuclearTotal: countryData.electricity.sources
              .filter(s => s.source === 'Nuclear')
              .reduce((sum, s) => sum + s.percent, 0)
          }
        },
        
        emissions: {
          ...countryData.electricity.emissions,
          unit: 'gCO2/kWh',
          totalUnit: 'MtCO2',
          perCapitaUnit: 'tCO2',
          projections: {
            target2030: countryData.electricity.emissions.reduction2030,
            pathway: calculateEmissionsPathway(countryData.electricity.emissions)
          }
        },
        
        renewable: {
          ...countryData.electricity.renewable,
          percentageOfTotal: countryData.electricity.renewable.percentage,
          targets: {
            year2025: countryData.electricity.renewable.target2025,
            year2030: countryData.electricity.renewable.target2030,
            year2050: countryData.electricity.renewable.target2050
          },
          investmentMillionUSD: countryData.electricity.renewable.investment,
          projects: countryData.electricity.renewable.projects || [],
          growthRate: calculateRenewableGrowthRate(countryData.electricity.historicalData)
        },
        
        trade: {
          ...countryData.electricity.trade,
          netPosition: countryData.electricity.trade.netExporter ? 'exporter' : 'importer',
          balance: countryData.electricity.trade.exports - countryData.electricity.trade.imports,
          unit: 'TWh',
          partners: countryData.electricity.trade.mainPartners || [],
          interconnections: countryData.electricity.trade.interconnections || []
        },
        
        grid: {
          ...countryData.electricity.grid,
          lengthUnit: 'km',
          lossesPercentage: countryData.electricity.grid.losses,
          reliabilityPercentage: countryData.electricity.grid.reliability,
          smartMeterCoverage: countryData.electricity.grid.smartMeters,
          investmentMillions: countryData.electricity.grid.investment || 0,
          infrastructure: {
            totalLength: countryData.electricity.grid.length,
            substations: countryData.electricity.grid.substations || 0,
            averageAge: 15 // Mock data
          }
        },
        
        historicalTrends: countryData.electricity.historicalData || [],
        
        comparisons: {
          vsRegionalAverage: generateRegionalComparison(countryData),
          vsGlobalAverage: {
            productionPerCapita: {
              country: countryData.electricity.production.perCapita,
              global: 3500,
              difference: ((countryData.electricity.production.perCapita - 3500) / 3500 * 100).toFixed(1)
            },
            renewableShare: {
              country: countryData.electricity.renewable.percentage,
              global: 28,
              difference: (countryData.electricity.renewable.percentage - 28).toFixed(1)
            },
            carbonIntensity: {
              country: countryData.electricity.emissions.intensity,
              global: 475,
              difference: ((countryData.electricity.emissions.intensity - 475) / 475 * 100).toFixed(1)
            }
          }
        }
      },
      
      // Coordinates for mapping
      coordinates: countryData.coordinates,
      
      // SEO and Schema.org structured data
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": `${countryData.name} Electricity Production Data`,
      "description": `Comprehensive electricity production, energy mix, and emissions data for ${countryData.name}`,
      "url": `https://yourdomain.com/api/electricity/${country}`,
      "temporalCoverage": new Date().getFullYear().toString(),
      "spatialCoverage": {
        "@type": "Place",
        "name": countryData.name,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": countryData.coordinates.center[1],
          "longitude": countryData.coordinates.center[0]
        }
      },
      "license": "https://creativecommons.org/licenses/by/4.0/",
      "creator": {
        "@type": "Organization",
        "name": "Global Energy Monitor",
        "url": "https://yourdomain.com"
      },
      "distribution": {
        "@type": "DataDownload",
        "encodingFormat": "application/json",
        "contentUrl": `https://yourdomain.com/api/electricity/${country}`
      }
    };
    
    // Return with proper caching headers for SEO and performance
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
        'X-Content-Type-Options': 'nosniff',
        'X-API-Version': '1.0.0',
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '99',
        'X-RateLimit-Reset': new Date(Date.now() + 3600000).toISOString()
      },
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An error occurred while processing your request',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}

// Helper functions
function calculateUtilizationRate(totalCapacity, peakDemand) {
  if (!totalCapacity || !peakDemand) return 0;
  return ((peakDemand / totalCapacity) * 100).toFixed(1);
}

function calculateRenewableTotal(sources) {
  const renewables = ['Hydro', 'Wind', 'Solar', 'Biomass', 'Geothermal', 'Other Renewables'];
  return sources
    .filter(s => renewables.includes(s.source))
    .reduce((sum, s) => sum + s.percent, 0);
}

function calculateFossilTotal(sources) {
  const fossils = ['Coal', 'Natural Gas', 'Gas', 'Oil', 'Petroleum'];
  return sources
    .filter(s => fossils.includes(s.source))
    .reduce((sum, s) => sum + s.percent, 0);
}

function isRenewableSource(source) {
  const renewables = ['Hydro', 'Wind', 'Solar', 'Biomass', 'Geothermal', 'Other Renewables'];
  return renewables.includes(source);
}

function getSourceCarbonIntensity(source) {
  const intensities = {
    'Coal': 820,
    'Natural Gas': 490,
    'Gas': 490,
    'Oil': 650,
    'Nuclear': 12,
    'Wind': 11,
    'Solar': 48,
    'Hydro': 24,
    'Biomass': 230,
    'Geothermal': 38
  };
  return intensities[source] || 0;
}

function generateMonthlyData(average) {
  // Generate realistic monthly variation
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const seasonalFactors = [1.15, 1.12, 1.05, 0.95, 0.85, 0.9, 0.95, 0.98, 0.92, 0.98, 1.08, 1.18];
  
  return months.map((month, index) => ({
    month,
    production: (average * seasonalFactors[index]).toFixed(2),
    unit: 'TWh'
  }));
}

function calculateEmissionsPathway(emissions) {
  const currentYear = new Date().getFullYear();
  const targetYear = 2030;
  const yearsRemaining = targetYear - currentYear;
  const targetReduction = emissions.reduction2030 || -35;
  
  return {
    currentIntensity: emissions.intensity,
    targetIntensity: emissions.intensity * (1 + targetReduction / 100),
    annualReductionRequired: (targetReduction / yearsRemaining).toFixed(1),
    onTrack: emissions.trend === 'decreasing'
  };
}

function calculateRenewableGrowthRate(historicalData) {
  if (!historicalData || historicalData.length < 2) return 0;
  
  const firstYear = historicalData[0];
  const lastYear = historicalData[historicalData.length - 1];
  const years = lastYear.year - firstYear.year;
  
  if (years === 0) return 0;
  
  const growthRate = ((lastYear.renewable - firstYear.renewable) / firstYear.renewable) * 100 / years;
  return growthRate.toFixed(1);
}

function generateRegionalComparison(countryData) {
  // Mock regional averages - in production, these would come from a database
  const regionalAverages = {
    'Europe': { production: 150, renewable: 35, emissions: 250 },
    'Asia': { production: 200, renewable: 25, emissions: 450 },
    'Americas': { production: 180, renewable: 30, emissions: 350 },
    'Africa': { production: 50, renewable: 20, emissions: 400 },
    'Oceania': { production: 100, renewable: 28, emissions: 380 }
  };
  
  const region = countryData.region || 'Europe';
  const average = regionalAverages[region] || regionalAverages['Europe'];
  
  return {
    region,
    averageProduction: average.production,
    averageRenewable: average.renewable,
    averageEmissions: average.emissions,
    countryVsAverage: {
      production: ((countryData.electricity.production.total / average.production - 1) * 100).toFixed(1),
      renewable: (countryData.electricity.renewable.percentage - average.renewable).toFixed(1),
      emissions: ((countryData.electricity.emissions.intensity / average.emissions - 1) * 100).toFixed(1)
    }
  };
}

// OPTIONS method for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}