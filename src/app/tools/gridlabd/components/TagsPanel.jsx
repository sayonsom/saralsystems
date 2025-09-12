import { useEffect, useState } from 'react';

export default function TagsPanel({
  visible,
  onClose,
  tags,
  onRefresh, // () => void
  onCreateTag, // (name, description) => void
  onOpenSnapshot // (tagId) => Promise<any>
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) onRefresh?.();
    setPreview(null);
  }, [visible, onRefresh]);

  const handleCreate = async () => {
    if (!name) return;
    await onCreateTag?.(name, description);
    setName(''); setDescription('');
  };

  const handleOpen = async (tag) => {
    setLoading(true);
    try {
      const data = await onOpenSnapshot?.(tag.id);
      setPreview(JSON.stringify(data, null, 2));
    } finally { setLoading(false); }
  };

  if (!visible) return null;

  return (
    <div className="absolute inset-y-0 right-0 w-[360px] bg-white border-l border-gray-300 flex flex-col">
      <div className="px-3 py-2 border-b border-gray-300 flex items-center justify-between">
        <div className="font-medium text-sm">Project Tags</div>
        <button className="text-gray-600 text-sm" onClick={onClose}>Close</button>
      </div>
      <div className="p-3 space-y-3 overflow-auto">
        <div className="space-y-2">
          <div className="text-xs text-gray-700 font-medium">Create Tag</div>
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Tag name (e.g., v1.0.0)" className="w-full border border-gray-300 px-2 py-1 text-sm" />
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full border border-gray-300 px-2 py-1 text-sm h-16" />
          <button onClick={handleCreate} className="px-3 py-1 border border-gray-300 text-sm bg-gray-50">Create</button>
        </div>
        <div className="border-t border-gray-200 pt-2">
          <div className="text-xs font-medium text-gray-700 mb-2">Existing Tags</div>
          <div className="space-y-2">
            {(tags || []).length === 0 && (
              <div className="text-xs text-gray-500">No tags yet.</div>
            )}
            {(tags || []).map(t => (
              <div key={t.id} className="border border-gray-200 p-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{t.name}</div>
                  <button className="text-[#ea580b]" onClick={()=>handleOpen(t)}>Open</button>
                </div>
                <div className="text-gray-600">{t.description || ''}</div>
                <div className="text-gray-600">{t.created_at ? new Date(t.created_at).toLocaleString() : ''}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2">
          <div className="text-xs font-medium text-gray-700 mb-2">Snapshot Preview</div>
          <pre className="text-[11px] leading-4 bg-gray-50 border border-gray-200 p-2 whitespace-pre-wrap overflow-auto h-40">{loading ? 'Loading…' : (preview || 'Open a tag to preview snapshot')}</pre>
        </div>
      </div>
    </div>
  );
}
