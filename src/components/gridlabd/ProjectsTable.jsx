"use client";

import React, { useMemo } from "react";

// Small icon component mapping action names to inline SVGs
function ActionIcon({ name }) {
  const common = "w-4 h-4"; // tailwind sizing
  switch (name) {
    case 'duplicate':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      );
    case 'download':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      );
    case 'unarchive':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 7l3-3h12l3 3v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" />
          <path d="M9 15l3-3 3 3" />
          <path d="M12 12v6" />
        </svg>
      );
    case 'restore':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 .49-5H7" />
        </svg>
      );
    case 'archive':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="4" rx="1" />
          <path d="M5 7v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
      );
    case 'trash':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="3 6 5 6 21 6" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      );
    case 'delete':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
          <line x1="9" y1="6" x2="15" y2="6" />
        </svg>
      );
    case 'share':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51l6.83 3.98" />
          <path d="M15.41 6.51L8.59 10.49" />
        </svg>
      );
    case 'file':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    default:
      return null;
  }
}

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

export default function ProjectsTable({ projects, onOpen, onDuplicate, onDelete, onShare, onArchive, onUnarchive, onRestore, onTrash, search, currentPage, totalPages, totalCount, onPageChange, selectedIds = new Set(), onToggleSelect = () => {}, onToggleSelectAll = () => {}, view = "all" }) {
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
                    <button onClick={() => onDuplicate(p)} className="p-2 text-gray-400 hover:text-gray-600" title="Duplicate" aria-label="Duplicate project">
                      <ActionIcon name="duplicate" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600" title="Download" aria-label="Download project">
                      <ActionIcon name="download" />
                    </button>
                    {view === 'archived' ? (
                      <button onClick={() => onUnarchive?.(p)} className="p-2 text-gray-400 hover:text-gray-600" title="Unarchive" aria-label="Unarchive project">
                        <ActionIcon name="unarchive" />
                      </button>
                    ) : view === 'trashed' ? (
                      <button onClick={() => onRestore?.(p)} className="p-2 text-gray-400 hover:text-gray-600" title="Restore" aria-label="Restore project">
                        <ActionIcon name="restore" />
                      </button>
                    ) : (
                      <button onClick={() => onArchive?.(p)} className="p-2 text-gray-400 hover:text-gray-600" title="Archive" aria-label="Archive project">
                        <ActionIcon name="archive" />
                      </button>
                    )}
                    <button onClick={() => (onTrash ? onTrash(p) : onDelete?.(p))} className="p-2 text-gray-400 hover:text-red-600" title={view === 'trashed' ? 'Delete permanently' : 'Move to trash'} aria-label={view === 'trashed' ? 'Delete permanently' : 'Move to trash'}>
                      <ActionIcon name={view === 'trashed' ? 'delete' : 'trash'} />
                    </button>
                    <button onClick={() => onShare?.(p)} className="p-2 text-gray-400 hover:text-gray-600" title="Share" aria-label="Share project">
                      <ActionIcon name="share" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages} • {typeof totalCount === 'number' ? totalCount : filtered.length} { (typeof totalCount === 'number' ? totalCount : filtered.length) === 1 ? 'project' : 'projects' }
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
    </div>
  );
}
