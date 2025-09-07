'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import dynamic from 'next/dynamic';
const MonacoEditor = dynamic(() => import('@monaco-editor/react').then(m=>m.default), { ssr:false });

ModuleRegistry.registerModules([AllCommunityModule]);

export default function GridLabDSimulator() {
  // State management
  const [activeTab, setActiveTab] = useState('visual');
  const [selectedFile, setSelectedFile] = useState(null);
  const [glmContent, setGlmContent] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [resultsData, setResultsData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [propertyPanel, setPropertyPanel] = useState('properties');
  const [files, setFiles] = useState([
    { id: 1, name: 'IEEE_13_bus.glm', type: 'file', parent: 'ieee' },
    { id: 2, name: 'Rural_Feeder.glm', type: 'file', parent: 'utility' },
  ]);
  const [expandedFolders, setExpandedFolders] = useState(['ieee', 'utility']);
  
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Sample GLM content for demo
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

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.glm')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGlmContent(e.target.result);
        setFiles([...files, { 
          id: files.length + 1, 
          name: file.name, 
          type: 'file', 
          parent: 'uploads' 
        }]);
        setSelectedFile(file.name);
        addConsoleMessage(`File loaded: ${file.name}`, 'success');
      };
      reader.readAsText(file);
    } else {
      addConsoleMessage('Please upload a valid .glm file', 'error');
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.add('border-[#ea580b]', 'bg-orange-50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove('border-[#ea580b]', 'bg-orange-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove('border-[#ea580b]', 'bg-orange-50');
    
    const files = Array.from(e.dataTransfer.files);
    const glmFile = files.find(f => f.name.endsWith('.glm'));
    
    if (glmFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGlmContent(e.target.result);
        setSelectedFile(glmFile.name);
        addConsoleMessage(`File dropped: ${glmFile.name}`, 'success');
      };
      reader.readAsText(glmFile);
    }
  };

  // Console message helper
  const addConsoleMessage = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleOutput(prev => [...prev, { timestamp, message, type }]);
  };

  // Simulation runner
  const runSimulation = async () => {
    if (!glmContent && !selectedFile) {
      addConsoleMessage('No model loaded. Please upload a GLM file or select a template.', 'error');
      return;
    }

    setIsRunning(true);
    setSimulationProgress(0);
    addConsoleMessage('Preparing simulation...', 'info');

    // Simulate file zipping
    setTimeout(() => {
      addConsoleMessage('Compressing GLM files...', 'info');
      setSimulationProgress(20);
    }, 500);

    // Simulate upload
    setTimeout(() => {
      addConsoleMessage('Uploading to cloud...', 'info');
      setSimulationProgress(40);
    }, 1000);

    // Simulate cloud processing
    setTimeout(() => {
      addConsoleMessage('Initializing GridLAB-D engine...', 'info');
      setSimulationProgress(60);
    }, 1500);

    // Simulate running
    setTimeout(() => {
      addConsoleMessage('Running simulation...', 'info');
      setSimulationProgress(80);
    }, 2000);

    // Simulate completion
    setTimeout(() => {
      setSimulationProgress(100);
      addConsoleMessage('Simulation complete!', 'success');
      addConsoleMessage('Total time: 2.4 seconds', 'info');
      addConsoleMessage('Convergence: SUCCESS', 'success');
      setIsRunning(false);
      
      // Mock results
      setResultsData({
        voltageViolations: 3,
        peakLoad: 4.2,
        losses: 2.3,
        convergence: true
      });
    }, 3000);

    // In real implementation, this would be:
    /*
    try {
      // Create FormData and append files
      const formData = new FormData();
      const blob = new Blob([glmContent], { type: 'text/plain' });
      formData.append('glm', blob, selectedFile || 'model.glm');
      
      // Upload to API
      const response = await fetch('/api/gridlabd/simulate', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      setResultsData(result);
    } catch (error) {
      addConsoleMessage(`Error: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
    }
    */
  };

  // Template loader
  const loadTemplate = (templateName) => {
    addConsoleMessage(`Loading template: ${templateName}`, 'info');
    setGlmContent(sampleGLM);
    setSelectedFile(`${templateName}.glm`);
    setActiveTab('code');
  };

  // Property editor for visual mode
  const PropertyEditor = () => (
    <div className="p-4">
      <h3 className="font-bold mb-4">Node Properties</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-gray-600">Name</label>
          <input 
            type="text" 
            className="w-full mt-1 px-3 py-2 border border-gray-300 focus:border-[#ea580b] outline-none"
            defaultValue={selectedNode || "source_bus"}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Type</label>
          <select className="w-full mt-1 px-3 py-2 border border-gray-300 focus:border-[#ea580b] outline-none">
            <option>SWING</option>
            <option>PQ</option>
            <option>PV</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Nominal Voltage (V)</label>
          <input 
            type="number" 
            className="w-full mt-1 px-3 py-2 border border-gray-300 focus:border-[#ea580b] outline-none"
            defaultValue="7200"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Phases</label>
          <select className="w-full mt-1 px-3 py-2 border border-gray-300 focus:border-[#ea580b] outline-none">
            <option>ABCN</option>
            <option>ABC</option>
            <option>AB</option>
            <option>A</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Visual diagram component
  const VisualDiagram = () => (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <svg width="400" height="300" className="mx-auto">
          {/* Simple one-line diagram */}
          <line x1="50" y1="150" x2="150" y2="150" stroke="#333" strokeWidth="2"/>
          <line x1="150" y1="150" x2="250" y2="150" stroke="#333" strokeWidth="2"/>
          <line x1="250" y1="150" x2="350" y2="150" stroke="#333" strokeWidth="2"/>
          
          {/* Nodes */}
          <circle cx="50" cy="150" r="8" fill="#ea580b" onClick={() => setSelectedNode('source')}/>
          <circle cx="150" cy="150" r="8" fill="#4B5563" onClick={() => setSelectedNode('node1')}/>
          <circle cx="250" cy="150" r="8" fill="#4B5563" onClick={() => setSelectedNode('node2')}/>
          <circle cx="350" cy="150" r="8" fill="#4B5563" onClick={() => setSelectedNode('load')}/>
          
          {/* Branch to DER */}
          <line x1="150" y1="150" x2="150" y2="80" stroke="#333" strokeWidth="2"/>
          <rect x="130" y="60" width="40" height="20" fill="#10B981" onClick={() => setSelectedNode('solar')}/>
          
          {/* Labels */}
          <text x="50" y="180" textAnchor="middle" className="text-xs">Source</text>
          <text x="150" y="180" textAnchor="middle" className="text-xs">Node 1</text>
          <text x="250" y="180" textAnchor="middle" className="text-xs">Node 2</text>
          <text x="350" y="180" textAnchor="middle" className="text-xs">Load</text>
          <text x="150" y="55" textAnchor="middle" className="text-xs">PV</text>
        </svg>
        <p className="text-sm text-gray-500 mt-4">Click on elements to edit properties</p>
      </div>
    </div>
  );

  // Excel-like data editor using AG-Grid
  // Note: Install ag-grid-react and ag-grid-community
  // npm install ag-grid-react ag-grid-community
  const DataEditor = () => {
    // Sample data for the grid (now editable)
    const [rowData, setRowData] = useState([
      { node: 'source_bus', type: 'SWING', voltage: 7200, load: null, pf: null },
      { node: 'node_1', type: 'PQ', voltage: 7180, load: 500, pf: 0.95 },
      { node: 'node_2', type: 'PQ', voltage: 7150, load: 750, pf: 0.92 },
      { node: 'node_3', type: 'PQ', voltage: 7100, load: 1200, pf: 0.90 },
      { node: 'transformer_1', type: 'TRANSFORMER', voltage: 480, load: 300, pf: 0.98 },
    ]);

    const [columnDefs] = useState([
      { field: 'node', headerName: 'Node Name', editable: true, minWidth: 150 },
      { 
        field: 'type', 
        headerName: 'Type', 
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['SWING', 'PQ', 'PV', 'TRANSFORMER']
        }
      },
      { field: 'voltage', headerName: 'Voltage (V)', editable: true, filter: 'agNumberColumnFilter' },
      { field: 'load', headerName: 'Load (kW)', editable: true, filter: 'agNumberColumnFilter' },
      { field: 'pf', headerName: 'Power Factor', editable: true, filter: 'agNumberColumnFilter' }
    ]);

    const defaultColDef = { resizable: true, sortable: true, filter: true, flex: 1, editable: true }; 

    const [gridApi, setGridApi] = useState(null);
    const fileInputRefCsv = useRef(null);

    const onGridReady = (params) => {
      setGridApi(params.api);
      params.api.sizeColumnsToFit();
    };

    const handleAddRow = () => {
      const newRow = { node: `new_node_${rowData.length+1}`, type: 'PQ', voltage: 0, load: 0, pf: 1.0 };
      setRowData(prev => [...prev, newRow]);
      addConsoleMessage('Row added to Data Table', 'info');
    };

    const handleExportCSV = () => {
      if (gridApi) {
        gridApi.exportDataAsCsv({ fileName: 'gridlabd-data.csv' });
        addConsoleMessage('Data exported as CSV', 'success');
      }
    };

    // (Community edition supports CSV export; Excel export requires Enterprise)
    const handleImportCSVClick = () => fileInputRefCsv.current?.click();

    const handleImportCSV = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const text = ev.target.result;
          const lines = text.split(/\r?\n/).filter(l => l.trim().length);
          const header = lines.shift().split(',').map(h => h.trim());
          const data = lines.map(line => {
            const values = line.split(',');
            const obj = {};
            header.forEach((h, idx) => { obj[h] = values[idx] === '' ? null : values[idx]; });
            // Coerce numeric fields
            ['voltage','load','pf'].forEach(k => { if (obj[k] !== null && !isNaN(obj[k])) obj[k] = Number(obj[k]); });
            return obj;
          });
          setRowData(data);
          addConsoleMessage(`Imported ${data.length} rows from CSV`, 'success');
        } catch (err) {
          addConsoleMessage('CSV import failed', 'error');
        } finally {
          e.target.value = '';
        }
      };
      reader.readAsText(file);
    };

    const onCellValueChanged = (params) => {
      setRowData(prev => prev.map(r => (r.node === params.data.node ? params.data : r)));
    };

    return (
      <div className="h-full p-4 flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <div className="space-x-2">
            <button onClick={handleImportCSVClick} className="px-3 py-1 bg-green-600 text-white text-sm hover:bg-green-700">Import CSV</button>
            <button onClick={handleExportCSV} className="px-3 py-1 bg-blue-600 text-white text-sm hover:bg-blue-700">Export CSV</button>
            <button onClick={handleAddRow} className="px-3 py-1 bg-gray-600 text-white text-sm hover:bg-gray-700">Add Row</button>
            <input ref={fileInputRefCsv} type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
          </div>
          <div className="text-sm text-gray-600">Editable grid • Use column filters • Drag to resize</div>
        </div>
        <div className="ag-theme-alpine flex-1 min-h-0" style={{ width: '100%' }}>
          <AgGridReact
            theme="legacy"
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            enableCellChangeFlash={true}
            onGridReady={onGridReady}
            editType="fullRow"
            suppressRowClickSelection={false}
            stopEditingWhenCellsLoseFocus={true}
            onCellValueChanged={onCellValueChanged}
            modules={[AllCommunityModule]}
          />
        </div>
        <div className="pt-2 text-xs text-gray-500">Community edition: Excel export requires enterprise license.</div>
      </div>
    );

  };

  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hi! I can help modify your GridLAB-D model. Try: "add node house_1" or "set stoptime 2024-01-03 00:00:00".' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);

  const handleChatInputChange = useCallback((e) => {
    setChatInput(e.target.value);
  }, []);

  const applyInstruction = (text) => {
    let updated = glmContent || sampleGLM;
    let response = '';
    const addNodeMatch = text.match(/add node (\w+)/i);
    if (addNodeMatch) {
      const nodeName = addNodeMatch[1];
      if (!updated.includes(`name \"${nodeName}\"`)) {
        updated += `\n\nobject node {\n  name \"${nodeName}\";\n  phases ABC;\n  nominal_voltage 7200;\n  bustype PQ;\n}`;
        response += `Added node ${nodeName}. `;
      } else {
        response += `Node ${nodeName} already exists. `;
      }
    }
    const setTimeMatch = text.match(/set (starttime|stoptime) ([0-9:-\s']+)/i);
    if (setTimeMatch) {
      const key = setTimeMatch[1];
      const val = setTimeMatch[2].replace(/"/g,'').trim();
      const clockRegex = new RegExp(`${key}[^;]*;`);
      if (clockRegex.test(updated)) {
        updated = updated.replace(clockRegex, `${key} '${val}';`);
      } else {
        // append inside clock if possible
        updated = updated.replace(/clock {([\s\S]*?)}/, (m, inner) => `clock {${inner}\n  ${key} '${val}';\n}`);
      }
      response += `${key} set to ${val}. `;
    }
    if (!response) response = 'Instruction noted (no direct action implemented).';
    setGlmContent(updated);
    return response.trim();
  };

  const handleSendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg = { role: 'user', content: text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    // Simulate AI processing
    setTimeout(() => {
      const result = applyInstruction(text);
      const aiMsg = { role: 'assistant', content: result };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 400);
  };

  // Stable ChatPanel component to prevent remount on each keystroke
  function ChatPanel({
    chatMessages,
    chatInput,
    isChatOpen,
    handleChatInputChange,
    handleSendChat,
    setIsChatOpen,
    setChatMessages
  }) {
    return (
      <div className={`h-full border-l-2 border-gray-300 bg-white flex flex-col transition-all duration-300 ${isChatOpen ? 'w-96' : 'w-8'}`}>
        <div className="flex items-center justify-between px-2 py-1 border-b bg-gray-50 shrink-0">
          <button onClick={() => setIsChatOpen(o=>!o)} className="text-xs text-gray-600 hover:text-[#ea580b]">{isChatOpen ? '⟨' : '⟩'}</button>
          {isChatOpen && <div className="text-xs font-semibold">AI Assistant</div>}
          {isChatOpen && <button onClick={() => setChatMessages([{ role:'assistant', content:'Cleared. Ask another question.'}])} className="text-[10px] text-gray-500 hover:text-red-600">Clear</button>}
        </div>
        {isChatOpen && (
          <>
            <div className="flex-1 overflow-auto p-3 space-y-2 text-sm">
              {chatMessages.map((m,i)=>(
                <div key={i} className={`${m.role==='assistant' ? 'bg-orange-50 border border-orange-200' : 'bg-gray-100'} rounded px-2 py-1`}> 
                  <span className="block text-[10px] uppercase tracking-wide mb-0.5 text-gray-500">{m.role}</span>
                  {m.content}
                </div>
              ))}
            </div>
            <div className="p-2 border-t bg-white shrink-0 sticky bottom-0">
              <textarea
                rows={2}
                autoFocus
                value={chatInput}
                onChange={handleChatInputChange}
                onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); handleSendChat(); }}}
                placeholder="e.g. add node house_1"
                className="w-full text-xs border border-gray-300 focus:border-[#ea580b] outline-none p-2 resize-none mb-2"
              />
              <div className="flex justify-between items-center">
                <div className="text-[10px] text-gray-500">Commands: add node NAME • set starttime TIME • set stoptime TIME</div>
                <button onClick={handleSendChat} className="px-3 py-1 bg-[#ea580b] text-white text-xs hover:bg-orange-600">Send</button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col h-full">{/* rely on parent height */}
      {/* Top Navigation Bar */}
      <div className="bg-white border-b-2 border-gray-300 shrink-0">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold">GridLAB-D Cloud</h1>
            <div className="flex space-x-4 text-sm">
              <button className="hover:text-[#ea580b]">File</button>
              <button className="hover:text-[#ea580b]">Edit</button>
              <button className="hover:text-[#ea580b]">View</button>
              <button className="hover:text-[#ea580b]">Run</button>
              <button className="hover:text-[#ea580b]">Help</button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Ready</span>
            <button className="bg-[#ea580b] text-white px-4 py-1 text-sm font-semibold hover:bg-orange-700">
              Sign In
            </button>
          </div>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">{/* fills remaining space above status bar */}
        {/* Left Sidebar - File Explorer */}
        <div className="w-64 bg-white border-r-2 border-gray-300 flex flex-col overflow-hidden">{/* unchanged sidebar */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-sm mb-3">File Explorer</h2>
            <div className="space-y-1">
              <div className="font-semibold text-sm text-gray-700 mb-2">📁 My Models</div>
              <div className="pl-4 space-y-1">
                <div className="text-sm hover:bg-gray-100 px-2 py-1 cursor-pointer">📁 IEEE Tests</div>
                {expandedFolders.includes('ieee') && (
                  <div className="pl-6">
                    <div 
                      className="text-sm hover:bg-gray-100 px-2 py-1 cursor-pointer"
                      onClick={() => loadTemplate('IEEE_13_bus')}
                    >
                      📄 13-bus
                    </div>
                    <div className="text-sm hover:bg-gray-100 px-2 py-1 cursor-pointer">📄 34-bus</div>
                  </div>
                )}
                <div className="text-sm hover:bg-gray-100 px-2 py-1 cursor-pointer">📁 Utility</div>
                <div className="text-sm hover:bg-gray-100 px-2 py-1 cursor-pointer">📁 Uploads</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-sm mb-3">Templates</h3>
            <div className="space-y-2">
              <button 
                onClick={() => loadTemplate('blank')}
                className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1"
              >
                ⚡ Blank Model
              </button>
              <button 
                onClick={() => loadTemplate('urban_feeder')}
                className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1"
              >
                ⚡ Urban Feeder
              </button>
              <button 
                onClick={() => loadTemplate('rural_der')}
                className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1"
              >
                ⚡ Rural + DER
              </button>
              <button 
                onClick={() => loadTemplate('microgrid')}
                className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1"
              >
                ⚡ Microgrid
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="p-4 flex-1">
            <div 
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-[#ea580b] transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Drop GLM files here</p>
              <p className="text-xs text-gray-500">or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".glm"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div className="bg-white border-b border-gray-300 px-4 shrink-0">
            <div className="flex space-x-2 relative">
              {['visual','code','data'].map(tab => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative py-2 px-5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580b] ${isActive ? 'text-[#ea580b] font-semibold' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    <span className="capitalize flex items-center space-x-1">
                      {tab==='visual' && <span>🧩</span>}
                      {tab==='code' && <span>{'</>'}</span>}
                      {tab==='data' && <span>📊</span>}
                      <span>{tab==='data' ? 'Data' : tab}</span>
                    </span>
                    {isActive && <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-[#ea580b]" />}
                  </button>
                );
              })}
              <div className="flex-1 border-b border-gray-300" />
            </div>
          </div>
          {/* Content Area */}
          <div className="flex-1 bg-white overflow-hidden">
            {activeTab === 'visual' && <VisualDiagram />}
            {activeTab === 'code' && (
              <div className="h-full flex flex-col">
                <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b bg-gray-50">
                  <h2 className="font-semibold text-sm text-gray-700">GLM Code Editor</h2>
                  <div className="space-x-2 text-xs">
                    <button onClick={()=>addConsoleMessage('Formatting not implemented','info')} className="px-2 py-1 border text-gray-600 hover:bg-gray-100 rounded">Format</button>
                    <button onClick={()=>addConsoleMessage('Validation placeholder','info')} className="px-2 py-1 border text-gray-600 hover:bg-gray-100 rounded">Validate</button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <MonacoEditor
                    height="100%"
                    defaultLanguage="plaintext"
                    theme="vs-light"
                    value={glmContent || sampleGLM}
                    onChange={(val)=> setGlmContent(val || '')}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      wordWrap: 'on',
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      tabSize: 2,
                    }}
                  />
                </div>
              </div>
            )}
            {activeTab === 'data' && <DataEditor />}
          </div>
          {/* Bottom Panel */}
          <div className="h-64 bg-white border-t-2 border-gray-300 shrink-0 flex flex-col">
            <div className="p-4 flex-1 overflow-auto">
              {resultsData ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-500">Simulation Results:</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg shadow">
                      <div className="text-xs font-semibold text-gray-700 uppercase mb-2">Voltage Violations</div>
                      <div className="text-lg font-bold text-[#ea580b]">{resultsData.voltageViolations}</div>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg shadow">
                      <div className="text-xs font-semibold text-gray-700 uppercase mb-2">Peak Load (kW)</div>
                      <div className="text-lg font-bold text-[#ea580b]">{resultsData.peakLoad}</div>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg shadow">
                      <div className="text-xs font-semibold text-gray-700 uppercase mb-2">Losses (kW)</div>
                      <div className="text-lg font-bold text-[#ea580b]">{resultsData.losses}</div>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg shadow">
                      <div className="text-xs font-semibold text-gray-700 uppercase mb-2">Convergence</div>
                      <div className="text-lg font-bold text-[#10B981]">{resultsData.convergence ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No results available. Run the simulation to see results here.</div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <h3 className="font-bold text-sm mb-3">Console Output</h3>
              <div className="space-y-2">
                {consoleOutput.map((msg, idx) => (
                  <div key={idx} className={`text-xs p-2 rounded-lg ${msg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    <span className="font-semibold">{msg.timestamp}</span>: {msg.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Chat Panel */}
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
      {/* Bottom Control Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-800 text-white flex items-center justify-between px-4 border-t border-gray-700 z-50">
        {/* Left controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`flex items-center space-x-2 px-4 py-1 ${isRunning ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isRunning ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Running...</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>Run</span>
              </>
            )}
          </button>
          <button className="px-4 py-1 bg-gray-700 hover:bg-gray-600" disabled={!isRunning}>⏸ Pause</button>
          <button className="px-4 py-1 bg-gray-700 hover:bg-gray-600" disabled={!isRunning}>⏹ Stop</button>
        </div>
        {/* Right status */}
        <div className="flex items-center space-x-4">
          <div className="text-sm">{selectedFile ? `Current: ${selectedFile}` : 'No file loaded'}</div>
          {isRunning && (
            <div className="flex items-center space-x-2">
              <span className="text-sm">Progress:</span>
              <div className="w-48 bg-gray-700 h-2">
                <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${simulationProgress}%` }} />
              </div>
              <span className="text-sm">{simulationProgress}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}