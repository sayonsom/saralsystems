'use client';

import { useState, useRef, useCallback } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import dynamic from 'next/dynamic';
import TopBar from './components/TopBar';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import DataEditor from './components/DataEditor';
import ChatPanel from './components/ChatPanel';
import BottomConsole from './components/BottomConsole';
import RunBar from './components/RunBar';
import VisualEditor from './components/VisualEditor';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function GridLabDSimulator() {
  const [activeTab, setActiveTab] = useState('visual');
  const [selectedFile, setSelectedFile] = useState(null);
  const [glmContent, setGlmContent] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [resultsData, setResultsData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.glm')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGlmContent(e.target.result);
        setSelectedFile(file.name);
        addConsoleMessage(`File loaded: ${file.name}`, 'success');
      }; reader.readAsText(file);
    } else { addConsoleMessage('Please upload a valid .glm file','error'); }
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); dropZoneRef.current?.classList.add('border-[#ea580b]','bg-orange-50'); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); dropZoneRef.current?.classList.remove('border-[#ea580b]','bg-orange-50'); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); dropZoneRef.current?.classList.remove('border-[#ea580b]','bg-orange-50'); const files = Array.from(e.dataTransfer.files); const glmFile = files.find(f=>f.name.endsWith('.glm')); if (glmFile){ const reader = new FileReader(); reader.onload = (ev)=>{ setGlmContent(ev.target.result); setSelectedFile(glmFile.name); addConsoleMessage(`File dropped: ${glmFile.name}`,'success'); }; reader.readAsText(glmFile);} };

  const runSimulation = () => {
    if (!glmContent && !selectedFile){ addConsoleMessage('No model loaded. Please upload a GLM file or select a template.','error'); return; }
    setIsRunning(true); setSimulationProgress(0); addConsoleMessage('Preparing simulation...','info');
    setTimeout(()=>{ addConsoleMessage('Compressing GLM files...','info'); setSimulationProgress(20); },500);
    setTimeout(()=>{ addConsoleMessage('Uploading to cloud...','info'); setSimulationProgress(40); },1000);
    setTimeout(()=>{ addConsoleMessage('Initializing GridLAB-D engine...','info'); setSimulationProgress(60); },1500);
    setTimeout(()=>{ addConsoleMessage('Running simulation...','info'); setSimulationProgress(80); },2000);
    setTimeout(()=>{ setSimulationProgress(100); addConsoleMessage('Simulation complete!','success'); addConsoleMessage('Total time: 2.4 seconds','info'); addConsoleMessage('Convergence: SUCCESS','success'); setIsRunning(false); setResultsData({ voltageViolations:3, peakLoad:4.2, losses:2.3, convergence:true }); },3000);
  };

  const loadTemplate = (templateName) => { addConsoleMessage(`Loading template: ${templateName}`,'info'); setGlmContent(sampleGLM); setSelectedFile(`${templateName}.glm`); setActiveTab('code'); };

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
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-300 px-4 shrink-0">
            <div className="flex space-x-2 relative">
              {['visual','code','data'].map(tab => { const isActive = activeTab === tab; return (
                <button key={tab} onClick={()=>setActiveTab(tab)} className={`relative py-2 px-5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580b] ${isActive ? 'text-[#ea580b] font-semibold' : 'text-gray-600 hover:text-gray-800'}`}>
                  <span className="capitalize flex items-center space-x-1">{tab==='visual' && <span>🧩</span>}{tab==='code' && <span>{'</>'}</span>}{tab==='data' && <span>📊</span>}<span>{tab==='data' ? 'Data' : tab}</span></span>
                  {isActive && <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-[#ea580b]" />}
                </button> ); })}
              <div className="flex-1 border-b border-gray-300" />
            </div>
          </div>
          <div className="flex-1 bg-white overflow-hidden">
            {activeTab==='visual' && <VisualEditor onSelectNode={setSelectedNode} />}
            {activeTab==='code' && <CodeEditor value={glmContent} onChange={setGlmContent} addConsoleMessage={addConsoleMessage} sampleGLM={sampleGLM} />}
            {activeTab==='data' && <DataEditor addConsoleMessage={addConsoleMessage} />}
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