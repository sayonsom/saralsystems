'use client';

// Migrated from /tools/gridlabd/projects/page.js with path adjustments
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { projects as apiProjects, users as apiUsers } from '@/lib/gridlabdClient';
import ProjectsTable from '@/components/gridlabd/ProjectsTable';
import ProjectsHeader from '@/components/gridlabd/ProjectsHeader';
import ProjectsSidebar from '@/components/gridlabd/ProjectsSidebar';
import NewProjectModal from '@/components/gridlabd/NewProjectModal';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ShareModal from '@/components/ShareModal';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function ProjectsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all'); // all | owned | shared | archived | trashed
  const [showNew, setShowNew] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // Updated page size to 25 per request
  const itemsPerPage = 25;

  // selection and sharing state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [shareOpen, setShareOpen] = useState(false);
  const [shareProjectIds, setShareProjectIds] = useState([]);
  const [loadError, setLoadError] = useState(null); // store error message or null

  const titleMap = { all: 'All projects', owned: 'Your projects', shared: 'Shared with you', archived: 'Archived projects', trashed: 'Trashed projects' };

  const fetchProjects = async (nextView = view, nextSearch = search) => {
    setLoadingProjects(true);
    setLoadError(null);
    try {
      let data;
      if (nextView === 'shared') data = await apiProjects.shared();
      else if (nextView === 'archived') data = await apiProjects.archived();
      else if (nextView === 'trashed') data = await apiProjects.trashed();
      else data = await apiProjects.filter({ view: nextView, q: nextSearch });

      let arr = [];
      if (Array.isArray(data)) arr = data;
      else if (data?.projects && Array.isArray(data.projects)) arr = data.projects;
      else if (data?.data && Array.isArray(data.data)) arr = data.data;
      const normalized = (arr || []).map((p) => ({ ...p, id: p?.id || p?._id || p?.project_id })).filter((p) => !!p.id);
      setProjects(normalized);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
      setLoadError(error?.message || 'Server error');
    } finally {
      setLoadingProjects(false);
    }
  };

  // Initial + on auth ready
  useEffect(() => {
    if (user) fetchProjects('all', '');
    else if (!loading) setLoadingProjects(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  // Reload on view change
  useEffect(() => {
    if (!user) return;
    fetchProjects(view, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Debounce search
  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => fetchProjects(view, search), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleCreate = async (data) => {
    try {
      const created = await apiProjects.create(data);
      const newProject = created?.id ? created : (created?.project || created?.data || created);
      const normalized = { ...newProject, id: newProject?.id || newProject?._id || newProject?.project_id };
      setProjects(prev => [normalized, ...prev]);
      setShowNew(false);
      router.push(`/projects/${normalized.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      try {
        const created = await apiFetch('/api/projects', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        const newProject = created?.id ? created : (created?.project || created?.data || created);
        const normalized = { ...newProject, id: newProject?.id || newProject?._id || newProject?.project_id };
        setProjects(prev => [normalized, ...prev]);
        setShowNew(false);
        router.push(`/projects/${normalized.id}`);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  };

  const handleOpen = (project) => {
    const id = project?.id || project?._id || project?.project_id;
    if (!id) return;
    router.push(`/projects/${id}`);
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

  const handleTrash = async (project) => {
    try {
      await apiProjects.trash(project.id);
      await fetchProjects(view, search);
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(project.id); return next; });
      toast({ title: 'Moved to trash', description: 'Project moved to trash.' });
    } catch (error) {
      console.error('Failed to move to trash:', error);
      toast({ title: 'Error', description: 'Failed to move project to trash.', variant: 'destructive' });
    }
  };

  const handleDelete = async (project) => {
    try {
      await apiProjects.delete(project.id);
      setProjects(prev => prev.filter(p => p.id !== project.id));
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(project.id); return next; });
      toast({ title: 'Deleted', description: 'Project deleted successfully.' });
    } catch (error) {
      console.error('Failed to delete project:', error);
      try {
        await apiFetch(`/api/projects/${project.id}`, { method: 'DELETE' });
        setProjects(prev => prev.filter(p => p.id !== project.id));
        toast({ title: 'Deleted', description: 'Project deleted successfully.' });
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        toast({ title: 'Error', description: 'Failed to delete project.', variant: 'destructive' });
      }
    }
  };

  const handleArchive = async (project) => {
    try { await apiProjects.archive(project.id); await fetchProjects(view, search); toast({ title: 'Archived', description: 'Project archived.' }); } catch (e) { console.error(e); }
  };
  const handleUnarchive = async (project) => {
    try { await apiProjects.unarchive(project.id); await fetchProjects(view, search); toast({ title: 'Unarchived', description: 'Project restored from archive.' }); } catch (e) { console.error(e); }
  };
  const handleRestore = async (project) => {
    try { await apiProjects.restore(project.id); await fetchProjects(view, search); toast({ title: 'Restored', description: 'Project restored from trash.' }); } catch (e) { console.error(e); }
  };

  const handlePageChange = (page) => { setCurrentPage(page); };

  // server already filtered by q; keep client-side filtering minimal (acts as safety)
  const filteredProjects = useMemo(() => {
    const q = (search || '').toLowerCase();
    return Array.isArray(projects) ? projects.filter((p) => (p?.name || '').toLowerCase().includes(q)) : [];
  }, [projects, search]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
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
    try {
      // resolve emails to user_ids
      let userIds = [];
      if (emails?.length) {
        try {
          const lookup = await apiUsers.lookup(emails);
          const mapped = Array.isArray(lookup?.users) ? lookup.users : [];
          userIds = mapped.filter(u => u.exists && u.id).map(u => u.id);
        } catch {}
      }

      if (ids.length > 1) {
        await apiProjects.shareBulk({ project_ids: ids, emails, user_ids: userIds, message, expires_in: 86400 });
      } else if (ids.length === 1) {
        await apiProjects.share(ids[0], { emails, user_ids: userIds, message, expires_in: 86400 });
      }
      toast({ title: 'Shared', description: 'Share links sent to recipients.' });
    } catch (e) {
      console.error('Failed to share project(s)', ids, e);
      const desc = e?.message ? e.message.slice(0, 300) : 'Share failed';
      toast({ title: 'Error', description: desc, variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <>
        <Header pageTitle="VoltEdge Projects" />
        <div className="min-h-screen flex items-center justify-center pt-12">
          <div className="text-gray-500">Loading…</div>
        </div>
      </>
    );
  }

  const isSpecialView = ['shared', 'archived', 'trashed'].includes(view);
  const showErrorEmpty = isSpecialView && loadError && !loadingProjects && projects.length === 0;
  const showStandardEmpty = !showErrorEmpty && (!projects || projects.length === 0) && !loadingProjects;

  return (
    <ProtectedRoute>
      <Header pageTitle="VoltEdge Projects" />
      <div className="min-h-screen bg-gray-50 pt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-4 text-sm text-gray-500">
            <Link href="/tools" className="hover:text-gray-700">Tools</Link>
            <span className="mx-2">/</span>
            <span>Projects</span>
          </div>

          {showStandardEmpty ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="w-16 h-16 bg-orange-100 flex items-center justify-center mx-auto mb-4 rounded">
                  {/* Illustration placeholder */}
                  <span className="text-2xl">📁</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No projects yet</h2>
                <p className="text-gray-600 mb-6">Create your first VoltEdge project to get started.</p>
                {(view === 'all' || view === 'owned') && (
                  <button onClick={() => setShowNew(true)} className="px-6 py-3 bg-orange-600 text-white hover:bg-orange-700 transition-colors">Create Project</button>
                )}
              </div>
            </div>
          ) : showErrorEmpty ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 flex items-center justify-center mx-auto mb-4 rounded">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to load {titleMap[view] || 'projects'}</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-4">Encountered a server error while loading these projects. Please retry or contact support at <a href="mailto:hello@voltedge.dev" className="text-orange-600 hover:underline">hello@voltedge.dev</a>.</p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => fetchProjects(view, search)} className="px-5 py-2 bg-orange-600 text-white hover:bg-orange-700 text-sm">Retry</button>
                  <a href="mailto:hello@voltedge.dev" className="px-5 py-2 border border-gray-300 text-sm hover:bg-gray-50">Contact Support</a>
                </div>
                {process.env.NODE_ENV !== 'production' && loadError && (
                  <div className="mt-4 text-xs text-gray-400 select-all">{loadError}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-[calc(100vh-200px)] bg-white shadow-sm">
              <ProjectsSidebar onCreate={() => setShowNew(true)} currentView={view} onChangeView={setView} />
              <div className="flex-1 flex flex-col">
                <ProjectsHeader title={titleMap[view] || 'Projects'} planLabel="free" onUpgrade={() => {}} badge={loadingProjects ? 'Loading…' : undefined} />
                <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
                  <div className="text-sm text-gray-700">Upgrade to NERC-CIP and SOC-2 Compliant Platform for enhanced cybersecurity and compliance.</div>
                  <div className="flex items-center gap-3">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Contact sales</button>
                    <button className="text-gray-500 hover:text-gray-700">[X]</button>
                  </div>
                </div>
                {selectedIds.size > 0 && (
                  <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                    <div className="text-sm text-gray-700">{selectedIds.size} selected</div>
                    <button onClick={() => openShareFor()} className="px-3 py-1.5 text-sm text-white" style={{ background: '#EA580B' }}>Share</button>
                  </div>
                )}
                <div className="px-6 py-4">
                  <div className="relative">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search in projects..." className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </span>
                  </div>
                </div>
                <ProjectsTable
                  projects={paginatedProjects}
                  onOpen={handleOpen}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onShare={(p) => openShareFor(p)}
                  onArchive={handleArchive}
                  onUnarchive={handleUnarchive}
                  onRestore={handleRestore}
                  onTrash={handleTrash}
                  search={search}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={filteredProjects.length}
                  onPageChange={handlePageChange}
                  selectedIds={selectedIds}
                  onToggleSelect={onToggleSelect}
                  onToggleSelectAll={onToggleSelectAll}
                  view={view}
                />
              </div>
            </div>
          )}

          <NewProjectModal open={showNew} onClose={() => setShowNew(false)} onCreate={handleCreate} />
          <ShareModal
            isOpen={shareOpen}
            onClose={() => setShareOpen(false)}
            title={shareProjectIds.length > 1 ? 'Share projects' : 'Share project'}
            projectLink={shareProjectIds.length === 1 ? `${typeof window !== 'undefined' ? window.location.origin : ''}/projects/${shareProjectIds[0]}` : ''}
            multipleCount={shareProjectIds.length}
            onSubmit={handleShareSubmit}
          />
        </div>
      </div>
      <Toaster />
    </ProtectedRoute>
  );
}
