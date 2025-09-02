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

  // view: list | ide
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Try backend first; fallback to local storage projects if backend not available
    let cancelled = false;
    (async () => {
      try {
        const list = await apiProjects.listProjects();
        if (!cancelled) setProjects(list);
      } catch (e) {
        const list = listLocalProjects(uid);
        if (!cancelled) setProjects(list);
      }
    })();
    return () => { cancelled = true; };
  }, [uid]);

  const openProject = (p) => {
    setActiveProject(p);
    setView("ide");
    try { localStorage.setItem("gridlabd:currentProjectId", p?.id || ""); } catch {}
  };

  const handleCreate = async (data) => {
    // data: { name, description, is_public, tags }
    try {
      const created = await apiProjects.createProject(data);
      setProjects((prev) => [created, ...prev]);
      openProject(created);
    } catch (e) {
      // Fallback to local
      const p = createLocalProject(uid, data);
      setProjects((prev) => [p, ...prev]);
      openProject(p);
    }
  };

  const handleDuplicate = (p) => {
    const cp = createLocalProject(uid, { name: `${p.name} (Copy)`, template: p.template, description: p.description });
    setProjects((prev) => [cp, ...prev]);
  };

  const handleDelete = async (p) => {
    try {
      await apiProjects.deleteProject(p.id);
      setProjects((prev) => prev.filter((x) => x.id !== p.id));
    } catch {
      const next = removeLocalProjects(uid, [p.id]);
      setProjects(next);
    }
  };

  if (view === "ide" && activeProject) {
    return (
      <div className="min-h-screen">
        <GridlabdIDE projectName={activeProject.name} />
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <button onClick={() => setView("list")} className="px-3 py-2 text-sm rounded-md bg-white border shadow">← Back to projects</button>
        </div>
      </div>
    );
  }

  const hasProjects = (projects || []).length > 0;

  return (
    <div className="min-h-[70vh]">
      {!hasProjects ? (
        <ProjectsEmptyState onCreate={() => setShowNew(true)} onLearn={() => {}} onClone={() => {}} />
      ) : (
        <div className="flex h-[calc(100vh-120px)] bg-gray-50">
          <ProjectsSidebar onCreate={() => setShowNew(true)} />

          <div className="flex-1 flex flex-col">
            <ProjectsHeader title="All projects" planLabel="free" onUpgrade={() => {}} />

            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                GridLAB-D Cloud: Run your simulations in the cloud for better performance. Get in touch to learn more.
              </div>
              <div className="flex items-center gap-3">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Contact sales</button>
                <button className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="relative">
                <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search in all projects..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>

            <ProjectsTable projects={projects} onOpen={openProject} onDuplicate={handleDuplicate} onDelete={handleDelete} search={search} />
          </div>
        </div>
      )}

      <NewProjectModal open={showNew} onClose={() => setShowNew(false)} onCreate={handleCreate} />
    </div>
  );
}
