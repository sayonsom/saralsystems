"use client";
import { useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function DataEditor({ addConsoleMessage }) {
  const [rowData, setRowData] = useState([
    { node: 'source_bus', type: 'SWING', voltage: 7200, load: null, pf: null },
    { node: 'node_1', type: 'PQ', voltage: 7180, load: 500, pf: 0.95 },
    { node: 'node_2', type: 'PQ', voltage: 7150, load: 750, pf: 0.92 },
    { node: 'node_3', type: 'PQ', voltage: 7100, load: 1200, pf: 0.90 },
    { node: 'transformer_1', type: 'TRANSFORMER', voltage: 480, load: 300, pf: 0.98 },
  ]);
  const [columnDefs] = useState([
    { field: 'node', headerName: 'Node Name', editable: true, minWidth: 150 },
    { field: 'type', headerName: 'Type', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['SWING','PQ','PV','TRANSFORMER'] } },
    { field: 'voltage', headerName: 'Voltage (V)', editable: true, filter: 'agNumberColumnFilter' },
    { field: 'load', headerName: 'Load (kW)', editable: true, filter: 'agNumberColumnFilter' },
    { field: 'pf', headerName: 'Power Factor', editable: true, filter: 'agNumberColumnFilter' }
  ]);
  const defaultColDef = { resizable: true, sortable: true, filter: true, flex: 1, editable: true };
  const [gridApi, setGridApi] = useState(null);
  const fileInputRefCsv = useRef(null);

  const onGridReady = (params) => { setGridApi(params.api); params.api.sizeColumnsToFit(); };
  const handleAddRow = () => { const newRow = { node: `new_node_${rowData.length+1}`, type: 'PQ', voltage: 0, load: 0, pf: 1.0 }; setRowData(prev => [...prev, newRow]); addConsoleMessage?.('Row added to Data Table','info'); };
  const handleExportCSV = () => { if (gridApi) { gridApi.exportDataAsCsv({ fileName: 'gridlabd-data.csv' }); addConsoleMessage?.('Data exported as CSV','success'); } };
  const handleImportCSVClick = () => fileInputRefCsv.current?.click();
  const handleImportCSV = (e) => { const file = e.target.files?.[0]; if(!file) return; const reader = new FileReader(); reader.onload = (ev) => { try { const text = ev.target.result; const lines = text.split(/\r?\n/).filter(l=>l.trim().length); const header = lines.shift().split(',').map(h=>h.trim()); const data = lines.map(line => { const values = line.split(','); const obj = {}; header.forEach((h, idx) => { obj[h] = values[idx] === '' ? null : values[idx]; }); ['voltage','load','pf'].forEach(k => { if (obj[k] !== null && !isNaN(obj[k])) obj[k] = Number(obj[k]); }); return obj; }); setRowData(data); addConsoleMessage?.(`Imported ${data.length} rows from CSV`,'success'); } catch { addConsoleMessage?.('CSV import failed','error'); } finally { e.target.value=''; } }; reader.readAsText(file); };
  const onCellValueChanged = (params) => { setRowData(prev => prev.map(r => (r.node === params.data.node ? params.data : r))); };

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
}
