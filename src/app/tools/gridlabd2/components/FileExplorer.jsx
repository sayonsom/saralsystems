"use client";
import { useMemo, useState } from 'react';
import { FileText, Folder, Download, X, Play, Zap, FilePlus, FolderPlus, ArrowLeft } from 'lucide-react';

export default function FileExplorer({
  loadTemplate,
  handleFileUpload,
  fileInputRef,
  dropZoneRef,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  projectFiles = [],
  removeFileFromProject = () => {},
  downloadProjectZip = () => {},
  selectedFile,
  setSelectedFile = () => {},
  createNewFile = () => {},
  createNewFolder = () => {},
  loadFileContent = () => {},
  // Project & simulation props (simplified view)
  projects = [],
  selectedProjectId,
  currentProject,
  onSelectProject = () => {},
  onCreateProject = () => {},
  onRenameProject = () => {},
  onDeleteProject = () => {},
  onSaveCurrent = () => {},
  onSaveAll = () => {},
  simulations = [],
  onCancelSimulation = () => {},
  onDownloadOutputs = () => {},
  // New: back navigation and run triggers
  onBackToProjects = () => {},
  onRunPersisted = () => {},
  onRunArchive = () => {},
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('file'); // 'file' or 'folder'
  const [newItemName, setNewItemName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  const handleCreateNew = (type) => { setCreateType(type); setNewItemName(''); setShowCreateModal(true); };
  const handleConfirmCreate = () => { if (!newItemName.trim()) return; if (createType === 'file') { createNewFile && createNewFile(newItemName.trim()); } else { createNewFolder && createNewFolder(newItemName.trim()); } setShowCreateModal(false); setNewItemName(''); };
  const handleDeleteClick = (e, fileName) => { e.stopPropagation(); setDeleteConfirm(fileName); };
  const confirmDelete = () => { if (deleteConfirm) { removeFileFromProject && removeFileFromProject(deleteConfirm); setDeleteConfirm(null); } };
  const toggleFolder = (folderPath) => { const next = new Set(expandedFolders); next.has(folderPath) ? next.delete(folderPath) : next.add(folderPath); setExpandedFolders(next); };

  const organizedFiles = useMemo(() => projectFiles.reduce((acc, file) => {
    const name = file.filename || file.name; const type = file.file_type || file.type;
    const pathParts = name.split('/'); const entry = { ...file, name, type };
    if (pathParts.length === 1) { (acc.root ||= []).push(entry); }
    else { const folderPath = pathParts.slice(0, -1).join('/'); (acc.folders ||= {}); (acc.folders[folderPath] ||= []).push(entry); }
    return acc;
  }, {}), [projectFiles]);

  const getFileKey = (file, idx = 0) => String(file.id ?? `${file.name}::${idx}`);

  const getFileIcon = (fileType) => {
    switch (fileType) { case 'glm': return <FileText size={12} className="text-blue-600" />; case 'csv': return <FileText size={12} className="text-green-600" />; case 'json': return <FileText size={12} className="text-orange-600" />; default: return <FileText size={12} className="text-gray-600" />; }
  };

  const renderFileItem = (file, depth = 0, idx = 0) => (
    <div
      key={getFileKey(file, idx)}
      className={`flex items-center justify-between text-xs p-1 cursor-pointer group ${ selectedFile === file.name ? 'bg-gray-200' : 'hover:bg-gray-100' }`}
      style={{ marginLeft: `${depth * 12}px` }}
      onClick={() => { setSelectedFile && setSelectedFile(file.name); loadFileContent && loadFileContent(file); }}
    >
      <span className="flex items-center gap-1 truncate">
        {getFileIcon(file.type)}
        <span className="truncate">{file.name.split('/').pop()}</span>
        {file.dirty && <span className="ml-1 text-[10px] text-[#ea580b]">• unsaved</span>}
      </span>
      <button onClick={(e) => handleDeleteClick(e, file.name)} className="text-red-600 hover:text-red-700 ml-1 opacity-0 group-hover:opacity-100" title="Delete file">
        <X size={12} />
      </button>
    </div>
  );

  const renderFolderItem = (folderPath, files) => {
    const isExpanded = expandedFolders.has(folderPath);
    const folderName = folderPath.split('/').pop();
    return (
      <div key={folderPath}>
        <div className="flex items-center text-xs p-1 cursor-pointer hover:bg-gray-100" onClick={() => toggleFolder(folderPath)}>
          <Folder size={12} className={`mr-1 ${isExpanded ? 'text-blue-600' : 'text-gray-600'}`} />
          <span className="font-medium">{folderName}</span>
          <span className="ml-auto text-gray-400">{files.length}</span>
        </div>
        {isExpanded && (<div className="ml-3">{files.map((file, idx) => renderFileItem(file, 1, idx))}</div>)}
      </div>
    );
  };

  // Limit simulations to last 5
  const sims = Array.isArray(simulations) ? simulations.slice(0, 5) : [];

  return (
    <div className="w-72 bg-gray-50 border-r-2 border-gray-300 flex flex-col overflow-hidden">
      {/* Header with back and actions */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button title="Back to projects" onClick={() => onBackToProjects && onBackToProjects()} className="text-gray-700 hover:text-gray-900"><ArrowLeft size={16} /></button>
          <h2 className="font-bold text-sm">Project Files</h2>
        </div>
        <div className="flex items-center gap-2">
          <button title="Run (persisted)" onClick={() => onRunPersisted && onRunPersisted('')} className="text-[#ea580b] hover:opacity-80"><Play size={16} /></button>
          <button title="Quick Run (archive)" onClick={() => onRunArchive && onRunArchive('')} className="text-gray-700 hover:text-gray-900"><Zap size={16} /></button>
          <button title="New File" onClick={() => handleCreateNew('file')} className="text-gray-700 hover:text-gray-900"><FilePlus size={16} /></button>
          <button title="New Folder" onClick={() => handleCreateNew('folder')} className="text-gray-700 hover:text-gray-900"><FolderPlus size={16} /></button>
          {projectFiles.length > 0 && (
            <button title="Download project as ZIP" onClick={downloadProjectZip} className="text-gray-700 hover:text-gray-900"><Download size={16} /></button>
          )}
        </div>
      </div>

      {/* Save actions */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button onClick={() => onSaveCurrent && onSaveCurrent()} className="px-3 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs">Save</button>
          <button onClick={() => onSaveAll && onSaveAll()} className="px-3 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs">Save All</button>
        </div>
      </div>

      {/* Project Files Section */}
      <div className="p-3 border-b border-gray-200">
        {projectFiles.length === 0 ? (
          <div className="text-xs text-gray-500 italic">No files in project</div>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {organizedFiles.root?.map((file, idx) => renderFileItem(file, 0, idx))}
            {organizedFiles.folders && Object.entries(organizedFiles.folders).map(([folderPath, files]) => renderFolderItem(folderPath, files))}
          </div>
        )}
      </div>

      {/* Current Project Info */}
      {currentProject && (
        <div className="p-3 border-b border-gray-200 bg-blue-50">
          <div className="text-xs font-medium text-gray-700 mb-1">Current Project</div>
          <div className="text-sm font-semibold text-gray-900 truncate" title={currentProject.name}>
            {currentProject.name}
          </div>
          {currentProject.description && (
            <div className="text-xs text-gray-600 mt-1 truncate" title={currentProject.description}>
              {currentProject.description}
            </div>
          )}
        </div>
      )}

      {/* Simulations Panel (last 5) */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="font-bold text-sm mb-2">Simulations</h3>
        <div className="space-y-1 max-h-36 overflow-y-auto">
          {sims?.length ? sims.map(s => (
            <div key={s.id} className="flex items-center gap-2 text-xs px-2 py-1 border border-gray-200">
              <div className="flex-1 truncate">{s.name || s.id}</div>
              <span className={`uppercase ${s.status==='completed' ? 'text-green-600' : s.status==='failed' ? 'text-red-600' : s.status==='running' ? 'text-[#ea580b]' : 'text-gray-600'}`}>{s.status}</span>
              <button className="text-xs text-red-600" disabled={['completed','failed','cancelled'].includes(s.status)} onClick={() => onCancelSimulation && onCancelSimulation(s.id)}>Cancel</button>
              <button className="text-xs text-[#ea580b]" onClick={() => onDownloadOutputs && onDownloadOutputs(s.id)}>Download</button>
            </div>
          )) : (
            <div className="text-xs text-gray-500 italic">No simulations</div>
          )}
        </div>
      </div>

      {/* File Upload Section */}
      <div className="p-3 flex-1">
        <div ref={dropZoneRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-[#ea580b] transition" onClick={() => fileInputRef.current?.click()}>
          <div className="mx-auto h-12 w-12 border border-gray-300" />
          <p className="mt-2 text-sm text-gray-600">Drop GLM files here</p>
          <p className="text-xs text-gray-500">or click to browse</p>
          <input ref={fileInputRef} type="file" className="hidden" accept=".glm" onChange={handleFileUpload} />
        </div>
      </div>

      {/* Create New Item Modal */}
      {showCreateModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-80 border border-gray-300">
            <h3 className="text-base font-semibold mb-4">Create New {createType === 'file' ? 'File' : 'Folder'}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{createType === 'file' ? 'File name (with extension):' : 'Folder name:'}</label>
              <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580b]" placeholder={createType === 'file' ? 'e.g., model.glm, data.csv' : 'e.g., models, data'} onKeyDown={(e) => e.key === 'Enter' && handleConfirmCreate()} autoFocus />
              {createType === 'file' && (<div className="mt-2 text-xs text-gray-500">Supported: .glm, .csv, .json, .txt</div>)}
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={handleConfirmCreate} disabled={!newItemName.trim()} className="px-4 py-2 bg-[#ea580b] text-white disabled:opacity-50 disabled:cursor-not-allowed">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-80 border border-gray-300">
            <h3 className="text-base font-semibold mb-4 text-red-600">Delete File</h3>
            <p className="text-gray-700 mb-4">Are you sure you want to delete <strong>{deleteConfirm}</strong>?</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
