'use client';

// Migrated from /tools/gridlabd/projects/[projectId]/page.js with path updates
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { projects as projectsAPI, simulations as simulationsAPI, users as usersAPI } from '@/lib/gridlabdClient';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import OutputsTab from '@/app/tools/gridlabd/components/OutputsTab'; // kept original import path
import { Plus, Save, Terminal, ArrowLeft, Play, Share2, ChevronLeft } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ShareModal from '@/components/ShareModal';
import JSZip from 'jszip';
import AIChatbot from '@/components/AIChatbot';
import Designer from '@/components/load-profile/Designer';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { ssr: false }
);

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
      <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] leading-none px-2 py-1 bg-black text-white rounded z-10 opacity-0 group-hover:opacity-100">
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
  const [shareOpen, setShareOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('code');
  const [simulations, setSimulations] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [renamingFile, setRenamingFile] = useState(null);
  const [renameFileName, setRenameFileName] = useState('');
  const [showConsole, setShowConsole] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(200);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isPollingConsole, setIsPollingConsole] = useState(false);
  const consolePollingRef = useRef(null);
  const consoleEndRef = useRef(null);
  const [showAIChat, setShowAIChat] = useState(true);

  useEffect(() => { if (projectId && user) { fetchProjectData(); } }, [projectId, user]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const id = projectId;
      const projectData = await projectsAPI.get(id, { forceLocal: true });
      setProject(projectData);
      const filesData = await projectsAPI.listFiles(id, { forceLocal: true });
      const list = Array.isArray(filesData) ? filesData : filesData.files || [];
      setFiles(list);
      const simulationsData = await projectsAPI.listSimulations(id, {}, { forceLocal: true });
      const simList = Array.isArray(simulationsData) ? simulationsData : simulationsData.simulations || [];
      setSimulations(simList);
    } catch (error) {
      console.error('Failed to fetch project data:', error);
      toast({ title: 'Error', description: 'Failed to load project data', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (selectedSimulation && showConsole && (selectedSimulation.status === 'running' || selectedSimulation.status === 'RUNNING')) {
      startConsolePolling(selectedSimulation.id || selectedSimulation.simulation_id);
    } else { stopConsolePolling(); }
    return () => stopConsolePolling();
  }, [selectedSimulation, showConsole]);

  const startConsolePolling = (simulationId) => {
    if (consolePollingRef.current) return;
    setIsPollingConsole(true);
    const fetchConsole = async () => {
      try {
        const response = await simulationsAPI.console(simulationId);
        const output = response.output || response.console || response;
        setConsoleOutput(prev => { if (typeof output === 'string' && output !== prev) { return output; } return prev; });
        if (consoleEndRef.current) { consoleEndRef.current.scrollIntoView({ behavior: 'smooth' }); }
      } catch (error) { console.error('Failed to fetch console output:', error); }
    };
    fetchConsole();
    consolePollingRef.current = setInterval(fetchConsole, 5000);
  };

  const stopConsolePolling = () => { if (consolePollingRef.current) { clearInterval(consolePollingRef.current); consolePollingRef.current = null; } setIsPollingConsole(false); };

  const handleFileSelect = useCallback(async (file) => {
    if (isBulkMode) {
      setSelectedFiles(prev => {
        const isSelected = prev.some(f => f.id === file.id);
        if (isSelected) {
          return prev.filter(f => f.id !== file.id);
        } else {
          return [...prev, file];
        }
      });
      return;
    }
    if (isDirty) { const confirmed = window.confirm('You have unsaved changes. Do you want to continue?'); if (!confirmed) return; }
    try { const fileData = await projectsAPI.getFile(projectId, file.id, { forceLocal: true }); setSelectedFile(file); setFileContent(fileData.content || ''); setIsDirty(false); }
    catch (error) { console.error('Failed to fetch file:', error); toast({ title: 'Error', description: 'Failed to load file content', variant: 'destructive' }); }
  }, [isDirty, projectId, toast, isBulkMode]);

  useEffect(() => { if (!selectedFile && Array.isArray(files) && files.length) { const byName = (f) => typeof f?.filename === 'string' ? f.filename : ''; const mainCandidate = files.find(f => /^main(\.|_)/i.test(byName(f))) || files.find(f => /^main/i.test(byName(f))) || files[0]; if (mainCandidate) { handleFileSelect(mainCandidate); } } }, [files, selectedFile, handleFileSelect]);

  const handleContentChange = (value) => { setFileContent(value); setIsDirty(true); };

  const handleSaveFile = async () => { if (!selectedFile || !isDirty) return; try { await projectsAPI.updateFile(projectId, selectedFile.id, { content: fileContent, filename: selectedFile.filename }, { forceLocal: true }); setIsDirty(false); toast({ title: 'Success', description: 'File saved successfully' }); } catch (error) { console.error('Failed to save file:', error); toast({ title: 'Error', description: 'Failed to save file', variant: 'destructive' }); } };

  const handleCreateFile = async () => { if (!newFileName.trim()) { toast({ title: 'Error', description: 'Please enter a file name', variant: 'destructive' }); return; } if (newFileName === 'main.glm' && files.some(f => f.filename === 'main.glm')) { toast({ title: 'Error', description: 'main.glm already exists', variant: 'destructive' }); return; } try { const newFile = await projectsAPI.createFile(projectId, { filename: newFileName, content: newFileContent || '// New GLM file\n', file_type: newFileName.endsWith('.glm') ? 'glm' : 'text' }, { forceLocal: true }); const filesData = await projectsAPI.listFiles(projectId, { forceLocal: true }); const list = Array.isArray(filesData) ? filesData : filesData.files || []; setFiles(list); handleFileSelect(newFile); setNewFileName(''); setNewFileContent(''); setShowNewFile(false); toast({ title: 'Success', description: 'File created successfully' }); } catch (error) { console.error('Failed to create file:', error); toast({ title: 'Error', description: 'Failed to create file', variant: 'destructive' }); } };

  const handleDeleteFile = async (fileId) => {
    const file = files.find(f => f.id === fileId);
    if (file && file.filename === 'main.glm') {
      toast({ title: 'Error', description: 'Cannot delete main.glm file', variant: 'destructive' });
      return;
    }
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try { await projectsAPI.deleteFile(projectId, fileId, { forceLocal: true }); if (selectedFile?.id === fileId) { setSelectedFile(null); setFileContent(''); setIsDirty(false); } const filesData = await projectsAPI.listFiles(projectId, { forceLocal: true }); const list = Array.isArray(filesData) ? filesData : filesData.files || []; setFiles(list); toast({ title: 'Success', description: 'File deleted successfully' }); } catch (error) { console.error('Failed to delete file:', error); toast({ title: 'Error', description: 'Failed to delete file', variant: 'destructive' }); }
  };

  const handleRenameFile = async () => {
    if (!renameFileName.trim()) {
      toast({ title: 'Error', description: 'Please enter a file name', variant: 'destructive' });
      return;
    }
    if (renameFileName === 'main.glm' && files.some(f => f.filename === 'main.glm' && f.id !== renamingFile.id)) {
      toast({ title: 'Error', description: 'main.glm already exists', variant: 'destructive' });
      return;
    }
    try {
      await projectsAPI.updateMetadata(projectId, renamingFile.id, { filename: renameFileName }, { forceLocal: true });
      const filesData = await projectsAPI.listFiles(projectId, { forceLocal: true });
      const list = Array.isArray(filesData) ? filesData : filesData.files || [];
      setFiles(list);
      if (selectedFile?.id === renamingFile.id) {
        setSelectedFile(list.find(f => f.id === renamingFile.id));
      }
      setRenamingFile(null);
      setRenameFileName('');
      toast({ title: 'Success', description: 'File renamed successfully' });
    } catch (error) {
      console.error('Failed to rename file:', error);
      toast({ title: 'Error', description: 'Failed to rename file', variant: 'destructive' });
    }
  };

  const handleRunSimulation = async () => {
    try {
      // Save any dirty file first
      if (isDirty && selectedFile) {
        await projectsAPI.updateFile(
          projectId,
          selectedFile.id,
          { content: fileContent, filename: selectedFile.filename },
          { forceLocal: true }
        );
        setIsDirty(false);
        toast({ title: 'Info', description: 'File saved before simulation' });
      }

      // Fetch current files and create versions
      const filesData = await projectsAPI.listFiles(projectId, { forceLocal: true });
      const currentFiles = Array.isArray(filesData) ? filesData : filesData.files || [];

      for (const file of currentFiles) {
        const fileResp = await projectsAPI.getFile(projectId, file.id, { forceLocal: true });
        await projectsAPI.createVersion(
          projectId,
          file.id,
          {
            content: fileResp.content,
            message: 'Pre-simulation version'
          },
          { forceLocal: true }
        );
      }

      // Tag the project as a snapshot
      const tagName = `simulation-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;
      await projectsAPI.createTag(
        projectId,
        { name: tagName, description: 'Pre-simulation snapshot' },
        { forceLocal: true }
      );

      // Determine main file name
      let mainFilename = selectedFile?.filename || 'main.glm';
      if (!currentFiles.find(f => f.filename === mainFilename)) {
        const mainCandidate =
          currentFiles.find(f => /^main(\.|_)/i.test(f.filename)) ||
          currentFiles.find(f => /^main/i.test(f.filename)) ||
          currentFiles[0];
        if (mainCandidate) mainFilename = mainCandidate.filename;
      }

      // Build a zip of all current files
      const zip = new JSZip();
      for (const f of currentFiles) {
        const fResp = await projectsAPI.getFile(projectId, f.id, { forceLocal: true });
        // Default to empty string if no content returned
        zip.file(f.filename, fResp?.content ?? '');
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipFile = new File([zipBlob], 'project.zip', { type: 'application/zip' });

      // Prepare form data for /api/simulations/archive
      const simName = `Simulation - ${new Date().toLocaleString()}`;
      const form = new FormData();
      form.append('project_id', projectId);
      form.append('name', simName);
      form.append('main_filename', mainFilename);
      // Include both keys for compatibility with upstream
      form.append('file', zipFile);
      form.append('archive', zipFile);
      // Also pass JSON config if backend supports it
      form.append('input_config', JSON.stringify({ main_file: mainFilename }));

      // Submit to archive endpoint
      const newSimulation = await simulationsAPI.archive(form, { forceLocal: true });

      // Update UI state and start polling
      setSimulations(prev => [newSimulation, ...(Array.isArray(prev) ? prev : [])]);
      setSelectedSimulation(newSimulation);
      setShowConsole(true);
      setConsoleOutput('Starting simulation...\n');
      toast({ title: 'Success', description: 'Simulation started successfully' });

      pollSimulationStatus(newSimulation.id || newSimulation.simulation_id);
    } catch (error) {
      console.error('Failed to run simulation:', error);
      toast({ title: 'Error', description: 'Failed to start simulation', variant: 'destructive' });
    }
  };

  const pollSimulationStatus = async (simulationId) => { const pollInterval = setInterval(async () => { try { const simulation = await simulationsAPI.get(simulationId, { forceLocal: true }); setSimulations(prev => prev.map(s => (s.id === simulationId || s.simulation_id === simulationId) ? simulation : s)); setSelectedSimulation(simulation); if (['completed','COMPLETED','failed','FAILED'].includes(simulation.status)) { clearInterval(pollInterval); stopConsolePolling(); if (['completed','COMPLETED'].includes(simulation.status)) { toast({ title: 'Success', description: 'Simulation completed successfully' }); setConsoleOutput(prev => prev + '\n=== Simulation completed successfully ===\n'); } else { toast({ title: 'Error', description: 'Simulation failed', variant: 'destructive' }); setConsoleOutput(prev => prev + '\n=== Simulation failed ===\n'); } } } catch (error) { console.error('Failed to poll simulation status:', error); clearInterval(pollInterval); } }, 5000); };

  const addConsoleMessage = (message, type = 'info') => { const timestamp = new Date().toLocaleTimeString(); const prefix = type === 'error' ? '[ERROR]' : type === 'warning' ? '[WARN]' : '[INFO]'; setConsoleOutput(prev => `${prev}${timestamp} ${prefix} ${message}\n`); };

  const handleConsoleResize = (e) => { e.preventDefault(); const startY = e.pageY; const startHeight = consoleHeight; const handleMouseMove = (e) => { const deltaY = startY - e.pageY; const newHeight = Math.min(600, Math.max(100, startHeight + deltaY)); setConsoleHeight(newHeight); }; const handleMouseUp = () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); }; document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp); };

  const handleShareSubmit = async ({ emails, message }) => { try { let userIds = []; if (emails?.length) { try { const lookup = await usersAPI.lookup(emails); const mapped = Array.isArray(lookup?.users) ? lookup.users : []; userIds = mapped.filter(u => u.exists && u.id).map(u => u.id); } catch {} } await projectsAPI.share(projectId, { emails, user_ids: userIds, message, expires_in: 86400 }); toast({ title: 'Shared', description: 'Share link sent to recipients.' }); } catch (error) { console.error('Failed to share project:', error); toast({ title: 'Error', description: 'Failed to share project', variant: 'destructive' }); } };

  if (loading) { return (<><Header pageTitle="GridSpeed Editor" /><div className="min-h-screen flex items-center justify-center pt-12"><div className="text-gray-500">Loading project...</div></div></>); }
  if (!user) { return null; }
  if (!project) { return (<><Header pageTitle="GridSpeed Editor" /><div className="min-h-screen flex items-center justify-center pt-12"><div className="text-center"><div className="text-gray-500 mb-4">Project not found</div><Link href="/projects" className="text-orange-600 hover:text-orange-700">Back to Projects</Link></div></div></>); }

  return (
    <ProtectedRoute>
      <Header pageTitle={`GridSpeed - ${project?.name || ''}`} />
      <div className="min-h-screen bg-gray-50 pt-12 overflow-x-hidden flex flex-col">
        <div className="relative flex w-full flex-1 overflow-hidden">
          {!showAIChat && (
            <button
              onClick={() => setShowAIChat(true)}
              className="fixed top-1/2 -translate-y-1/2 right-0 z-50 bg-white border border-gray-300 rounded-l-full px-2 py-2 text-gray-600 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              title="Expand AI Chat"
              aria-label="Expand AI Chat"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Link href="/projects" aria-label="Back" title="Back" className="text-gray-700 hover:text-gray-900"><ArrowLeft className="w-4 h-4" /></Link>
                  <h2 className="text-sm font-semibold text-gray-700">Files</h2>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton onClick={() => setIsBulkMode(!isBulkMode)} title={isBulkMode ? 'Exit Bulk Mode' : 'Bulk Mode'} ariaLabel={isBulkMode ? 'Exit Bulk Mode' : 'Bulk Mode'} active={isBulkMode}><Terminal className="w-4 h-4" /></IconButton>
                  <IconButton onClick={() => setShowNewFile(true)} title="New File" ariaLabel="New File"><Plus className="w-4 h-4" /></IconButton>
                  <IconButton onClick={handleSaveFile} disabled={!isDirty || !selectedFile} title="Save File" ariaLabel="Save File"><Save className="w-4 h-4" /></IconButton>
                  <IconButton onClick={() => setShowConsole(!showConsole)} title={showConsole ? 'Hide Console' : 'Show Console'} ariaLabel={showConsole ? 'Hide Console' : 'Show Console'} active={showConsole}><Terminal className="w-4 h-4" /></IconButton>
                  <IconButton onClick={() => setShareOpen(true)} title="Share Project" ariaLabel="Share Project" className="text-[#ea580b] hover:text-orange-700"><Share2 className="w-4 h-4" /></IconButton>
                  <IconButton onClick={handleRunSimulation} title="Run Simulation" ariaLabel="Run Simulation" className="text-[#ea580b] hover:text-orange-700"><Play className="w-4 h-4" /></IconButton>
                  {isBulkMode && selectedFiles.length > 0 && (
                    <IconButton onClick={handleBulkDelete} title="Delete Selected" ariaLabel="Delete Selected" className="text-red-600 hover:text-red-700"><Terminal className="w-4 h-4" /></IconButton>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {files.length > 0 ? (
                <div className="py-2">
                  {files.map((file) => (
                    <div key={file.id} className={`group flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer ${selectedFile?.id === file.id ? 'bg-orange-50 border-l-2 border-orange-600' : ''} ${selectedFiles.some(f => f.id === file.id) ? 'bg-blue-50' : ''}`} onClick={() => handleFileSelect(file)}>
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        {isBulkMode && (
                          <input
                            type="checkbox"
                            checked={selectedFiles.some(f => f.id === file.id)}
                            onChange={() => {}}
                            className="w-4 h-4"
                          />
                        )}
                        <span className="text-gray-400">📄</span>
                        {renamingFile?.id === file.id ? (
                          <input
                            type="text"
                            value={renameFileName}
                            onChange={(e) => setRenameFileName(e.target.value)}
                            onBlur={handleRenameFile}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleRenameFile(); if (e.key === 'Escape') { setRenamingFile(null); setRenameFileName(''); } }}
                            className="flex-1 px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm text-gray-700 truncate">{file.filename}</span>
                        )}
                      </div>
                      {!isBulkMode && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setRenamingFile(file); setRenameFileName(file.filename); }}
                            className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-700 text-xs px-1"
                            title="Rename"
                            aria-label="Rename"
                          >
                            ✏️
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }} className={`text-xs px-1 ${file.filename === 'main.glm' ? 'text-gray-400 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700'}`} title="Delete" aria-label="Delete" disabled={file.filename === 'main.glm'}>✕</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">No files yet. Create your first file to get started.</div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="bg-white border-b border-gray-200 px-4">
              <div className="flex space-x-6">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'code' ? 'text-orange-600 border-orange-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                >
                  Code Editor
                </button>
                <button
                  onClick={() => setActiveTab('outputs')}
                  className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'outputs' ? 'text-orange-600 border-orange-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                >
                  Outputs
                </button>
                <button
                  onClick={() => setActiveTab('designer')}
                  className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'designer' ? 'text-orange-600 border-orange-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                  title="Load Profile Designer"
                  aria-label="Load Profile Designer"
                >
                  Load Designer
                </button>
              </div>
            </div>
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
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      Select a file to edit or create a new file
                    </div>
                  )}
                </div>
              ) : activeTab === 'outputs' ? (
                <OutputsTab
                  simulations={simulations}
                  selectedProjectId={projectId}
                  addConsoleMessage={addConsoleMessage}
                />
              ) : (
                <Designer projectId={projectId} />
              )}
            </div>
          </div>
          {showAIChat && (
            <AIChatbot onCollapse={() => setShowAIChat(false)} />
          )}
        </div>
        {showConsole && (
          <div className="border-t border-gray-300">
            <div className="h-1 bg-gray-200 hover:bg-gray-300 cursor-ns-resize" onMouseDown={handleConsoleResize} />
            <div className="bg-black text-green-400 font-mono text-xs p-4 overflow-auto" style={{ height: `${consoleHeight}px` }}>
              <div className="flex items-center justify-between mb-2"><div className="text-gray-500">Terminal Output</div>{isPollingConsole && (<div className="text-xs text-orange-400">● Live (5s refresh)</div>)}</div>
              <pre className="whitespace-pre-wrap">{consoleOutput || 'No output yet. Run a simulation to see console output here.'}<div ref={consoleEndRef} /></pre>
            </div>
          </div>
        )}
        <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} title="Share project" projectLink={`${typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''}`} multipleCount={0} onSubmit={handleShareSubmit} />
        {showNewFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Create New File</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">File Name</label><input type="text" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} placeholder="example.glm" className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Initial Content (Optional)</label><textarea value={newFileContent} onChange={(e) => setNewFileContent(e.target.value)} placeholder="// Enter initial file content..." rows={6} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button onClick={() => { setShowNewFile(false); setNewFileName(''); setNewFileContent(''); }} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button onClick={handleCreateFile} className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700">Create File</button>
              </div>
            </div>
          </div>
        )}
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
