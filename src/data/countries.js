// src/data/countries.js
// Complete country data for electricity production, energy mix, and emissions

export const COUNTRY_DATA = {
  'azerbaijan': {
    name: 'Azerbaijan',
    code: 'AZ',
    flag: '🇦🇿',
    region: 'Asia',
    subregion: 'Western Asia',
    population: 10139177,
    area: 86600,
    capital: 'Baku',
    coordinates: { center: [47.5769, 40.1431], zoom: 7 },
    electricity: {
      production: {
        total: 27.3,
        perCapita: 2690,
        growth: '+2.1%',
        rank: 87,
        monthlyAverage: 2.275,
        peakDemand: 4.2
      },
      capacity: {
        total: 7.8,
        thermal: 6.4,
        hydro: 1.1,
        solar: 0.2,
        wind: 0.1,
        nuclear: 0,
        other: 0
      },
      sources: [
        { source: 'Natural Gas', percent: 93.2, color: 'bg-gray-500', twh: 25.4 },
        { source: 'Hydro', percent: 5.8, color: 'bg-blue-500', twh: 1.6 },
        { source: 'Oil', percent: 0.7, color: 'bg-gray-800', twh: 0.2 },
        { source: 'Solar', percent: 0.2, color: 'bg-yellow-500', twh: 0.05 },
        { source: 'Wind', percent: 0.1, color: 'bg-cyan-500', twh: 0.03 }
      ],
      emissions: {
        total: 32.7,
        intensity: 410,
        trend: 'stable',
        perCapita: 3.2,
        reduction2030: -35,
        historicalPeak: 45.2
      },
      trade: {
        exports: 1.5,
        imports: 0.1,
        netExporter: true,
        mainPartners: ['Russia', 'Georgia', 'Iran', 'Turkey'],
        interconnections: [
          { country: 'Russia', capacity: 500, utilized: 78 },
          { country: 'Georgia', capacity: 700, utilized: 65 },
          { country: 'Iran', capacity: 600, utilized: 45 }
        ]
      },
      renewable: {
        percentage: 6.1,
        target2025: 20,
        target2030: 30,
        target2050: 70,
        investment: 245,
        projects: [
          { name: 'Khizi Wind Farm', capacity: 240, type: 'wind', status: 'operational' },
          { name: 'Garadagh Solar', capacity: 230, type: 'solar', status: 'construction' }
        ]
      },
      grid: {
        losses: 11.2,
        reliability: 99.2,
        smartMeters: 15,
        length: 6821,
        substations: 145,
        investment: 1200
      },
      historicalData: [
        { year: 2020, production: 24.8, renewable: 5.2, emissions: 390 },
        { year: 2021, production: 25.4, renewable: 5.5, emissions: 395 },
        { year: 2022, production: 26.2, renewable: 5.8, emissions: 400 },
        { year: 2023, production: 26.7, renewable: 6.0, emissions: 405 },
        { year: 2024, production: 27.3, renewable: 6.1, emissions: 410 }
      ]
    }
  },
  
  'germany': {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    region: 'Europe',
    subregion: 'Western Europe',
    population: 83190556,
    area: 357022,
    capital: 'Berlin',
    coordinates: { center: [10.4515, 51.1657], zoom: 5.5 },
    electricity: {
      production: {
        total: 580,
        perCapita: 6980,
        growth: '-1.2%',
        rank: 7,
        monthlyAverage: 48.3,
        peakDemand: 82.5
      },
      capacity: {
        total: 245,
        thermal: 85,
        hydro: 14,
        solar: 70,
        wind: 66,
        nuclear: 8,
        other: 2
      },
      sources: [
        { source: 'Coal', percent: 28, color: 'bg-gray-800', twh: 162.4 },
        { source: 'Wind', percent: 22, color: 'bg-cyan-500', twh: 127.6 },
        { source: 'Natural Gas', percent: 15, color: 'bg-gray-500', twh: 87 },
        { source: 'Nuclear', percent: 12, color: 'bg-purple-500', twh: 69.6 },
        { source: 'Solar', percent: 10, color: 'bg-yellow-500', twh: 58 },
        { source: 'Biomass', percent: 8, color: 'bg-green-600', twh: 46.4 },
        { source: 'Hydro', percent: 5, color: 'bg-blue-500', twh: 29 }
      ],
      emissions: {
        total: 220,
        intensity: 385,
        trend: 'decreasing',
        perCapita: 2.6,
        reduction2030: -65,
        historicalPeak: 380
      },
      renewable: {
        percentage: 45,
        target2025: 55,
        target2030: 65,
        target2050: 100,
        investment: 8900,
        projects: [
          { name: 'Baltic Eagle Offshore', capacity: 476, type: 'wind', status: 'construction' },
          { name: 'Weesow-Willmersdorf Solar', capacity: 187, type: 'solar', status: 'operational' }
        ]
      },
      trade: {
        exports: 25,
        imports: 28,
        netExporter: false,
        mainPartners: ['France', 'Austria', 'Netherlands', 'Poland', 'Czech Republic', 'Switzerland'],
        interconnections: [
          { country: 'France', capacity: 2800, utilized: 65 },
          { country: 'Austria', capacity: 4900, utilized: 58 },
          { country: 'Netherlands', capacity: 3850, utilized: 72 },
          { country: 'Poland', capacity: 2600, utilized: 45 }
        ]
      },
      grid: {
        losses: 5.2,
        reliability: 99.8,
        smartMeters: 45,
        length: 35000,
        substations: 580,
        investment: 15000
      },
      historicalData: [
        { year: 2020, production: 573, renewable: 45, emissions: 365 },
        { year: 2021, production: 582, renewable: 42, emissions: 385 },
        { year: 2022, production: 577, renewable: 44, emissions: 390 },
        { year: 2023, production: 575, renewable: 46, emissions: 387 },
        { year: 2024, production: 580, renewable: 45, emissions: 385 }
      ]
    }
  },
  
  'france': {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    region: 'Europe',
    subregion: 'Western Europe',
    population: 67391582,
    area: 643801,
    capital: 'Paris',
    coordinates: { center: [2.2137, 46.2276], zoom: 5.5 },
    electricity: {
      production: {
        total: 545,
        perCapita: 7980,
        growth: '+0.5%',
        rank: 8,
        monthlyAverage: 45.4,
        peakDemand: 88.5
      },
      capacity: {
        total: 142,
        nuclear: 61.4,
        hydro: 25.5,
        wind: 20.1,
        solar: 15.8,
        gas: 12.5,
        other: 6.7
      },
      sources: [
        { source: 'Nuclear', percent: 65, color: 'bg-purple-500', twh: 354.3 },
        { source: 'Hydro', percent: 13, color: 'bg-blue-500', twh: 70.9 },
        { source: 'Wind', percent: 8, color: 'bg-cyan-500', twh: 43.6 },
        { source: 'Natural Gas', percent: 7, color: 'bg-gray-500', twh: 38.2 },
        { source: 'Solar', percent: 4, color: 'bg-yellow-500', twh: 21.8 },
        { source: 'Biomass', percent: 2, color: 'bg-green-600', twh: 10.9 },
        { source: 'Other', percent: 1, color: 'bg-gray-400', twh: 5.5 }
      ],
      emissions: {
        total: 30,
        intensity: 56,
        trend: 'decreasing',
        perCapita: 0.4,
        reduction2030: -55,
        historicalPeak: 85
      },
      renewable: {
        percentage: 25,
        target2025: 32,
        target2030: 40,
        target2050: 100,
        investment: 5600,
        projects: [
          { name: 'Saint-Nazaire Offshore Wind', capacity: 480, type: 'wind', status: 'operational' },
          { name: 'Cestas Solar Park', capacity: 300, type: 'solar', status: 'operational' }
        ]
      },
      trade: {
        exports: 45,
        imports: 12,
        netExporter: true,
        mainPartners: ['Italy', 'UK', 'Germany', 'Spain', 'Switzerland', 'Belgium'],
        interconnections: [
          { country: 'Italy', capacity: 4250, utilized: 82 },
          { country: 'Spain', capacity: 2800, utilized: 68 },
          { country: 'Germany', capacity: 2800, utilized: 55 },
          { country: 'UK', capacity: 3000, utilized: 75 }
        ]
      },
      grid: {
        losses: 6.5,
        reliability: 99.7,
        smartMeters: 35,
        length: 45000,
        substations: 650,
        investment: 12000
      },
      historicalData: [
        { year: 2020, production: 531, renewable: 23, emissions: 55 },
        { year: 2021, production: 537, renewable: 24, emissions: 57 },
        { year: 2022, production: 530, renewable: 26, emissions: 63 },
        { year: 2023, production: 541, renewable: 25, emissions: 58 },
        { year: 2024, production: 545, renewable: 25, emissions: 56 }
      ]
    }
  },
  
  'united-states': {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    region: 'Americas',
    subregion: 'North America',
    population: 331449281,
    area: 9833517,
    capital: 'Washington D.C.',
    coordinates: { center: [-95.7129, 37.0902], zoom: 3.5 },
    electricity: {
      production: {
        total: 4500,
        perCapita: 13500,
        growth: '+1.8%',
        rank: 2,
        monthlyAverage: 375,
        peakDemand: 740
      },
      capacity: {
        total: 1200,
        gas: 480,
        coal: 210,
        nuclear: 95,
        wind: 145,
        solar: 110,
        hydro: 80,
        other: 80
      },
      sources: [
        { source: 'Natural Gas', percent: 39, color: 'bg-gray-500', twh: 1755 },
        { source: 'Coal', percent: 20, color: 'bg-gray-800', twh: 900 },
        { source: 'Nuclear', percent: 19, color: 'bg-purple-500', twh: 855 },
        { source: 'Wind', percent: 10, color: 'bg-cyan-500', twh: 450 },
        { source: 'Hydro', percent: 6, color: 'bg-blue-500', twh: 270 },
        { source: 'Solar', percent: 4, color: 'bg-yellow-500', twh: 180 },
        { source: 'Other', percent: 2, color: 'bg-gray-400', twh: 90 }
      ],
      emissions: {
        total: 1890,
        intensity: 420,
        trend: 'decreasing',
        perCapita: 5.7,
        reduction2030: -50,
        historicalPeak: 2400
      },
      renewable: {
        percentage: 22,
        target2025: 28,
        target2030: 35,
        target2050: 80,
        investment: 65000,
        projects: [
          { name: 'Vineyard Wind', capacity: 800, type: 'wind', status: 'construction' },
          { name: 'Gemini Solar', capacity: 690, type: 'solar', status: 'operational' }
        ]
      },
      trade: {
        exports: 25,
        imports: 58,
        netExporter: false,
        mainPartners: ['Canada', 'Mexico'],
        interconnections: [
          { country: 'Canada', capacity: 15000, utilized: 65 },
          { country: 'Mexico', capacity: 2600, utilized: 45 }
        ]
      },
      grid: {
        losses: 5.0,
        reliability: 99.5,
        smartMeters: 55,
        length: 450000,
        substations: 7500,
        investment: 85000
      },
      historicalData: [
        { year: 2020, production: 4286, renewable: 20, emissions: 417 },
        { year: 2021, production: 4381, renewable: 21, emissions: 423 },
        { year: 2022, production: 4432, renewable: 22, emissions: 418 },
        { year: 2023, production: 4467, renewable: 22, emissions: 421 },
        { year: 2024, production: 4500, renewable: 22, emissions: 420 }
      ]
    }
  },
  
  'china': {
    name: 'China',
    code: 'CN',
    flag: '🇨🇳',
    region: 'Asia',
    subregion: 'Eastern Asia',
    population: 1439323776,
    area: 9596961,
    capital: 'Beijing',
    coordinates: { center: [104.1954, 35.8617], zoom: 3.5 },
    electricity: {
      production: {
        total: 8500,
        perCapita: 6000,
        growth: '+4.5%',
        rank: 1,
        monthlyAverage: 708,
        peakDemand: 1340
      },
      capacity: {
        total: 2650,
        coal: 1080,
        hydro: 415,
        wind: 365,
        solar: 390,
        nuclear: 56,
        gas: 110,
        other: 234
      },
      sources: [
        { source: 'Coal', percent: 57, color: 'bg-gray-800', twh: 4845 },
        { source: 'Hydro', percent: 15, color: 'bg-blue-500', twh: 1275 },
        { source: 'Wind', percent: 9, color: 'bg-cyan-500', twh: 765 },
        { source: 'Nuclear', percent: 5, color: 'bg-purple-500', twh: 425 },
        { source: 'Solar', percent: 5, color: 'bg-yellow-500', twh: 425 },
        { source: 'Natural Gas', percent: 3, color: 'bg-gray-500', twh: 255 },
        { source: 'Other', percent: 6, color: 'bg-gray-400', twh: 510 }
      ],
      emissions: {
        total: 4590,
        intensity: 540,
        trend: 'stable',
        perCapita: 3.2,
        reduction2030: -40,
        historicalPeak: 4800
      },
      renewable: {
        percentage: 31,
        target2025: 38,
        target2030: 45,
        target2050: 80,
        investment: 180000,
        projects: [
          { name: 'Baihetan Hydro', capacity: 16000, type: 'hydro', status: 'operational' },
          { name: 'Tengger Desert Solar', capacity: 1547, type: 'solar', status: 'operational' }
        ]
      },
      trade: {
        exports: 18,
        imports: 25,
        netExporter: false,
        mainPartners: ['Russia', 'Mongolia', 'Myanmar', 'Laos', 'Vietnam'],
        interconnections: [
          { country: 'Russia', capacity: 3150, utilized: 55 },
          { country: 'Mongolia', capacity: 450, utilized: 78 },
          { country: 'Myanmar', capacity: 600, utilized: 62 }
        ]
      },
      grid: {
        losses: 5.5,
        reliability: 99.6,
        smartMeters: 72,
        length: 1500000,
        substations: 25000,
        investment: 150000
      },
      historicalData: [
        { year: 2020, production: 7624, renewable: 28, emissions: 535 },
        { year: 2021, production: 8134, renewable: 29, emissions: 540 },
        { year: 2022, production: 8168, renewable: 30, emissions: 545 },
        { year: 2023, production: 8324, renewable: 31, emissions: 542 },
        { year: 2024, production: 8500, renewable: 31, emissions: 540 }
      ]
    }
  },
  
  'india': {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    region: 'Asia',
    subregion: 'Southern Asia',
    population: 1380004385,
    area: 3287263,
    capital: 'New Delhi',
    coordinates: { center: [78.9629, 20.5937], zoom: 4 },
    electricity: {
      production: {
        total: 1800,
        perCapita: 1300,
        growth: '+5.2%',
        rank: 3,
        monthlyAverage: 150,
        peakDemand: 240
      },
      capacity: {
        total: 440,
        coal: 210,
        hydro: 51,
        solar: 75,
        wind: 45,
        nuclear: 7,
        gas: 25,
        other: 27
      },
      sources: [
        { source: 'Coal', percent: 72, color: 'bg-gray-800', twh: 1296 },
        { source: 'Hydro', percent: 10, color: 'bg-blue-500', twh: 180 },
        { source: 'Solar', percent: 5, color: 'bg-yellow-500', twh: 90 },
        { source: 'Wind', percent: 5, color: 'bg-cyan-500', twh: 90 },
        { source: 'Natural Gas', percent: 3, color: 'bg-gray-500', twh: 54 },
        { source: 'Nuclear', percent: 3, color: 'bg-purple-500', twh: 54 },
        { source: 'Other', percent: 2, color: 'bg-gray-400', twh: 36 }
      ],
      emissions: {
        total: 1296,
        intensity: 720,
        trend: 'increasing',
        perCapita: 0.9,
        reduction2030: -33,
        historicalPeak: 1300
      },
      renewable: {
        percentage: 23,
        target2025: 30,
        target2030: 50,
        target2050: 80,
        investment: 15000,
        projects: [
          { name: 'Bhadla Solar Park', capacity: 2245, type: 'solar', status: 'operational' },
          { name: 'Kutch Wind Project', capacity: 1500, type: 'wind', status: 'construction' }
        ]
      },
      trade: {
        exports: 7.2,
        imports: 5.8,
        netExporter: true,
        mainPartners: ['Bangladesh', 'Nepal', 'Bhutan', 'Myanmar'],
        interconnections: [
          { country: 'Bhutan', capacity: 2136, utilized: 85 },
          { country: 'Bangladesh', capacity: 1160, utilized: 72 },
          { country: 'Nepal', capacity: 487, utilized: 65 }
        ]
      },
      grid: {
        losses: 20.5,
        reliability: 98.5,
        smartMeters: 8,
        length: 425000,
        substations: 8500,
        investment: 25000
      },
      historicalData: [
        { year: 2020, production: 1561, renewable: 21, emissions: 705 },
        { year: 2021, production: 1630, renewable: 22, emissions: 710 },
        { year: 2022, production: 1703, renewable: 22, emissions: 715 },
        { year: 2023, production: 1750, renewable: 23, emissions: 718 },
        { year: 2024, production: 1800, renewable: 23, emissions: 720 }
      ]
    }
  },
  
  'japan': {
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    region: 'Asia',
    subregion: 'Eastern Asia',
    population: 126476461,
    area: 377975,
    capital: 'Tokyo',
    coordinates: { center: [138.2529, 36.2048], zoom: 5 },
    electricity: {
      production: {
        total: 1050,
        perCapita: 8300,
        growth: '-0.5%',
        rank: 5,
        monthlyAverage: 87.5,
        peakDemand: 159
      },
      capacity: {
        total: 295,
        gas: 72,
        coal: 43,
        hydro: 49,
        nuclear: 33,
        solar: 75,
        wind: 7,
        other: 16
      },
      sources: [
        { source: 'Natural Gas', percent: 37, color: 'bg-gray-500', twh: 388.5 },
        { source: 'Coal', percent: 31, color: 'bg-gray-800', twh: 325.5 },
        { source: 'Hydro', percent: 8, color: 'bg-blue-500', twh: 84 },
        { source: 'Nuclear', percent: 7, color: 'bg-purple-500', twh: 73.5 },
        { source: 'Solar', percent: 9, color: 'bg-yellow-500', twh: 94.5 },
        { source: 'Wind', percent: 1, color: 'bg-cyan-500', twh: 10.5 },
        { source: 'Other', percent: 7, color: 'bg-gray-400', twh: 73.5 }
      ],
      emissions: {
        total: 465,
        intensity: 443,
        trend: 'decreasing',
        perCapita: 3.7,
        reduction2030: -46,
        historicalPeak: 550
      },
      renewable: {
        percentage: 22,
        target2025: 28,
        target2030: 38,
        target2050: 100,
        investment: 23000,
        projects: [
          { name: 'Akita Offshore Wind', capacity: 140, type: 'wind', status: 'construction' },
          { name: 'Setouchi Mega Solar', capacity: 235, type: 'solar', status: 'operational' }
        ]
      },
      trade: {
        exports: 0,
        imports: 0,
        netExporter: false,
        mainPartners: [],
        interconnections: []
      },
      grid: {
        losses: 4.5,
        reliability: 99.9,
        smartMeters: 85,
        length: 170000,
        substations: 3500,
        investment: 35000
      },
      historicalData: [
        { year: 2020, production: 1036, renewable: 20, emissions: 450 },
        { year: 2021, production: 1042, renewable: 21, emissions: 447 },
        { year: 2022, production: 1048, renewable: 21, emissions: 445 },
        { year: 2023, production: 1046, renewable: 22, emissions: 444 },
        { year: 2024, production: 1050, renewable: 22, emissions: 443 }
      ]
    }
  },
  
  'united-kingdom': {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    region: 'Europe',
    subregion: 'Northern Europe',
    population: 67886011,
    area: 242495,
    capital: 'London',
    coordinates: { center: [-3.4360, 55.3781], zoom: 5 },
    electricity: {
      production: {
        total: 325,
        perCapita: 4780,
        growth: '-2.1%',
        rank: 12,
        monthlyAverage: 27.1,
        peakDemand: 58
      },
      capacity: {
        total: 108,
        gas: 35,
        wind: 28,
        nuclear: 8,
        solar: 14,
        biomass: 8,
        hydro: 4,
        coal: 6,
        other: 5
      },
      sources: [
        { source: 'Natural Gas', percent: 38, color: 'bg-gray-500', twh: 123.5 },
        { source: 'Wind', percent: 26, color: 'bg-cyan-500', twh: 84.5 },
        { source: 'Nuclear', percent: 15, color: 'bg-purple-500', twh: 48.8 },
        { source: 'Biomass', percent: 8, color: 'bg-green-600', twh: 26 },
        { source: 'Solar', percent: 4, color: 'bg-yellow-500', twh: 13 },
        { source: 'Hydro', percent: 2, color: 'bg-blue-500', twh: 6.5 },
        { source: 'Coal', percent: 2, color: 'bg-gray-800', twh: 6.5 },
        { source: 'Other', percent: 5, color: 'bg-gray-400', twh: 16.3 }
      ],
      emissions: {
        total: 76,
        intensity: 233,
        trend: 'decreasing',
        perCapita: 1.1,
        reduction2030: -68,
        historicalPeak: 180
      },
      renewable: {
        percentage: 43,
        target2025: 50,
        target2030: 65,
        target2050: 100,
        investment: 18000,
        projects: [
          { name: 'Dogger Bank Wind', capacity: 3600, type: 'wind', status: 'construction' },
          { name: 'Hornsea 2', capacity: 1320, type: 'wind', status: 'operational' }
        ]
      },
      trade: {
        exports: 2.3,
        imports: 24.5,
        netExporter: false,
        mainPartners: ['France', 'Netherlands', 'Ireland', 'Belgium', 'Norway'],
        interconnections: [
          { country: 'France', capacity: 3000, utilized: 82 },
          { country: 'Netherlands', capacity: 1000, utilized: 75 },
          { country: 'Belgium', capacity: 1000, utilized: 68 },
          { country: 'Norway', capacity: 1400, utilized: 72 }
        ]
      },
      grid: {
        losses: 7.8,
        reliability: 99.7,
        smartMeters: 53,
        length: 85000,
        substations: 1200,
        investment: 15000
      },
      historicalData: [
        { year: 2020, production: 330, renewable: 42, emissions: 230 },
        { year: 2021, production: 332, renewable: 41, emissions: 235 },
        { year: 2022, production: 328, renewable: 42, emissions: 238 },
        { year: 2023, production: 326, renewable: 43, emissions: 235 },
        { year: 2024, production: 325, renewable: 43, emissions: 233 }
      ]
    }
  },
  
  'brazil': {
    name: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    region: 'Americas',
    subregion: 'South America',
    population: 212559417,
    area: 8514877,
    capital: 'Brasília',
    coordinates: { center: [-51.9253, -14.2350], zoom: 3.5 },
    electricity: {
      production: {
        total: 650,
        perCapita: 3050,
        growth: '+3.2%',
        rank: 9,
        monthlyAverage: 54.2,
        peakDemand: 95
      },
      capacity: {
        total: 195,
        hydro: 109,
        wind: 23,
        solar: 16,
        gas: 25,
        biomass: 15,
        nuclear: 2,
        coal: 3,
        other: 2
      },
      sources: [
        { source: 'Hydro', percent: 62, color: 'bg-blue-500', twh: 403 },
        { source: 'Wind', percent: 12, color: 'bg-cyan-500', twh: 78 },
        { source: 'Natural Gas', percent: 8, color: 'bg-gray-500', twh: 52 },
        { source: 'Biomass', percent: 8, color: 'bg-green-600', twh: 52 },
        { source: 'Solar', percent: 3, color: 'bg-yellow-500', twh: 19.5 },
        { source: 'Nuclear', percent: 2, color: 'bg-purple-500', twh: 13 },
        { source: 'Coal', percent: 3, color: 'bg-gray-800', twh: 19.5 },
        { source: 'Other', percent: 2, color: 'bg-gray-400', twh: 13 }
      ],
      emissions: {
        total: 85,
        intensity: 131,
        trend: 'stable',
        perCapita: 0.4,
        reduction2030: -50,
        historicalPeak: 120
      },
      renewable: {
        percentage: 85,
        target2025: 88,
        target2030: 90,
        target2050: 100,
        investment: 12000,
        projects: [
          { name: 'Belo Monte Hydro', capacity: 11233, type: 'hydro', status: 'operational' },
          { name: 'Lagoa dos Ventos Wind', capacity: 1100, type: 'wind', status: 'construction' }
        ]
      },
      trade: {
        exports: 0.5,
        imports: 35,
        netExporter: false,
        mainPartners: ['Argentina', 'Uruguay', 'Paraguay', 'Venezuela'],
        interconnections: [
          { country: 'Paraguay', capacity: 14000, utilized: 85 },
          { country: 'Argentina', capacity: 2200, utilized: 45 },
          { country: 'Uruguay', capacity: 570, utilized: 62 }
        ]
      },
      grid: {
        losses: 15.5,
        reliability: 98.9,
        smartMeters: 12,
        length: 145000,
        substations: 2500,
        investment: 8500
      },
      historicalData: [
        { year: 2020, production: 622, renewable: 83, emissions: 132 },
        { year: 2021, production: 631, renewable: 78, emissions: 145 },
        { year: 2022, production: 638, renewable: 82, emissions: 135 },
        { year: 2023, production: 644, renewable: 84, emissions: 133 },
        { year: 2024, production: 650, renewable: 85, emissions: 131 }
      ]
    }
  },
  
  'russia': {
    name: 'Russia',
    code: 'RU',
    flag: '🇷🇺',
    region: 'Europe',
    subregion: 'Eastern Europe',
    population: 145934462,
    area: 17098242,
    capital: 'Moscow',
    coordinates: { center: [105.3188, 61.5240], zoom: 2.5 },
    electricity: {
      production: {
        total: 1150,
        perCapita: 7880,
        growth: '+1.5%',
        rank: 4,
        monthlyAverage: 95.8,
        peakDemand: 165
      },
      capacity: {
        total: 275,
        gas: 118,
        hydro: 55,
        nuclear: 30,
        coal: 48,
        wind: 2,
        solar: 2,
        other: 20
      },
      sources: [
        { source: 'Natural Gas', percent: 47, color: 'bg-gray-500', twh: 540.5 },
        { source: 'Nuclear', percent: 20, color: 'bg-purple-500', twh: 230 },
        { source: 'Hydro', percent: 18, color: 'bg-blue-500', twh: 207 },
        { source: 'Coal', percent: 13, color: 'bg-gray-800', twh: 149.5 },
        { source: 'Wind', percent: 0.5, color: 'bg-cyan-500', twh: 5.8 },
        { source: 'Solar', percent: 0.5, color: 'bg-yellow-500', twh: 5.8 },
        { source: 'Other', percent: 1, color: 'bg-gray-400', twh: 11.5 }
      ],
      emissions: {
        total: 470,
        intensity: 409,
        trend: 'stable',
        perCapita: 3.2,
        reduction2030: -30,
        historicalPeak: 520
      },
      renewable: {
        percentage: 20,
        target2025: 22,
        target2030: 25,
        target2050: 45,
        investment: 3500,
        projects: [
          { name: 'Sayano-Shushenskaya Hydro', capacity: 6400, type: 'hydro', status: 'operational' },
          { name: 'Kola Wind Farm', capacity: 201, type: 'wind', status: 'operational' }
        ]
      },
      trade: {
        exports: 25,
        imports: 5,
        netExporter: true,
        mainPartners: ['Finland', 'Lithuania', 'China', 'Mongolia', 'Kazakhstan', 'Georgia'],
        interconnections: [
          { country: 'Finland', capacity: 1400, utilized: 55 },
          { country: 'China', capacity: 3150, utilized: 48 },
          { country: 'Kazakhstan', capacity: 1850, utilized: 62 }
        ]
      },
      grid: {
        losses: 10.5,
        reliability: 99.3,
        smartMeters: 8,
        length: 2500000,
        substations: 15000,
        investment: 12000
      },
      historicalData: [
        { year: 2020, production: 1090, renewable: 19, emissions: 408 },
        { year: 2021, production: 1115, renewable: 19, emissions: 410 },
        { year: 2022, production: 1130, renewable: 20, emissions: 409 },
        { year: 2023, production: 1140, renewable: 20, emissions: 409 },
        { year: 2024, production: 1150, renewable: 20, emissions: 409 }
      ]
    }
  },
  
  'canada': {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    region: 'Americas',
    subregion: 'North America',
    population: 37742154,
    area: 9984670,
    capital: 'Ottawa',
    coordinates: { center: [-106.3468, 56.1304], zoom: 3 },
    electricity: {
      production: {
        total: 640,
        perCapita: 16950,
        growth: '+0.8%',
        rank: 10,
        monthlyAverage: 53.3,
        peakDemand: 138
      },
      capacity: {
        total: 152,
        hydro: 82,
        nuclear: 14,
        gas: 22,
        wind: 14,
        coal: 7,
        solar: 4,
        other: 9
      },
      sources: [
        { source: 'Hydro', percent: 60, color: 'bg-blue-500', twh: 384 },
        { source: 'Nuclear', percent: 15, color: 'bg-purple-500', twh: 96 },
        { source: 'Natural Gas', percent: 11, color: 'bg-gray-500', twh: 70.4 },
        { source: 'Wind', percent: 6, color: 'bg-cyan-500', twh: 38.4 },
        { source: 'Coal', percent: 5, color: 'bg-gray-800', twh: 32 },
        { source: 'Solar', percent: 1, color: 'bg-yellow-500', twh: 6.4 },
        { source: 'Other', percent: 2, color: 'bg-gray-400', twh: 12.8 }
      ],
      emissions: {
        total: 119,
        intensity: 186,
        trend: 'decreasing',
        perCapita: 3.2,
        reduction2030: -40,
        historicalPeak: 150
      },
      renewable: {
        percentage: 68,
        target2025: 72,
        target2030: 75,
        target2050: 90,
        investment: 15000,
        projects: [
          { name: 'Site C Hydro', capacity: 1100, type: 'hydro', status: 'construction' },
          { name: 'Saint-Lawrence Wind', capacity: 350, type: 'wind', status: 'operational' }
        ]
      },
      trade: {
        exports: 68,
        imports: 12,
        netExporter: true,
        mainPartners: ['United States'],
        interconnections: [
          { country: 'United States', capacity: 15000, utilized: 72 }
        ]
      },
      grid: {
        losses: 7.2,
        reliability: 99.7,
        smartMeters: 82,
        length: 160000,
        substations: 2200,
        investment: 20000
      },
      historicalData: [
        { year: 2020, production: 632, renewable: 67, emissions: 188 },
        { year: 2021, production: 635, renewable: 67, emissions: 187 },
        { year: 2022, production: 637, renewable: 68, emissions: 186 },
        { year: 2023, production: 638, renewable: 68, emissions: 186 },
        { year: 2024, production: 640, renewable: 68, emissions: 186 }
      ]
    }
  },
  
  'australia': {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    region: 'Oceania',
    subregion: 'Australia and New Zealand',
    population: 25499884,
    area: 7692024,
    capital: 'Canberra',
    coordinates: { center: [133.7751, -25.2744], zoom: 3.5 },
    electricity: {
      production: {
        total: 265,
        perCapita: 10400,
        growth: '+2.5%',
        rank: 18,
        monthlyAverage: 22.1,
        peakDemand: 35
      },
      capacity: {
        total: 82,
        coal: 23,
        gas: 20,
        solar: 19,
        wind: 10,
        hydro: 8,
        other: 2
      },
      sources: [
        { source: 'Coal', percent: 54, color: 'bg-gray-800', twh: 143.1 },
        { source: 'Natural Gas', percent: 19, color: 'bg-gray-500', twh: 50.4 },
        { source: 'Solar', percent: 12, color: 'bg-yellow-500', twh: 31.8 },
        { source: 'Wind', percent: 10, color: 'bg-cyan-500', twh: 26.5 },
        { source: 'Hydro', percent: 4, color: 'bg-blue-500', twh: 10.6 },
        { source: 'Other', percent: 1, color: 'bg-gray-400', twh: 2.7 }
      ],
      emissions: {
        total: 170,
        intensity: 642,
        trend: 'decreasing',
        perCapita: 6.7,
        reduction2030: -43,
        historicalPeak: 210
      },
      renewable: {
        percentage: 29,
        target2025: 35,
        target2030: 50,
        target2050: 82,
        investment: 7500,
        projects: [
          { name: 'Snowy 2.0 Hydro', capacity: 2000, type: 'hydro', status: 'construction' },
          { name: 'MacIntyre Wind Precinct', capacity: 1026, type: 'wind', status: 'construction' }
        ]
      },
      trade: {
        exports: 0,
        imports: 0,
        netExporter: false,
        mainPartners: [],
        interconnections: []
      },
      grid: {
        losses: 8.5,
        reliability: 99.4,
        smartMeters: 92,
        length: 45000,
        substations: 850,
        investment: 10000
      },
      historicalData: [
        { year: 2020, production: 254, renewable: 27, emissions: 655 },
        { year: 2021, production: 257, renewable: 28, emissions: 650 },
        { year: 2022, production: 260, renewable: 28, emissions: 648 },
        { year: 2023, production: 262, renewable: 29, emissions: 645 },
        { year: 2024, production: 265, renewable: 29, emissions: 642 }
      ]
    }
  }
};

