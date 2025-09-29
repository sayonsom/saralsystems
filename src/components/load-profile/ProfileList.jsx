"use client";

import React from "react";

export default function ProfileList({
  profiles = [],
  activeProfile = null,
  setActiveProfile = () => {},
  setProfiles = () => {},
}) {
  return (
    <div className="bg-white border border-gray-200 p-4 mt-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Generated Profiles</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {profiles.length === 0 && (
          <div className="text-sm text-gray-500">No profiles yet. Generate one to get started.</div>
        )}
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`px-3 py-2 border transition-colors cursor-pointer ${
              activeProfile === profile.id
                ? "border-[#ea580b] bg-orange-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setActiveProfile(profile.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3"
                  style={{ backgroundColor: profile.color || "#ea580b" }}
                />
                <span className="text-sm text-gray-700">{profile.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfiles(
                      profiles.map((p) =>
                        p.id === profile.id ? { ...p, visible: !p.visible } : p
                      )
                    );
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                  title={profile.visible ? "Hide" : "Show"}
                  aria-label={profile.visible ? "Hide profile" : "Show profile"}
                >
                  {profile.visible ? "👁" : "👁‍🗨"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfiles(profiles.filter((p) => p.id !== profile.id));
                  }}
                  className="p-1 hover:bg-red-100 rounded"
                  title="Delete"
                  aria-label="Delete profile"
                >
                  <span className="text-red-600">✕</span>
                </button>
              </div>
            </div>
            {profile?.parameters && (
              <div className="mt-1 text-xs text-gray-500">
                {profile.parameters.scale} • {profile.parameters.seasonType} • {profile.parameters.aggregationLevel} units
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}