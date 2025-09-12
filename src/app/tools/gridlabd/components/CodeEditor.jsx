"use client";
import dynamic from 'next/dynamic';
const MonacoEditor = dynamic(() => import('@monaco-editor/react').then(m=>m.default), { ssr:false });

export default function CodeEditor({ value, onChange, addConsoleMessage, sampleGLM }) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b bg-gray-50">
        <h2 className="font-semibold text-sm text-gray-700">GLM Code Editor</h2>
        <div className="space-x-2 text-xs">
          <button onClick={()=>addConsoleMessage('Formatting not implemented','info')} className="px-2 py-1 border text-gray-600 hover:bg-gray-100 rounded">Format</button>
          <button onClick={()=>addConsoleMessage('Validation placeholder','info')} className="px-2 py-1 border text-gray-600 hover:bg-gray-100 rounded">Validate</button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          defaultLanguage="plaintext"
          theme="vs-light"
          value={value || sampleGLM}
          onChange={(val)=> onChange(val || '')}
          options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: 'on', automaticLayout: true, scrollBeyondLastLine: false, tabSize: 2 }}
        />
      </div>
    </div>
  );
}
