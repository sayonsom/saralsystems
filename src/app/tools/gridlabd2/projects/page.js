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

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiProjects.listProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Fallback to direct apiFetch
        try {
          const data = await apiFetch('/api/projects');
          setProjects(Array.isArray(data) ? data : []);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          setProjects([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreate = async (data) => {
    try {
      const newProject = await apiProjects.createProject(data);
      setProjects(prev => [newProject, ...prev]);
      setShowNew(false);
      // Navigate to the project editor
      router.push(`/tools/gridlabd2?project=${newProject.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      // Fallback: try direct apiFetch if gridlabdClient fails
      try {
        const newProject = await apiFetch('/api/projects', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        setProjects(prev => [newProject, ...prev]);
        setShowNew(false);
        router.push(`/tools/gridlabd2?project=${newProject.id}`);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  };

  const handleOpen = (project) => {
    router.push(`/tools/gridlabd2?project=${project.id}`);
  };

  const handleDuplicate = (project) => {
    // Simple duplication - create a copy with modified name
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
      await apiProjects.deleteProject(project.id);
      setProjects(prev => prev.filter(p => p.id !== project.id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      // Fallback to direct apiFetch
      try {
        await apiFetch(`/api/projects/${project.id}`, {
          method: 'DELETE'
        });
        setProjects(prev => prev.filter(p => p.id !== project.id));
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter projects based on search
  const filteredProjects = useMemo(() => {
    const q = (search || "").toLowerCase();
    const arr = Array.isArray(projects) ? projects : (projects?.projects || projects?.data || []);
    return arr.filter((p) => (p?.name || "").toLowerCase().includes(q));
  }, [projects, search]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  const hasProjects = projects.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-gray-500">
          <Link href="/tools" className="hover:text-gray-700">Tools</Link>
          <span className="mx-2">/</span>
          <Link href="/tools/gridlabd2" className="hover:text-gray-700">GridLAB-D</Link>
          <span className="mx-2">/</span>
          <span>Projects</span>
        </div>

        {!hasProjects ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <div className="w-16 h-16 bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">[FILE]</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No projects yet</h2>
              <p className="text-gray-600 mb-6">Create your first GridLAB-D project to get started.</p>
              <button
                onClick={() => setShowNew(true)}
                className="px-6 py-3 bg-orange-600 text-white hover:bg-orange-700 transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-200px)] bg-white shadow-sm">
            <ProjectsSidebar onCreate={() => setShowNew(true)} />

            <div className="flex-1 flex flex-col">
              <ProjectsHeader title="GridLAB-D Projects" planLabel="free" onUpgrade={() => {}} />

              <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  GridLAB-D Cloud: Run your simulations in the cloud for better performance.
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Contact sales</button>
                  <button className="text-gray-500 hover:text-gray-700">[X]</button>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search in all projects..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">[SEARCH]</span>
                </div>
              </div>

              <ProjectsTable
                projects={paginatedProjects}
                onOpen={handleOpen}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                search={search}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}

        <NewProjectModal
          open={showNew}
          onClose={() => setShowNew(false)}
          onCreate={handleCreate}
        />
      </div>
    </div>
  );
}