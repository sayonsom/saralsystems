"use client";

import React from "react";

export default function AdvancedSettings({
  weatherData,
  setWeatherData,
  includeEV,
  setIncludeEV,
  includeSolar,
  setIncludeSolar,
  includeBattery,
  setIncludeBattery,
  solarCapacity,
  setSolarCapacity,
  batteryCapacity,
  setBatteryCapacity,
  batteryPower,
  setBatteryPower,
}) {
  return (
    <div className="bg-white border border-gray-200 p-4 mt-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Weather & DER Settings</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-gray-600">Temperature (°F)</label>
          <input
            type="number"
            value={weatherData.temperature}
            onChange={(e) =>
              setWeatherData({ ...weatherData, temperature: parseFloat(e.target.value || "0") })
            }
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580b]"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600">Humidity (%)</label>
          <input
            type="number"
            value={weatherData.humidity}
            onChange={(e) =>
              setWeatherData({ ...weatherData, humidity: parseFloat(e.target.value || "0") })
            }
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580b]"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600">Cloud Cover (%)</label>
          <input
            type="number"
            value={weatherData.cloudCover}
            onChange={(e) =>
              setWeatherData({ ...weatherData, cloudCover: parseFloat(e.target.value || "0") })
            }
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580b]"
          />
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Distributed Energy Resources</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 border border-gray-200">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeEV}
                onChange={(e) => setIncludeEV(e.target.checked)}
              />
              Include EV Charging
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Adds evening/night charging demand based on regional EV penetration.
            </p>
          </div>

          <div className="p-3 border border-gray-200">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeSolar}
                onChange={(e) => setIncludeSolar(e.target.checked)}
              />
              Include Solar PV
            </label>
            <div className="mt-2">
              <label className="text-xs text-gray-600">Solar Capacity (kW)</label>
              <input
                type="number"
                value={solarCapacity}
                min={0}
                onChange={(e) => setSolarCapacity(Math.max(0, parseFloat(e.target.value || "0")))}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580b]"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Daytime bell-shaped PV output subtracted from load.
            </p>
          </div>

          <div className="p-3 border border-gray-200">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeBattery}
                onChange={(e) => setIncludeBattery(e.target.checked)}
              />
              Include Battery Storage
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600">Capacity (kWh)</label>
                <input
                  type="number"
                  value={batteryCapacity}
                  min={0}
                  onChange={(e) =>
                    setBatteryCapacity(Math.max(0, parseFloat(e.target.value || "0")))
                  }
                  className="w-full mt-1 px-2 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580b]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Power (kW)</label>
                <input
                  type="number"
                  value={batteryPower}
                  min={0}
                  onChange={(e) => setBatteryPower(Math.max(0, parseFloat(e.target.value || "0")))}
                  className="w-full mt-1 px-2 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580b]"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Simple peak shaving: discharge above 80% peak, charge below 40%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}