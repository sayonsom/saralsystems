"use client";
export default function RunBar({ runSimulation, isRunning, selectedFile, simulationProgress }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-800 text-white flex items-center justify-between px-4 border-t border-gray-700 z-50">
      <div className="flex items-center space-x-4">
        <button onClick={runSimulation} disabled={isRunning} className={`flex items-center space-x-2 px-4 py-1 ${isRunning ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
          {isRunning ? (<><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div><span>Running...</span></>) : (<><span>▶</span><span>Run</span></>)}
        </button>
        <button className="px-4 py-1 bg-gray-700 hover:bg-gray-600" disabled={!isRunning}>⏸ Pause</button>
        <button className="px-4 py-1 bg-gray-700 hover:bg-gray-600" disabled={!isRunning}>⏹ Stop</button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm">{selectedFile ? `Current: ${selectedFile}` : 'No file loaded'}</div>
        {isRunning && (
          <div className="flex items-center space-x-2">
            <span className="text-sm">Progress:</span>
            <div className="w-48 bg-gray-700 h-2"><div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${simulationProgress}%` }} /></div>
            <span className="text-sm">{simulationProgress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
