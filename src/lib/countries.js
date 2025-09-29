// lib/countries.js

// This is our mock database. In a real app, this would come from a CMS or a dedicated energy data API.
const countriesData = [
  {
    countryCode: 'in',
    name: 'India',
    seo: {
      title: 'India Energy Profile 2025: Usage, Emissions & Forecast',
      description: 'In-depth analysis of India\'s energy sector in 2025. View live usage breakdown, carbon emissions time series, market data, and download historical reports.',
    },
    content: {
      // Main page heading
      heading: 'Energy Profile: India - 2025',
      // High-level summary dashboard
      keyMetrics: {
        totalGeneration: '1,850 TWh',
        peakDemand: '240 GW',
        renewablesShare: '42.5%', // (Solar, Wind, Hydro, etc.)
        carbonIntensity: '550 gCO2eq/kWh',
        gridFrequency: '49.98 Hz'
      },
      // Data for the live breakdown chart
      liveEnergyMix: {
        title: 'Current Generation Mix',
        timestamp: '2025-09-26T12:45:00+05:30',
        sources: [
          { name: 'Coal', percentage: 48.2 },
          { name: 'Solar', percentage: 18.5 },
          { name: 'Wind', percentage: 11.3 },
          { name: 'Hydro', percentage: 9.8 },
          { name: 'Natural Gas', percentage: 6.2 },
          { name: 'Nuclear', percentage: 4.1 },
          { name: 'Other', percentage: 1.9 },
        ]
      },
      // Data for the 2025 time series charts
      timeSeries2025: {
        energyBreakdown: {
          title: 'Monthly Energy Generation Mix (TWh)',
          // Data points for a stacked area chart
          data: [ /* Array of objects: { month: 'Jan', coal: 80, solar: 20, ... } */ ]
        },
        carbonEmissions: {
          title: 'Monthly Carbon Emissions (Million Tonnes CO2eq)',
          // Data points for a line or bar chart
          data: [ /* Array of objects: { month: 'Jan', emissions: 150 } */ ]
        }
      },
      // Data for the forecast section
      forecast: {
        title: 'Future Outlook & Projections to 2030',
        summary: 'India is projected to see significant growth in renewable capacity, aiming for 500 GW by 2030. Demand is expected to rise by 5-6% annually, driven by industrial and residential growth.',
        projections: [
          { metric: 'Projected Peak Demand (2030)', value: '350 GW' },
          { metric: 'Target Renewables Share (2030)', value: '65%' },
          { metric: 'Projected Carbon Intensity (2030)', value: '380 gCO2eq/kWh' },
        ]
      },
      // In-depth data for professionals
      marketAndGridData: {
          title: 'In-Depth Market & Grid Data',
          data: [
            { metric: 'Avg. Wholesale Price (Day-Ahead Market)', value: '₹3.50 / kWh' },
            { metric: 'Transmission & Distribution (T&D) Losses', value: '18.2%' },
            { metric: 'Net Energy Imports/Exports', value: '-5.2 TWh (Net Importer)' },
            { metric: 'Installed Generation Capacity', value: '480 GW' },
          ]
      },
      // Links for historical data downloads
      historicalData: {
        title: 'Download Historical Data Archives',
        files: [
          { year: 2024, url: '/downloads/india-energy-data-2024.csv', format: 'CSV', size: '15 MB' },
          { year: 2023, url: '/downloads/india-energy-data-2023.csv', format: 'CSV', size: '14.5 MB' },
          { year: 2022, url: '/downloads/india-energy-data-2022.csv', format: 'CSV', size: '14.2 MB' },
        ]
      }
    },
  },
  // ... add other countries with the same rich data structure
];

// ... (keep the helper functions: getAllCountryCodes, getCountryData, getAllCountries)
export function getAllCountryCodes() { /* ... */ }
export function getCountryData(countryCode) { /* ... */ }
export function getAllCountries() { /* ... */ }