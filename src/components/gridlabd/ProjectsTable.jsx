"use client";

import React, { useMemo } from "react";

function StatusBadge({ status, lastModified }) {
  const map = {
    running: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Running" },
    success: { bg: "bg-orange-100", text: "text-orange-800", label: "Success" },
    failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
  };
  const cfg = map[status] || map.success;
  const lm = lastModified ? new Date(lastModified).toLocaleString() : "";
  return (
    <div className="flex items-center gap-2">
      <span className={`px-3 py-1 text-sm font-medium ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
      {lm && <span className="text-gray-500 text-sm">{lm}</span>}
    </div>
  );
}

export default function ProjectsTable({ projects, onOpen, onDuplicate, onDelete, onShare, search, currentPage, totalPages, onPageChange, selectedIds = new Set(), onToggleSelect = () => {}, onToggleSelectAll = () => {} }) {
  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase();
    const arr = Array.isArray(projects) ? projects : (projects?.projects || projects?.data || []);
    return arr.filter((p) => (p?.name || "").toLowerCase().includes(q));
  }, [projects, search]);

  if (!Array.isArray(filtered) || !filtered.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No projects matched your search.
      </div>
    );
  }

  const allVisibleIds = filtered.map((p) => p.id || p._id).filter(Boolean);
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.has(id));

  return (
    <div className="flex-1 px-6 pb-6 overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4">
              <input
                type="checkbox"
                className="border-gray-300"
                checked={allSelected}
                onChange={() => onToggleSelectAll(allVisibleIds)}
              />
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Owner</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
            <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => {
            const id = p.id || p._id;
            const isSelected = id ? selectedIds.has(id) : false;
            return (
              <tr key={id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    className="border-gray-300"
                    checked={isSelected}
                    onChange={() => onToggleSelect(id)}
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">[FILE]</span>
                    <div>
                      <button onClick={() => onOpen(p)} className="font-medium text-gray-900 hover:text-orange-600">
                        {p.name}
                      </button>
                      {p.shared && (
                        <div className="text-xs text-gray-500 mt-1">Shared with {p.sharedWith}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">{p.owner_name || p.owner || "You"}</td>
                <td className="py-3 px-4"><StatusBadge status={p.status || "success"} lastModified={p.updated_at || p.lastModified} /></td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onDuplicate(p)} className="p-2 text-gray-400 hover:text-gray-600" title="Duplicate">DUP</button>
                    <button className="p-2 text-gray-400 hover:text-gray-600" title="Download">DL</button>
                    <button className="p-2 text-gray-400 hover:text-gray-600" title="Archive">ARC</button>
                    <button onClick={() => onShare?.(p)} className="p-2 text-gray-400 hover:text-gray-600" title="Share">SHR</button>
                    <button onClick={() => onDelete(p)} className="p-2 text-gray-400 hover:text-red-600" title="Delete">DEL</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1 text-sm border ${
                    pageNum === currentPage
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
