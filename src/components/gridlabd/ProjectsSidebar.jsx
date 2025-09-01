"use client";

import React from "react";

export default function ProjectsSidebar({ onCreate }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <button onClick={onCreate} className="w-full bg-green-600 text-white rounded-lg px-4 py-2.5 font-medium hover:bg-green-700 transition-colors">
          + New project
        </button>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          <a className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-900">All projects</a>
          <a className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">Your projects</a>
          <a className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">Shared with you</a>
          <a className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">Archived projects</a>
          <a className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">Trashed projects</a>
        </div>

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Organize Tags</h3>
          <div className="mt-3 space-y-1">
            <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-100">＋ New tag</button>
            <div className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-gray-100 cursor-pointer">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              power_flow (3)
            </div>
            <div className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-gray-100 cursor-pointer">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              solar_pv (2)
            </div>
            <div className="text-gray-500 italic px-3 py-2 text-sm">Uncategorized (5)</div>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="mb-2">Are you affiliated with an institution?</p>
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Add affiliation</button>
        </div>
      </div>
    </div>
  );
}
