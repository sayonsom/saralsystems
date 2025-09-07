"use client";
export default function FileExplorer({ loadTemplate, handleFileUpload, fileInputRef, dropZoneRef, handleDragOver, handleDragLeave, handleDrop }) {
  return (
    <div className="w-64 bg-white border-r-2 border-gray-300 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-sm mb-3">File Explorer</h2>
        <div className="space-y-1">
          <div className="font-semibold text-sm text-gray-700 mb-2">📁 My Models</div>
          <div className="pl-4 space-y-1">
            <div className="text-sm hover:bg-gray-100 px-2 py-1 cursor-pointer">📁 IEEE Tests</div>
            <div className="pl-6">
              <div className="text-sm hover:bg-gray-100 px-2 py-1 cursor-pointer" onClick={() => loadTemplate('IEEE_13_bus')}>📄 13-bus</div>
              <div className="text-sm hover:bg-gray-100 px-2 py-1 cursor-pointer">📄 34-bus</div>
            </div>
            <div className="text-sm hover:bg-gray-100 px-2 py-1 cursor-pointer">📁 Utility</div>
            <div className="text-sm hover:bg-gray-100 px-2 py-1 cursor-pointer">📁 Uploads</div>
          </div>
        </div>
      </div>
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-sm mb-3">Templates</h3>
        <div className="space-y-2">
          <button onClick={() => loadTemplate('blank')} className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1">⚡ Blank Model</button>
          <button onClick={() => loadTemplate('urban_feeder')} className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1">⚡ Urban Feeder</button>
          <button onClick={() => loadTemplate('rural_der')} className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1">⚡ Rural + DER</button>
          <button onClick={() => loadTemplate('microgrid')} className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1">⚡ Microgrid</button>
        </div>
      </div>
      <div className="p-4 flex-1">
        <div ref={dropZoneRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-[#ea580b] transition" onClick={() => fileInputRef.current?.click()}>
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">Drop GLM files here</p>
          <p className="text-xs text-gray-500">or click to browse</p>
          <input ref={fileInputRef} type="file" className="hidden" accept=".glm" onChange={handleFileUpload} />
        </div>
      </div>
    </div>
  );
}
