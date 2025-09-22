"use client";

import React from "react";

export default function ProjectsEmptyState({ onCreate, onLearn, onClone }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Welcome to GridSpeed Web IDE</h1>
        <p className="text-lg text-gray-600">Start your power system simulation journey</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        <button onClick={onCreate} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
          <div className="mb-6">
            <div className="w-40 h-28 md:w-48 md:h-32 mx-auto bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-3xl md:text-4xl text-blue-500">＋</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Create a new project</h3>
          <p className="text-gray-600 text-sm">Start from scratch or use a template</p>
        </button>

        <button onClick={onLearn} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
          <div className="mb-6">
            <div className="w-40 h-28 md:w-48 md:h-32 mx-auto bg-green-50 rounded-lg flex items-center justify-center">
              <span className="text-3xl md:text-4xl text-green-600">🎓</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Learn with a tutorial</h3>
          <p className="text-gray-600 text-sm">Interactive guides to get you started</p>
        </button>

        <button onClick={onClone} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
          <div className="mb-6">
            <div className="w-40 h-28 md:w-48 md:h-32 mx-auto bg-purple-50 rounded-lg flex items-center justify-center">
              <span className="text-3xl md:text-4xl text-purple-600">🧪</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Clone IEEE Models</h3>
          <p className="text-gray-600 text-sm">Start with standard test feeders</p>
        </button>
      </div>
    </div>
  );
}
