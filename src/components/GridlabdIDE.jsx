"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Colors from GitHub Dark for visual parity
const COLORS = {
  bg: "#0d1117",
  bgMuted: "#161b22",
  border: "#30363d",
  text: "#c9d1d9",
  textMuted: "#8b949e",
  accent: "#58a6ff",
  success: "#3fb950",
  warning: "#d29922",
  error: "#f85149",
  primary: "#238636",
  primaryHover: "#2ea043",
  secondary: "#21262d",
  secondaryHover: "#30363d",
};

const INITIAL_GLM = `// Enter your GridLab-D model here...

// Example IEEE 13 Node Test Feeder
clock {
    timezone EST+5EDT;
    starttime '2023-01-01 00:00:00';
    stoptime '2023-01-01 23:59:59';
}

module powerflow {
    solver_method NR;
    NR_iteration_limit 50;
}

module tape;

object overhead_line_conductor {
    name conductor_1;
    resistance 0.185900;
    geometric_mean_radius 0.031300;
}

object line_configuration {
    name line_config_1;
    conductor_A conductor_1;
    conductor_B conductor_1;
    conductor_C conductor_1;
    conductor_N conductor_1;
    spacing line_spacing_1;
}

object node {
    name node_1;
    phases ABCN;
    voltage_A 2400+0j;
    voltage_B -1200-2078j;
    voltage_C -1200+2078j;
    nominal_voltage 2400;
}

object meter {
    name meter_1;
    parent node_1;
    phases ABCN;
    nominal_voltage 2400;
}

object recorder {
    parent meter_1;
    property voltage_A,voltage_B,voltage_C;
    interval 3600;
    file meter_output.csv;
}`;

// ---------------- Icons ----------------
function IconDoc({ className = "", fill = "currentColor" }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill={fill} aria-hidden>
      <path d="M14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2h5.5L14 4.5z" />
    </svg>
  );
}

function IconPlay({ className = "" }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z" />
    </svg>
  );
}

function IconNew({ className = "" }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M9 1H3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7L9 1z" />
      <path d="M9 1v6h6" />
    </svg>
  );
}

function IconSave({ className = "" }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M3 1h10a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V3a2 2 0 012-2z" />
      <path d="M11 1v5H5V1" />
    </svg>
  );
}

function IconFormat({ className = "" }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M5.433.451L.942 7.905a1 1 0 000 1.19l4.491 7.454A1 1 0 006.29 17h3.42a1 1 0 00.857-.549l4.491-7.454a1 1 0 000-1.19L10.567.451A1 1 0 009.71 0H6.29a1 1 0 00-.857.451z" />
    </svg>
  );
}

// Explorer icons
function IconChevron({ expanded }) {
  return (
    <svg width="10" height="10" viewBox="0 0 8 8" style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .15s" }} aria-hidden>
      <path d="M2 1l4 3-4 3z" fill={COLORS.textMuted} />
    </svg>
  );
}
function IconFolder({ open = false }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path d={open ? "M2 4v8h12V5H9L7 3H2v1z" : "M2 3v10h12V5H9L7 3H2z"} fill="#f0883e" />
    </svg>
  );
}
function IconCsv() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path d="M14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2h5.5L14 4.5z" fill={COLORS.success} />
      <path d="M4 6h8M4 8h8M4 10h8M4 12h8" stroke={COLORS.bg} strokeWidth="0.5" />
    </svg>
  );
}
function IconJson() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path d="M14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2h5.5L14 4.5z" fill={COLORS.warning} />
      <path d="M6 6h1M9 6h1M5 8h6M6 10h1M9 10h1" stroke={COLORS.bg} strokeWidth="0.8" />
    </svg>
  );
}
function IconTxt() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path d="M14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2h5.5L14 4.5z" fill="#6e7681" />
      <path d="M4 6h8M4 8h6M4 10h8M4 12h5" stroke={COLORS.bg} strokeWidth="0.5" />
    </svg>
  );
}

// ---------------- Utils ----------------
const isTextExt = (name) => /\.(glm|csv|json|txt|md|xml)$/i.test(name);
const fileExt = (name) => (name.match(/\.[^.]+$/)?.[0].toLowerCase() || "");
const baseName = (p) => (p === "/" ? "/" : p.split("/").filter(Boolean).slice(-1)[0] || "");
const parentPathOf = (p) => {
  if (!p || p === "/") return "/";
  const parts = p.split("/").filter(Boolean);
  parts.pop();
  return "/" + parts.join("/");
};

