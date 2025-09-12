import { useMemo, useState } from 'react';

export default function FileActionsBar({
  selectedFile,
  onRename, // (oldName, newName)
  onSave,
  onSaveAll,
  onOpenHistory, // () => void
  onOpenTags, // () => void
  isBulkSaving
}) {
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState('');

  const canRename = useMemo(() => !!selectedFile, [selectedFile]);

  const beginRename = () => { if (!selectedFile) return; setRenaming(true); setName(selectedFile); };
  const commitRename = () => { if (!selectedFile || !name || name === selectedFile) { setRenaming(false); return; } onRename?.(selectedFile, name); setRenaming(false); };

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-300 bg-gray-50">
      {!renaming ? (
        <>
          <div className="text-sm text-gray-700 flex-1 truncate">{selectedFile || 'No file selected'}</div>
          <button className="px-2 py-1 border border-gray-300 text-xs bg-white" disabled={!canRename} onClick={beginRename}>Rename</button>
          <button className="px-2 py-1 border border-gray-300 text-xs bg-white" onClick={onSave}>Save</button>
          <button className="px-2 py-1 border border-gray-300 text-xs bg-white" onClick={onSaveAll}>{isBulkSaving ? 'Saving…' : 'Save All'}</button>
          <div className="flex-1" />
          <button className="px-2 py-1 border border-gray-300 text-xs bg-white" onClick={onOpenHistory}>History</button>
          <button className="px-2 py-1 border border-gray-300 text-xs bg-white" onClick={onOpenTags}>Tags</button>
        </>
      ) : (
        <div className="flex items-center gap-2 w-full">
          <input value={name} onChange={(e)=>setName(e.target.value)} className="flex-1 border border-gray-300 px-2 py-1 text-sm" />
          <button className="px-2 py-1 border border-gray-300 text-xs bg-white" onClick={commitRename}>Save</button>
          <button className="px-2 py-1 border border-gray-300 text-xs bg-white" onClick={()=>setRenaming(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
