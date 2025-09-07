"use client";

import { useCallback, useState, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background, addEdge, useNodesState, useEdgesState, Handle, Position, ConnectionMode, useReactFlow } from 'reactflow';
import Image from 'next/image';
import 'reactflow/dist/style.css';
import { Home, Factory, Sun, Wind, Battery, Car, Gauge, RadioTower, Server, Zap, Plug } from 'lucide-react';

// Node palette definition (icons replaced with existing ones)
const PALETTE = [
  { type: 'substation', label: 'Substation', icon: Server },
  { type: 'transformer', label: 'Transformer', icon: Zap },
  { type: 'meter', label: 'Meter', icon: Gauge },
  { type: 'load', label: 'Load', icon: Plug },
  { type: 'home', label: 'Home', icon: Home },
  { type: 'commercial', label: 'Commercial', icon: Factory },
  { type: 'dg', label: 'DG', icon: null, svg: '/icons/ac_gen.svg' },
  { type: 'solar', label: 'Solar', icon: Sun },
  { type: 'wind', label: 'Wind', icon: Wind },
  { type: 'ev', label: 'EV', icon: Car },
  { type: 'storage', label: 'Storage', icon: Battery }
];

let id = 0;
const getId = () => `n_${id++}`;

const baseNodeStyle = 'relative flex flex-col items-center text-[10px] select-none';
const typeColor = {
  substation: 'bg-rose-600',
  transformer: 'bg-amber-600',
  meter: 'bg-slate-600',
  home: 'bg-teal-600',
  commercial: 'bg-indigo-600',
  dg: 'bg-fuchsia-600',
  solar: 'bg-yellow-500 text-black',
  wind: 'bg-sky-600',
  ev: 'bg-green-600',
  storage: 'bg-zinc-700'
};

