"use client";

import { useCallback, useState, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background, addEdge, useNodesState, useEdgesState, Handle, Position, ConnectionMode, useReactFlow } from 'reactflow';
import Image from 'next/image';
import 'reactflow/dist/style.css';
import { Home, Factory, Sun, Wind, Battery, Car, Gauge, RadioTower, Server, Zap, Plug } from 'lucide-react';

// Node palette definition (icons replaced with existing ones)
const PALETTE = [
  { type: 'substation', label: 'Substation', icon: Server },
  { type: 'feederBus', label: 'Feeder Bus', icon: RadioTower },
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

// Feeder edge component - represents main power distribution lines
function FeederEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data = {} }) {
  // Create step path for feeders (right angles like power system diagrams)
  let edgePath;
  if (data.isFeeder) {
    const midX = sourceX + (targetX - sourceX) * 0.5;
    edgePath = `M${sourceX},${sourceY} L${midX},${sourceY} L${midX},${targetY} L${targetX},${targetY}`;
  } else {
    edgePath = `M${sourceX},${sourceY} L${targetX},${targetY}`;
  }
  
  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          stroke: data.isFeeder ? '#dc2626' : style.stroke || '#475569',
          strokeWidth: data.isFeeder ? 6 : style.strokeWidth || 2,
          strokeLinecap: 'round'
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      {data.isFeeder && (
        <text>
          <textPath href={`#${id}`} startOffset="25%" textAnchor="middle" className="fill-red-600 text-xs font-semibold">
            {data.name || 'Feeder'}
          </textPath>
        </text>
      )}
    </>
  );
}

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
  storage: 'bg-zinc-700',
  feederBus: 'bg-red-600'
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

// Feeder Bus Node - represents points along a feeder line
function FeederBusNode({ id, data }) {
  const rf = useReactFlow();
  const [value, setValue] = useState(data.label);
  
  useEffect(() => { setValue(data.label); }, [data.label]);
  
  const commit = (val) => {
    rf.setNodes(ns => ns.map(n => n.id === id ? { ...n, data: { ...n.data, label: val } } : n));
  };

  const edges = rf.getEdges();
  const usedHandles = new Set();
  edges.forEach(e => { 
    if (e.source === id && e.sourceHandle) usedHandles.add(e.sourceHandle); 
    if (e.target === id && e.targetHandle) usedHandles.add(e.targetHandle); 
  });

  const handleClass = (hid) => usedHandles.has(hid)
    ? 'w-2 h-2 !bg-gray-300 border border-gray-300 rounded-full opacity-50'
    : 'w-2 h-2 !bg-white border border-red-500 rounded-full cursor-crosshair shadow';

  return (
    <div className="relative flex flex-col items-center text-[10px] select-none" title={value}>
      {/* Feeder bus handles - more prominent for main feeder connections */}
      <Handle id="t-target" type="target" position={Position.Top} className={`-mt-2 ${handleClass('t-target')}`} />
      <Handle id="t-source" type="source" position={Position.Top} className={`-mt-2 ml-3 ${handleClass('t-source')}`} />
      <Handle id="l-target" type="target" position={Position.Left} className={`-ml-2 ${handleClass('l-target')}`} />
      <Handle id="l-source" type="source" position={Position.Left} className={`-ml-2 mt-3 ${handleClass('l-source')}`} />
      
      {/* Feeder bus representation - red circle */}
      <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-md flex items-center justify-center">
        <div className="w-1 h-1 bg-white rounded-full"></div>
      </div>
      
      <Handle id="r-target" type="target" position={Position.Right} className={`-mr-2 ${handleClass('r-target')}`} />
      <Handle id="r-source" type="source" position={Position.Right} className={`-mr-2 mt-3 ${handleClass('r-source')}`} />
      <Handle id="b-target" type="target" position={Position.Bottom} className={`-mb-2 ${handleClass('b-target')}`} />
      <Handle id="b-source" type="source" position={Position.Bottom} className={`-mb-2 ml-3 ${handleClass('b-source')}`} />
      
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={e => commit(e.target.value.trim() || value)}
        onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }}}
        className="mt-1 w-12 bg-transparent text-[8px] font-medium text-center text-red-700 border border-transparent focus:border-red-500 focus:outline-none rounded-sm px-0.5"
        spellCheck={false}
      />
    </div>
  );
}