// Helper function to get all country codes
export const getAllCountryCodes = () => {
  return Object.keys(COUNTRY_DATA).sort();
};

// Helper function to get country by code
export const getCountryByCode = (code) => {
  return COUNTRY_DATA[code.toLowerCase()] || null;
};

// Helper function to get countries by region
export const getCountriesByRegion = (region) => {
  return Object.entries(COUNTRY_DATA)
    .filter(([_, country]) => country.region === region)
    .map(([code, country]) => ({ code, ...country }));
};

// Helper function to get neighboring countries
export const getNeighboringCountries = (countryCode) => {
  const neighbors = {
    'azerbaijan': ['georgia', 'armenia', 'iran', 'russia', 'turkey'],
    'germany': ['france', 'poland', 'czech-republic', 'austria', 'switzerland', 'denmark', 'netherlands', 'belgium', 'luxembourg'],
    'france': ['spain', 'italy', 'switzerland', 'germany', 'belgium', 'luxembourg', 'monaco', 'andorra'],
    'united-states': ['canada', 'mexico'],
    'china': ['russia', 'mongolia', 'north-korea', 'vietnam', 'laos', 'myanmar', 'india', 'bhutan', 'nepal', 'pakistan', 'afghanistan', 'tajikistan', 'kyrgyzstan', 'kazakhstan'],
    'india': ['pakistan', 'china', 'nepal', 'bhutan', 'bangladesh', 'myanmar', 'sri-lanka'],
    'japan': [],
    'united-kingdom': ['ireland'],
    'brazil': ['argentina', 'uruguay', 'paraguay', 'bolivia', 'peru', 'colombia', 'venezuela', 'guyana', 'suriname', 'french-guiana'],
    'russia': ['norway', 'finland', 'estonia', 'latvia', 'lithuania', 'poland', 'belarus', 'ukraine', 'georgia', 'azerbaijan', 'kazakhstan', 'china', 'mongolia', 'north-korea'],
    'canada': ['united-states'],
    'australia': []
  };
  return neighbors[countryCode.toLowerCase()] || [];
};