function DefaultNode({ id, data }) {
  const { label, type } = data;
  const rf = useReactFlow();
  const paletteItem = PALETTE.find(p=>p.type===type);
  const Icon = paletteItem?.icon || Home;
  const [value, setValue] = useState(label);
  // sync external label changes
  useEffect(()=>{ setValue(label); }, [label]);
  const commit = (val) => {
    rf.setNodes(ns => ns.map(n => n.id === id ? { ...n, data: { ...n.data, label: val } } : n));
  };
  // Determine used handles
  const edges = rf.getEdges();
  const usedHandles = new Set();
  edges.forEach(e => { if (e.source === id && e.sourceHandle) usedHandles.add(e.sourceHandle); if (e.target === id && e.targetHandle) usedHandles.add(e.targetHandle); });
  const handleClass = (hid) => usedHandles.has(hid)
    ? 'w-2 h-2 !bg-gray-300 border border-gray-300 rounded-full opacity-50'
    : 'w-2 h-2 !bg-white border border-orange-500 rounded-full cursor-crosshair shadow';
  return (
    <div className={baseNodeStyle} title={value}>
      {/* top handles */}
      <Handle id="t-target" type="target" position={Position.Top} className={`-mt-2 ${handleClass('t-target')}`} />
      <Handle id="t-source" type="source" position={Position.Top} className={`-mt-2 ml-3 ${handleClass('t-source')}`} />
      {/* left handles */}
      <Handle id="l-target" type="target" position={Position.Left} className={`-ml-2 ${handleClass('l-target')}`} />
      <Handle id="l-source" type="source" position={Position.Left} className={`-ml-2 mt-3 ${handleClass('l-source')}`} />
      <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-white ${typeColor[type] || 'bg-gray-600'}`}>
        {paletteItem?.svg ? <Image src={paletteItem.svg} alt={type} width={18} height={18} /> : <Icon size={14} />}
      </div>
      {/* right handles */}
      <Handle id="r-target" type="target" position={Position.Right} className={`-mr-2 ${handleClass('r-target')}`} />
      <Handle id="r-source" type="source" position={Position.Right} className={`-mr-2 mt-3 ${handleClass('r-source')}`} />
      {/* bottom handles */}
      <Handle id="b-target" type="target" position={Position.Bottom} className={`-mb-2 ${handleClass('b-target')}`} />
      <Handle id="b-source" type="source" position={Position.Bottom} className={`-mb-2 ml-3 ${handleClass('b-source')}`} />
      <input
        value={value}
        onChange={e=>setValue(e.target.value)}
        onBlur={e=>commit(e.target.value.trim() || value)}
        onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); e.currentTarget.blur(); }}}
        className="mt-1 w-16 bg-transparent text-[9px] font-medium text-center text-black border border-transparent focus:border-orange-500 focus:outline-none rounded-sm px-0.5"
        spellCheck={false}
      />
    </div>
  );
}

const nodeTypes = { default: DefaultNode };

export default function VisualEditor({ onSelectNode }) {
  const initialNodes = [
    { id: getId(), type: 'default', position: { x: 0, y: 0 }, data: { label: 'Substation', type: 'substation', bustype: 'SWING', phases: 'ABCN', nominal_voltage: 7200 } }
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [edgeCounter, setEdgeCounter] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);

  // helper to update node data
  const updateNodeData = useCallback((id, newData) => {
    setNodes(ns => ns.map(n => n.id === id ? { ...n, data: { ...n.data, ...newData } } : n));
  }, [setNodes]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => {
      const sourceNode = nodes.find(n=>n.id===params.source);
      const targetNode = nodes.find(n=>n.id===params.target);
      const newEdge = {
        id: `e_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        ...params,
        type: 'step',
        data: {
          name: `line_${edgeCounter}`,
          phases: 'ABCN',
          configuration: '',
            from: sourceNode?.data?.label || params.source,
            to: targetNode?.data?.label || params.target,
            length: 100
        },
        style: { stroke: '#475569', strokeWidth: 2 }
      };
      setEdgeCounter(c=>c+1);
      return addEdge(newEdge, eds);
    });
  }, [nodes, edgeCounter]);

  const handlePaneClick = useCallback((e) => {
    if (activeTool) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const position = { x: e.clientX - bounds.left - 80, y: e.clientY - bounds.top };
      const paletteItem = PALETTE.find(p => p.type === activeTool);
      setNodes(nds => nds.concat({ id: getId(), type: 'default', position, data: { label: paletteItem.label, type: paletteItem.type, bustype: 'PQ', phases: 'ABCN', nominal_voltage: 7200, ...(paletteItem.type==='load'?{ real_power:0, reactive_power:0, power_factor:1.0, load_class:'Residential' }:{}), ...(paletteItem.type==='meter'?{ meter_class:'revenue', interval:60 }:{}) } }));
      setActiveTool(null);
    } else {
      setSelectedNode(null);
      onSelectNode?.(null);
    }
  }, [activeTool, onSelectNode, setNodes]);

  // Allow ESC to unselect active tool
  useEffect(() => {
    const escHandler = (e) => { if (e.key === 'Escape') setActiveTool(null); };
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, []);

  const onNodeClick = useCallback((_, node) => { setSelectedNode(node.id); setSelectedEdge(null); onSelectNode?.(node); }, [onSelectNode]);
  const onEdgeClick = useCallback((_, edge) => { setSelectedEdge(edge); }, []);

  const updateEdgeData = (key, value) => {
    setEdges(es => es.map(e => e.id === selectedEdge.id ? { ...e, data: { ...e.data, [key]: value } } : e));
    setSelectedEdge(se => se ? { ...se, data: { ...se.data, [key]: value } } : se);
  };

  // Keep from/to in sync with node label changes
  useEffect(()=>{
    setEdges(es => es.map(e => {
      const s = nodes.find(n=>n.id===e.source); const t = nodes.find(n=>n.id===e.target);
      return { ...e, data: { ...e.data, from: s?.data?.label || e.data.from, to: t?.data?.label || e.data.to } };
    }));
  }, [nodes, setEdges]);

  const deleteSelectedEdge = () => {
    if (!selectedEdge) return;
    setEdges(es => es.filter(e => e.id !== selectedEdge.id));
    setSelectedEdge(null);
  };

  // highlight selected edge
  useEffect(() => {
    setEdges(es => es.map(e => e.id === selectedEdge?.id ? { ...e, style: { ...(e.style||{}), stroke: '#ea580b', strokeWidth: 3 } } : { ...e, style: { ...(e.style||{}), stroke: e.style?.stroke === '#ea580b' ? '#475569' : e.style?.stroke || '#475569', strokeWidth: 2 } }));
  }, [selectedEdge, setEdges]);

  const defaultEdgeOptions = { type: 'step', style: { stroke: '#475569', strokeWidth: 2 } };

  const exportLayout = () => {
    const data = { nodes: nodes.map(n=>({ ...n, selected: undefined, dragging: undefined })), edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gridlabd-layout.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="h-full w-full flex">
      <div className="w-48 border-r border-gray-200 p-2 space-y-3 bg-white overflow-auto">
        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Palette</div>
        <div className="grid grid-cols-2 gap-2">
          {PALETTE.map(item => {
            const active = activeTool === item.type;
            return (
              <button
                key={item.type}
                onClick={() => setActiveTool(active ? null : item.type)}
                className={`flex flex-col items-center justify-center border rounded p-2 hover:border-orange-500 hover:bg-orange-50 transition text-[10px] ${active ? 'border-orange-600 bg-orange-100' : 'border-gray-200 bg-white'}`}
                title={active ? 'Click again or ESC to unselect' : 'Click then canvas'}
              >
                {item.svg ? (
                  <Image src={item.svg} width={16} height={16} alt={item.label} className="mb-1" />
                ) : (
                  item.icon && <item.icon size={16} className="mb-1" />
                )}
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={() => { setNodes([{ id: getId(), type: 'default', position: { x:0, y:0 }, data: { label: 'Substation', type: 'substation', bustype: 'SWING', phases: 'ABCN', nominal_voltage: 7200 } }]); setEdges([]); setActiveTool(null); setSelectedEdge(null); }} className="flex-1 text-[10px] py-1 border border-gray-300 hover:bg-gray-50 rounded">Reset</button>
          <button onClick={() => { setNodes([]); setEdges([]); setActiveTool(null); setSelectedEdge(null); }} className="flex-1 text-[10px] py-1 border border-gray-300 hover:bg-gray-50 rounded">Clear</button>
        </div>
        <div className="flex gap-2">
          <button onClick={exportLayout} className="flex-1 text-[10px] py-1 border border-gray-300 hover:bg-gray-50 rounded">Save JSON</button>
        </div>
        {selectedNode && (
          <div className="mt-2 border-t pt-2">
            <div className="text-[10px] font-semibold text-gray-600 mb-1">Node Properties</div>
            {(() => { const node = nodes.find(n=>n.id===selectedNode); if(!node) return null; const d=node.data; return (
              <div className="space-y-1">
                <div>
                  <label className="block text-[9px] text-gray-500">Name</label>
                  <input value={d.label} onChange={e=>updateNodeData(node.id,{ label:e.target.value })} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded" />
                </div>
                <div className="flex gap-1">
                  <div className="flex-1">
                    <label className="block text-[9px] text-gray-500">Bustype</label>
                    <select value={d.bustype || 'PQ'} onChange={e=>updateNodeData(node.id,{ bustype:e.target.value })} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded">
                      <option value="SWING">SWING</option>
                      <option value="PV">PV</option>
                      <option value="PQ">PQ</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[9px] text-gray-500">Phases</label>
                    <select value={d.phases || 'ABCN'} onChange={e=>updateNodeData(node.id,{ phases:e.target.value })} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded">
                      <option value="ABCN">ABCN</option>
                      <option value="AN">AN</option>
                      <option value="BN">BN</option>
                      <option value="CN">CN</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] text-gray-500">Nominal Voltage</label>
                  <input type="number" value={d.nominal_voltage ?? 0} onChange={e=>updateNodeData(node.id,{ nominal_voltage:Number(e.target.value) })} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded" />
                </div>
                {d.type==='load' && (
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <div className="col-span-2">
                      <label className="block text-[9px] text-gray-500">Load Class</label>
                      <select value={d.load_class||'Residential'} onChange={e=>updateNodeData(node.id,{ load_class:e.target.value })} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded">
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Industrial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-500">kW</label>
                      <input type="number" value={d.real_power ?? 0} onChange={e=>updateNodeData(node.id,{ real_power:Number(e.target.value) })} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-500">kVar</label>
                      <input type="number" value={d.reactive_power ?? 0} onChange={e=>updateNodeData(node.id,{ reactive_power:Number(e.target.value) })} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-500">PF</label>
                      <input type="number" step="0.01" value={d.power_factor ?? 1} onChange={e=>updateNodeData(node.id,{ power_factor:Number(e.target.value) })} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded" />
                    </div>
                  </div>
                )}
                {d.type==='meter' && (
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <div className="col-span-2">
                      <label className="block text-[9px] text-gray-500">Meter Class</label>
                      <select value={d.meter_class||'revenue'} onChange={e=>updateNodeData(node.id,{ meter_class:e.target.value })} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded">
                        <option value="revenue">Revenue</option>
                        <option value="secondary">Secondary</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-500">Interval (min)</label>
                      <input type="number" value={d.interval ?? 60} onChange={e=>updateNodeData(node.id,{ interval:Number(e.target.value) })} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded" />
                    </div>
                  </div>
                )}
                <div className="flex gap-1 pt-1">
                  <button onClick={()=>setSelectedNode(null)} className="flex-1 text-[9px] border border-gray-300 rounded py-0.5 hover:bg-gray-50">Deselect</button>
                </div>
              </div>
            ); })()}
          </div>
        )}
        {selectedEdge && (
          <div className="mt-2 border-t pt-2">
            <div className="text-[10px] font-semibold text-gray-600 mb-1">Edge Properties</div>
            <div className="space-y-1">
              <div>
                <label className="block text-[9px] text-gray-500">Name</label>
                <input value={selectedEdge.data?.name || ''} onChange={e=>updateEdgeData('name', e.target.value)} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded" />
              </div>
              <div className="flex gap-1">
                <div className="flex-1">
                  <label className="block text-[9px] text-gray-500">Phases</label>
                  <input value={selectedEdge.data?.phases || ''} onChange={e=>updateEdgeData('phases', e.target.value)} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded" />
                </div>
                <div className="flex-1">
                  <label className="block text-[9px] text-gray-500">Config</label>
                  <input value={selectedEdge.data?.configuration || ''} onChange={e=>updateEdgeData('configuration', e.target.value)} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded" />
                </div>
              </div>
              <div className="flex gap-1">
                <div className="flex-1">
                  <label className="block text-[9px] text-gray-500">From</label>
                  <input value={selectedEdge.data?.from || ''} disabled className="w-full bg-gray-50 border border-gray-200 px-1 py-0.5 text-[9px] rounded" />
                </div>
                <div className="flex-1">
                  <label className="block text-[9px] text-gray-500">To</label>
                  <input value={selectedEdge.data?.to || ''} disabled className="w-full bg-gray-50 border border-gray-200 px-1 py-0.5 text-[9px] rounded" />
                </div>
              </div>
              <div>
                <label className="block text-[9px] text-gray-500">Length</label>
                <input type="number" value={selectedEdge.data?.length ?? 0} onChange={e=>updateEdgeData('length', Number(e.target.value))} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded" />
              </div>
              <div className="flex gap-1 pt-1">
                <button onClick={()=>setSelectedEdge(null)} className="flex-1 text-[9px] border border-gray-300 rounded py-0.5 hover:bg-gray-50">Deselect</button>
                <button onClick={deleteSelectedEdge} className="flex-1 text-[9px] border border-red-300 text-red-600 rounded py-0.5 hover:bg-red-50">Delete</button>
              </div>
            </div>
          </div>
        )}
        <div className="pt-2 text-[10px] text-gray-500 space-y-1">
          <p>Place nodes, connect with handles (unused handles highlighted).</p>
          <p>Click edge to edit properties.</p>
          <p>ESC cancels active tool.</p>
        </div>
        {activeTool && <div className="text-[10px] text-orange-600 font-medium">Active: {activeTool}</div>}
      </div>
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          onPaneClick={handlePaneClick}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          snapToGrid
          snapGrid={[16,16]}
          connectionMode={ConnectionMode.Loose}
          connectOnClick
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap pannable zoomable />
          <Controls />
          <Background gap={16} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