const nodeTypes = { 
  default: DefaultNode,
  feederBus: FeederBusNode 
};
const edgeTypes = { 
  default: FeederEdge, 
  feeder: FeederEdge,
  step: FeederEdge
};

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
  const [feederMode, setFeederMode] = useState(false);
  const [feederExtensionMode, setFeederExtensionMode] = useState(false);
  const [lastFeederNode, setLastFeederNode] = useState(null);

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
        type: feederMode ? 'feeder' : 'step',
        data: {
          name: feederMode ? `feeder_${edgeCounter}` : `line_${edgeCounter}`,
          phases: 'ABCN',
          configuration: '',
          from: sourceNode?.data?.label || params.source,
          to: targetNode?.data?.label || params.target,
          length: 100,
          isFeeder: feederMode,
          voltage_level: feederMode ? 'Medium' : 'Low',
          conductor_type: feederMode ? 'ACSR' : 'Copper'
        },
        style: { 
          stroke: feederMode ? '#dc2626' : '#475569', 
          strokeWidth: feederMode ? 6 : 2,
          strokeLinecap: 'round'
        }
      };
      setEdgeCounter(c=>c+1);
      return addEdge(newEdge, eds);
    });
  }, [nodes, edgeCounter, feederMode]);

  const handlePaneClick = useCallback((e) => {
    if (feederExtensionMode && lastFeederNode) {
      // Extend feeder: create a new feeder bus node and connect it
      const bounds = e.currentTarget.getBoundingClientRect();
      const position = { x: e.clientX - bounds.left - 80, y: e.clientY - bounds.top };
      const newBusId = getId();
      
      // Create new feeder bus node
      setNodes(nds => nds.concat({ 
        id: newBusId, 
        type: 'feederBus', 
        position, 
        data: { 
          label: `Bus${Math.floor(Math.random() * 900) + 100}`, 
          type: 'feederBus',
          bustype: 'PQ',
          phases: 'ABCN',
          nominal_voltage: 7200
        } 
      }));
      
      // Create feeder connection to the last feeder node
      setEdges(eds => addEdge({
        id: `e_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        source: lastFeederNode,
        target: newBusId,
        sourceHandle: 'r-source',
        targetHandle: 'l-target',
        type: 'feeder',
        data: {
          name: `feeder_${edgeCounter}`,
          phases: 'ABCN',
          configuration: '',
          from: nodes.find(n => n.id === lastFeederNode)?.data?.label || lastFeederNode,
          to: `Bus${Math.floor(Math.random() * 900) + 100}`,
          length: Math.sqrt(Math.pow(position.x - (nodes.find(n => n.id === lastFeederNode)?.position?.x || 0), 2) + 
                          Math.pow(position.y - (nodes.find(n => n.id === lastFeederNode)?.position?.y || 0), 2)) || 100,
          isFeeder: true,
          voltage_level: 'Medium',
          conductor_type: 'ACSR'
        },
        style: { stroke: '#dc2626', strokeWidth: 6, strokeLinecap: 'round' }
      }, eds));
      
      setEdgeCounter(c => c + 1);
      setLastFeederNode(newBusId);
      
    } else if (activeTool) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const position = { x: e.clientX - bounds.left - 80, y: e.clientY - bounds.top };
      const paletteItem = PALETTE.find(p => p.type === activeTool);
      const nodeType = activeTool === 'feederBus' ? 'feederBus' : 'default';
      setNodes(nds => nds.concat({ 
        id: getId(), 
        type: nodeType, 
        position, 
        data: { 
          label: paletteItem.label, 
          type: paletteItem.type, 
          bustype: 'PQ', 
          phases: 'ABCN', 
          nominal_voltage: 7200, 
          ...(paletteItem.type==='load'?{ real_power:0, reactive_power:0, power_factor:1.0, load_class:'Residential' }:{}), 
          ...(paletteItem.type==='meter'?{ meter_class:'revenue', interval:60 }:{}) 
        } 
      }));
      setActiveTool(null);
    } else {
      setSelectedNode(null);
      setSelectedEdge(null);
      setLastFeederNode(null);
      setFeederExtensionMode(false);
      onSelectNode?.(null);
    }
  }, [activeTool, feederExtensionMode, lastFeederNode, nodes, edgeCounter, onSelectNode, setNodes, setEdges]);

  // Allow ESC to unselect active tool or feeder mode
  useEffect(() => {
    const escHandler = (e) => { 
      if (e.key === 'Escape') {
        setActiveTool(null);
        setFeederMode(false);
        setFeederExtensionMode(false);
        setLastFeederNode(null);
      }
    };
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, []);

  const onNodeClick = useCallback((_, node) => { 
    if (feederExtensionMode) {
      // Set this node as the starting point for feeder extension
      setLastFeederNode(node.id);
    } else {
      setSelectedNode(node.id); 
      setSelectedEdge(null); 
      onSelectNode?.(node);
    }
  }, [onSelectNode, feederExtensionMode]);
  const onEdgeClick = useCallback((_, edge) => { setSelectedEdge(edge); }, []);

  const updateEdgeData = (key, value) => {
    setEdges(es => es.map(e => e.id === selectedEdge.id ? { 
      ...e, 
      data: { ...e.data, [key]: value },
      // Update visual style if changing feeder status
      style: key === 'isFeeder' ? {
        ...e.style,
        stroke: value ? '#dc2626' : '#475569',
        strokeWidth: value ? 6 : 2
      } : e.style,
      type: key === 'isFeeder' ? (value ? 'feeder' : 'step') : e.type
    } : e));
    setSelectedEdge(se => se ? { 
      ...se, 
      data: { ...se.data, [key]: value },
      style: key === 'isFeeder' ? {
        ...se.style,
        stroke: value ? '#dc2626' : '#475569',
        strokeWidth: value ? 6 : 2
      } : se.style
    } : se);
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

  const defaultEdgeOptions = { type: 'step', style: { stroke: '#475569', strokeWidth: 2, strokeLinecap: 'round' } };

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
        <div className="border-t pt-2 mt-2">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Feeder Tools</div>
          
          <button 
            onClick={() => {
              setFeederExtensionMode(!feederExtensionMode);
              if (!feederExtensionMode) {
                setFeederMode(false);
                setActiveTool(null);
              }
            }}
            className={`w-full text-[10px] py-2 border rounded transition mb-2 ${feederExtensionMode ? 'border-blue-600 bg-blue-100 text-blue-700' : 'border-gray-300 hover:bg-gray-50'}`}
            title={feederExtensionMode ? 'Click node then canvas to extend feeder' : 'Enable feeder extension mode'}
          >
            {feederExtensionMode ? '🔵 Extend Feeder Mode' : '⚡ Extend Feeder'}
          </button>
          
          <button 
            onClick={() => {
              setFeederMode(!feederMode);
              if (!feederMode) {
                setFeederExtensionMode(false);
                setLastFeederNode(null);
              }
            }}
            className={`w-full text-[10px] py-2 border rounded transition ${feederMode ? 'border-red-600 bg-red-100 text-red-700' : 'border-gray-300 hover:bg-gray-50'}`}
            title={feederMode ? 'Click to disable feeder mode' : 'Click to enable feeder mode - creates thick red feeder lines'}
          >
            {feederMode ? '🔴 Feeder Mode ON' : '⚪ Normal Lines'}
          </button>
          
          <p className="text-[9px] text-gray-500 mt-1">
            {feederExtensionMode 
              ? 'Click a node, then click canvas to extend feeder'
              : feederMode 
                ? 'Connections will create thick red feeder lines' 
                : 'Connections will create normal distribution lines'
            }
          </p>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={() => { setNodes([{ id: getId(), type: 'default', position: { x:0, y:0 }, data: { label: 'Substation', type: 'substation', bustype: 'SWING', phases: 'ABCN', nominal_voltage: 7200 } }]); setEdges([]); setActiveTool(null); setSelectedEdge(null); setFeederMode(false); setFeederExtensionMode(false); setLastFeederNode(null); }} className="flex-1 text-[10px] py-1 border border-gray-300 hover:bg-gray-50 rounded">Reset</button>
          <button onClick={() => { setNodes([]); setEdges([]); setActiveTool(null); setSelectedEdge(null); setFeederMode(false); setFeederExtensionMode(false); setLastFeederNode(null); }} className="flex-1 text-[10px] py-1 border border-gray-300 hover:bg-gray-50 rounded">Clear</button>
        </div>
        <div className="flex gap-2">
          <button onClick={exportLayout} className="flex-1 text-[10px] py-1 border border-gray-300 hover:bg-gray-50 rounded">Save JSON</button>
        </div>
        
        <div className="border-t pt-2 mt-2">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Start</div>
          <button 
            onClick={() => {
              // Find substation node
              const substationNode = nodes.find(n => n.data.type === 'substation');
              if (substationNode) {
                setLastFeederNode(substationNode.id);
                setFeederExtensionMode(true);
                setFeederMode(false);
                setActiveTool(null);
              }
            }}
            className="w-full text-[10px] py-1 border border-green-300 text-green-700 hover:bg-green-50 rounded"
            disabled={!nodes.find(n => n.data.type === 'substation')}
          >
            ⚡ Start Feeder from Substation
          </button>
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
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isFeeder" 
                  checked={selectedEdge.data?.isFeeder || false} 
                  onChange={e=>updateEdgeData('isFeeder', e.target.checked)}
                  className="w-3 h-3"
                />
                <label htmlFor="isFeeder" className="text-[9px] text-gray-700 font-medium">Main Feeder Line</label>
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
                  <label className="block text-[9px] text-gray-500">Voltage Level</label>
                  <select value={selectedEdge.data?.voltage_level || 'Low'} onChange={e=>updateEdgeData('voltage_level', e.target.value)} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded">
                    <option value="Low">Low (LV)</option>
                    <option value="Medium">Medium (MV)</option>
                    <option value="High">High (HV)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[9px] text-gray-500">Conductor</label>
                  <select value={selectedEdge.data?.conductor_type || 'Copper'} onChange={e=>updateEdgeData('conductor_type', e.target.value)} className="w-full border border-gray-300 focus:border-orange-500 outline-none px-1 py-0.5 text-[9px] rounded">
                    <option value="Copper">Copper</option>
                    <option value="ACSR">ACSR</option>
                    <option value="Aluminum">Aluminum</option>
                  </select>
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
                <label className="block text-[9px] text-gray-500">Length (feet)</label>
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
          <p><strong>Extend Feeder:</strong> Click node → click canvas to extend.</p>
          <p><strong>Feeder Mode:</strong> Creates thick red main distribution lines.</p>
          <p>Click edge to edit properties or convert to feeder.</p>
          <p>ESC cancels all active modes.</p>
        </div>
        {activeTool && <div className="text-[10px] text-orange-600 font-medium">Active: {activeTool}</div>}
        {feederMode && <div className="text-[10px] text-red-600 font-medium">🔴 Feeder Mode Active</div>}
        {feederExtensionMode && <div className="text-[10px] text-blue-600 font-medium">🔵 Feeder Extension Mode</div>}
        {lastFeederNode && <div className="text-[9px] text-blue-500">Selected: {nodes.find(n => n.id === lastFeederNode)?.data?.label || 'Node'}</div>}
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
          edgeTypes={edgeTypes}
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
