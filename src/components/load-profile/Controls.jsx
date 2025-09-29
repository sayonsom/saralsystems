"use client";

import React from "react";
import { geographicProfiles } from "@/lib/load-profile/generation";

export default function Controls({
  scale,
  setScale,
  geography,
  setGeography,
  timeHorizon,
  setTimeHorizon,
  seasonType,
  setSeasonType,
  aggregationLevel,
  setAggregationLevel,
  showAdvanced = false,
  onToggleAdvanced = () => {},
  onGenerate = () => {},
  onExportCSV = null,
  onExportJSON = null,
}) {
  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Profile Configuration</h2>

      {/* Scale */}
      <div className="mb-4">
        <label className="text-xs text-gray-600 uppercase tracking-wider">Scale</label>
        <select
          value={scale}
          onChange={(e) => setScale(e.target.value)}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580b]"
          style={{ fontFamily: "Sen, sans-serif" }}
        >
          <option value="residential">Individual Residential</option>
          <option value="commercial">Commercial Building</option>
          <option value="industrial">Industrial Facility</option>
          <option value="agricultural">Agricultural</option>
          <option value="feeder">Distribution Feeder</option>
          <option value="substation">Substation</option>
        </select>
      </div>

      {/* Geography */}
      <div className="mb-4">
        <label className="text-xs text-gray-600 uppercase tracking-wider">Geography</label>
        <select
          value={geography}
          onChange={(e) => setGeography(e.target.value)}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580b]"
          style={{ fontFamily: "Sen, sans-serif" }}
        >
          {Object.entries(geographicProfiles).map(([key, profile]) => (
            <option key={key} value={key}>
              {profile.name}
            </option>
          ))}
        </select>
      </div>

      {/* Time Horizon */}
      <div className="mb-4">
        <label className="text-xs text-gray-600 uppercase tracking-wider">Time Horizon</label>
        <select
          value={timeHorizon}
          onChange={(e) => setTimeHorizon(e.target.value)}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580b]"
          style={{ fontFamily: "Sen, sans-serif" }}
        >
          <option value="daily">24-Hour Daily</option>
          <option value="weekly">7-Day Weekly</option>
          <option value="monthly">30-Day Monthly</option>
          <option value="8760">8760-Hour Annual</option>
        </select>
      </div>

      {/* Season */}
      <div className="mb-4">
        <label className="text-xs text-gray-600 uppercase tracking-wider">Season/Day Type</label>
        <select
          value={seasonType}
          onChange={(e) => setSeasonType(e.target.value)}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580b]"
          style={{ fontFamily: "Sen, sans-serif" }}
        >
          <option value="summer-weekday">Summer Weekday</option>
          <option value="summer-weekend">Summer Weekend</option>
          <option value="winter-weekday">Winter Weekday</option>
          <option value="winter-weekend">Winter Weekend</option>
          <option value="shoulder-weekday">Shoulder Weekday</option>
          <option value="shoulder-weekend">Shoulder Weekend</option>
        </select>
      </div>

      {/* Aggregation */}
      <div className="mb-4">
        <label className="text-xs text-gray-600 uppercase tracking-wider">Number of Customers</label>
        <input
          type="number"
          value={aggregationLevel}
          onChange={(e) => setAggregationLevel(Math.max(1, parseInt(e.target.value || "1", 10)))}
          min={1}
          max={100000}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580b]"
          style={{ fontFamily: "Sen, sans-serif" }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onGenerate}
          className="px-4 py-2 bg-[#ea580b] text-white hover:bg-[#dc2626] transition-colors text-sm"
        >
          Generate Profile
        </button>
        {typeof onExportCSV === "function" && (
          <button
            onClick={onExportCSV}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
          >
            Export CSV
          </button>
        )}
        {typeof onExportJSON === "function" && (
          <button
            onClick={onExportJSON}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
          >
            Export JSON
          </button>
        )}
        <button
          onClick={onToggleAdvanced}
          className="ml-auto px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm"
        >
          {showAdvanced ? "Hide Advanced" : "Advanced Settings"}
        </button>
      </div>
    </div>
  );
}