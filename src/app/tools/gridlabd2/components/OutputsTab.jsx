'use client';

import { useState, useCallback } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { apiFetch } from '@/lib/api';

export default function OutputsTab({ simulations = [], selectedProjectId, addConsoleMessage }) {
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [selectedOutputFile, setSelectedOutputFile] = useState(null);
  const [outputPreview, setOutputPreview] = useState({ type: 'none', text: '', csv: null });
  const [loading, setLoading] = useState(false);

  // Heuristic for previewable text
  const isTextFile = (filename = '') => /\.(txt|log|json|xml|yaml|yml|ini|conf|glm|md|csv)$/i.test(filename);

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
      const yKeys = headers.slice(1);
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
    setOutputPreview({ type: 'none', text: '', csv: null });
    setLoading(true);
    try {
      // Fetch output files for this simulation
      const files = await apiFetch(`/api/simulations/${simulation.id}/files`);
      // For now, assume we have files, but since API might not be fully implemented, we'll simulate
      addConsoleMessage(`Selected simulation: ${simulation.name || simulation.id}`, 'info');
    } catch (error) {
      addConsoleMessage(`Failed to load simulation outputs: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addConsoleMessage]);

  const handleOutputFileSelect = useCallback(async (filename) => {
    setSelectedOutputFile(filename);
    setLoading(true);
    try {
      // Fetch the file content
      const response = await apiFetch(`/api/simulations/${selectedSimulation.id}/files/${filename}`);
      const text = typeof response === 'string' ? response : await response.text();

      if (/\.csv$/i.test(filename)) {
        const csv = await parseCSV(text, 1000);
        setOutputPreview({ type: 'csv', text: '', csv });
      } else if (isTextFile(filename)) {
        setOutputPreview({ type: 'text', text, csv: null });
      } else {
        setOutputPreview({ type: 'download', text: '', csv: null });
      }
      addConsoleMessage(`Loaded output: ${filename}`, 'info');
    } catch (error) {
      setOutputPreview({ type: 'none', text: '', csv: null });
      addConsoleMessage(`Failed to load output file: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedSimulation, addConsoleMessage]);

  const downloadSelectedOutput = useCallback(() => {
    if (!selectedOutputFile) return;
    try {
      let blob;
      if (outputPreview.type === 'csv') blob = new Blob([JSON.stringify(outputPreview.csv)], { type: 'application/json' });
      else if (outputPreview.type === 'text') blob = new Blob([outputPreview.text], { type: 'text/plain' });
      else return; // For binary files, we'd need to fetch the original
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = selectedOutputFile; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch (error) {
      addConsoleMessage(`Failed to download: ${error.message}`, 'error');
    }
  }, [outputPreview, selectedOutputFile, addConsoleMessage]);

  return (
    <div className="h-full flex">
      {/* Simulations List */}
      <div className="w-72 border-r border-gray-200 p-3 space-y-3">
        <div className="text-sm font-medium text-gray-700">Simulations</div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {simulations.length === 0 ? (
            <div className="text-xs text-gray-500 italic">No simulations found</div>
          ) : (
            simulations.map(s => (
              <div
                key={s.id}
                onClick={() => handleSimulationSelect(s)}
                className={`p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedSimulation?.id === s.id ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                <div className="text-sm font-medium">{s.name || s.id}</div>
                <div className="text-xs text-gray-500">{new Date(s.created_at || s.timestamp).toLocaleString()}</div>
                <div className={`text-xs uppercase ${s.status === 'completed' ? 'text-green-600' : s.status === 'failed' ? 'text-red-600' : s.status === 'running' ? 'text-orange-600' : 'text-gray-600'}`}>
                  {s.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Output Files and Preview */}
      <div className="flex-1 min-w-0">
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
              <button className="px-2 py-1 text-xs border border-gray-300" onClick={downloadSelectedOutput}>Download</button>
            </div>
            <div className="p-4 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={outputPreview.csv.data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                  <XAxis dataKey={outputPreview.csv.xKey} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  {(outputPreview.csv.yKeys || []).slice(0, 3).map((k, idx) => (
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
              <button className="px-2 py-1 text-xs border border-gray-300" onClick={downloadSelectedOutput}>Download</button>
            </div>
            <pre className="p-4 text-xs overflow-auto whitespace-pre-wrap">{outputPreview.text}</pre>
          </div>
        ) : outputPreview.type === 'download' ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-sm">
              Preview not available. <button className="text-blue-600 underline" onClick={downloadSelectedOutput}>Download file</button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            No preview available
          </div>
        )}
      </div>
    </div>
  );
}