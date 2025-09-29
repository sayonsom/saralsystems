// Utility-grade load profile generation library

// Geographic load characteristics by region
export const geographicProfiles = {
  'california-cz3': {
    name: 'California - CZ3 (Bay Area)',
    coolingDegree: 65,
    heatingDegree: 65,
    solarCapacity: 0.85,
    evPenetration: 0.35,
    typicalPeakTime: 17
  },
  'california-cz10': {
    name: 'California - CZ10 (Riverside)',
    coolingDegree: 65,
    heatingDegree: 65,
    solarCapacity: 0.95,
    evPenetration: 0.25,
    typicalPeakTime: 16
  },
  'arizona-phoenix': {
    name: 'Arizona - Phoenix',
    coolingDegree: 75,
    heatingDegree: 65,
    solarCapacity: 0.98,
    evPenetration: 0.15,
    typicalPeakTime: 17
  },
  'texas-ercot': {
    name: 'Texas - ERCOT',
    coolingDegree: 72,
    heatingDegree: 65,
    solarCapacity: 0.90,
    evPenetration: 0.12,
    typicalPeakTime: 16
  },
  'midwest-pjm': {
    name: 'Midwest - PJM',
    coolingDegree: 70,
    heatingDegree: 60,
    solarCapacity: 0.75,
    evPenetration: 0.10,
    typicalPeakTime: 17
  },
  'northeast-iso-ne': {
    name: 'Northeast - ISO-NE',
    coolingDegree: 68,
    heatingDegree: 60,
    solarCapacity: 0.70,
    evPenetration: 0.20,
    typicalPeakTime: 18
  }
};

// Load shape templates by customer class
export const loadTemplates = {
  residential: {
    baseLoad: 0.35,
    summerPeak: 2.8,
    winterPeak: 2.2,
    shoulderPeak: 1.8,
    weekendFactor: 0.85,
    diversityFactor: (n) => 1 / (1 + (n - 1) * 0.4)
  },
  commercial: {
    baseLoad: 0.45,
    summerPeak: 2.2,
    winterPeak: 1.8,
    shoulderPeak: 1.9,
    weekendFactor: 0.3,
    diversityFactor: (n) => 1 / (1 + (n - 1) * 0.3)
  },
  industrial: {
    baseLoad: 0.75,
    summerPeak: 1.3,
    winterPeak: 1.2,
    shoulderPeak: 1.25,
    weekendFactor: 0.7,
    diversityFactor: (n) => 1 / (1 + (n - 1) * 0.2)
  },
  agricultural: {
    baseLoad: 0.25,
    summerPeak: 3.5,
    winterPeak: 1.2,
    shoulderPeak: 2.8,
    weekendFactor: 0.95,
    diversityFactor: (n) => 1 / (1 + (n - 1) * 0.5)
  }
};

export const TIME_HORIZONS = ['daily', 'weekly', 'monthly', '8760'];

// Simulate temperature based on location and time
export const simulateTemperature = (hour, dayOfYear, geography) => {
  const baseTemp = 70;
  const seasonalVariation = Math.sin((dayOfYear - 80) * 2 * Math.PI / 365) * 20;
  const dailyVariation = Math.sin((hour - 6) * 2 * Math.PI / 24) * 10;
  return baseTemp + seasonalVariation + dailyVariation;
};

// Calculate hourly load with all factors
export const calculateHourlyLoad = (params) => {
  const {
    customerType = 'residential',
    capacity = 1,
    hour = 0,
    season = 'shoulder',
    isWeekend = false,
    geography = 'california-cz3',
    aggregationLevel = 1,
    temperature
  } = params || {};

  const template = loadTemplates[customerType] || loadTemplates.residential;
  const geoProfile = geographicProfiles[geography] || geographicProfiles['california-cz3'];

  let load = template.baseLoad * capacity;

  const todFactors = {
    0: 0.7, 1: 0.65, 2: 0.6, 3: 0.6, 4: 0.65, 5: 0.7,
    6: 0.85, 7: 1.0, 8: 1.1, 9: 1.15, 10: 1.1, 11: 1.05,
    12: 1.0, 13: 1.05, 14: 1.1, 15: 1.2, 16: 1.35, 17: 1.5,
    18: 1.4, 19: 1.3, 20: 1.2, 21: 1.0, 22: 0.85, 23: 0.75
  };
  load *= todFactors[hour] || 1.0;

  const seasonFactors = {
    summer: template.summerPeak,
    winter: template.winterPeak,
    shoulder: template.shoulderPeak
  };
  load *= seasonFactors[season] || 1.0;

  if (isWeekend) {
    load *= template.weekendFactor;
  }

  if (typeof temperature === 'number') {
    const coolingLoad = Math.max(0, (temperature - geoProfile.coolingDegree) * 0.03);
    const heatingLoad = Math.max(0, (geoProfile.heatingDegree - temperature) * 0.02);
    load *= (1 + coolingLoad + heatingLoad);
  }

  if (aggregationLevel > 1) {
    const diversityFactor = template.diversityFactor(aggregationLevel);
    load *= aggregationLevel * diversityFactor;
  }

  load *= (0.95 + Math.random() * 0.1);
  return Math.max(0, load);
};

