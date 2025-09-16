'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { projects as apiProjects } from '@/lib/gridlabdClient';
import ProjectsTable from '@/components/gridlabd/ProjectsTable';
import ProjectsHeader from '@/components/gridlabd/ProjectsHeader';
import ProjectsSidebar from '@/components/gridlabd/ProjectsSidebar';
import NewProjectModal from '@/components/gridlabd/NewProjectModal';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ShareModal from '@/components/ShareModal';

export default function ProjectsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // selection and sharing state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [shareOpen, setShareOpen] = useState(false);
  const [shareProjectIds, setShareProjectIds] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiProjects.list();
        console.log('Fetched projects:', data);
        if (Array.isArray(data)) {
          setProjects(data);
        } else if (data && data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else if (data && data.data && Array.isArray(data.data)) {
          setProjects(data.data);
        } else {
          console.warn('Unexpected projects response format:', data);
          setProjects([]);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };
    if (user) {
      fetchProjects();
    } else if (!loading) {
      setLoadingProjects(false);
    }
  }, [user, loading]);

  const handleCreate = async (data) => {
    try {
      const newProject = await apiProjects.create(data);
      setProjects(prev => [newProject, ...prev]);
      setShowNew(false);
      router.push(`/tools/gridlabd/projects/${newProject.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      try {
        const newProject = await apiFetch('/api/projects', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        setProjects(prev => [newProject, ...prev]);
        setShowNew(false);
        router.push(`/tools/gridlabd/projects/${newProject.id}`);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  };

  const handleOpen = (project) => {
    router.push(`/tools/gridlabd/projects/${project.id}`);
  };

  const handleDuplicate = (project) => {
    const duplicatedProject = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setProjects(prev => [duplicatedProject, ...prev]);
  };

  const handleDelete = async (project) => {
    try {
      await apiProjects.delete(project.id);
      setProjects(prev => prev.filter(p => p.id !== project.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(project.id);
        return next;
      });
    } catch (error) {
      console.error('Failed to delete project:', error);
      try {
        await apiFetch(`/api/projects/${project.id}`, { method: 'DELETE' });
        setProjects(prev => prev.filter(p => p.id !== project.id));
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  };

  const handlePageChange = (page) => { setCurrentPage(page); };

  const filteredProjects = useMemo(() => {
    const q = (search || "").toLowerCase();
    return projects.filter((p) => (p?.name || "").toLowerCase().includes(q));
  }, [projects, search]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // selection helpers
  const onToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const onToggleSelectAll = (ids) => {
    setSelectedIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      if (allSelected) {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      }
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  };

  // open share modal for single item via row action or for selection
  const openShareFor = (project) => {
    const ids = project ? [project.id || project._id] : Array.from(selectedIds);
    setShareProjectIds(ids);
    setShareOpen(true);
  };

  const handleShareSubmit = async ({ emails, message }) => {
    const ids = shareProjectIds;
    for (const id of ids) {
      try {
        await apiProjects.share(id, { emails, message, expires_in: 86400 });
      } catch (e) {
        console.error('Failed to share project', id, e);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header pageTitle="GridLAB-D Projects" />
        <div className="min-h-screen flex items-center justify-center pt-12">
          <div className="text-gray-500">Loading…</div>
        </div>
      </>
    );
  }

  return (
    <ProtectedRoute>
      <Header pageTitle="GridLAB-D Projects" />
      <div className="min-h-screen bg-gray-50 pt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-4 text-sm text-gray-500">
            <Link href="/tools" className="hover:text-gray-700">Tools</Link>
            <span className="mx-2">/</span>
            <Link href="/tools/gridlabd" className="hover:text-gray-700">GridLAB-D</Link>
            <span className="mx-2">/</span>
            <span>Projects</span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="w-16 h-16 bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">[FILE]</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No projects yet</h2>
                <p className="text-gray-600 mb-6">Create your first GridLAB-D project to get started.</p>
                <button onClick={() => setShowNew(true)} className="px-6 py-3 bg-orange-600 text-white hover:bg-orange-700 transition-colors">Create Project</button>
              </div>
            </div>
          ) : (
            <div className="flex h-[calc(100vh-200px)] bg-white shadow-sm">
              <ProjectsSidebar onCreate={() => setShowNew(true)} />
              <div className="flex-1 flex flex-col">
                <ProjectsHeader title="GridLAB-D Projects" planLabel="free" onUpgrade={() => {}} />
                <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
                  <div className="text-sm text-gray-700">Upgrade to NERC-CIP and SOC-2 Compliant Platform for enhanced cybersecurity and compliance.</div>
                  <div className="flex items-center gap-3">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Contact sales</button>
                    <button className="text-gray-500 hover:text-gray-700">[X]</button>
                  </div>
                </div>
                {/* bulk actions bar */}
                {selectedIds.size > 0 && (
                  <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                    <div className="text-sm text-gray-700">{selectedIds.size} selected</div>
                    <button onClick={() => openShareFor()} className="px-3 py-1.5 text-sm text-white" style={{ background: '#EA580B' }}>Share</button>
                  </div>
                )}
                <div className="px-6 py-4">
                  <div className="relative">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search in all projects..." className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">[SEARCH]</span>
                  </div>
                </div>
                <ProjectsTable
                  projects={paginatedProjects}
                  onOpen={handleOpen}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onShare={(p) => openShareFor(p)}
                  search={search}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  selectedIds={selectedIds}
                  onToggleSelect={onToggleSelect}
                  onToggleSelectAll={onToggleSelectAll}
                />
              </div>
            </div>
          )}

          <NewProjectModal open={showNew} onClose={() => setShowNew(false)} onCreate={handleCreate} />
          <ShareModal
            isOpen={shareOpen}
            onClose={() => setShareOpen(false)}
            title={shareProjectIds.length > 1 ? 'Share projects' : 'Share project'}
            projectLink={shareProjectIds.length === 1 ? `${typeof window !== 'undefined' ? window.location.origin : ''}/tools/gridlabd/projects/${shareProjectIds[0]}` : ''}
            multipleCount={shareProjectIds.length}
            onSubmit={handleShareSubmit}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}