function pickIconByName(name) {
  const ext = fileExt(name);
  if (ext === ".csv") return <IconCsv />;
  if (ext === ".json") return <IconJson />;
  if (ext === ".glm") return <IconDoc fill={COLORS.accent} />;
  if (ext === ".md" || ext === ".txt" || ext === ".xml") return <IconTxt />;
  return <IconDoc fill="#6e7681" />;
}

// Tree helpers working on a { '/': {type:'folder', children:{ ... }} } structure
function getNode(root, path) {
  if (!path || path === "/") return root["/"];
  const parts = path.split("/").filter(Boolean);
  let node = root["/"];
  for (const seg of parts) {
    node = node?.children?.[seg];
    if (!node) return undefined;
  }
  return node;
}
function getChildren(root, path) {
  const n = getNode(root, path);
  return n?.children || {};
}
function cloneDeep(obj) {
  if (typeof structuredClone === "function") return structuredClone(obj);
  return JSON.parse(JSON.stringify(obj));
}
function ensureFolder(root, folderPath) {
  const next = cloneDeep(root);
  const parts = folderPath.split("/").filter(Boolean);
  let node = next["/"];
  for (const seg of parts) {
    node.children[seg] = node.children[seg] || { type: "folder", children: {} };
    node = node.children[seg];
  }
  return next;
}
function addChild(root, folderPath, name, childNode) {
  const next = ensureFolder(root, folderPath);
  const parts = folderPath.split("/").filter(Boolean);
  let node = next["/"];
  for (const seg of parts) node = node.children[seg];
  node.children[name] = childNode;
  return next;
}
function setFileContent(root, filePath, content) {
  const next = cloneDeep(root);
  const folder = parentPathOf(filePath);
  const name = baseName(filePath);
  const parts = folder.split("/").filter(Boolean);
  let node = next["/"];
  for (const seg of parts) node = node.children[seg];
  if (node?.children?.[name] && node.children[name].type === "file") {
    node.children[name].content = content;
    node.children[name].size = content?.length || 0;
  }
  return next;
}
function deleteAt(root, targetPath) {
  if (targetPath === "/") return root;
  const folder = parentPathOf(targetPath);
  const name = baseName(targetPath);
  const next = cloneDeep(root);
  const parts = folder.split("/").filter(Boolean);
  let node = next["/"];
  for (const seg of parts) node = node.children[seg];
  if (node?.children?.[name]) delete node.children[name];
  return next;
}
function renameAt(root, targetPath, newName) {
  if (!newName || /\//.test(newName)) return root;
  const folder = parentPathOf(targetPath);
  const name = baseName(targetPath);
  const next = cloneDeep(root);
  const parts = folder.split("/").filter(Boolean);
  let node = next["/"];
  for (const seg of parts) node = node.children[seg];
  if (node?.children?.[name]) {
    node.children[newName] = node.children[name];
    delete node.children[name];
  }
  return next;
}
function countFilesAndSize(node) {
  if (!node) return { files: 0, folders: 0, bytes: 0 };
  if (node.type === "file") return { files: 1, folders: 0, bytes: node.size || 0 };
  let res = { files: 0, folders: 1, bytes: 0 };
  for (const key of Object.keys(node.children || {})) {
    const r = countFilesAndSize(node.children[key]);
    res.files += r.files;
    res.folders += r.folders;
    res.bytes += r.bytes;
  }
  return res;
}

function StatusBadge({ status }) {
  const common = "px-3 py-1 rounded-full text-xs font-medium border";
  if (status === "running")
    return (
      <span
        className={`${common}`}
        style={{
          background: "#5a3e1b",
          color: COLORS.warning,
          borderColor: "#9e6a03",
          animation: "pulse 2s infinite",
        }}
      >
        Running...
      </span>
    );
  if (status === "error")
    return (
      <span
        className={`${common}`}
        style={{ background: "#4d1f24", color: COLORS.error, borderColor: "#da3633" }}
      >
        Error
      </span>
    );
  return (
    <span
      className={`${common}`}
      style={{ background: "#0d4429", color: COLORS.success, borderColor: COLORS.primary }}
    >
      Ready
    </span>
  );
}

function Header({ onNew, onSave, onRun, status }) {
  return (
    <div
      className="w-full flex items-center justify-between"
      style={{ background: COLORS.bgMuted, borderBottom: `1px solid ${COLORS.border}`, height: 60 }}
    >
      <div className="flex items-center gap-2 px-5">
        <svg viewBox="0 0 24 24" width={24} height={24} style={{ fill: COLORS.accent }} aria-hidden>
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
        <span className="text-base font-semibold" style={{ color: COLORS.accent }}>
          GridLab-D Web IDE
        </span>
      </div>
      <div className="flex items-center gap-2 px-5">
        <StatusBadge status={status} />
        <button
          type="button"
          onClick={onNew}
          className="inline-flex items-center gap-1 text-sm font-medium rounded-md px-3 py-2"
          style={{ background: COLORS.secondary, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
        >
          <IconNew />
          New File
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center gap-1 text-sm font-medium rounded-md px-3 py-2"
          style={{ background: COLORS.secondary, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
        >
          <IconSave />
          Save
        </button>
        <button
          type="button"
          onClick={onRun}
          className="inline-flex items-center gap-1 text-sm font-medium rounded-md px-3 py-2 text-white"
          style={{ background: COLORS.primary }}
        >
          <IconPlay />
          Run Simulation
        </button>
      </div>
    </div>
  );
}

function useConsole() {
  const [lines, setLines] = useState(() => [
    { type: "info", text: "GridLab-D Web IDE initialized", at: Date.now() },
    { type: "success", text: "Ready to run simulations", at: Date.now() },
    { type: "", text: 'Click "Run Simulation" to execute your model', at: Date.now() },
  ]);
  const append = useCallback((text, type = "") => {
    setLines((prev) => [...prev, { type, text, at: Date.now() }]);
  }, []);
  return { lines, append, setLines };
}

function ConsoleView({ lines }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);
  return (
    <div ref={ref} className="h-full overflow-y-auto text-sm" style={{ fontFamily: "Menlo, Monaco, 'Ubuntu Mono', ui-monospace, SFMono-Regular, monospace" }}>
      {lines.map((l, i) => (
        <div key={i} className="mb-1 whitespace-pre-wrap break-words">
          <span className="mr-2 text-[11px]" style={{ color: "#6e7681" }}>
            [{new Date(l.at).toLocaleTimeString("en-US", { hour12: false })}]
          </span>
          <span
            style={{
              color:
                l.type === "info"
                  ? COLORS.accent
                  : l.type === "success"
                  ? COLORS.success
                  : l.type === "warning"
                  ? COLORS.warning
                  : l.type === "error"
                  ? COLORS.error
                  : COLORS.text,
            }}
          >
            {l.text}
          </span>
        </div>
      ))}
    </div>
  );
}

function ErrorPanel({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-md p-4 mb-4" style={{ background: "#4d1f24", border: `1px solid #da3633` }}>
      <div className="flex items-center gap-2 font-semibold" style={{ color: COLORS.error }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <path d="M8.982 1.566a1.13 1.13 0 00-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
          <path d="M7.002 12h2v2h-2v-2zm0-6h2v4h-2V6z" />
        </svg>
        Simulation Error
      </div>
      <div className="text-sm mt-2" style={{ color: "#ffdcd7" }}>{message}</div>
    </div>
  );
}

// ---------------- File Explorer ----------------
function FileExplorer({
  projectName,
  tree,
  expanded,
  onToggle,
  selectedPath,
  onSelect,
  onCreateFile,
  onCreateFolder,
  onUpload,
}) {
  const inputRef = useRef(null);

  const counts = useMemo(() => countFilesAndSize(tree["/"]), [tree]);
  const totalKB = (counts.bytes / 1024).toFixed(1);

  const sortedEntries = (children) => {
    const entries = Object.entries(children || {});
    return entries.sort((a, b) => {
      const [an, av] = a;
      const [bn, bv] = b;
      if (av.type !== bv.type) return av.type === "folder" ? -1 : 1;
      return an.localeCompare(bn);
    });
  };

  const renderNode = (path, name, node, level) => {
    const fullPath = path === "/" ? `/${name}` : `${path}/${name}`;
    if (node.type === "folder") {
      const isOpen = expanded.has(fullPath);
      return (
        <div key={fullPath}>
          <div
            className="flex items-center gap-1 px-3 py-1.5 cursor-pointer hover:bg-[#21262d]"
            style={{ color: COLORS.text }}
            onClick={() => onToggle(fullPath)}
          >
            <span className="mr-1" style={{ marginLeft: level * 14 }}>
              <IconChevron expanded={isOpen} />
            </span>
            <span className="mr-2"><IconFolder open={isOpen} /></span>
            <span className="text-sm" style={{ color: COLORS.text }}>{name}</span>
          </div>
          {isOpen && (
            <div>
              {sortedEntries(node.children).map(([childName, childNode]) =>
                renderNode(fullPath, childName, childNode, level + 1)
              )}
            </div>
          )}
        </div>
      );
    }
    const isSelected = selectedPath === fullPath;
    return (
      <div
        key={fullPath}
        className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer ${isSelected ? "bg-[#1f6feb]" : "hover:bg-[#21262d]"}`}
        style={{ color: isSelected ? "#fff" : COLORS.text }}
        onClick={() => onSelect(fullPath)}
      >
        <span style={{ marginLeft: level * 14, visibility: "hidden" }}>
          <IconChevron expanded={false} />
        </span>
        <span className="mr-2">{pickIconByName(name)}</span>
        <span className="text-sm truncate">{name}</span>
      </div>
    );
  };

  const selectedFolder = useMemo(() => {
    if (!selectedPath || selectedPath === "/") return "/";
    const n = getNode(tree, selectedPath);
    return n?.type === "folder" ? selectedPath : parentPathOf(selectedPath);
  }, [selectedPath, tree]);

  return (
    <div className="shrink-0 flex flex-col" style={{ width: 260, background: COLORS.bgMuted, borderRight: `1px solid ${COLORS.border}`, height: "calc(100vh - 60px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3" style={{ background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="text-sm font-semibold" style={{ color: COLORS.text }}>{projectName}</div>
        <div className="flex items-center gap-1">
          <button title="New File" onClick={() => onCreateFile(selectedFolder)} className="rounded-md p-1" style={{ color: COLORS.textMuted, border: `1px solid ${COLORS.border}`, background: COLORS.secondary }}>
            <IconNew />
          </button>
          <button title="New Folder" onClick={() => onCreateFolder(selectedFolder)} className="rounded-md p-1" style={{ color: COLORS.textMuted, border: `1px solid ${COLORS.border}`, background: COLORS.secondary }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7 2H2v11h12V4H9L7 2z"/><path d="M11 8v3M9.5 9.5h3"/></svg>
          </button>
          <button title="Upload" onClick={() => inputRef.current?.click()} className="rounded-md p-1" style={{ color: COLORS.textMuted, border: `1px solid ${COLORS.border}`, background: COLORS.secondary }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.646 1.146a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L8.5 2.707V12a.5.5 0 01-1 0V2.707L5.354 4.854a.5.5 0 01-.708-.708l3-3z"/><path d="M1 13.5h14a1 1 0 001-1V11a.5.5 0 00-1 0v1.5H1V11a.5.5 0 00-1 0v1.5a1 1 0 001 1z"/></svg>
          </button>
          <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && onUpload(Array.from(e.target.files), selectedFolder)} />
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto" style={{ paddingTop: 4 }}>
        {/* Root */}
        {renderNode("", "/", tree["/"], 0)}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 text-[11px] flex items-center justify-between" style={{ borderTop: `1px solid ${COLORS.border}`, color: COLORS.textMuted, background: COLORS.bg }}>
        <span>{counts.files} files, {Math.max(counts.folders - 1, 0)} folders</span>
        <span>{totalKB} KB</span>
      </div>
    </div>
  );
}

export default function GridlabdIDE() {
  const [status, setStatus] = useState("ready");
  const [activeTab, setActiveTab] = useState("console");
  const [editorValue, setEditorValue] = useState(INITIAL_GLM);
  const [outputFiles, setOutputFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [editorPct, setEditorPct] = useState(50);
  const [hasVizData, setHasVizData] = useState(false);

  // Project state (in-memory)
  const [projectName] = useState("IEEE 13 Node");
  const [fileTree, setFileTree] = useState(() => ({
    "/": {
      type: "folder",
      children: {
        "main.glm": { type: "file", size: INITIAL_GLM.length, content: INITIAL_GLM },
        config: {
          type: "folder",
          children: {
            "line_config.glm": { type: "file", size: 0, content: "// line config..." },
            "transformer.glm": { type: "file", size: 0, content: "// transformer config..." },
          },
        },
        data: {
          type: "folder",
          children: {
            "load_profile.csv": { type: "file", size: 24, content: "timestamp,load\n00:00,1.2" },
            "weather.csv": { type: "file", size: 24, content: "timestamp,temp\n00:00,28" },
            "solar_profile.json": { type: "file", size: 2, content: "{}" },
          },
        },
        output: { type: "folder", children: {} },
        "README.md": { type: "file", size: 14, content: "# Project files" },
      },
    },
  }));
  const [expanded, setExpanded] = useState(() => new Set(["/", "/config", "/data"]));
  const [activeFilePath, setActiveFilePath] = useState("/main.glm");

  const { lines, append, setLines } = useConsole();

  const containerRef = useRef(null);
  const isResizingRef = useRef(false);
  const canvasRef = useRef(null);

  // Derived: is editor dirty vs tree
  const isDirty = useMemo(() => {
    const n = getNode(fileTree, activeFilePath);
    if (!n || n.type !== "file") return false;
    return (n.content || "") !== editorValue;
  }, [fileTree, activeFilePath, editorValue]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        runSimulation();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Explorer actions
  const toggleFolder = useCallback((path) => {
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(path)) n.delete(path);
      else n.add(path);
      return n;
    });
  }, []);

  const openPath = useCallback((path) => {
    const node = getNode(fileTree, path);
    if (!node) return;
    if (node.type === "file") {
      setActiveFilePath(path);
      setEditorValue(node.content || "");
    } else {
      toggleFolder(path);
    }
  }, [fileTree, toggleFolder]);

  const createNewFile = useCallback((folderPath = "/") => {
    const base = "untitled";
    let name = `${base}.glm`;
    const children = getChildren(fileTree, folderPath);
    let idx = 1;
    while (children[name]) {
      name = `${base}-${idx++}.glm`;
    }
    const newPath = folderPath === "/" ? `/${name}` : `${folderPath}/${name}`;
    setFileTree((prev) => addChild(prev, folderPath, name, { type: "file", size: 0, content: "" }));
    setExpanded((s) => new Set([...s, folderPath]));
    setActiveFilePath(newPath);
    setEditorValue("");
    append(`New file created: ${newPath}`, "info");
  }, [fileTree, append]);

  const createNewFolder = useCallback((folderPath = "/") => {
    const base = "folder";
    let name = base;
    const children = getChildren(fileTree, folderPath);
    let idx = 1;
    while (children[name]) name = `${base}-${idx++}`;
    setFileTree((prev) => addChild(prev, folderPath, name, { type: "folder", children: {} }));
    setExpanded((s) => new Set([...s, folderPath, folderPath === "/" ? `/${name}` : `${folderPath}/${name}`]));
    append(`New folder created: ${folderPath === "/" ? "" : folderPath}/${name}`.replace("//", "/"), "info");
  }, [fileTree, append]);

  const uploadFiles = useCallback(async (files, targetFolder = "/") => {
    if (!files || files.length === 0) return;
    let nextTree = fileTree;
    for (const f of files) {
      let content = "";
      try {
        if (isTextExt(f.name)) content = await f.text();
      } catch {}
      const node = { type: "file", size: content ? content.length : f.size || 0, content };
      nextTree = addChild(nextTree, targetFolder, f.name, node);
    }
    setFileTree(nextTree);
    setExpanded((s) => new Set([...s, targetFolder]));
    append(`${files.length} file(s) uploaded to ${targetFolder}`, "success");
  }, [fileTree, append]);

  const renamePath = useCallback((path) => {
    const newName = window.prompt("Enter new name", baseName(path));
    if (!newName) return;
    setFileTree((prev) => renameAt(prev, path, newName));
    const parent = parentPathOf(path);
    const np = parent === "/" ? `/${newName}` : `${parent}/${newName}`;
    if (activeFilePath === path) setActiveFilePath(np);
  }, [activeFilePath]);

  const deletePath = useCallback((path) => {
    if (!window.confirm(`Delete ${path}?`)) return;
    setFileTree((prev) => deleteAt(prev, path));
    if (activeFilePath === path) {
      setActiveFilePath("/main.glm");
      const node = getNode(fileTree, "/main.glm");
      setEditorValue(node?.content || "");
    }
  }, [activeFilePath, fileTree]);

  const handleNew = useCallback(() => {
    // Create a new file in the selected folder or root
    const node = getNode(fileTree, activeFilePath);
    const targetFolder = node?.type === "folder" ? activeFilePath : parentPathOf(activeFilePath);
    createNewFile(targetFolder || "/");
  }, [fileTree, activeFilePath, createNewFile]);

  const handleSave = useCallback(() => {
    try {
      // Update in-memory project
      setFileTree((prev) => setFileContent(prev, activeFilePath, editorValue));

      // Download the file
      const blob = new Blob([editorValue], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = baseName(activeFilePath) || "model.glm";
      a.click();
      URL.revokeObjectURL(url);
      append("File saved successfully", "success");
    } catch (e) {
      append("Failed to save file", "error");
    }
  }, [editorValue, append, activeFilePath]);

  const formatCode = useCallback(() => {
    // Placeholder formatting – could integrate prettier-plugin if needed
    append("Code formatting applied", "info");
  }, [append]);

  const runSimulation = useCallback(async () => {
    if (status === "running") {
      append("Simulation already running...", "warning");
      return;
    }
    if (!editorValue.trim()) {
      append("Error: No model code to simulate", "error");
      setActiveTab("console");
      return;
    }

    setStatus("running");
    setErrorMessage("");
    setActiveTab("console");

    append("Starting GridLab-D simulation...", "info");
    try {
      append("Bundling project files...", "info");
      await delay(500);
      append("Parsing GLM model...", "info");
      await delay(500);
      append("Initializing power flow solver...", "info");
      await delay(800);
      append("Running simulation timesteps...", "info");
      await delay(1500);

      append("Simulation completed successfully!", "success");
      append("Total runtime: 2.8 seconds", "info");
      append("Convergence achieved in 5 iterations", "info");

      // Mock files
      setOutputFiles([
        { name: "meter_output.csv", size: "2.4 KB" },
        { name: "voltage_profile.csv", size: "1.8 KB" },
        { name: "power_losses.csv", size: "956 B" },
      ]);

      setHasVizData(true);
      setStatus("ready");
    } catch (e) {
      const msg = e?.message || "Unknown error";
      append(`Error: ${msg}`, "error");
      setErrorMessage(msg);
      setStatus("error");
    }
  }, [status, editorValue, append]);

  // Resizing logic
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerWidth = rect.width;
      const relX = e.clientX - rect.left;
      const pct = Math.max(20, Math.min(80, (relX / containerWidth) * 100));
      setEditorPct(pct);
    };
    const onMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = "default";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Visualization drawing when tab becomes active or data changes
  const drawViz = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#6e7681";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();

    const series = [
      { color: COLORS.accent, label: "Phase A" },
      { color: COLORS.success, label: "Phase B" },
      { color: COLORS.warning, label: "Phase C" },
    ];

    series.forEach((s, index) => {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < 24; x++) {
        const xPos = 40 + x * ((width - 60) / 24);
        const yPos = height - 40 - (Math.sin(x / 3 + index) * 20 + 100 + Math.random() * 10);
        if (x === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.stroke();

      // Legend
      ctx.fillStyle = s.color;
      ctx.fillRect(width - 150, 30 + index * 25, 15, 15);
      ctx.fillStyle = COLORS.text;
      ctx.font = "12px sans-serif";
      ctx.fillText(s.label, width - 130, 42 + index * 25);
    });

    // Labels
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = "11px sans-serif";
    ctx.fillText("Voltage (V)", 10, 15);
    ctx.fillText("Time (hours)", width / 2 - 30, height - 10);
  }, []);

  useEffect(() => {
    if (activeTab === "visualization" && hasVizData) drawViz();
  }, [activeTab, hasVizData, drawViz]);

  const EditorHeader = (
    <div className="flex items-center justify-between px-4 py-2" style={{ background: COLORS.bgMuted, borderBottom: `1px solid ${COLORS.border}` }}>
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2 text-xs px-3 py-1 rounded-t-md"
          style={{ background: COLORS.bg, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderBottom: "none" }}
        >
          <IconDoc /> {baseName(activeFilePath) || "model.glm"}
          {isDirty && <span className="ml-1 text-[10px]" style={{ color: COLORS.warning }}>*</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={formatCode}
          aria-label="Format code"
          className="inline-flex items-center justify-center rounded-md"
          style={{ background: COLORS.secondary, color: COLORS.text, border: `1px solid ${COLORS.border}`, padding: "6px 10px" }}
        >
          <IconFormat />
        </button>
        {/* Quick actions for the selected item */}
        <button
          type="button"
          onClick={() => renamePath(activeFilePath)}
          className="inline-flex items-center justify-center rounded-md"
          style={{ background: COLORS.secondary, color: COLORS.textMuted, border: `1px solid ${COLORS.border}`, padding: "6px 10px" }}
          title="Rename"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M12.146.854a.5.5 0 01.708 0l2.292 2.292a.5.5 0 010 .708l-9 9a.5.5 0 01-.353.146H3.5a.5.5 0 01-.5-.5v-2.293a.5.5 0 01.146-.353l9-9z"/></svg>
        </button>
        <button
          type="button"
          onClick={() => deletePath(activeFilePath)}
          className="inline-flex items-center justify-center rounded-md"
          style={{ background: COLORS.secondary, color: COLORS.error, border: `1px solid ${COLORS.border}`, padding: "6px 10px" }}
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 1a.5.5 0 00-.5.5V2H2a.5.5 0 000 1h12a.5.5 0 000-1h-4v-.5a.5.5 0 00-.5-.5h-3zM3 4h10l-.9 10.1a1 1 0 01-1 .9H4.9a1 1 0 01-1-.9L3 4z"/></svg>
        </button>
      </div>
    </div>
  );

  const Tabs = (
    <div className="flex items-center gap-3 px-4 py-2" style={{ background: COLORS.bgMuted, borderBottom: `1px solid ${COLORS.border}` }}>
      {[
        { id: "console", label: "Console" },
        { id: "output", label: "Output Files" },
        { id: "visualization", label: "Visualization" },
        { id: "errors", label: "Errors" },
      ].map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          className="text-sm font-medium px-3 py-2 border-b-2"
          style={{
            background: "transparent",
            color: activeTab === t.id ? COLORS.accent : COLORS.textMuted,
            borderColor: activeTab === t.id ? COLORS.accent : "transparent",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full overflow-hidden" style={{ background: COLORS.bg, color: COLORS.text }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }`}</style>
      <Header onNew={handleNew} onSave={handleSave} onRun={runSimulation} status={status} />

      <div ref={containerRef} className="flex" style={{ height: "calc(100vh - 60px)" }}>
        {/* New File Explorer Panel */}
        <FileExplorer
          projectName={projectName}
          tree={fileTree}
          expanded={expanded}
          onToggle={toggleFolder}
          selectedPath={activeFilePath}
          onSelect={openPath}
          onCreateFile={createNewFile}
          onCreateFolder={createNewFolder}
          onUpload={uploadFiles}
        />

        {/* Editor Panel */}
        <div
          className="flex flex-col"
          style={{ flexBasis: `${editorPct}%`, borderRight: `1px solid ${COLORS.border}`, background: COLORS.bg }}
        >
          {EditorHeader}
          <div className="relative flex-1">
            <textarea
              value={editorValue}
              onChange={(e) => setEditorValue(e.target.value)}
              spellCheck={false}
              className="w-full h-full resize-none outline-none p-5 text-sm"
              style={{
                background: COLORS.bg,
                color: COLORS.text,
                fontFamily: "Menlo, Monaco, 'Ubuntu Mono', ui-monospace, SFMono-Regular, monospace",
                lineHeight: 1.6,
              }}
              placeholder={INITIAL_GLM}
              aria-label="GLM editor"
            />
          </div>
        </div>

        {/* Divider */}
        <div
          role="separator"
          aria-orientation="vertical"
          onMouseDown={() => {
            isResizingRef.current = true;
            document.body.style.cursor = "col-resize";
          }}
          className="shrink-0"
          style={{ width: 4, background: COLORS.border, position: "relative", cursor: "col-resize" }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 2,
              height: 30,
              background: "#6e7681",
              borderRadius: 2,
            }}
          />
        </div>

        {/* Results Panel */}
        <div className="flex flex-col" style={{ flexBasis: `${100 - editorPct}%`, background: COLORS.bg }}>
          {Tabs}
          <div className="flex-1 p-5 overflow-y-auto" style={{ fontFamily: "Menlo, Monaco, monospace" }}>
            {activeTab === "console" && <ConsoleView lines={lines} />}

            {activeTab === "output" && (
              <div>
                {outputFiles.length === 0 ? (
                  <div className="text-center py-10" style={{ color: "#6e7681" }}>
                    No output files yet. Run a simulation to see results.
                  </div>
                ) : (
                  <div>
                    <h3 className="text-base font-semibold mb-4" style={{ color: COLORS.text }}>
                      Generated Output Files:
                    </h3>
                    <div className="space-y-2 mb-5">
                      {outputFiles.map((f) => (
                        <div key={f.name} className="flex items-center gap-2 rounded-md px-3 py-2" style={{ background: COLORS.bgMuted }}>
                          <IconDoc className="shrink-0" fill={COLORS.success} />
                          <span className="text-sm" style={{ color: COLORS.text }}>{f.name}</span>
                          <span className="text-xs ml-auto" style={{ color: "#6e7681" }}>{f.size}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-md p-4" style={{ background: COLORS.bgMuted }}>
                      <h4 className="text-sm mb-2" style={{ color: COLORS.textMuted }}>
                        Sample Output (meter_output.csv):
                      </h4>
                      <pre className="text-xs overflow-x-auto" style={{ color: "#6e7681" }}>
{`timestamp,voltage_A,voltage_B,voltage_C
2023-01-01 00:00:00,2400.00+0.00j,-1200.00-2078.46j,-1200.00+2078.46j
2023-01-01 01:00:00,2398.45+2.31j,-1198.23-2077.89j,-1200.22+2078.01j
2023-01-01 02:00:00,2397.89+3.45j,-1197.56-2077.12j,-1200.33+2077.56j`}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "visualization" && (
              <div className="space-y-5">
                {!hasVizData ? (
                  <div className="text-center py-10" style={{ color: "#6e7681" }}>
                    No data to visualize. Run a simulation first.
                  </div>
                ) : (
                  <>
                    <div className="rounded-md" style={{ background: COLORS.bgMuted }}>
                      <div className="px-5 pt-5 text-sm font-semibold" style={{ color: COLORS.text }}>
                        Voltage Profile Over Time
                      </div>
                      <div className="p-5">
                        <canvas ref={canvasRef} width={800} height={320} />
                      </div>
                    </div>
                    <div className="rounded-md" style={{ background: COLORS.bgMuted }}>
                      <div className="px-5 pt-5 text-sm font-semibold" style={{ color: COLORS.text }}>
                        Power Flow Summary
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
                        <div className="rounded-md text-center p-5" style={{ background: COLORS.bg }}>
                          <div className="text-xs mb-2" style={{ color: "#6e7681" }}>Total Load</div>
                          <div className="text-2xl font-semibold" style={{ color: COLORS.accent }}>1.2 MW</div>
                        </div>
                        <div className="rounded-md text-center p-5" style={{ background: COLORS.bg }}>
                          <div className="text-xs mb-2" style={{ color: "#6e7681" }}>System Losses</div>
                          <div className="text-2xl font-semibold" style={{ color: COLORS.warning }}>45.3 kW</div>
                        </div>
                        <div className="rounded-md text-center p-5" style={{ background: COLORS.bg }}>
                          <div className="text-xs mb-2" style={{ color: "#6e7681" }}>Voltage Deviation</div>
                          <div className="text-2xl font-semibold" style={{ color: COLORS.success }}>0.8%</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "errors" && (
              <div>
                {errorMessage ? (
                  <ErrorPanel message={errorMessage} />
                ) : (
                  <div className="text-center py-10" style={{ color: COLORS.success }}>
                    No errors detected
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