// Generate 8760 hourly data
export const generate8760Profile = (params, ctx = {}) => {
  const hourlyData = [];
  const year = new Date().getFullYear();
  const geography = params?.geography || ctx.geography || 'california-cz3';
  const aggregationLevel = params?.aggregationLevel ?? ctx.aggregationLevel ?? 1;
  const customerType = params?.customerType || ctx.scale || 'residential';
  const capacity = params?.capacity ?? 1;

  for (let day = 0; day < 365; day++) {
    const date = new Date(year, 0, day + 1);
    const month = date.getMonth();
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let season = 'shoulder';
    if (month >= 5 && month <= 8) season = 'summer';
    else if (month >= 11 || month <= 1) season = 'winter';

    for (let hour = 0; hour < 24; hour++) {
      const temperature = simulateTemperature(hour, day, geography);
      const value = calculateHourlyLoad({
        customerType,
        capacity,
        hour,
        season,
        isWeekend,
        geography,
        aggregationLevel,
        temperature
      });
      hourlyData.push({
        timestamp: new Date(year, 0, day + 1, hour),
        value,
        season,
        isWeekend,
        temperature
      });
    }
  }
  return hourlyData;
};

// Add EV charging profile
export const addEVCharging = (baseData, { timeHorizon = 'daily', geography = 'california-cz3', aggregationLevel = 1 } = {}) => {
  const evPenetration = geographicProfiles[geography]?.evPenetration ?? 0.2;
  const chargingPower = 7.2; // kW per vehicle
  const vehicles = Math.floor(aggregationLevel * evPenetration);

  return baseData.map((point, index) => {
    const hour = timeHorizon === 'daily'
      ? (point.time ?? index)
      : (point.timestamp ? new Date(point.timestamp).getHours() : (index % 24));
    let evLoad = 0;
    if (hour >= 18 || hour <= 6) {
      evLoad = vehicles * chargingPower * (0.3 + Math.random() * 0.4) / 1000; // MW
    }
    return { ...point, value: (point.value ?? 0) + evLoad };
  });
};

// Add solar generation profile
export const addSolarGeneration = (baseData, { timeHorizon = 'daily', geography = 'california-cz3', aggregationLevel = 1 } = {}, { solarCapacity = 5 } = {}) => {
  const geoProfile = geographicProfiles[geography] || geographicProfiles['california-cz3'];
  return baseData.map((point, index) => {
    const hour = timeHorizon === 'daily'
      ? (point.time ?? index)
      : (point.timestamp ? new Date(point.timestamp).getHours() : (index % 24));
    let solarGen = 0;
    if (hour >= 6 && hour <= 18) {
      const peakHour = 12;
      const hourFromPeak = Math.abs(hour - peakHour);
      solarGen = solarCapacity * geoProfile.solarCapacity *
        Math.max(0, 1 - hourFromPeak * 0.15) *
        aggregationLevel / 1000; // MW
    }
    return { ...point, value: Math.max(0, (point.value ?? 0) - solarGen), solarGeneration: solarGen };
  });
};

