'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { projects as projectsAPI, simulations as simulationsAPI, users as usersAPI } from '@/lib/gridlabdClient';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import OutputsTab from '@/app/tools/gridlabd/components/OutputsTab';
import { Plus, Save, Terminal, ArrowLeft, Play, Share2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ShareModal from '@/components/ShareModal';

// Dynamic Monaco Editor
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { ssr: false }
);

// Instant Tooltip Icon Button
function IconButton({ onClick, disabled, title, ariaLabel, className = '', active = false, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || title}
      className={`group relative p-1.5 ${disabled ? 'text-gray-300 cursor-not-allowed' : active ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'} ${className}`}
      type="button"
    >
      {children}
      <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] leading-none px-2 py-1 bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
        {title}
      </span>
    </button>
  );
}

export default function ProjectEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const projectId = params.projectId;
  const { toast } = useToast();

  // sharing state
  const [shareOpen, setShareOpen] = useState(false);

  // State management
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('code');
  const [simulations, setSimulations] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  
  // Console state
  const [showConsole, setShowConsole] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(200);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isPollingConsole, setIsPollingConsole] = useState(false);
  const consolePollingRef = useRef(null);
  const consoleEndRef = useRef(null);

  // Fetch project and files on mount
  useEffect(() => {
    if (projectId && user) {
      fetchProjectData();
    }
  }, [projectId, user]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const id = projectId;
      // Fetch project details
      const projectData = await projectsAPI.get(id, { forceLocal: true });
      setProject(projectData);
      // Fetch project files
      const filesData = await projectsAPI.listFiles(id, { forceLocal: true });
      const list = Array.isArray(filesData) ? filesData : filesData.files || [];
      setFiles(list);
      // Fetch project simulations
      const simulationsData = await projectsAPI.listSimulations(id, {}, { forceLocal: true });
      setSimulations(Array.isArray(simulationsData) ? simulationsData : simulationsData.simulations || []);
    } catch (error) {
      console.error('Failed to fetch project data:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to load project data', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Console polling logic
  useEffect(() => {
    if (selectedSimulation && showConsole && (selectedSimulation.status === 'running' || selectedSimulation.status === 'RUNNING')) {
      startConsolePolling(selectedSimulation.id || selectedSimulation.simulation_id);
    } else {
      stopConsolePolling();
    }

    return () => stopConsolePolling();
  }, [selectedSimulation, showConsole]);

  const startConsolePolling = (simulationId) => {
    if (consolePollingRef.current) return;
    
    setIsPollingConsole(true);
    
    const fetchConsole = async () => {
      try {
        const response = await simulationsAPI.console(simulationId);
        const output = response.output || response.console || response;
        setConsoleOutput(prev => {
          if (typeof output === 'string' && output !== prev) {
            return output;
          }
          return prev;
        });
        
        // Auto-scroll to bottom
        if (consoleEndRef.current) {
          consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (error) {
        console.error('Failed to fetch console output:', error);
      }
    };

    // Initial fetch
    fetchConsole();
    
    // Set up polling interval
    consolePollingRef.current = setInterval(fetchConsole, 5000);
  };

  const stopConsolePolling = () => {
    if (consolePollingRef.current) {
      clearInterval(consolePollingRef.current);
      consolePollingRef.current = null;
    }
    setIsPollingConsole(false);
  };

  // Handle file selection
  const handleFileSelect = useCallback(async (file) => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Do you want to continue?');
      if (!confirmed) return;
    }

    try {
      const fileData = await projectsAPI.getFile(projectId, file.id, { forceLocal: true });
      setSelectedFile(file);
      setFileContent(fileData.content || '');
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to fetch file:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to load file content', 
        variant: 'destructive' 
      });
    }
  }, [isDirty, projectId, toast]);

  // Auto-select default main*.glm when files load
  useEffect(() => {
    if (!selectedFile && Array.isArray(files) && files.length) {
      const byName = (f) => typeof f?.filename === 'string' ? f.filename : '';
      const mainCandidate = files.find(f => /^main(\.|_)/i.test(byName(f))) || files.find(f => /^main/i.test(byName(f))) || files[0];
      if (mainCandidate) {
        handleFileSelect(mainCandidate);
      }
    }
  }, [files, selectedFile, handleFileSelect]);

  // Handle file content change
  const handleContentChange = (value) => {
    setFileContent(value);
    setIsDirty(true);
  };

  // Save file
  const handleSaveFile = async () => {
    if (!selectedFile || !isDirty) return;

    try {
      await projectsAPI.updateFile(projectId, selectedFile.id, { 
        content: fileContent,
        filename: selectedFile.filename 
      }, { forceLocal: true });
      setIsDirty(false);
      toast({ 
        title: 'Success', 
        description: 'File saved successfully' 
      });
    } catch (error) {
      console.error('Failed to save file:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to save file', 
        variant: 'destructive' 
      });
    }
  };

  // Create new file
  const handleCreateFile = async () => {
    if (!newFileName.trim()) {
      toast({ 
        title: 'Error', 
        description: 'Please enter a file name', 
        variant: 'destructive' 
      });
      return;
    }

    try {
      const newFile = await projectsAPI.createFile(projectId, {
        filename: newFileName,
        content: newFileContent || '// New GLM file\n',
        file_type: newFileName.endsWith('.glm') ? 'glm' : 'text'
      }, { forceLocal: true });
      // Refresh files list (without full-page loading state)
      const filesData = await projectsAPI.listFiles(projectId, { forceLocal: true });
      const list = Array.isArray(filesData) ? filesData : filesData.files || [];
      setFiles(list);
      // Select the new file
      handleFileSelect(newFile);
      // Reset form and close modal
      setNewFileName('');
      setNewFileContent('');
      setShowNewFile(false);
      
      toast({ 
        title: 'Success', 
        description: 'File created successfully' 
      });
    } catch (error) {
      console.error('Failed to create file:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to create file', 
        variant: 'destructive' 
      });
    }
  };

  // Delete file
  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await projectsAPI.deleteFile(projectId, fileId, { forceLocal: true });
      
      // Clear selection if deleted file was selected
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
        setFileContent('');
        setIsDirty(false);
      }
      
      // Refresh files list (no page flash)
      const filesData = await projectsAPI.listFiles(projectId, { forceLocal: true });
      const list = Array.isArray(filesData) ? filesData : filesData.files || [];
      setFiles(list);
      
      toast({ 
        title: 'Success', 
        description: 'File deleted successfully' 
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to delete file', 
        variant: 'destructive' 
      });
    }
  };

  // Run simulation
  const handleRunSimulation = async () => {
    try {
      const simulationData = {
        project_id: projectId,
        name: `Simulation - ${new Date().toLocaleString()}`,
        input_config: {
          main_file: selectedFile?.filename || 'main.glm'
        }
      };
      const newSimulation = await simulationsAPI.create(simulationData, { forceLocal: true });
      
      // Surface immediately without page flash
      setSimulations(prev => [newSimulation, ...(Array.isArray(prev) ? prev : [])]);
      setSelectedSimulation(newSimulation);
      
      // Open console immediately
      setShowConsole(true);
      setConsoleOutput('Starting simulation...\n');
      
      toast({ 
        title: 'Success', 
        description: 'Simulation started successfully' 
      });
      
      // Start polling for simulation status (no full reload)
      pollSimulationStatus(newSimulation.id || newSimulation.simulation_id);
    } catch (error) {
      console.error('Failed to run simulation:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to start simulation', 
        variant: 'destructive' 
      });
    }
  };

  // Poll simulation status
  const pollSimulationStatus = async (simulationId) => {
    const pollInterval = setInterval(async () => {
      try {
        const simulation = await simulationsAPI.get(simulationId, { forceLocal: true });
        
        // Update simulation in list
        setSimulations(prev => prev.map(s => 
          (s.id === simulationId || s.simulation_id === simulationId) ? simulation : s
        ));
        
        // Update selected simulation
        setSelectedSimulation(simulation);
        
        // Stop polling if simulation is complete
        if (simulation.status === 'completed' || simulation.status === 'COMPLETED' || 
            simulation.status === 'failed' || simulation.status === 'FAILED') {
          clearInterval(pollInterval);
          stopConsolePolling();
          
          if (simulation.status === 'completed' || simulation.status === 'COMPLETED') {
            toast({ 
              title: 'Success', 
              description: 'Simulation completed successfully' 
            });
            setConsoleOutput(prev => prev + '\n=== Simulation completed successfully ===\n');
          } else {
            toast({ 
              title: 'Error', 
              description: 'Simulation failed', 
              variant: 'destructive' 
            });
            setConsoleOutput(prev => prev + '\n=== Simulation failed ===\n');
          }
        }
      } catch (error) {
        console.error('Failed to poll simulation status:', error);
        clearInterval(pollInterval);
      }
    }, 5000); // Poll every 5 seconds
  };

  // Handle console messages from OutputsTab
  const addConsoleMessage = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '[ERROR]' : type === 'warning' ? '[WARN]' : '[INFO]';
    setConsoleOutput(prev => `${prev}${timestamp} ${prefix} ${message}\n`);
  };

  // Handle console resize
  const handleConsoleResize = (e) => {
    e.preventDefault();
    const startY = e.pageY;
    const startHeight = consoleHeight;

    const handleMouseMove = (e) => {
      const deltaY = startY - e.pageY;
      const newHeight = Math.min(600, Math.max(100, startHeight + deltaY));
      setConsoleHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleShareSubmit = async ({ emails, message }) => {
    try {
      let userIds = [];
      if (emails?.length) {
        try {
          const lookup = await usersAPI.lookup(emails);
          const mapped = Array.isArray(lookup?.users) ? lookup.users : [];
          userIds = mapped.filter(u => u.exists && u.id).map(u => u.id);
        } catch {}
      }
      await projectsAPI.share(projectId, { emails, user_ids: userIds, message, expires_in: 86400 });
      toast({ title: 'Shared', description: 'Share link sent to recipients.' });
    } catch (error) {
      console.error('Failed to share project:', error);
      toast({ title: 'Error', description: 'Failed to share project', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <>
        <Header pageTitle="VoltEdge Editor" />
        <div className="min-h-screen flex items-center justify-center pt-12">
          <div className="text-gray-500">Loading project...</div>
        </div>
      </>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  if (!project) {
    return (
      <>
        <Header pageTitle="VoltEdge Editor" />
        <div className="min-h-screen flex items-center justify-center pt-12">
          <div className="text-center">
            <div className="text-gray-500 mb-4">Project not found</div>
            <Link
              href="/tools/gridlabd/projects"
              className="text-orange-600 hover:text-orange-700"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <ProtectedRoute>
      <Header pageTitle={`VoltEdge - ${project?.name || ''}`} />
      <div className="min-h-screen bg-gray-50 pt-12">
        {/* Removed wide sub-header bar; controls moved into Files header */}

        {/* Main Content */}
        <div className="flex h-[calc(100vh-108px)]" style={{ height: showConsole ? `calc(100vh - 108px - ${consoleHeight}px)` : 'calc(100vh - 108px)' }}>
          {/* Left Column - File List */}
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Link href="/tools/gridlabd/projects" aria-label="Back" title="Back" className="text-gray-700 hover:text-gray-900">
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                  <h2 className="text-sm font-semibold text-gray-700">Files</h2>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton onClick={() => setShowNewFile(true)} title="New File" ariaLabel="New File">
                    <Plus className="w-4 h-4" />
                  </IconButton>
                  <IconButton onClick={handleSaveFile} disabled={!isDirty || !selectedFile} title="Save File" ariaLabel="Save File">
                    <Save className="w-4 h-4" />
                  </IconButton>
                  <IconButton onClick={() => setShowConsole(!showConsole)} title={showConsole ? 'Hide Console' : 'Show Console'} ariaLabel={showConsole ? 'Hide Console' : 'Show Console'} active={showConsole}>
                    <Terminal className="w-4 h-4" />
                  </IconButton>
                  <IconButton onClick={() => setShareOpen(true)} title="Share Project" ariaLabel="Share Project" className="text-[#ea580b] hover:text-orange-700">
                    <Share2 className="w-4 h-4" />
                  </IconButton>
                  <IconButton onClick={handleRunSimulation} title="Run Simulation" ariaLabel="Run Simulation" className="text-[#ea580b] hover:text-orange-700">
                    <Play className="w-4 h-4" />
                  </IconButton>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {files.length > 0 ? (
                <div className="py-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={`group flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                        selectedFile?.id === file.id ? 'bg-orange-50 border-l-2 border-orange-600' : ''
                      }`}
                      onClick={() => handleFileSelect(file)}
                    >
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <span className="text-gray-400">📄</span>
                        <span className="text-sm text-gray-700 truncate">
                          {file.filename}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 text-xs px-1"
                        title="Delete"
                        aria-label="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No files yet. Create your first file to get started.
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Editor */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 px-4">
              <div className="flex space-x-6">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'code'
                      ? 'text-orange-600 border-orange-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  Code Editor
                </button>
                <button
                  onClick={() => setActiveTab('outputs')}
                  className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'outputs'
                      ? 'text-orange-600 border-orange-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  Outputs
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 bg-white overflow-hidden">
              {activeTab === 'code' ? (
                <div className="h-full">
                  {selectedFile ? (
                    <MonacoEditor
                      height="100%"
                      language="plaintext"
                      theme="vs-light"
                      value={fileContent}
                      onChange={handleContentChange}
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        wordWrap: 'on',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        tabSize: 2,
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      Select a file to edit or create a new file
                    </div>
                  )}
                </div>
              ) : (
                <OutputsTab 
                  simulations={simulations}
                  selectedProjectId={projectId}
                  addConsoleMessage={addConsoleMessage}
                />
              )}
            </div>
          </div>

          {/* Right Column - Empty for now */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Properties</h3>
            <p className="text-sm text-gray-500">
              Additional features coming soon...
            </p>
            {selectedSimulation && (
              <div className="mt-4 p-3 bg-white border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Simulation</h4>
                <div className="text-xs space-y-1">
                  <div>ID: {selectedSimulation.id || selectedSimulation.simulation_id}</div>
                  <div>Status: <span className={`font-medium ${
                    (selectedSimulation.status === 'completed' || selectedSimulation.status === 'COMPLETED') ? 'text-green-600' :
                    (selectedSimulation.status === 'running' || selectedSimulation.status === 'RUNNING') ? 'text-orange-600' :
                    (selectedSimulation.status === 'failed' || selectedSimulation.status === 'FAILED') ? 'text-red-600' :
                    'text-gray-600'
                  }`}>{selectedSimulation.status}</span></div>
                  {isPollingConsole && (
                    <div className="text-orange-600">🔄 Polling console...</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Console Panel */}
        {showConsole && (
          <div className="border-t border-gray-300">
            {/* Console Resize Handle */}
            <div 
              className="h-1 bg-gray-200 hover:bg-gray-300 cursor-ns-resize"
              onMouseDown={handleConsoleResize}
            />
            
            {/* Console Content */}
            <div 
              className="bg-black text-green-400 font-mono text-xs p-4 overflow-auto"
              style={{ height: `${consoleHeight}px` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-500">Terminal Output</div>
                {isPollingConsole && (
                  <div className="text-xs text-orange-400">● Live (5s refresh)</div>
                )}
              </div>
              <pre className="whitespace-pre-wrap">
                {consoleOutput || 'No output yet. Run a simulation to see console output here.'}
                <div ref={consoleEndRef} />
              </pre>
            </div>
          </div>
        )}

        {/* Share Modal */}
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          title="Share project"
          projectLink={`${typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''}`}
          multipleCount={0}
          onSubmit={handleShareSubmit}
        />

        {/* New File Modal */}
        {showNewFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Create New File</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="example.glm"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Content (Optional)
                  </label>
                  <textarea
                    value={newFileContent}
                    onChange={(e) => setNewFileContent(e.target.value)}
                    placeholder="// Enter initial file content..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setShowNewFile(false);
                    setNewFileName('');
                    setNewFileContent('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFile}
                  className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700"
                >
                  Create File
                </button>
              </div>
            </div>
          </div>
        )}

        <Toaster />
      </div>
    </ProtectedRoute>
  );
}