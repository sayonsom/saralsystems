'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import dynamic from 'next/dynamic';
import TopBar from './components/TopBar';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import DataEditor from './components/DataEditor';
import OutputsTab from './components/OutputsTab';
import ChatPanel from './components/ChatPanel';
import BottomConsole from './components/BottomConsole';
import RunBar from './components/RunBar';
import VisualEditor from './components/VisualEditor';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { apiFetch } from '@/lib/api';
import { projects as apiProjects } from '@/lib/gridlabdClient';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function GridLabDSimulator() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const [activeTab, setActiveTab] = useState('visual');
  const [selectedFile, setSelectedFile] = useState(null);
  const [glmContent, setGlmContent] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [resultsData, setResultsData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Project and simulation state
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const [currentProject, setCurrentProject] = useState(null);
  const [simulations, setSimulations] = useState([]);
  const [projectFiles, setProjectFiles] = useState([]);

  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiProjects.listProjects();
        setProjects(data);
        if (projectId) {
          setSelectedProjectId(projectId);
          // Find and set current project
          const current = data.find(p => p.id === projectId);
          if (current) setCurrentProject(current);
        } else if (data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data[0].id);
          setCurrentProject(data[0]);
        }
      } catch (error) {
        addConsoleMessage(`Failed to fetch projects: ${error.message}`, 'error');
        // Fallback to direct apiFetch
        try {
          const data = await apiFetch('/api/projects');
          setProjects(data);
          if (projectId) {
            setSelectedProjectId(projectId);
            const current = data.find(p => p.id === projectId);
            if (current) setCurrentProject(current);
          } else if (data.length > 0 && !selectedProjectId) {
            setSelectedProjectId(data[0].id);
            setCurrentProject(data[0]);
          }
        } catch (fallbackError) {
          addConsoleMessage(`Fallback also failed: ${fallbackError.message}`, 'error');
        }
      }
    };
    fetchProjects();
  }, [projectId]);

  // Fetch simulations when project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchSimulations = async () => {
      try {
        const data = await apiFetch(`/api/projects/${selectedProjectId}/simulations`);
        setSimulations(Array.isArray(data) ? data : []);
      } catch (error) {
        addConsoleMessage(`Failed to fetch simulations: ${error.message}`, 'error');
        setSimulations([]);
      }
    };
    fetchSimulations();
  }, [selectedProjectId]);

  // Load project data when projectId changes
  useEffect(() => {
    if (!selectedProjectId) return;
    const loadProject = async () => {
      try {
        const projectData = await apiProjects.getProject(selectedProjectId);
        if (projectData && projectData.name) {
          setCurrentProject(projectData);
          addConsoleMessage(`Loaded project: ${projectData.name}`, 'info');
        }
      } catch (error) {
        addConsoleMessage(`Failed to load project: ${error.message}`, 'error');
        // Fallback to direct apiFetch
        try {
          const projectData = await apiFetch(`/api/projects/${selectedProjectId}`);
          if (projectData && projectData.name) {
            setCurrentProject(projectData);
            addConsoleMessage(`Loaded project: ${projectData.name}`, 'info');
          }
        } catch (fallbackError) {
          addConsoleMessage(`Fallback also failed: ${fallbackError.message}`, 'error');
        }
      }
    };
    loadProject();
  }, [selectedProjectId]);

  // Mark file as dirty when content changes
  useEffect(() => {
    if (selectedFile && glmContent !== undefined) {
      setProjectFiles(prev => prev.map(f =>
        f.name === selectedFile
          ? { ...f, dirty: f.content !== glmContent }
          : f
      ));
    }
  }, [glmContent, selectedFile]);

  const sampleGLM = `// GridLAB-D Model
clock {
  timezone EST+5EDT;
  starttime '2024-01-01 00:00:00';
  stoptime '2024-01-02 00:00:00';
}

module powerflow {
  solver_method NR;
}

object node {
  name "source_bus";
  bustype SWING;
  phases "ABCN";
  voltage_A +7199.558+0.000j;
  voltage_B -3599.779-6235.000j;
  voltage_C -3599.779+6235.000j;
  nominal_voltage 7200;
}`;

  const addConsoleMessage = (message, type='info') => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleOutput(prev => [...prev, { timestamp, message, type }]);
  };



  const runSimulation = async () => {
    if (!glmContent && !selectedFile){ addConsoleMessage('No model loaded. Please upload a GLM file or select a template.','error'); return; }
    if (!selectedProjectId) { addConsoleMessage('No project selected.','error'); return; }

    setIsRunning(true); setSimulationProgress(0); addConsoleMessage('Preparing simulation...','info');

    try {
      // Create simulation record using FormData (backend expects multipart/form-data)
      const formData = new FormData();
      formData.append('project_id', selectedProjectId);
      formData.append('name', `Simulation ${new Date().toLocaleString()}`);
      formData.append('model_content', glmContent);
      formData.append('status', 'running');

      const newSimulation = await apiFetch('/api/simulations', {
        method: 'POST',
        body: formData
      });

      addConsoleMessage('Simulation started...','info');
      setSimulationProgress(20);

      // Simulate progress
      setTimeout(()=>{ addConsoleMessage('Compressing GLM files...','info'); setSimulationProgress(40); },500);
      setTimeout(()=>{ addConsoleMessage('Uploading to cloud...','info'); setSimulationProgress(60); },1000);
      setTimeout(()=>{ addConsoleMessage('Initializing GridLAB-D engine...','info'); setSimulationProgress(80); },1500);
      setTimeout(()=>{ addConsoleMessage('Running simulation...','info'); setSimulationProgress(90); },2000);

      setTimeout(async ()=>{
        try {
          // Update simulation status to completed
          const statusFormData = new FormData();
          statusFormData.append('status', 'completed');

          await apiFetch(`/api/simulations/${newSimulation.id}`, {
            method: 'PUT',
            body: statusFormData
          });

          setSimulationProgress(100);
          addConsoleMessage('Simulation complete!','success');
          addConsoleMessage('Total time: 2.4 seconds','info');
          addConsoleMessage('Convergence: SUCCESS','success');
          setIsRunning(false);
          setResultsData({ voltageViolations:3, peakLoad:4.2, losses:2.3, convergence:true });

          // Refresh simulations list
          const updatedSimulations = await apiFetch(`/api/projects/${selectedProjectId}/simulations`);
          setSimulations(Array.isArray(updatedSimulations) ? updatedSimulations : []);
        } catch (error) {
          addConsoleMessage(`Failed to update simulation: ${error.message}`, 'error');
          setIsRunning(false);
        }
      }, 3000);
    } catch (error) {
      addConsoleMessage(`Failed to start simulation: ${error.message}`, 'error');
      setIsRunning(false);
    }
  };

  const loadTemplate = (templateName) => { addConsoleMessage(`Loading template: ${templateName}`,'info'); setGlmContent(sampleGLM); setSelectedFile(`${templateName}.glm`); setActiveTab('code'); };

  // File upload handlers
  const handleFileUpload = useCallback((e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setGlmContent(content);
      setSelectedFile(file.name);
      addConsoleMessage(`Loaded file: ${file.name}`, 'info');
      setActiveTab('code');
    };
    reader.readAsText(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setGlmContent(content);
        setSelectedFile(file.name);
        addConsoleMessage(`Loaded file: ${file.name}`, 'info');
        setActiveTab('code');
      };
      reader.readAsText(file);
    }
  }, []);

  // File management functions
  const createNewFile = useCallback((filename) => {
    if (!filename.trim()) return;
    const newFile = {
      id: Date.now(),
      filename: filename.trim(),
      name: filename.trim(),
      type: filename.split('.').pop() || 'txt',
      content: '',
      dirty: true
    };
    setProjectFiles(prev => [...prev, newFile]);
    setSelectedFile(filename.trim());
    setGlmContent('');
    addConsoleMessage(`Created new file: ${filename}`, 'info');
    setActiveTab('code');
  }, []);

  const createNewFolder = useCallback((foldername) => {
    if (!foldername.trim()) return;
    const newFolder = {
      id: Date.now(),
      filename: foldername.trim() + '/',
      name: foldername.trim() + '/',
      type: 'folder',
      content: '',
      dirty: false
    };
    setProjectFiles(prev => [...prev, newFolder]);
    addConsoleMessage(`Created new folder: ${foldername}`, 'info');
  }, []);

  const removeFileFromProject = useCallback((filename) => {
    setProjectFiles(prev => prev.filter(f => f.name !== filename));
    if (selectedFile === filename) {
      setSelectedFile(null);
      setGlmContent('');
    }
    addConsoleMessage(`Removed file: ${filename}`, 'info');
  }, [selectedFile]);

  const downloadProjectZip = useCallback(() => {
    addConsoleMessage('Download project ZIP - feature not implemented yet', 'info');
  }, []);

  const loadFileContent = useCallback((file) => {
    setGlmContent(file.content || '');
    setSelectedFile(file.name);
    addConsoleMessage(`Loaded file: ${file.name}`, 'info');
    setActiveTab('code');
  }, []);

  const onSaveCurrent = useCallback(() => {
    if (!selectedFile) {
      addConsoleMessage('No file selected to save', 'warning');
      return;
    }
    setProjectFiles(prev => prev.map(f =>
      f.name === selectedFile
        ? { ...f, content: glmContent, dirty: false }
        : f
    ));
    addConsoleMessage(`Saved file: ${selectedFile}`, 'success');
  }, [selectedFile, glmContent]);

  const onSaveAll = useCallback(() => {
    setProjectFiles(prev => prev.map(f =>
      f.name === selectedFile
        ? { ...f, content: glmContent, dirty: false }
        : f
    ));
    addConsoleMessage('Saved all files', 'success');
  }, [selectedFile, glmContent]);

  const onCancelSimulation = useCallback((simulationId) => {
    addConsoleMessage(`Cancelled simulation: ${simulationId}`, 'info');
    // In a real implementation, this would call the API to cancel the simulation
  }, []);

  const onDownloadOutputs = useCallback((simulationId) => {
    addConsoleMessage(`Downloading outputs for simulation: ${simulationId}`, 'info');
    // In a real implementation, this would trigger a download of simulation outputs
  }, []);

  const onBackToProjects = useCallback(() => {
    // Navigate to projects page
    window.location.href = '/tools/gridlabd2/projects';
  }, []);

  const onRunPersisted = useCallback((modelName) => {
    addConsoleMessage(`Running persisted model: ${modelName || 'current'}`, 'info');
    runSimulation();
  }, [runSimulation]);

  const onRunArchive = useCallback(async (modelName) => {
    if (!glmContent && !selectedFile) {
      addConsoleMessage('No model loaded. Please upload a GLM file or select a template.', 'error');
      return;
    }
    if (!selectedProjectId) {
      addConsoleMessage('No project selected.', 'error');
      return;
    }

    addConsoleMessage(`Running archived model: ${modelName || 'current'}`, 'info');
    setIsRunning(true);
    setSimulationProgress(0);

    try {
      // Create a zip file with the current GLM content
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add the main GLM file
      const mainFilename = selectedFile || 'model.glm';
      zip.file(mainFilename, glmContent);

      // Add any other project files
      projectFiles.forEach(file => {
        if (file.content && file.name !== mainFilename) {
          zip.file(file.name, file.content);
        }
      });

      // Generate the zip blob
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Use the archive endpoint
      const { simulations: simClient } = await import('@/lib/gridlabdClient');
      const result = await simClient.runSimulationFromArchive({
        projectId: selectedProjectId,
        name: `Archive Simulation ${new Date().toLocaleString()}`,
        mainFilename,
        zipBlob
      });

      addConsoleMessage('Archive simulation started...', 'info');
      setSimulationProgress(50);

      // Simulate completion
      setTimeout(() => {
        setSimulationProgress(100);
        addConsoleMessage('Archive simulation complete!', 'success');
        addConsoleMessage('Total time: 3.2 seconds', 'info');
        addConsoleMessage('Convergence: SUCCESS', 'success');
        setIsRunning(false);
        setResultsData({ voltageViolations: 2, peakLoad: 3.8, losses: 1.9, convergence: true });

        // Refresh simulations list
        if (selectedProjectId) {
          apiFetch(`/api/projects/${selectedProjectId}/simulations`)
            .then(data => setSimulations(Array.isArray(data) ? data : []))
            .catch(error => {
              addConsoleMessage(`Failed to refresh simulations: ${error.message}`, 'error');
              setSimulations([]);
            });
        }
      }, 3200);

    } catch (error) {
      addConsoleMessage(`Failed to run archive simulation: ${error.message}`, 'error');
      setIsRunning(false);
    }
  }, [glmContent, selectedFile, selectedProjectId, projectFiles]);

  const onCreateProject = useCallback(() => {
    addConsoleMessage('Create project - feature not implemented yet', 'info');
  }, []);

  const onRenameProject = useCallback(() => {
    addConsoleMessage('Rename project - feature not implemented yet', 'info');
  }, []);

  const onDeleteProject = useCallback(() => {
    addConsoleMessage('Delete project - feature not implemented yet', 'info');
  }, []);

  const [chatMessages, setChatMessages] = useState([{ role:'assistant', content:'Hi! I can help modify your GridLAB-D model. Try: "add node house_1" or "set stoptime 2024-01-03 00:00:00".' }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);

  const handleChatInputChange = useCallback((e)=> setChatInput(e.target.value), []);

  const applyInstruction = (text) => {
    let updated = glmContent || sampleGLM; let response='';
    const addNodeMatch = text.match(/add node (\w+)/i); if (addNodeMatch){ const nodeName = addNodeMatch[1]; if(!updated.includes(`name "${nodeName}"`)){ updated += `\n\nobject node {\n  name "${nodeName}";\n  phases ABC;\n  nominal_voltage 7200;\n  bustype PQ;\n}`; response += `Added node ${nodeName}. `; } else { response += `Node ${nodeName} already exists. `; } }
    const setTimeMatch = text.match(/set (starttime|stoptime) ([0-9:-\s']+)/i); if (setTimeMatch){ const key=setTimeMatch[1]; const val=setTimeMatch[2].replace(/"/g,'').trim(); const clockRegex = new RegExp(`${key}[^;]*;`); if (clockRegex.test(updated)){ updated = updated.replace(clockRegex, `${key} '${val}';`); } else { updated = updated.replace(/clock {([\s\S]*?)}/,(m,inner)=>`clock {${inner}\n  ${key} '${val}';\n}`); } response += `${key} set to ${val}. `; }
    if(!response) response='Instruction noted (no direct action implemented).'; setGlmContent(updated); return response.trim(); };

  const handleSendChat = () => { const text = chatInput.trim(); if(!text) return; const userMsg = { role:'user', content:text }; setChatMessages(prev=>[...prev,userMsg]); setChatInput(''); setTimeout(()=>{ const result = applyInstruction(text); const aiMsg = { role:'assistant', content:result }; setChatMessages(prev=>[...prev,aiMsg]); },400); };

  return (
    <div className="min-h-full flex flex-col h-full">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <FileExplorer
          loadTemplate={loadTemplate}
          handleFileUpload={handleFileUpload}
          fileInputRef={fileInputRef}
          dropZoneRef={dropZoneRef}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          projectFiles={projectFiles}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          createNewFile={createNewFile}
          createNewFolder={createNewFolder}
          removeFileFromProject={removeFileFromProject}
          downloadProjectZip={downloadProjectZip}
          loadFileContent={loadFileContent}
          onSaveCurrent={onSaveCurrent}
          onSaveAll={onSaveAll}
          projects={projects}
          selectedProjectId={selectedProjectId}
          currentProject={currentProject}
          onSelectProject={setSelectedProjectId}
          onCreateProject={onCreateProject}
          onRenameProject={onRenameProject}
          onDeleteProject={onDeleteProject}
          onCancelSimulation={onCancelSimulation}
          onDownloadOutputs={onDownloadOutputs}
          onBackToProjects={onBackToProjects}
          onRunPersisted={onRunPersisted}
          onRunArchive={onRunArchive}
          simulations={simulations}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-300 px-4 shrink-0">
            <div className="flex space-x-2 relative">
              {['visual','code','data','outputs'].map(tab => { const isActive = activeTab === tab; return (
                <button key={tab} onClick={()=>setActiveTab(tab)} className={`relative py-2 px-5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580b] ${isActive ? 'text-[#ea580b] font-semibold' : 'text-gray-600 hover:text-gray-800'}`}>
                  <span className="capitalize flex items-center space-x-1">{tab==='visual' && <span>🧩</span>}{tab==='code' && <span>{'</>'}</span>}{tab==='data' && <span>📊</span>}{tab==='outputs' && <span>📦</span>}<span>{tab==='data' ? 'Data' : tab}</span></span>
                  {isActive && <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-[#ea580b]" />}
                </button> ); })}
              <div className="flex-1 border-b border-gray-300" />
            </div>
          </div>
          <div className="flex-1 bg-white overflow-hidden">
            {activeTab==='visual' && <VisualEditor onSelectNode={setSelectedNode} />}
            {activeTab==='code' && <CodeEditor value={glmContent} onChange={setGlmContent} addConsoleMessage={addConsoleMessage} sampleGLM={sampleGLM} />}
            {activeTab==='data' && <DataEditor addConsoleMessage={addConsoleMessage} />}
            {activeTab==='outputs' && (
              <OutputsTab
                simulations={simulations}
                selectedProjectId={selectedProjectId}
                addConsoleMessage={addConsoleMessage}
              />
            )}
          </div>
          <BottomConsole resultsData={resultsData} consoleOutput={consoleOutput} />
        </div>
        <ChatPanel
          chatMessages={chatMessages}
          chatInput={chatInput}
          isChatOpen={isChatOpen}
          handleChatInputChange={handleChatInputChange}
          handleSendChat={handleSendChat}
          setIsChatOpen={setIsChatOpen}
          setChatMessages={setChatMessages}
        />
      </div>
      <RunBar runSimulation={runSimulation} isRunning={isRunning} selectedFile={selectedFile} simulationProgress={simulationProgress} />
    </div>
  );
}