// Helper function to get top countries by metric
export const getTopCountriesByMetric = (metric, limit = 10) => {
  const metrics = {
    'production': (country) => country.electricity.production.total,
    'renewable': (country) => country.electricity.renewable.percentage,
    'emissions': (country) => country.electricity.emissions.intensity,
    'perCapita': (country) => country.electricity.production.perCapita,
    'gridReliability': (country) => country.electricity.grid.reliability
  };
  
  const sortFn = metrics[metric] || metrics['production'];
  
  return Object.entries(COUNTRY_DATA)
    .map(([code, country]) => ({
      code,
      name: country.name,
      value: sortFn(country),
      ...country
    }))
    .sort((a, b) => {
      // For emissions, lower is better
      if (metric === 'emissions') {
        return a.value - b.value;
      }
      // For others, higher is better
      return b.value - a.value;
    })
    .slice(0, limit);
};

// Helper function to calculate global statistics
export const getGlobalStatistics = () => {
  const countries = Object.values(COUNTRY_DATA);
  
  const totalProduction = countries.reduce((sum, c) => sum + c.electricity.production.total, 0);
  const totalEmissions = countries.reduce((sum, c) => sum + c.electricity.emissions.total, 0);
  const avgRenewable = countries.reduce((sum, c) => sum + c.electricity.renewable.percentage, 0) / countries.length;
  const avgCarbonIntensity = countries.reduce((sum, c) => sum + c.electricity.emissions.intensity, 0) / countries.length;
  
  return {
    totalProduction: totalProduction.toFixed(1),
    totalEmissions: totalEmissions.toFixed(1),
    averageRenewable: avgRenewable.toFixed(1),
    averageCarbonIntensity: avgCarbonIntensity.toFixed(0),
    numberOfCountries: countries.length,
    totalPopulation: countries.reduce((sum, c) => sum + (c.population || 0), 0),
    totalCapacity: countries.reduce((sum, c) => sum + c.electricity.capacity.total, 0).toFixed(1)
  };
};

// Export default
export default COUNTRY_DATA;