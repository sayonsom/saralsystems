"use client";

import React, { useMemo, useState } from "react";
import Chart from "./Chart";
import Controls from "./Controls";
import AdvancedSettings from "./AdvancedSettings";
import ProfileList from "./ProfileList";
import {
  generateProfile,
  calculateStatistics,
  geographicProfiles,
  loadTemplates,
} from "@/lib/load-profile/generation";

// Orchestrator for the Load Profile Designer
export default function Designer({ projectId = null }) {
  // Core state
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);

  const [timeHorizon, setTimeHorizon] = useState("daily"); // daily | weekly | monthly | 8760
  const [seasonType, setSeasonType] = useState("summer-weekday");
  const [geography, setGeography] = useState("california-cz3");
  const [scale, setScale] = useState("residential"); // residential | commercial | industrial | agricultural | feeder | substation
  const [aggregationLevel, setAggregationLevel] = useState(1);

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced/DER params
  const [weatherData, setWeatherData] = useState({
    temperature: 75,
    humidity: 60,
    cloudCover: 20,
  });

  const [includeEV, setIncludeEV] = useState(false);
  const [includeSolar, setIncludeSolar] = useState(false);
  const [includeBattery, setIncludeBattery] = useState(false);
  const [solarCapacity, setSolarCapacity] = useState(5);
  const [batteryCapacity, setBatteryCapacity] = useState(10);
  const [batteryPower, setBatteryPower] = useState(5);

  const visibleProfiles = profiles.filter((p) => p.visible);

  const active = useMemo(() => profiles.find((p) => p.id === activeProfile), [profiles, activeProfile]);
  const activeStats = useMemo(() => (active ? calculateStatistics(active.data) : null), [active]);

  const getCapacityForScale = (s) => {
    if (s === "residential") return 5;
    if (s === "commercial") return 50;
    if (s === "industrial") return 500;
    if (s === "agricultural") return 20;
    if (s === "feeder") return 5000;
    if (s === "substation") return 20000;
    return 5;
  };

  const createNewProfile = () => {
    const capacity = getCapacityForScale(scale);
    const profileData = generateProfile(
      {
        capacity,
        includeEV,
        includeSolar,
        includeBattery,
        solarCapacity,
        batteryCapacity,
        batteryPower,
      },
      {
        timeHorizon,
        seasonType,
        geography,
        aggregationLevel,
        scale,
        weatherData,
      }
    );

    const id = Date.now();
    const newProfile = {
      id,
      name: `${capitalize(scale)} • ${seasonType} • ${aggregationLevel} units`,
      type: scale,
      season: seasonType,
      geography,
      aggregationLevel,
      color: "#ea580b",
      visible: true,
      data: profileData,
      parameters: {
        scale,
        seasonType,
        geography,
        aggregationLevel,
        timeHorizon,
        includeEV,
        includeSolar,
        includeBattery,
        solarCapacity,
        batteryCapacity,
        batteryPower,
      },
    };

    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfile(id);
  };

  const exportJSON = () => {
    const exportData = {
      version: "1.0",
      generated_at: new Date().toISOString(),
      metadata: {
        geography,
        timeHorizon,
        seasonType,
        scale,
        aggregationLevel,
        projectId,
      },
      profiles: profiles.map((p) => ({
        ...p,
        statistics: calculateStatistics(p.data),
      })),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `load_profiles_${geography}_${new Date().toISOString()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    let csv = "Timestamp";
    profiles.forEach((p) => {
      csv += `,${(p.name || "Profile").replace(/,/g, "_")}`;
    });
    csv += "\n";

    if (profiles.length > 0) {
      const maxLength = Math.max(...profiles.map((p) => p.data?.length || 0));
      for (let i = 0; i < maxLength; i++) {
        const t =
          timeHorizon === "8760"
            ? profiles[0].data[i]?.timestamp || ""
            : timeHorizon === "monthly"
            ? `Day_${i}`
            : `H_${i}`;
        csv += `${t}`;
        profiles.forEach((p) => {
          const v = p.data[i]?.value;
          csv += `,${typeof v === "number" ? v.toFixed(3) : ""}`;
        });
        csv += "\n";
      }
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `load_profiles_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Load Profile Designer</h1>
            <p className="text-xs text-gray-500 mt-1">
              Utility-grade load shape generation for distribution planning, DER integration, rate design, and more.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-xs"
            >
              Export CSV
            </button>
            <button
              onClick={exportJSON}
              className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-xs"
            >
              Export JSON
            </button>
            <button
              onClick={createNewProfile}
              className="px-3 py-2 bg-[#ea580b] text-white hover:bg-[#dc2626] transition-colors text-xs"
            >
              Generate Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left controls */}
        <div className="lg:col-span-1">
          <Controls
            scale={scale}
            setScale={setScale}
            geography={geography}
            setGeography={setGeography}
            timeHorizon={timeHorizon}
            setTimeHorizon={setTimeHorizon}
            seasonType={seasonType}
            setSeasonType={setSeasonType}
            aggregationLevel={aggregationLevel}
            setAggregationLevel={setAggregationLevel}
            showAdvanced={showAdvanced}
            onToggleAdvanced={() => setShowAdvanced((v) => !v)}
            onGenerate={createNewProfile}
            onExportCSV={exportCSV}
            onExportJSON={exportJSON}
          />

          {showAdvanced && (
            <AdvancedSettings
              weatherData={weatherData}
              setWeatherData={setWeatherData}
              includeEV={includeEV}
              setIncludeEV={setIncludeEV}
              includeSolar={includeSolar}
              setIncludeSolar={setIncludeSolar}
              includeBattery={includeBattery}
              setIncludeBattery={setIncludeBattery}
              solarCapacity={solarCapacity}
              setSolarCapacity={setSolarCapacity}
              batteryCapacity={batteryCapacity}
              setBatteryCapacity={setBatteryCapacity}
              batteryPower={batteryPower}
              setBatteryPower={setBatteryPower}
            />
          )}

          <ProfileList
            profiles={profiles}
            activeProfile={activeProfile}
            setActiveProfile={setActiveProfile}
            setProfiles={setProfiles}
          />
        </div>

        {/* Right: chart + stats */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-800">Load Profile Visualization</h2>
              <div className="flex gap-2 text-xs">
                <span className="px-3 py-1 bg-gray-100 text-gray-700">
                  {visibleProfiles.length} Active Profiles
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700">
                  {timeHorizon === "8760" ? "8760 Hours" : capitalize(timeHorizon)}
                </span>
              </div>
            </div>

            <Chart profiles={visibleProfiles} timeHorizon={timeHorizon} height={400} />
          </div>

          {active && (
            <div className="bg-white border border-gray-200 p-6 mt-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Load Profile Statistics</h2>
              {activeStats ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Stat label="Peak Load" value={`${activeStats.peak} MW`} />
                  <Stat label="Min Load" value={`${activeStats.min} MW`} />
                  <Stat label="Load Factor" value={`${activeStats.loadFactor}%`} />
                  <Stat label="Total Energy" value={`${activeStats.energy} MWh`} />
                  <Stat label="Avg Load" value={`${activeStats.average} MW`} />
                  <Stat label="Max Ramp Up" value={`${activeStats.maxRampUp} MW/h`} />
                  <Stat label="Max Ramp Down" value={`${activeStats.maxRampDown} MW/h`} />
                  <Stat
                    label="Diversity Factor"
                    value={`${(loadTemplates[scale]?.diversityFactor(Math.max(1, aggregationLevel)) * 100).toFixed(1)}%`}
                  />
                </div>
              ) : (
                <div className="text-sm text-gray-500">Generate and select a profile to view statistics.</div>
              )}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 p-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 mt-0.5">ⓘ</div>
              <div>
                <h3 className="text-sm font-semibold text-blue-900">Methodology</h3>
                <p className="text-sm text-blue-800 mt-1">
                  This tool generates realistic load profiles using diversity factors, temperature sensitivity models,
                  time-of-use patterns, and geographic characteristics. Suitable for distribution planning, hosting
                  capacity, rate design, and regulatory support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-50 p-3">
      <div className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
    </div>
  );
}

function capitalize(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}