// Add battery storage profile
export const addBatteryStorage = (baseData, { timeHorizon = 'daily', aggregationLevel = 1 } = {}, { batteryCapacity = 10, batteryPower = 5 } = {}) => {
  let stateOfCharge = 0.5; // 50%
  return baseData.map((point, index) => {
    const hour = timeHorizon === 'daily'
      ? (point.time ?? index)
      : (point.timestamp ? new Date(point.timestamp).getHours() : (index % 24));
    let batteryFlow = 0;
    const capacity = Math.max(1, point.capacity ?? 1);
    if ((point.value ?? 0) > capacity * 0.8 && stateOfCharge > 0.2) {
      batteryFlow = Math.min(batteryPower * aggregationLevel / 1000, stateOfCharge * batteryCapacity / 1000);
      stateOfCharge -= batteryFlow / (batteryCapacity / 1000);
    } else if ((point.value ?? 0) < capacity * 0.4 && stateOfCharge < 0.9) {
      batteryFlow = -Math.min(batteryPower * aggregationLevel / 1000, (0.9 - stateOfCharge) * batteryCapacity / 1000);
      stateOfCharge += Math.abs(batteryFlow) / (batteryCapacity / 1000);
    }
    return { ...point, value: Math.max(0, (point.value ?? 0) - batteryFlow), batteryFlow, stateOfCharge };
  });
};

// Generate profile given params and context
export const generateProfile = (params, ctx) => {
  const {
    capacity = 1,
    includeEV = false,
    includeSolar = false,
    includeBattery = false,
    solarCapacity = 5,
    batteryCapacity = 10,
    batteryPower = 5
  } = params || {};

  const {
    timeHorizon = 'daily',
    seasonType = 'summer-weekday',
    geography = 'california-cz3',
    aggregationLevel = 1,
    scale = 'residential',
    weatherData = { temperature: 75 }
  } = ctx || {};

  let data = [];

  if (timeHorizon === '8760') {
    data = generate8760Profile({
      customerType: scale,
      capacity,
      geography,
      aggregationLevel
    }, ctx);
  } else if (timeHorizon === 'daily') {
    for (let hour = 0; hour < 24; hour++) {
      const value = calculateHourlyLoad({
        customerType: scale,
        capacity,
        hour,
        season: seasonType.split('-')[0],
        isWeekend: seasonType.includes('weekend'),
        geography,
        aggregationLevel,
        temperature: weatherData.temperature
      });
      data.push({ time: hour, value, capacity });
    }
  } else if (timeHorizon === 'weekly') {
    for (let k = 0; k < 7 * 24; k++) {
      const hour = k % 24;
      const isWeekend = (Math.floor(k / 24) % 7) >= 5;
      const value = calculateHourlyLoad({
        customerType: scale,
        capacity,
        hour,
        season: seasonType.split('-')[0],
        isWeekend,
        geography,
        aggregationLevel,
        temperature: weatherData.temperature
      });
      data.push({ time: k, value, capacity });
    }
  } else if (timeHorizon === 'monthly') {
    for (let day = 0; day < 30; day++) {
      let dailyTotal = 0;
      for (let hour = 0; hour < 24; hour++) {
        dailyTotal += calculateHourlyLoad({
          customerType: scale,
          capacity,
          hour,
          season: seasonType.split('-')[0],
          isWeekend: day % 7 >= 5,
          geography,
          aggregationLevel,
          temperature: weatherData.temperature
        });
      }
      data.push({ time: day, value: dailyTotal / 24, capacity });
    }
  }

  if (includeEV) {
    data = addEVCharging(data, { timeHorizon, geography, aggregationLevel });
  }
  if (includeSolar) {
    data = addSolarGeneration(data, { timeHorizon, geography, aggregationLevel }, { solarCapacity });
  }
  if (includeBattery) {
    data = addBatteryStorage(data, { timeHorizon, aggregationLevel }, { batteryCapacity, batteryPower });
  }
  return data;
};

// Calculate statistics for profile
export const calculateStatistics = (data) => {
  if (!data || !data.length) return {};
  const values = data.map(d => d.value ?? 0);
  const peak = Math.max(...values);
  const min = Math.min(...values);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const loadFactor = average / (peak || 1);
  const rampRates = [];
  for (let i = 1; i < values.length; i++) {
    rampRates.push(values[i] - values[i - 1]);
  }
  const maxRampUp = Math.max(...rampRates, 0);
  const maxRampDown = Math.min(...rampRates, 0);
  return {
    peak: peak.toFixed(2),
    min: min.toFixed(2),
    average: average.toFixed(2),
    loadFactor: (loadFactor * 100).toFixed(1),
    energy: (average * data.length).toFixed(0),
    maxRampUp: maxRampUp.toFixed(2),
    maxRampDown: Math.abs(maxRampDown).toFixed(2)
  };
};