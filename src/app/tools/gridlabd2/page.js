'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { GridLABDProvider, useGridLABD } from '@/lib/gridlabdStore';
import { projects as projectsAPI, simulations as simulationsAPI } from '@/lib/gridlabdClient';
import JSZip from 'jszip';
import { Plus, Save, Terminal } from 'lucide-react';

// Dynamic Monaco Editor
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { ssr: false }
);

// Simple Resizable Panel Component
const ResizablePanel = ({ children, initialWidth = '25%', onResize }) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback((e) => {
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = parseInt(width, 10) || window.innerWidth * 0.25;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [width]);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    const newWidth = startWidth.current + (e.clientX - startX.current);
    const newPercent = (newWidth / window.innerWidth) * 100;
    setWidth(`${Math.max(10, Math.min(40, newPercent))}%`);
    onResize?.(newPercent);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove]);

  return (
    <>
      <div style={{ width }} className="flex flex-col overflow-hidden">
        {children}
      </div>
      <div
        className="w-1 bg-gray-300 cursor-col-resize hover:bg-[#ea580b] transition-colors"
        onMouseDown={handleMouseDown}
      />
    </>
  );
};

// Left Panel - Projects and File Tree
const LeftPanel = () => {
  const { state: { projects, currentProject, files, loading, selectedProjectId }, createProject, selectProject, loadProjects, createFile, updateFile, deleteFile, bulkSaveFiles, openFile } = useGridLABD();
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [showNewFile, setShowNewFile] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [selectedFileId, setSelectedFileId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    try {
      const newProject = await createProject({ name: projectName, description: '', is_public: false, tags: [] });
      toast({ title: 'Project Created', description: `Created ${newProject.name}` });
      setShowNewProject(false);
      setProjectName('');
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleCreateFile = async () => {
    if (!fileName.trim() || !currentProject) return;
    try {
      const newFile = await createFile(currentProject.id, { filename: fileName, content: fileContent || '// New GLM file', file_type: 'glm' });
      openFile(newFile);
      toast({ title: 'File Created', description: `Created ${fileName}` });
      setShowNewFile(false);
      setFileName('');
      setFileContent('');
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!currentProject) return;
    try {
      await deleteFile(currentProject.id, fileId);
      toast({ title: 'File Deleted', description: 'File removed successfully' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSaveFile = async (file) => {
    if (!currentProject) return;
    try {
      await updateFile(currentProject.id, file.id, { content: file.content });
      toast({ title: 'File Saved', description: 'File updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleBulkSave = async () => {
    if (!currentProject || files.length === 0) return;
    try {
      const saveData = { files: files.map(f => ({ id: f.id, content: f.content })) };
      await bulkSaveFiles(currentProject.id, saveData);
      toast({ title: 'All Files Saved', description: 'Bulk save completed' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Projects Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-gray-800">Projects</h2>
          <button
            onClick={() => setShowNewProject(true)}
            className="text-xs text-[#ea580b] hover:underline"
            title="New Project"
            aria-label="New Project"
          >
            New Project
          </button>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-1">
          {loading ? (
            <p className="text-xs text-gray-500">Loading projects...</p>
          ) : Array.isArray(projects) ? projects.map((project) => (
            <div
              key={project.id}
              className={`p-2 text-xs cursor-pointer ${selectedProjectId === project.id ? 'bg-[#ea580b] text-white' : 'hover:bg-gray-100'} ${currentProject?.id === project.id ? 'border border-[#ea580b]' : ''}`}
              onClick={() => selectProject(project.id)}
            >
              {project.name}
            </div>
          )) : (
            <p className="text-xs text-gray-500">No projects available</p>
          )}
        </div>
      </div>

      {/* File Tree Section */}
      {currentProject && (
        <div className="flex-1 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-800">Files - {currentProject.name}</h3>
              <div className="space-x-1">
                <button
                  onClick={() => setShowNewFile(true)}
                  className="p-2 text-gray-700 hover:text-gray-900"
                  title="New File"
                  aria-label="New File"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleBulkSave}
                  className="p-2 text-gray-700 hover:text-gray-900"
                  title="Save All"
                  aria-label="Save All"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-2 overflow-y-auto text-xs">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-1 hover:bg-gray-100">
                <span
                  className={`cursor-pointer ${selectedFileId === file.id ? 'font-semibold text-[#ea580b]' : ''}`}
                  onClick={() => {
                    setSelectedFileId(file.id);
                    openFile(file);
                  }}
                >
                  {file.filename}
                </span>
                <div>
                  <button onClick={() => handleSaveFile(file)} className="text-gray-700 mr-1" title="Save"><Save className="inline w-4 h-4" /></button>
                  <button onClick={() => handleDeleteFile(file.id)} className="text-red-600" title="Delete">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">New Project</h3>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              className="w-full p-2 border border-gray-300 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowNewProject(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button onClick={handleCreateProject} className="px-4 py-2 bg-[#ea580b] text-white">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* New File Modal */}
      {showNewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">New File</h3>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="File name (e.g., main.glm)"
              className="w-full p-2 border border-gray-300 mb-4"
            />
            <textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="// Add initial content"
              className="w-full p-2 border border-gray-300 mb-4 h-32"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowNewFile(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button onClick={handleCreateFile} className="px-4 py-2 bg-[#ea580b] text-white">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Center Panel - Editor Tabs
const CenterPanel = () => {
  const { state: { openFiles, selectedProjectId }, updateOpenFile } = useGridLABD();
  const [activeTab, setActiveTab] = useState('editor');
  const [activeFileId, setActiveFileId] = useState(null);

  useEffect(() => {
    if (openFiles.length > 0 && !activeFileId) {
      setActiveFileId(openFiles[0].id);
    }
  }, [openFiles, activeFileId]);

  const activeFile = openFiles.find(f => f.id === activeFileId);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Tab Bar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex space-x-2">
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'editor' ? 'bg-white border border-[#ea580b] text-[#ea580b]' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Editor
        </button>
        <button
          onClick={() => setActiveTab('simulations')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'simulations' ? 'bg-white border border-[#ea580b] text-[#ea580b]' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Simulations
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'editor' && (
          <div className="h-full">
            {activeFile ? (
              <MonacoEditor
                height="100%"
                language="plaintext"
                theme="vs-light"
                value={activeFile.content}
                onChange={(value) => {
                  // Update in store
                  updateOpenFile({ ...activeFile, content: value });
                }}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                  fontFamily: 'Sen, monospace'
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Open a file to edit
              </div>
            )}
          </div>
        )}

        {activeTab === 'simulations' && (
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-4">Simulation History</h3>
            <p>Simulation list placeholder - integrate with store</p>
            {/* Integrate simulations list here */}
          </div>
        )}
      </div>
    </div>
  );
};

// Right Panel - Outputs, Console, Status
const RightPanel = () => {
  const { state: { simulations }, getSimulationConsole, downloadOutputs, cancelSimulation } = useGridLABD();
  const [activeTab, setActiveTab] = useState('console');
  const [selectedSimulationId, setSelectedSimulationId] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState('');
  const pollingInterval = useRef(null);

  const selectedSimulation = Array.isArray(simulations) ? simulations.find(s => s.id === selectedSimulationId) : null;

  // Poll console for selected simulation
  useEffect(() => {
    if (selectedSimulationId && selectedSimulation?.status === 'running') {
      pollingInterval.current = setInterval(async () => {
        try {
          const consoleData = await getSimulationConsole(selectedSimulationId);
          setConsoleOutput(consoleData.output || '');
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 2000);
      return () => clearInterval(pollingInterval.current);
    }
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
    return () => clearInterval(pollingInterval.current);
  }, [selectedSimulationId, selectedSimulation?.status]);

  const handleDownload = async () => {
    if (!selectedSimulationId) return;
    try {
      const zipBlob = await downloadOutputs(selectedSimulationId);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `outputs-${selectedSimulationId}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleCancel = async () => {
    if (!selectedSimulationId) return;
    try {
      await cancelSimulation(selectedSimulationId);
    } catch (error) {
      console.error('Cancel error:', error);
    }
  };

  return (
    <div className="bg-gray-50 border-l border-gray-200 flex flex-col h-full w-80">
      {/* Tab Bar */}
      <div className="border-b border-gray-200 bg-white p-2 flex space-x-2">
        <button
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'status' ? 'text-white bg-[#ea580b]' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Status
        </button>
        <button
          onClick={() => setActiveTab('console')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'console' ? 'text-white bg-[#ea580b]' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Console
        </button>
        <button
          onClick={() => setActiveTab('outputs')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'outputs' ? 'text-white bg-[#ea580b]' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Outputs
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'status' && (
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-4">Simulation Status</h3>
            <div className="space-y-2">
              {Array.isArray(simulations) ? simulations.map((sim) => (
                <div key={sim.id} className="p-2 bg-white border">
                  <div className="text-xs font-medium">{sim.name || sim.id}</div>
                  <div className="text-xs text-gray-600">Status: {sim.status}</div>
                  <div className="text-xs">Started: {new Date(sim.started_at).toLocaleString()}</div>
                  {sim.status === 'running' && (
                    <button onClick={() => setSelectedSimulationId(sim.id)} className="text-xs text-[#ea580b] mt-1">
                      View Console
                    </button>
                  )}
                  {sim.status === 'completed' && (
                    <button onClick={handleDownload} className="text-xs text-green-600 mt-1">
                      Download Outputs
                    </button>
                  )}
                  {sim.status === 'running' && (
                    <button onClick={handleCancel} className="text-xs text-red-600 mt-1">
                      Cancel
                    </button>
                  )}
                </div>
              )) : (
                <p className="text-xs text-gray-500">No simulations</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'console' && (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold">Console Output</h3>
              {selectedSimulation && (
                <div className="text-xs text-gray-600 mt-1">Simulation: {selectedSimulation.name || selectedSimulation.id}</div>
              )}
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-black text-green-400 text-xs font-mono whitespace-pre-wrap">
              {consoleOutput || 'No output yet...'}
            </div>
          </div>
        )}

        {activeTab === 'outputs' && (
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-4">Outputs</h3>
            {selectedSimulation && selectedSimulation.has_output ? (
              <div className="space-y-2">
                <p className="text-xs">Files generated. Use download button in status tab.</p>
              </div>
            ) : (
              <p className="text-xs text-gray-500">No outputs available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Run Upload
const QuickRunUpload = () => {
  const fileInputRef = useRef(null);
  const { runArchiveSimulation } = useGridLABD();
  const { toast } = useToast();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      toast({ title: 'Error', description: 'Please upload a ZIP file', variant: 'destructive' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('main_filename', 'main.glm');
    formData.append('name', `Quick Run - ${file.name}`);

    try {
      const sim = await runArchiveSimulation(formData);
      toast({ title: 'Quick Run Started', description: `Simulation ID: ${sim.id}` });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <h3 className="text-sm font-semibold mb-2">Quick Run (Upload ZIP)</h3>
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full text-xs bg-[#ea580b] text-white py-2 hover:bg-orange-600"
      >
        Upload Project ZIP
      </button>
      <p className="text-xs text-gray-500 mt-1">Upload a zipped project for quick simulation without login.</p>
    </div>
  );
};

// Top Bar with User Profile
const TopBar = () => {
  const { state: { userProfile } } = useGridLABD();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">GridLAB-D IDE</h1>
      <div className="flex items-center space-x-4">
        {userProfile ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm">Welcome, {userProfile.name || userProfile.email}</span>
            <button onClick={() => setShowProfile(!showProfile)} className="text-[#ea580b]">Profile</button>
            {showProfile && (
              <div className="absolute top-full right-0 bg-white border p-2 text-xs">
                <p>Usage: {userProfile.usage_stats?.simulations_run || 0} runs</p>
                <button className="text-red-600 mt-2">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">Anonymous Mode - Create account to save projects</p>
        )}
      </div>
    </div>
  );
};

// Main IDE Component
function IDE() {
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get('project');
  const { toast } = useToast();
  const { selectProject } = useGridLABD();
  const [rightPanelWidth, setRightPanelWidth] = useState(25); // %

  useEffect(() => {
    if (initialProjectId) {
      // Select project from URL
      selectProject(initialProjectId);
    }
  }, [initialProjectId, selectProject]);

  return (
    <div className="h-screen flex flex-col bg-gray-100 font-sans" style={{ fontFamily: 'Sen, sans-serif' }}>
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Resizable */}
        <ResizablePanel initialWidth="25%" onResize={setRightPanelWidth}>
          <LeftPanel />
        </ResizablePanel>

        {/* Center Panel */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ flex: `1 1 ${100 - 50}%` }}>
          <CenterPanel />
        </div>

        {/* Right Panel - Resizable */}
        <ResizablePanel initialWidth={`${rightPanelWidth}%`} onResize={() => {}}>
          <RightPanel />
        </ResizablePanel>
      </div>

      {/* Bottom Quick Run */}
      <QuickRunUpload />

      {/* Persist layout in localStorage if needed */}
    </div>
  );
}

// Wrapped with Provider
export default function GridLABDPage() {
  return (
    <GridLABDProvider>
      <IDE />
      <Toaster />
    </GridLABDProvider>
  );
}