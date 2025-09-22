"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createProject as createLocalProject, listProjects as listLocalProjects, removeProjects as removeLocalProjects } from "@/lib/projects";
import ProjectsEmptyState from "./ProjectsEmptyState";
import ProjectsSidebar from "./ProjectsSidebar";
import ProjectsHeader from "./ProjectsHeader";
import ProjectsTable from "./ProjectsTable";
import NewProjectModal from "./NewProjectModal";
import GridlabdIDE from "@/components/GridlabdIDE";
import { projects as apiProjects } from "@/lib/gridlabdClient";

export default function ProjectsDashboard() {
  const { user } = useAuth();
  const uid = user?.uid || "anon";

  // view: all | owned | shared | archived | trashed | ide
  const [view, setView] = useState("all");
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async ({ nextView = view, nextSearch = search, nextTag = tag } = {}) => {
    setLoading(true);
    try {
      let data;
      if (nextView === "shared") {
        data = await apiProjects.shared();
      } else if (nextView === "archived") {
        data = await apiProjects.archived();
      } else if (nextView === "trashed") {
        data = await apiProjects.trashed();
      } else {
        // all | owned -> use filter API to unify
        data = await apiProjects.filter({ view: nextView, tag: nextTag, q: nextSearch });
      }
      const arr = Array.isArray(data) ? data : (data?.projects || data?.data || []);
      setProjects(arr || []);
    } catch (e) {
      // Fallback to local storage for basic list when backend unavailable
      const list = listLocalProjects(uid);
      setProjects(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  useEffect(() => {
    // reload on view/search/tag change (debounce search lightly)
    const t = setTimeout(() => load({ nextView: view, nextSearch: search, nextTag: tag }), 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, search, tag]);

  const openProject = (p) => {
    setActiveProject(p);
    setView("ide");
    try { localStorage.setItem("gridlabd:currentProjectId", p?.id || ""); } catch {}
  };

  const handleCreate = async (data) => {
    // data: { name, description, is_public, tags }
    try {
      const created = await apiProjects.create(data);
      const p = created?.id ? created : (created?.project || created?.data || created);
      setProjects((prev) => [p, ...(Array.isArray(prev) ? prev : [])]);
      openProject(p);
    } catch (e) {
      // Fallback to local
      const p = createLocalProject(uid, data);
      setProjects((prev) => [p, ...(Array.isArray(prev) ? prev : [])]);
      openProject(p);
    }
  };

  const handleDuplicate = (p) => {
    const cp = createLocalProject(uid, { name: `${p.name} (Copy)`, template: p.template, description: p.description });
    setProjects((prev) => [cp, ...prev]);
  };

  const handleDelete = async (p) => {
    try {
      // Prefer trash over hard delete if API is available
      await apiProjects.trash?.(p.id);
      await load();
    } catch {
      try {
        await apiProjects.delete?.(p.id);
        await load();
      } catch {
        const next = removeLocalProjects(uid, [p.id]);
        setProjects(next);
      }
    }
  };

  const handleArchive = async (p) => {
    try { await apiProjects.archive(p.id); await load(); } catch {}
  };
  const handleRestore = async (p) => {
    try { await apiProjects.restore(p.id); await load(); } catch {}
  };
  const handleUnarchive = async (p) => {
    try { await apiProjects.unarchive(p.id); await load(); } catch {}
  };

  if (view === "ide" && activeProject) {
    return (
      <div className="min-h-screen">
        <GridlabdIDE projectName={activeProject.name} />
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <button onClick={() => setView("all")} className="px-3 py-2 text-sm rounded-none bg-white border shadow">← Back to projects</button>
        </div>
      </div>
    );
  }

  const hasProjects = (projects || []).length > 0;
  const titleMap = { all: "All projects", owned: "Your projects", shared: "Shared with you", archived: "Archived projects", trashed: "Trashed projects" };

  return (
    <div className="min-h-[70vh]">
      {!hasProjects ? (
        <ProjectsEmptyState onCreate={() => setShowNew(true)} onLearn={() => {}} onClone={() => {}} />
      ) : (
        <div className="flex h-[calc(100vh-120px)] bg-gray-50">
          <ProjectsSidebar onCreate={() => setShowNew(true)} currentView={view} onChangeView={setView} />

          <div className="flex-1 flex flex-col">
            <ProjectsHeader title={titleMap[view] || "Projects"} planLabel="free" onUpgrade={() => {}} badge={loading ? "Loading…" : undefined} />

            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Upgrade to Enterprise for 
              </div>
              <div className="flex items-center gap-3">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Contact sales</button>
                <button className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="relative">
                <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search in projects..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>

            <ProjectsTable
              projects={projects}
              onOpen={openProject}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onShare={() => {}}
              onArchive={handleArchive}
              onUnarchive={handleUnarchive}
              onRestore={handleRestore}
              onTrash={handleDelete}
              search={search}
              view={view}
            />
          </div>
        </div>
      )}

      <NewProjectModal open={showNew} onClose={() => setShowNew(false)} onCreate={handleCreate} />
    </div>
  );
}
