"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiFetch } from '@/lib/api';
import { Download } from 'lucide-react';

export default function OutputsTab({ simulations = [], selectedProjectId, addConsoleMessage }) {
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [selectedOutputFile, setSelectedOutputFile] = useState(null);
  const [outputFiles, setOutputFiles] = useState([]);
  const [outputPreview, setOutputPreview] = useState({ type: 'none', text: '', csv: null });
  const [loading, setLoading] = useState(false);

  // Heuristic for previewable text
  const isTextFile = (filename = '') => /(\.txt|\.log|\.json|\.xml|\.yaml|\.yml|\.ini|\.conf|\.glm|\.md|\.csv)$/i.test(filename);

  // Complex magnitude parser: "+7199.56+0j" => abs
  const complexAbs = (val) => {
    if (val == null) return null;
    const s = String(val).trim();
    if (!/[ji]/i.test(s)) { const n = Number(s); return Number.isFinite(n) ? n : val; }
    const lower = s.toLowerCase();
    const jIdx = Math.max(lower.lastIndexOf('j'), lower.lastIndexOf('i'));
    if (jIdx === -1) { const n = Number(s); return Number.isFinite(n) ? n : val; }
    const w = lower.slice(0, jIdx);
    let split = -1; for (let i=1;i<w.length;i++){ const c=w[i]; if(c==='+'||c==='-') split=i; }
    let re=0, im=0; if (split===-1) { im = Number(w); } else { re = Number(w.slice(0,split)); im = Number(w.slice(split)); }
    if (!Number.isFinite(re) || !Number.isFinite(im)) return val;
    return Math.sqrt(re*re + im*im);
  };

  // PapaParse-powered CSV parser with header-in-comments support and 1000 row cap
  const parseCSV = async (text, maxRows = 1000) => {
    try {
      const raw = String(text || '').replace(/\r\n?/g, '\n');
      const lines = raw.split('\n').filter(Boolean);
      if (!lines.length) return { data: [], xKey: '', yKeys: [] };
      const commentLines = lines.filter(l => l.trim().startsWith('#'));
      let headerLine = '';
      for (let i = commentLines.length - 1; i >= 0; i -= 1) {
        const cand = commentLines[i].replace(/^\s*#\s*/, '');
        if (cand.includes(',')) { headerLine = cand; break; }
      }
      const dataLines = lines.filter(l => !l.trim().startsWith('#'));
      if (!headerLine) headerLine = dataLines[0] || '';
      const clean = [headerLine, ...dataLines.filter(l => l !== headerLine).slice(0, maxRows)].join('\n');

      let Papa; try { const m = await import('papaparse'); Papa = m.default || m; } catch {}
      let rows = [], headers = [];
      if (Papa) {
        const res = Papa.parse(clean, { header: true, skipEmptyLines: 'greedy', dynamicTyping: false });
        headers = Array.isArray(res.meta?.fields) ? res.meta.fields : [];
        rows = Array.isArray(res.data) ? res.data : [];
      } else {
        const all = clean.split('\n').filter(Boolean);
        headers = (all[0] || '').split(',').map(h => h.trim());
        rows = all.slice(1).map(line => { const cols = line.split(','); const obj = {}; headers.forEach((h,i)=> obj[h]=(cols[i]??'').trim()); return obj; });
      }

      const xKey = headers[0] || 'timestamp';
      const yKeys = headers.slice(1, 4); // First 3 columns after timestamp
      const processed = rows.map(r => {
        const o = {}; headers.forEach((h, idx) => {
          let v = r[h];
          if (idx > 0 && typeof v === 'string') {
            const trimmed = v.trim();
            const comp = complexAbs(trimmed);
            if (typeof comp === 'number') v = comp; else { const num = Number(trimmed); v = Number.isFinite(num) ? num : trimmed; }
          }
          o[h] = v;
        }); return o; });

      return { data: processed.slice(0, maxRows), xKey, yKeys };
    } catch { return { data: [], xKey: '', yKeys: [] }; }
  };

  const handleSimulationSelect = useCallback(async (simulation) => {
    setSelectedSimulation(simulation);
    setSelectedOutputFile(null);
    setOutputFiles([]);
    setOutputPreview({ type: 'none', text: '', csv: null });
    setLoading(true);
    
    try {
      const simulationId = simulation.simulation_id || simulation.id;
      addConsoleMessage(`Selected simulation: ${simulationId}`, 'info');
      
      // Fetch the list of output files from the API
      const filesResponse = await apiFetch(`/api/simulations/${simulationId}/files`);
      
      if (filesResponse) {
        // Handle different response formats
        const files = Array.isArray(filesResponse) ? filesResponse : 
                      filesResponse.files ? filesResponse.files : 
                      filesResponse.outputs ? filesResponse.outputs : [];
        
        setOutputFiles(files);
        addConsoleMessage(`Found ${files.length} output files`, 'info');
        
        // If there are files, log their names
        if (files.length > 0) {
          const fileNames = files.map(f => f.filename || f.name || f).join(', ');
          addConsoleMessage(`Files: ${fileNames}`, 'info');
        }
      }
    } catch (error) {
      console.error('Failed to load simulation files:', error);
      addConsoleMessage(`Failed to load simulation outputs: ${error.message}`, 'error');
      setOutputFiles([]);
    } finally {
      setLoading(false);
    }
  }, [addConsoleMessage]);

  const handleOutputFileSelect = useCallback(async (outputFile) => {
    const filename = outputFile.filename || outputFile.name || outputFile;
    setSelectedOutputFile(filename);
    setLoading(true);
    
    try {
      const simulationId = selectedSimulation.simulation_id || selectedSimulation.id;
      
      // Fetch the specific file content
      const response = await apiFetch(`/api/simulations/${simulationId}/files/${encodeURIComponent(filename)}`);
      
      let text;
      if (response instanceof Blob) {
        text = await response.text();
      } else if (typeof response === 'string') {
        text = response;
      } else if (response.content) {
        text = response.content;
      } else {
        text = JSON.stringify(response);
      }

      if (/\.csv$/i.test(filename)) {
        const csv = await parseCSV(text, 1000);
        setOutputPreview({ type: 'csv', text: '', csv });
        addConsoleMessage(`Loaded CSV: ${filename} (${csv.data.length} rows, columns: ${csv.yKeys.join(', ')})`, 'info');
      } else if (isTextFile(filename)) {
        setOutputPreview({ type: 'text', text, csv: null });
        addConsoleMessage(`Loaded text file: ${filename}`, 'info');
      } else {
        setOutputPreview({ type: 'download', text: '', csv: null });
        addConsoleMessage(`File loaded for download: ${filename}`, 'info');
      }
    } catch (error) {
      setOutputPreview({ type: 'none', text: '', csv: null });
      addConsoleMessage(`Failed to load output file: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedSimulation, addConsoleMessage]);

  const downloadSelectedOutput = useCallback(async () => {
    if (!selectedOutputFile || !selectedSimulation) return;
    
    try {
      const simulationId = selectedSimulation.simulation_id || selectedSimulation.id;
      
      // Fetch the file as blob for download
      const response = await apiFetch(`/api/simulations/${simulationId}/files/${encodeURIComponent(selectedOutputFile)}`);
      
      let blob;
      if (response instanceof Blob) {
        blob = response;
      } else if (typeof response === 'string') {
        blob = new Blob([response], { type: 'text/plain' });
      } else {
        blob = new Blob([JSON.stringify(response)], { type: 'application/json' });
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedOutputFile;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addConsoleMessage(`Downloaded: ${selectedOutputFile}`, 'info');
    } catch (error) {
      addConsoleMessage(`Failed to download: ${error.message}`, 'error');
    }
  }, [selectedSimulation, selectedOutputFile, addConsoleMessage]);

  const downloadAllOutputs = useCallback(async () => {
    if (!selectedSimulation) return;
    
    try {
      const simulationId = selectedSimulation.simulation_id || selectedSimulation.id;
      addConsoleMessage('Downloading all outputs as ZIP...', 'info');
      
      // Download the outputs.zip file
      const response = await apiFetch(`/api/simulations/${simulationId}/outputs`);
      
      let blob;
      if (response instanceof Blob) {
        blob = response;
      } else {
        blob = new Blob([JSON.stringify(response)], { type: 'application/json' });
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `outputs-${simulationId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addConsoleMessage('Downloaded outputs.zip successfully', 'info');
    } catch (error) {
      addConsoleMessage(`Failed to download outputs.zip: ${error.message}`, 'error');
    }
  }, [selectedSimulation, addConsoleMessage]);

  // Poll for simulation updates if running
  useEffect(() => {
    if (!selectedSimulation) return;
    
    const status = selectedSimulation.status;
    if (status === 'running' || status === 'RUNNING' || status === 'pending' || status === 'PENDING') {
      const interval = setInterval(async () => {
        try {
          const simulationId = selectedSimulation.simulation_id || selectedSimulation.id;
          const updated = await apiFetch(`/api/simulations/${simulationId}`);
          
          if (updated.status !== status) {
            setSelectedSimulation(updated);
            
            if (updated.status === 'completed' || updated.status === 'COMPLETED') {
              // Refresh files list when simulation completes
              handleSimulationSelect(updated);
            }
          }
        } catch (error) {
          console.error('Failed to poll simulation status:', error);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [selectedSimulation]);

  return (
    <div className="h-full flex">
      {/* Simulations List */}
      <div className="w-72 border-r border-gray-200 p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">Simulations</div>
          {selectedSimulation && (selectedSimulation.status === 'completed' || selectedSimulation.status === 'COMPLETED') && (
            <button 
              onClick={downloadAllOutputs}
              className="text-xs px-2 py-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Download className="w-4 h-4 inline-block" />
            </button>
          )}
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {(!Array.isArray(simulations) || simulations.length === 0) ? (
            <div className="text-xs text-gray-500 italic">No simulations found</div>
          ) : (
            simulations.map(s => (
              <div
                key={s.simulation_id || s.id}
                onClick={() => handleSimulationSelect(s)}
                className={`p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 ${(selectedSimulation?.simulation_id || selectedSimulation?.id) === (s.simulation_id || s.id) ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                <div className="text-sm font-medium">{s.name || s.simulation_id || s.id}</div>
                <div className="text-xs text-gray-500">{new Date(s.started_at || s.created_at || s.timestamp || Date.now()).toLocaleString()}</div>
                <div className={`text-xs uppercase font-medium ${
                  s.status === 'COMPLETED' || s.status === 'completed' ? 'text-green-600' : 
                  s.status === 'FAILED' || s.status === 'failed' ? 'text-red-600' : 
                  s.status === 'RUNNING' || s.status === 'running' ? 'text-orange-600' : 
                  'text-gray-600'
                }`}>
                  {s.status || 'pending'}
                </div>
                {s.duration_seconds && (
                  <div className="text-xs text-gray-500">Duration: {s.duration_seconds}s</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Output Files and Preview */}
      <div className="flex-1 min-w-0 flex">
        {/* Output Files List */}
        {selectedSimulation && (
          <div className="w-64 border-r border-gray-200 p-3 space-y-3">
            <div className="text-sm font-medium text-gray-700">Output Files</div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-xs text-gray-500 italic">Loading files...</div>
              ) : outputFiles.length === 0 ? (
                <div className="text-xs text-gray-500 italic">
                  {selectedSimulation.status === 'running' || selectedSimulation.status === 'RUNNING' 
                    ? 'Simulation still running...' 
                    : 'No output files available'}
                </div>
              ) : (
                outputFiles.map(output => {
                  const filename = output.filename || output.name || output;
                  const size = output.size_bytes || output.size;
                  return (
                    <div
                      key={filename}
                      onClick={() => handleOutputFileSelect(output)}
                      className={`p-2 text-xs border border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedOutputFile === filename ? 'bg-blue-50 border-blue-300' : ''}`}
                    >
                      <div className="font-medium">{filename}</div>
                      {size && <div className="text-gray-500">Size: {(size / 1024).toFixed(2)} KB</div>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
        
        {/* Preview Area */}
        <div className="flex-1">
          {!selectedSimulation ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              Select a simulation to view its outputs
            </div>
          ) : loading ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              Loading...
            </div>
          ) : !selectedOutputFile ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              Select an output file to preview
            </div>
          ) : outputPreview.type === 'csv' && outputPreview.csv ? (
            <div className="h-full flex flex-col">
              <div className="px-4 py-2 border-b border-gray-200 text-sm font-medium flex items-center justify-between">
                <span>{selectedOutputFile}</span>
                <button className="px-2 py-1 text-xs border border-gray-300 hover:bg-gray-50" onClick={downloadSelectedOutput}>
                  Download
                </button>
              </div>
              <div className="p-4 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={outputPreview.csv.data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                    <XAxis dataKey={outputPreview.csv.xKey} tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    {(outputPreview.csv.yKeys || []).map((k, idx) => (
                      <Line key={k} type="monotone" dataKey={k} stroke={["#2563eb","#16a34a","#f59e0b"][idx%3]} dot={false} strokeWidth={1.8} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : outputPreview.type === 'text' ? (
            <div className="h-full flex flex-col">
              <div className="px-4 py-2 border-b border-gray-200 text-sm font-medium flex items-center justify-between">
                <span>{selectedOutputFile}</span>
                <button className="px-2 py-1 text-xs border border-gray-300 hover:bg-gray-50" onClick={downloadSelectedOutput}>
                  Download
                </button>
              </div>
              <pre className="p-4 text-xs overflow-auto whitespace-pre-wrap flex-1">{outputPreview.text}</pre>
            </div>
          ) : outputPreview.type === 'download' ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-sm">
                Preview not available. 
                <button className="text-blue-600 underline ml-2" onClick={downloadSelectedOutput}>
                  Download file
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              No preview available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}