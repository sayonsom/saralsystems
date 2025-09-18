"use client";

import React from "react";

export default function ProjectsHeader({ title, planLabel = "free", onUpgrade, badge }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {badge && (
            <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700 border border-gray-200">{badge}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            You're on the <span className="font-semibold">{planLabel} plan</span>
          </span>
          <button onClick={onUpgrade} className="bg-orange-600 text-white px-4 py-2 text-sm font-medium hover:bg-orange-700 transition-colors">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}
