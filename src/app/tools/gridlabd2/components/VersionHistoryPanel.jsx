import { useEffect, useMemo, useState } from 'react';

export default function VersionHistoryPanel({
  visible,
  onClose,
  file,
  versions,
  onRefresh, // (fileId) => void
  onSaveVersion, // (fileId, content, message) => void
  onOpenVersion, // (fileId, versionId) => Promise<{ content: string }>
}) {
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileId = file?.id;
  const title = useMemo(() => file?.filename || file?.name || 'File', [file]);

  useEffect(() => {
    if (!visible || !fileId) return;
    onRefresh?.(fileId);
    setPreview(null);
    setMessage('');
  }, [visible, fileId, onRefresh]);

  const handleOpen = async (ver) => {
    if (!fileId || !ver?.id) return;
    setLoading(true);
    try {
      const data = await onOpenVersion?.(fileId, ver.id);
      setPreview(data?.content || JSON.stringify(data, null, 2));
    } finally { setLoading(false); }
  };

  const handleSaveVersion = async () => {
    if (!fileId) return;
    await onSaveVersion?.(fileId, file?.content ?? '', message || `Version of ${title}`);
    setMessage('');
    onRefresh?.(fileId);
  };

  if (!visible) return null;

  return (
    <div className="absolute inset-y-0 right-0 w-[360px] bg-white border-l border-gray-300 flex flex-col">
      <div className="px-3 py-2 border-b border-gray-300 flex items-center justify-between">
        <div className="font-medium text-sm">History: {title}</div>
        <button className="text-gray-600 text-sm" onClick={onClose}>Close</button>
      </div>
      <div className="p-3 space-y-3 overflow-auto">
        <div className="space-y-2">
          <label className="block text-xs text-gray-600">Commit message</label>
          <input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Describe your change" className="w-full border border-gray-300 px-2 py-1 text-sm" />
          <button onClick={handleSaveVersion} className="px-3 py-1 border border-gray-300 text-sm bg-gray-50">Save Version</button>
        </div>
        <div className="border-t border-gray-200 pt-2">
          <div className="text-xs font-medium text-gray-700 mb-2">Timeline</div>
          <div className="space-y-2">
            {(versions || []).length === 0 && (
              <div className="text-xs text-gray-500">No versions yet.</div>
            )}
            {(versions || []).map(v => (
              <div key={v.id} className="border border-gray-200 p-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-medium">v{v.version_number} — {v.message || 'No message'}</div>
                  <button className="text-[#ea580b]" onClick={()=>handleOpen(v)}>Open</button>
                </div>
                <div className="text-gray-600">{v.created_at ? new Date(v.created_at).toLocaleString() : ''}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2">
          <div className="text-xs font-medium text-gray-700 mb-2">Preview</div>
          <pre className="text-[11px] leading-4 bg-gray-50 border border-gray-200 p-2 whitespace-pre-wrap overflow-auto h-40">{loading ? 'Loading…' : (preview || 'Select a version to preview')}</pre>
        </div>
      </div>
    </div>
  );
}
